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
  if (clientScore > 0) {
    var lastTapAt =
      earnings.last_tap_at !== null
        ? earnings.last_tap_at
        : earnings.created_date;

    lastTapAt = moment.utc(lastTapAt);
    var currentTime = moment.utc();
    var diffInSec = currentTime.diff(lastTapAt, "seconds");
    var maxScore = diffInSec * 10;
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
  isValidScore,
  getTapScore,
};
