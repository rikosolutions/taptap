const moment = require("moment");
const numeral = require("numeral");
const _ = require("lodash");
const Earnings = require("../models/Earnings");

const { isValidScore } = require("../utils/validator");

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
  if (minerLevel >= 1 && minerLevel <= 25) {
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
      return next(`No earnings record found for ${userid}`);
    }

    //TODO: score
    var minerLevel = !isNaN(parseInt(earnings.miner_level))
      ? parseInt(earnings.miner_level)
      : 0;
    var clientScore = !_.isNil(req.headers.score)
      ? parseInt(req.headers.score)
      : 0;
    clientScore = !isNaN(clientScore) ? clientScore : 0;
    var serverScore =
      earnings.tap_score === null ? 0 : parseInt(earnings.tap_score);
    var tapScore = serverScore;
    if (clientScore > 0) {
      var lastTapAt =
        earnings.last_tap_at !== null
          ? earnings.last_tap_at
          : earnings.created_date;
      if (isValidScore(clientScore, serverScore, lastTapAt)) {
        tapScore = clientScore;
      } else {
        //TODO: handle not valid score
      }
    }

    if (minerLevel < 25) {
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
      message: "Ivalid upgrade request",
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
      return next(`No earnings record found for ${userid}`);
    }

    var minerLevel = !isNaN(parseInt(earnings.miner_level))
      ? parseInt(earnings.miner_level)
      : 0;
    var clientScore = !_.isNil(req.headers.score)
      ? parseInt(req.headers.score)
      : 0;
    clientScore = !isNaN(clientScore) ? clientScore : 0;
    var serverScore =
      earnings.tap_score === null ? 0 : parseInt(earnings.tap_score);
    var tapScore = serverScore;
    if (clientScore > 0) {
      var lastTapAt =
        earnings.last_tap_at !== null
          ? earnings.last_tap_at
          : earnings.created_date;
      if (isValidScore(clientScore, serverScore, lastTapAt)) {
        tapScore = clientScore;
      } else {
        //TODO: handle not valid score
      }
    }
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
      message: "Ivalid claim request",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  claim,
  upgrade,
};
