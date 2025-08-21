const Redis = require('ioredis');
const { Queue } = require('bullmq');


const redis = new Redis(process.env.REDIS_URL,{
  maxRetriesPerRequest: null,
});

const rideExpiryQueue=new Queue('ride-expiry-queue',{
  connection:{
    host:"redis-13004.c11.us-east-1-2.ec2.redns.redis-cloud.com",
    port:13004,
    password:process.env.REDIS_PASSWORD,
    username:"nishantgarg"

  }
});
module.exports={redis, rideExpiryQueue};