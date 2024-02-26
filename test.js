const Redis = require("redis");

const redisClient = Redis.createClient();

const test = async () => {
  redisClient.connect();

  const data = await redisClient.get("photos");

  console.log(data);
};

test();
