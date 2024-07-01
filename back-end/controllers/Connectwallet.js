const { Op, col } = require("sequelize");
const { sequelize } = require("../config/mysql-sequelize");
const Earnings = require("../models/Earnings");
const TGUser = require("../models/TGUser");

async function connect(req, res, next) {
    try {
        const wallet_address = req.body;
        const tguser = req.user;
        if (!tguser || !tguser.id) {
            return res.status(401).json({ error: "Invalid user" });
        }

        // TODO : check this validation need are not 
        // const existingAddress = await TGUser.findOne({
        //     where: { wallet_address: wallet_address.walletid }
        // });

        // if (existingAddress) {
        //     return res.status(400).json({ error: "Wallet address already exists", message: "Wallet address already exists" });
        // }




        const earnDetails = await Earnings.findOne({
            where: {
                userid: tguser.id,
            },
        });
        if (!earnDetails) {
            return res.status(401).json({ error: "Invalid user" });
        }
        // TODO:check is need to add in task
        const dbTask = earnDetails.task ? earnDetails.task : [];
        let newTask = dbTask.includes("W") ? dbTask : `${dbTask}|W`;
        let temp_wallet = wallet_address.walletid

        const up = {
            task_score: parseInt(earnDetails.task_score) + parseInt(process.env.OKR_POINTS),
            tap_score: parseInt(earnDetails.tap_score) + parseInt(process.env.OKR_POINTS),
            wallet_address: temp_wallet != null ? temp_wallet : ''
        };
        const [updated] = await Earnings.update(up, {
            where: {
                userid: tguser.id,
            },
            individualHooks: true 
        });
        console.log("updated", updated)
        if (updated > 0) {
            return res.status(200).json({ message: 'Success', data: [] });
        } else {
            return res.status(409).json({ error: 'Conflict', message: 'Referral claim failed' });
        }
    } catch (error) {
        console.log(error)
        next("Connect wallet error");
    }
}

module.exports = {
    connect
}