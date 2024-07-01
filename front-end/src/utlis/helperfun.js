import moment from 'moment';

export function getBigInt(value, defaultValue = 0) {

    if (value === null || value === undefined || value === '') {
        return 0;
    }
    try {
        const bigIntValue = BigInt(value);
        return bigIntValue;
    } catch (e) {
        return 0;
    }
};


export function getUTCTime(param = null, duration = null) {
    let time = moment().utc();

    if (duration) {
        const durationRegex = /(\d+)(hr|min|sec)/g;
        let match;
        while ((match = durationRegex.exec(duration)) !== null) {
            const value = parseInt(match[1], 10);
            const unit = match[2];

            if (unit === 'hr') {
                time.add(value, 'hours');
            } else if (unit === 'min') {
                time.add(value, 'minutes');
            } else if (unit === 'sec') {
                time.add(value, 'seconds');
            }
        }
    }

    if (param === 'timestamp') {
        return time.valueOf();
    } else if (param === 'datetime') {
        return time.format('YYYY-MM-DD HH:mm:ss');
    } else if (param === null) {
        return time;
    } else {
        return null;
    }
}

export function checkRestoretime(timestamp) {
    const now = moment.utc();
    const target = moment.utc(Number("1719614573708"));

    if (target.isAfter(now)) {
        return true;
    } else {
        return false;
    }
}