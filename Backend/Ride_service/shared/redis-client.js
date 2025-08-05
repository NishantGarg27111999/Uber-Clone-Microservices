const Redis = require('ioredis');
const { Queue } = require('bullmq');


const redis = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
});

const rideExpiryQueue=new Queue('ride-expiry-queue',{
  redis
});
module.exports={redis, rideExpiryQueue};