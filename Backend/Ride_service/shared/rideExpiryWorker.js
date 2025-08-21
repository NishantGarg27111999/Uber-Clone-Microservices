const {Worker} =require('bullmq');
const {redis}=require('../shared/redis-client');
const rideModel=require('../models/ride.model');

const rideExpiryWorker= new Worker('ride-expiry-queue', async(job)=>{
    const {rideId}=job.data;

    const ride= await rideModel.findById(rideId);

    if(ride && ride.status=='pending'){
        ride.status='expired';
        await ride.save();

        redis.publish('ride-expired',JSON.stringify({rideId}));
    }

},{
    connection: {
    host:"redis-13004.c11.us-east-1-2.ec2.redns.redis-cloud.com",
    port:13004,
    username:"nishantgarg",
    password:process.env.REDIS_PASSWORD,


  }
});

rideExpiryWorker.on('completed',(job)=>{
    console.log(`Expiry check completed for ride ${job.data.rideId}`);
});
rideExpiryWorker.on('failed', (job, err) => {
  console.error(`Expiry check failed:`, err);
});

