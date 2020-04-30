const moment = require('moment')

function formatMessage(email,
    text) {
    return {
        email,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage