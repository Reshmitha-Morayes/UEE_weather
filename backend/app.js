const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const WeatherModel = require('./models/Data')

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URL = "mongodb+srv://WeatherApp:weatherappinfo@projects.smsnj61.mongodb.net/EcoConnect";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.get('/environmentalData', async (req, res) => {
  WeatherModel.find({})
    .then(weather => res.json(weather))
    .catch(err => res.status(500).json(err));
});

app.post("/createEnvironmentalData", async (req, res) => {
  const { city, country, airQuality, temperature, co2Level, humidity } = req.body;

  // Check for missing fields
  if (!city || !country || airQuality === undefined || temperature === undefined || co2Level === undefined || humidity === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const weather = await WeatherModel.create({ city, country, airQuality, temperature, co2Level, humidity });
    console.log("Data saved successfully:", weather);
    res.status(201).json(weather);
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ error: "An error occurred while adding new items" });
  }
});


app.listen(3000, () => {
  console.log('Node js has started...');
})