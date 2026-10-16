const Redis = require('ioredis');
const { Queue } = require('bullmq');


const redis = new Redis(process.env.REDIS_URL,{
  maxRetriesPerRequest: null,
});

const rideExpiryQueue=new Queue('ride-expiry-queue',{
  connection:{
    host:"redis-12568.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    port:12568,
    password:process.env.REDIS_PASSWORD,
    username:"default"

  }
});
module.exports={redis, rideExpiryQueue};
