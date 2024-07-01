const moment = require("moment");
const _ = require("lodash");

function getTapScore(req, earnings) {
  var isClientScore = false;
  var clientScore = !_.isNil(req.headers.score)
    ? parseInt(req.headers.score)
    : 0;
  clientScore = !isNaN(clientScore) ? clientScore : 0;
  var serverScore =
    earnings.tap_score === null ? 0 : parseInt(earnings.tap_score);
  var tapScore = serverScore;

  // const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // console.log("userid", earnings.userid);
  // console.log("ip", ip, earnings.userid);
  // console.log("clientScore", clientScore);
  // console.log("serverScore", serverScore);
  // console.log("currentTime", moment.utc().toDate());
  // console.log("last_tap_at", earnings.last_tap_at);
  // console.log("created_date", earnings.created_date);

  if (clientScore > 0) {
    var lastTapAt =
      earnings.last_tap_at !== null
        ? earnings.last_tap_at
        : earnings.created_date;

    lastTapAt = moment.utc(lastTapAt);
    var currentTime = moment.utc();
    var diffInSec = currentTime.diff(lastTapAt, "seconds");
    var maxScore = diffInSec * 50;
    var currentScore = clientScore - serverScore;
    if (currentScore > 0) {
      if (maxScore >= currentScore) {
        tapScore = clientScore;
        isClientScore = true;
      }
    }
  }
  return [tapScore, isClientScore];
}

module.exports = {
  getTapScore,
};
