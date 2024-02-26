const express = require("express");
const axios = require("axios");
const cors = require("cors");
const Redis = require("redis");

const redisClient = Redis.createClient();
redisClient.connect();

const DEFAULT_EXPIRATION = 3600;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/photos", async (req, res) => {
  const photos = await redisClient.get("photos");

  if (photos) {
    return res.json(JSON.parse(photos));
  }

  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/photos"
  );

  redisClient.setEx(
    "photos",
    DEFAULT_EXPIRATION,
    JSON.stringify(response.data)
  );

  res.json(response.data);
});

app.get("/photos/:id", async (req, res) => {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
  );
  res.json(response.data);
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
