const dotenv=require("dotenv");
dotenv.config();
const express=require('express');
const app=express();
const captainRoutes=require('./routes/captian.routes')
const connectToDb=require('./db/db')
const cors=require('cors');
const cookieParser=require('cookie-parser');
// const {redisSubscriber}=require('./shared/redis-client');

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use('/',captainRoutes);





app.listen(4002,()=>{
    console.log('Captain service running at 4002 port');
})