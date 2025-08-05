const mongoose=require('mongoose');

const rideSchema=new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    captain:{
        type: String,
        
    },
    pickup:{
        type:String,
        required: true
    },
    destination:{
        type:String,
        required: true
    },
    fare:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum:['pending','accepted','ongoing','completed','cancelled','expired'],
        default:'pending'
    },
    duration:{
        type: Number
    },
    distance:{
        type:Number
    },
    paymentId:{
        type:String
    },
    orderId:{
        type:String
    },
    signature:{
        type:String
    },
    otp:{
        type:Number,
        required:true,
        select:false
    }

});

module.exports=mongoose.model('ride',rideSchema);