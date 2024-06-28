const moment = require('moment');

function isValidScore(clientScore, serverScore, lastTapAt){
    lastTapAt = moment.utc(lastTapAt);
    var currentTime = moment.utc();
    var diffInSec = currentTime.diff(lastTapAt, "seconds");
    var maxScore = diffInSec * 10;
    var currentScore = clientScore - serverScore;
    console.log(clientScore, serverScore, currentScore, maxScore);

    return (currentScore > 0 && maxScore>=currentScore)
}

module.exports = {
    isValidScore
};