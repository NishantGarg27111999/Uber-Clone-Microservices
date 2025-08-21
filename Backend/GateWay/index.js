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
app.use('/user',proxy('http://localhost:4001'));
app.use('/captains',proxy('http://localhost:4002'));
app.use('/ride',proxy('http://localhost:4003'));

const port=process.env.PORT || 4000;
server.listen(port,()=>{
    console.log('Gateway service running at 4000 port');
})