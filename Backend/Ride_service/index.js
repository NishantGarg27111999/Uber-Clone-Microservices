const dotenv=require("dotenv");
dotenv.config();
const express=require('express');
const app=express();
const cors=require("cors");
const rideExpiryWorker=require('./shared/rideExpiryWorker');
const connectToDb=require('./db/db');
const rideRoutes=require('./routes/ride.routes');

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',rideRoutes);




app.listen(4003,()=>{
    console.log('Captain service running at 4003 port');
})