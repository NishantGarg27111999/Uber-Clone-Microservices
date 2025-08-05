const jwt=require('jsonwebtoken');
const blackListTokenModel=require('../models/blackListToken.model');
const userModel=require('../models/user.model');



module.exports.authUser=async(req,res,next)=>{
    console.log("authuser from user service");
    const token=req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if(!token){        
        return res.status(401).json({message: 'Unauthorized access'});
    }

    const blackListed=await blackListTokenModel.findOne({token});
  
    if(blackListed){
        
        return res.status(401).json({message: 'Unauthorized access'});
    }
    try{
        
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        
        const user=await userModel.findById(decoded._id);
        console.log("auth: ",user);
        if(!user){
            console.log('mein bhi ho sakta hun');
            return res.status(401).json({message: 'Unauthorized access'});
        }
        req.user=user;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({message: 'Unauthorized access'});
    }


}

