const { validationResult } = require('express-validator');
const captainService = require('../services/captain.service')
const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blackListToken.model');
const { redisSubscriber } = require('../shared/redis-client');
// const { rideExpiryQueue } = require('../../Ride_service/shared/redis-client');
const cron=require('../cron');




redisSubscriber.subscribe('ride-completed');
redisSubscriber.on('message', async (channel, message) => {
    if (channel == 'ride-completed') {
        console.log('ride-complete subcriber at captain service');
        const { captainId, fare,distance } = JSON.parse(message);
        try{
        const captain=await captainModel.findByIdAndUpdate(captainId, { $inc: { moneyEarned: fare } },{new:true,strict:false});
        await captainModel.findByIdAndUpdate(captainId, { $inc: { ridesToday: 1 } },{new:true,strict:false});
        await captainModel.findByIdAndUpdate(captainId, { $inc: { distanceCoveredToday: distance } },{new:true,strict:false});
        console.log(`Updated captain ${captainId} with fare ${fare}`);
        }
        catch(err){
            console.error('Failed to update moneyEarnedToday:', err);
        }
    }

});




module.exports.registerCaptain = async (req, res, next) => {
    console.log("captain registeration...");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        console.log("errrororroror....");
        return res.status(400).json({ error: errors.array() });
    }
    console.log("after error cehck...");

    const { fullname, email, password, vehicle } = req.body;
    
    const hashedPassword = await captainModel.hashPassword(password);
     console.log("after hash cehck...");
    const captain = await captainService.createCaptain(
        {

            firstname: fullname.firstname,
            lastname: fullname.lastname,

            email,
            password: hashedPassword,

            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        }
    )
console.log("captain registeration done...");
    const token = captain.generateAuthToken();
console.log("captain registeration final...");
    res.status(201).json({ captain, token });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordMatch = captain.comparePassword(password);
    if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = captain.generateAuthToken();
    res.cookie('token', token);
    res.status(200).json({ captain, token });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json(req.captain);
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token;
    res.clearCookie('token');
    await blackListTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out' });

}

module.exports.getCaptainDetails = async (req, res, next) => {


    const captain = await captainModel.findById(req.params.captainId);

    if (captain) {
        return res.status(200).json(captain);
    }
    else {
        return res.status(404).json({ message: 'captain do not exist' });
    }


}

module.exports.getMoneyEarned = async (req, res, next) => {
    try {
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ error: errors });
        // }

        const captainId = req.params.captainId;

        const captain = await captainModel.findById(captainId);
        const captainCopy=captain.toObject();
        console.log('captain get money: ',captainCopy.moneyEarned);
        if (captain) {
            return res.status(200).json(captainCopy.moneyEarned);
        }
    }
    catch (err) {
        console.log("error while fetchin money earned...");
        return res.status(500).json({ message: 'Internal server error' });
    }
}
