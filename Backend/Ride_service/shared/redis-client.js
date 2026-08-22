const Redis = require('ioredis');
const { Queue } = require('bullmq');


const redis = new Redis(process.env.REDIS_URL,{
  maxRetriesPerRequest: null,
});

const rideExpiryQueue=new Queue('ride-expiry-queue',{
  connection:{
    host:"redis-16832.c241.us-east-1-4.ec2.cloud.redislabs.com",
    port:16832,
    password:process.env.REDIS_PASSWORD,
    username:"default"

  }
});
module.exports={redis, rideExpiryQueue};
