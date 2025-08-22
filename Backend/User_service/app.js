const dotenv=require("dotenv");
dotenv.config();
const express=require('express');
const app=express();
const userRoutes=require('./routes/user.routes');
const cors=require("cors");
const cookieParser=require('cookie-parser');
const connectToDb=require('./db/db');

connectToDb();
const port=process.env.PORT || 4001;
app.use(cors({
  origin: '*', // or specify your frontend origin
  methods: ['GET', 'POST'],
  credentials: false
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.get('/health',(req,res)=> res.send("ok"));
app.use('/',userRoutes)




app.listen(port,()=>{
    console.log('User service running at 4001 port');
})
