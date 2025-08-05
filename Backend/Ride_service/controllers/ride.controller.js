const { validationResult } = require("express-validator");
const rideService=require('../services/ride.service');
const mapService=require('../services/map.service');
const rideModel = require("../models/ride.model");

const {rideExpiryQueue}=require('../shared/redis-client');
const {redis}=require('../shared/redis-client')
const axios=require('axios');



module.exports.createRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {pickup,destination,vehicleType}=req.body;
    try{
        const ride=await rideService.createRide({user: req.user._id,pickup,destination,vehicleType});
        res.status(201).json(ride);

        const pickupCoordinates=await mapService.getAddressCoordinate(pickup);
        console.log(pickupCoordinates);

        const captains=await redis.georadius('captains_locations', pickupCoordinates.lng, pickupCoordinates.ltd, 500, 'km');
        ride.otp="";
        console.log('yes, mein bhi run hua');
        const rideFinal=await rideModel.findById(ride._id);
        
        console.log("user detial bina dikkat: ",req.user);
        const rideInfo=rideFinal.toObject();
        rideInfo.user=req.user;
        console.log(rideFinal);
        
        console.log(captains);
        redis.publish('new-ride',JSON.stringify({ ride: rideInfo, captains }));
        await rideExpiryQueue.add('expire-ride',{
            rideId:ride._id
        },{
            delay:7*60*1000,
            attempts:1
        });
        

        return;

        
    }
    catch(err){
        console.log(err);
    }


}

module.exports.getFare=async(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    try{
    const {pickup,destination}=req.query;
    const fare=await rideService.getFare(pickup,destination);
    return res.status(200).json(fare);

    
    }
    catch(err){
        console.log("get-fare");
        console.log(err);
        return res.status(500).json({message: err});
    }
}

module.exports.confirmAndStartRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors});
    }

    try{
        
        const ride=await rideService.confirmRide({otp:req.query.otp,rideId:req.query.rideId,});
        
        return res.status(200).json(ride);
        
    }
    catch(err){
        console.log('Ride confirm error: ',err.message);
        return res.status(500).json({message: err.message});
    }
}

module.exports.getActiveRide=async (req,res)=>{
    
    try {
    const captainId = req.params.captainId; // or req.query.captainId based on your route

    if (!captainId) {
      return res.status(400).json({ message: "captainId is required" });
    }

    const activeRide = await rideModel.findOne({ captain: captainId, status: "accepted" });
    

    if (activeRide) {
      return res.status(200).json(activeRide);
    } else {
      return res.status(404).json({ message: "Active ride not found for this captain" });
    }
  } catch (err) {
    console.error("Error fetching active ride:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports.acceptRide=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors});
    }

    try{
        const {rideId, captainId}=req.body;
        const ride=await rideModel.findOneAndUpdate({ _id: rideId }, { status: 'accepted',captain: captainId },{ new: true }).select('+otp');
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
       
        res.status(200).json(ride);
    
    }
    catch(err){
        console.log('error while updating accept status');
        res.status(500).json({message: 'Internal server error'})

    }
}

module.exports.getAddressCoordinate=async(req,res,next)=>{
    try{
        console.log('ride controller map');
    const {address}=req.query;
    const addressCoordinate=await mapService.getAddressCoordinate(address);
    return res.status(200).json(addressCoordinate);
    }
    catch(err){
        console.log('Error while getting address coordinates in ride controller.');
        return res.status(500).json({message: "Internal server errr"});
    }
}

module.exports.finishRide=async(req,res,next)=>{
    try{
        const {rideId}=req.body;
        console.log(rideId);
        await rideModel.findByIdAndUpdate(ride._id,{status:'completed'});
        return;
        
    }
    catch(err){
        console.log('Error while updating ride status to complete...');
        return res.status(400).json({message: 'Error while updating ride status to complete'});
    }
}