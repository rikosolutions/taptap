var jwt = require("jsonwebtoken");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const { Sequelize } = require("sequelize");

const { sequelize } = require("../config/mysql-sequelize");
const { getTapScore } = require("../utils/validator");

const TGUser = require("../models/TGUser");
const Earnings = require("../models/Earnings");

function isMobileDevice(userAgent) {
    if (process.env.MODE == "dev") return true;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
    );
}

async function auth(req, res, next) {
    var user_agent = req.headers["user-agent"];
    var is_mobile = isMobileDevice(user_agent);
    if (user_agent === undefined || is_mobile !== true) {
        return res.status(403).json({
            statusCode: 403,
            status: "error",
            message: "Only available for mobile devices",
        });
    }

    try {
        var {
            id,
            username,
            first_name,
            last_name,
            language_code,
            referral_by,
            is_premium,
        } = req.body;
        var sync_data = null;

        if (!_.isNil(id)) {
            var tgUser = await TGUser.findOne({
                where: {
                    userid: id,
                },
            });

            if (tgUser === null) {
                referral_code = uuidv4().replace(/-/g, "");
                var tgUserData = {
                    userid: id,
                    username: username,
                    first_name: first_name,
                    last_name: last_name,
                    language_code: language_code,
                    referral_by: referral_by,
                    referral_code: referral_code,
                };

                if (is_premium === true) {
                    tgUserData["tg_premium_user"] = "Y";
                }

                try {
                    const result = await sequelize.transaction(async t => {
                        const user = await TGUser.create(tgUserData, { transaction: t });
                        const earnings = await Earnings.create({ 'userid': id, "energy_remaning": 2000 }, { transaction: t });
                        return user;
                    });
                } catch (error) {
                    return next(error);
                }

                sync_data = {
                    referral_code: referral_code,
                    score: 0,
                    miner_level: 0,
                    last_mine_at: "",
                    wallet: "",
                };
            } else {
                var earnings = await Earnings.findOne({
                    where: {
                        userid: tgUser.userid,
                    },
                });
                if (earnings !== null) {
                    var [tapScore, isClientScore ] = getTapScore(req, earnings);

                    if(isClientScore){
                        earnings.tap_score = tapScore;
                        earnings.last_tap_at = moment.utc().toDate();
                        await earnings.save();
                    }
                    sync_data = {
                        referral_code: tgUser.referral_code,
                        score: tapScore,
                        miner_level: earnings.miner_level,
                        last_mine_at: earnings.last_mine_at === null ? "" : earnings.last_mine_at,
                        wallet: (earnings.wallet_address !== null && earnings.wallet_address !== '') ? earnings.wallet_address : '',
                    };
                } else {
                    throw new Error(`Earnings is not found for ${id}`);
                }
            }

            var token = jwt.sign({
                    id: id,
                    username: username,
                    referral_code: sync_data["referral_code"],
                },
                process.env.SECRET_KEY
            );
            sync_data["auth_token"] = token;

            return res.status(200).json({
                status: "success",
                sync_data: sync_data,
                message: "Successfully authenticated",
            });
        }

        return res.status(400).json({
            status: "error",
            message: "Invalid input data",
        });
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    auth,
};