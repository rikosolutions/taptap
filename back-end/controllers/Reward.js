const moment = require("moment");
const numeral = require("numeral");
const _ = require("lodash");
const Earnings = require("../models/Earnings");

const { getTapScore } = require("../utils/validator");

function getSeconds(lastMineAt) {
  let endTime = moment.utc(lastMineAt).add(3, "hours");
  let seconds = endTime.diff(moment.utc(), "seconds");

  if (seconds > 0) return seconds;
  return 0;
}

function getCalcScore(minerLevel, next = true) {
  if (next) minerLevel = minerLevel + 1;
  var score = 0;
  var readScore = "";
  var claimScore = 0;
  var readClaim = "";
  if (minerLevel >= 1 && minerLevel <= 10) {
    const v = 20000;
    const r = 2;
    score = v * Math.pow(r, minerLevel - 1);
    readScore = numeral(score).format("0a");
    claimScore = score * 0.75;
    readClaim = numeral(claimScore).format("0a");
  }

  return [score, readScore, claimScore, readClaim];
}

async function upgrade(req, res, next) {
  try {
    var userid = req.user.id;

    var earnings = await Earnings.findOne({
      where: {
        userid: userid,
      },
    });

    if (earnings === null) {
      throw new Error(`No earnings record found for ${userid}`);
    }

    //TODO: score
    var minerLevel = !isNaN(parseInt(earnings.miner_level))
      ? parseInt(earnings.miner_level)
      : 0;
    var [tapScore, isClientScore ] = getTapScore(req, earnings);

    if (minerLevel < 10) {
      const [requiredScore] = getCalcScore(minerLevel);
      if (tapScore >= requiredScore) {
        var newMinerLevel = minerLevel + 1;
        tapScore -= requiredScore;

        var currentDate = moment.utc().toDate();
        earnings.tap_score = tapScore;
        earnings.miner_level = newMinerLevel;
        earnings.last_tap_at = currentDate;
        earnings.last_mine_at =
          earnings.last_mine_at === null ? currentDate : earnings.last_mine_at;
        await earnings.save();

        var sync_data = {
          miner_level: newMinerLevel,
          last_mine_at:
            earnings.last_mine_at === null
              ? currentDate
              : earnings.last_mine_at,
          score: tapScore,
        };
        return res.status(200).json({
          status: "success",
          sync_data: sync_data,
          message: "Successfully upgraded",
        });
      }
    }
    return res.status(400).json({
      status: "error",
      message: "Invalid upgrade request",
    });
  } catch (err) {
    return next(err);
  }
}

async function claim(req, res, next) {
  try {
    var userid = req.user.id;
    var earnings = await Earnings.findOne({
      where: {
        userid: userid,
      },
    });

    if (earnings === null) {
      throw new Error(`No earnings record found for ${userid}`);
    }

    var minerLevel = !isNaN(parseInt(earnings.miner_level))
      ? parseInt(earnings.miner_level)
      : 0;
    var [tapScore, isClientScore ] = getTapScore(req, earnings);
    
    if (minerLevel > 0) {
      var lastMineAt = earnings.last_mine_at;
      var seconds = getSeconds(lastMineAt);
      if (seconds <= 0) {
        const [requiredScore, readScore, claimScore] = getCalcScore(
          minerLevel,
          false
        );
        tapScore += claimScore;

        var currentDate = moment.utc().toDate();
        earnings.tap_score = tapScore;
        earnings.last_tap_at = currentDate;
        earnings.last_mine_at = currentDate;
        await earnings.save();

        var sync_data = {
          last_mine_at: currentDate,
          score: tapScore,
        };
        return res.status(200).json({
          status: "success",
          sync_data: sync_data,
          message: "Successfully claimed",
        });
      }
    }
    return res.status(400).json({
      status: "error",
      message: "Invalid claim request",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  claim,
  upgrade,
};
