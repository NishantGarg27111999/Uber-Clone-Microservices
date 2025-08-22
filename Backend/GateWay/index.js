const dotenv=require("dotenv");
dotenv.config();
const express=require('express');
const app=express();
const cors=require('cors');
const proxy=require('express-http-proxy');
const http=require('http');
const {initializeSocket}=require('./socket.js');

const server=http.createServer(app);

initializeSocket(server);
app.use(cors());
app.use('/user',proxy('https://uberclone-user-service.onrender.com'));
app.use('/captains',proxy('https://uberclone-captain-service.onrender.com'));
app.use('/ride',proxy('https://uberclone-ride-service.onrender.com'));
app.get('/health',(req,res)=> res.send("ok"));

const port=process.env.PORT || 4000;
server.listen(port,()=>{
    console.log('Gateway service running at 4000 port');
})
