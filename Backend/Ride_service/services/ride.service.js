// const { getFare } = require('../controllers/ride.controller');
const rideModel = require('../models/ride.model');
const mapService = require('../services/map.service');
const crypto = require('crypto');
const { redis } = require('../shared/redis-client')
const axios=require('axios');
// const { sendMessageToSocketId } = require('../socket');

module.exports.getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        console.log('error1');
        throw new Error('Pickup and desination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    // console.log("distance Time: ")
    // console.log(distanceTime);

    const baseFare = {
        auto: 30,
        car: 50,
        motorcycle: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        motorcycle: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        motorcycle: 1.5
    }

    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value) / 1000 * perKmRate.auto) + ((distanceTime.duration.value) / 60 * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value) / 1000 * perKmRate.car) + ((distanceTime.duration.value) / 60 * perMinuteRate.car)),
        bike: Math.round(baseFare.motorcycle + ((distanceTime.distance.value) / 1000 * perKmRate.motorcycle) + ((distanceTime.duration.value) / 60 * perMinuteRate.motorcycle)),
    }

    return {fare,distance: ((distanceTime.distance.value) / 1000)};
}




function getOTP(num) {
    const OTP = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
    return OTP;
}

module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {

    // console.log("I am createRide");

    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }
    // console.log("k hall h");
    // console.log(user,pickup,destination,vehicleType);

    const {fare,distance} = await this.getFare(pickup, destination);
    const ride = rideModel.create({
        user,
        pickup,
        destination,
        distance,
        otp: getOTP(6),
        fare: fare[vehicleType],


    });
    return ride;

}

module.exports.confirmRide = async ({ rideId, otp }) => {
    console.log(rideId, otp);
    if (!rideId || !otp) {
        throw new Error('RideId and OTP are requried');
    }
    const ride = await rideModel.findOne({ _id: rideId }).select('+otp');
    console.log('ride at ride.service.js :',ride);

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status != 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp != Number(otp)) {
        // console.log(typeof(ride.otp));
        // console.log(typeof(otp));
        throw new Error('Invalid OTP');
    }
    // console.log("rideInfo in ride service passed from frontend: ", rideInfo);
    console.log('captain k liye....');
    
    try{
    
    const captainInfo = await axios.get(`https://uberclone-captain-service.onrender.com/${ride.captain}`);
    console.log(captainInfo.data);
    console.log('upper naya h');
    
    // console.log('rideCopy in confirm ride: ',rideCopy);
    const rideupdate=await rideModel.findOneAndUpdate({ _id: rideId }, { status: "ongoing" },{new:true});
    rideCopy = rideupdate.toObject();
    rideCopy.captain = captainInfo.data;
    ride.otp = "";


    redis.publish('ride-started', JSON.stringify({ rideCopy }));
   

    return ride;
    }
    catch(err){
        console.log("Error while calling captain service.");
        throw new Error('Failed to fetch captain details in ride service')
    }

}
