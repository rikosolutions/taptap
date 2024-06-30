const { sequelize } = require("../config/mysql-sequelize");
const { getUTCTime } = require("../utils/helperfun")
const { Op, col } = require("sequelize");
const moment = require("moment");

const { getTapScore } = require("../utils/validator");

const Earnings = require("../models/Earnings");
const TGUser = require("../models/TGUser");

// TODO :Remove the console in pro
async function getscore(req, res, next) {
    try {
        const { user: tgUser } = req;

        if (!tgUser || tgUser.id == null) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }

        const userDetails = await Earnings.findOne({ where: { userid: tgUser.id } });

        if (userDetails && userDetails != null) {
            const value = {
                checkin_score: userDetails.checkin_score,
                miner_points: userDetails.miner_points,
                referral_score: userDetails.referral_score,
                tap_score: userDetails.tap_score,
                enery_restore_time: userDetails.enery_restore_time,
                energy_remaning: userDetails.energy_remaning,
                game_level: userDetails.miner_level,
            };
            return res.status(200).json({ message: 'Success', data: value });
        } else {
            return res.status(200).json({ message: 'Success', data: [] });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        return next('An error occurred on the get score');
    }
}


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
    getscore,
    upscore
};