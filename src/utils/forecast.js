const request = require('request')

const forecast = (lat, lng, callback) => {
    const url = `https://api.darksky.net/forecast/fd8cb9580b4f755f766a8621170e9a6c/${lat},${lng}`

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect forecast services.')
        } else if (body.code === 400) {
            callback('Forecast not available. Please try another search.')
        } else {
            callback(undefined, {
                summary: body.daily.data[0].summary,
                temperature: body.currently.temperature,
                precipitation: body.daily.data[0].precipProbability
            })
        }
    })
}

module.exports = forecast