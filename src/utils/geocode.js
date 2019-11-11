const request = require('request')

const geocode = (address, callback) => {
    const encodedAddress = encodeURIComponent(address)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=pk.eyJ1IjoicGV0cm84NCIsImEiOiJjandmYzJlbGwwdjdsNDBvM25laXBkb2E4In0.v8qDkGr8iluVw_q91R_xAw`

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!')
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try again.')
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

const reverseGeocode = (coords, callback) => {
    const encodeLng = encodeURIComponent(coords[0])
    const encodeLat = encodeURIComponent(coords[1])
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeLng},${encodeLat}.json?types=postcode&access_token=pk.eyJ1IjoicGV0cm84NCIsImEiOiJjandmYzJlbGwwdjdsNDBvM25laXBkb2E4In0.v8qDkGr8iluVw_q91R_xAw`

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!')
        } else if (body.features.length === 0) {
            callback('Unable to reverse geocode location. Try again.')
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = { geocode, reverseGeocode }