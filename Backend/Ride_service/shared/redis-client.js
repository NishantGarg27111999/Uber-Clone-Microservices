const Redis = require('ioredis');
const { Queue } = require('bullmq');


const redis = new Redis(process.env.REDIS_URL,{
  maxRetriesPerRequest: null,
});

const rideExpiryQueue=new Queue('ride-expiry-queue',{
  redis
});
module.exports={redis, rideExpiryQueue};