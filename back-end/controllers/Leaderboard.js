const { sequelize } = require("../config/mysql-sequelize");
const { getUTCTime } = require("../utils/helperfun")
const { Op, col } = require("sequelize");

const Earnings = require("../models/Earnings");
const TGUser = require("../models/TGUser");

// TODO: need to complete
async function allrank(req, res, next) {
    try {
        const tgUser = req.user;
        const { tid } = req.body;

        let userPosition = null;
        let specificUserDetails = null;

        if (!tgUser || !tgUser.id || tid != tgUser.id) {
            return res.status(401).json({ error: "unauth" });
        }

        const [results, metadata] = await sequelize.query("SELECT e.tap_score, t.username, e.miner_level, e.id, t.first_name from tg_users as t JOIN earnings as e ON t.userid=e.userid order by e.tap_score desc;");
        const topUsers = results;
        if (!topUsers) {
            return res.status(401).json({ error: "Invalid user" });
        }

        const topplayers = topUsers.map((user) => ({
            id: user.id,
            firstname: user.first_name,
            username: user.username,
            overallPoints: user.tap_score,
            gameLevel: "",
        }));
        if (tid) {
            const userInTop = topplayers.find((player) => player.id === tid);
            if (!userInTop) {
                const [results1, metadata1] = await sequelize.query(`SELECT e.tap_score, t.username, e.miner_level, e.id, t.first_name from tg_users as t JOIN earnings as e ON t.userid=e.userid where t.userid='${tid}' order by e.tap_score desc;`);
                const specificUser = results1;

                if (specificUser.length > 0) {
                    specificUserDetails = {
                        id: specificUser[0].id,
                        firstname: specificUser[0].first_name,
                        username: specificUser[0].username,
                        overallPoints: specificUser[0].tap_score,
                        gameLevel: "",
                    };

                    const userRank = await Earnings.count({
                        where: {
                            tap_score: {
                                [Op.gt]: specificUser[0].tap_score,
                            },
                        },
                    });
                    userPosition = userRank + 1;
                }
            }
        }

        return res.status(200).json({
            isthere: true,
            message: "success",
            value: { topplayers, specificUserDetails, userPosition },
        });
    } catch (e) {
        next(e);
    }
}


module.exports = {
    allrank
}