const path = require('path')
const express = require('express')
const hbs = require('hbs')

const {geocode, reverseGeocode} = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

const publicDir = path.join(__dirname, '../public')
const viewsDir = path.join(__dirname, '../templates/views')
const partialsDir = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsDir)
hbs.registerPartials(partialsDir)

app.use(express.static(publicDir))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Larry'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Larry'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Larry',
        message: 'Please try your search again!'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address && !req.query.coords) {
        return res.send({
            error: 'No address provided, please try again!'
        })
    }

    if (req.query.address) {
        geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                return res.send({ error })
            }

            forecast(latitude, longitude, (error, { summary, temperature, precipitation } = {}) => {
                if (error) {
                    return res.send({ error })
                }

                res.send({
                    location,
                    address: req.query.address,
                    summary: `${summary} It is currently ${temperature} degrees outside. There is a ${precipitation}% chance of rain.`
                })
            })
        })
    } else if (req.query.coords) {
        const coords = req.query.coords.split(',')
        reverseGeocode(coords, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send({error})
            }

            forecast(latitude, longitude, (error, {summary, temperature, precipitation} = {}) => {
                if (error) {
                    return res.send({error})
                }

                res.send({
                    location,
                    address: coords,
                    summary: `${summary} It is currently ${temperature} degrees outside. There is a ${precipitation}% chance of rain.`
                })
            })
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('not-found', {
        title: '404',
        name: 'Larry',
        message: 'Document not found'
    })
})

app.get('*', (req, res) => {
    res.render('not-found', {
        title: '404',
        name: 'Larry',
        message: 'Page not found'
    })
})

app.listen(port, () => console.log(`Server running on port ${port}`))