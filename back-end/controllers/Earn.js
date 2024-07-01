const { sequelize } = require("../config/mysql-sequelize");
const { getUTCTime } = require("../utils/helperfun")
const { Op, col } = require("sequelize");
const moment = require("moment");

const { getTapScore } = require("../utils/validator");

const Earnings = require("../models/Earnings");
const TGUser = require("../models/TGUser");


async function upscore(req, res, next){

    try{
        var userid = req.user.id;

        var earnings = await Earnings.findOne({
            where: {
              userid: userid,
            },
        });

        if (earnings === null) {
            throw new Error(`No earnings record found for ${userid}`);
        }

        var [tapScore, isClientScore ] = getTapScore(req, earnings);
        if(isClientScore===false){
            return res.status(400).json({
                status: "error",
                message: "Invalid Tap request",
            });
        }

        earnings.tap_score = tapScore;
        earnings.last_tap_at = moment.utc().toDate();
        await earnings.save();
        return res.status(200).json({ status: 'success' });

    }catch(err){
        next(err);
    }
}


module.exports = {
    upscore
};