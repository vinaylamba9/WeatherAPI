require('dotenv').config()
let express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3000,
    path = require('path'),
    key = process.env.API_KEY
bodyParser = require('body-parser')
request = require('request')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

let logger = (request, response, next) => {
        console.log((new Date).getTime(), request.status, request.url)
        next()
    },
    middle2 = (request, response, next) => {
        console.log("I am MiddleWare2")
        next()
    }

app.get('/', logger, middle2, (request, response) => {
    response.status(200)
    response.sendFile(path.resolve(__dirname + '/index.html')) //path.resolve resolves absolute path of file in different operating systems.
        //response.write(`Welcome to our new Server.`)
        //response.end()
})

app.use(express.static('./'))


app.post('/form', (req, res) => {
    let mydata = req.body.cityname,
        url = `https://api.openweathermap.org/data/2.5/weather?q=${mydata}&units=metric&appid=${key}`
    request(url, { json: true }, (err, resp, body) => {
        if (body.message) return res.send(body)
        res.status(200)
        weatherdata = {
            "city": body.name,
            "weather": body.weather[0].main,
            "description": body.weather[0].description,
            "temperature": body.main.temp,
            "humidity": body.main.humidity,
            "wind_speed": body.wind.speed,
            "min_temp": body.main.temp_min,
            "max_temp": body.main.temp_max,
            "country": body.sys.country,
        }
        res.json(weatherdata)
    })
})
app.listen(PORT, err => {
    if (!err) console.log(`server Started on port:${PORT}`)
})