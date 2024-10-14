const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    city: String,
    country: String,
    airQuality: Number,
    temperature: Number,
    co2Level: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now },
})

const WeatherModel = mongoose.model("weatherdbs", WeatherSchema)
module.exports = WeatherModel