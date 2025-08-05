const userModel=require("../models/user.model")
const userService=require('../services/user.service');
 const {validationResult}= require("express-validator")
const blackListTokenModel=require('../models/blackListToken.model');



module.exports.registerUser=async(req,res,next)=>{
    
    // console.log(req);
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {fullname,email,password}=req.body;
    const hashedPassword=await userModel.hashPassword(password);
    const user= await userModel.findOne({email});
    // console.log(user);
    if(user){
        res.status(403).json({message: "User already exist"});
        return;
    }

    const createdUser=await userService.createUser({firstname:fullname.firstname,lastname:fullname.lastname,email,password:hashedPassword});

    
    const token=createdUser.generateAuthToken();
    res.cookie('token',token);
    res.status(201).json({token,createdUser});
}

module.exports.loginUser=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }


    const {email,password}=req.body;
    // await authUser(req,res,next);
    
    const user=await userModel.findOne({email}).select('+password');
    if(!user){
        
        return res.status(401).json('Invalid email or password');
    }

    const isMatch= await user.comparePassword(password);

    if(!isMatch){
        
        return res.status(401).json('Invalid email or password');
    }

    const token=user.generateAuthToken();
    
    res.cookie('token',token);
    
    return res.status(200).json({user,token});
}

module.exports.getUserProfile=async(req,res,next)=>{
    console.log("getUserProfile:", req.user);
    res.status(200).json(req.user);
}

module.exports.logoutUser=async(req,res,next)=>{
    const token=req.cookies.token;
    res.clearCookie('token');
    await blackListTokenModel.create({token});
    
    return res.status(200).json({message: 'Logged out'});

}
module.exports.getUserDetails=async(req,res,next)=>{
    const userId=req.params.userId;

    const user=await userModel.findById(userId);

    if(user){
        return res.status(200).json(user);
    }
    else{
        return res.status(404).json({message: 'user do not exist'});
    }

}

