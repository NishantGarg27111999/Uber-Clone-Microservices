const { Server, RemoteSocket } = require('socket.io');
const { redis } = require('./shared/redis-client');
const { redisSubscriber } = require('./shared/redis-client')

const axios = require('axios');

async function test(params) {
    await redis.set('test_key', 'Hello Redis');
    const value = await redis.get('test_key');
    console.log('✅ Redis is working. Value:', value);

}
test();


let io;
let initializeSocket = (server) => {




    io = new Server(server, {
        cors: {
            origin: '*', // <-- allow frontend origin
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    redisSubscriber.subscribe('new-ride')
    redisSubscriber.on('message', async (channel, message) => {
        if (channel === 'new-ride') {
            console.log("gateway per new-ride subscriber run hua");

            const { ride, captains } = JSON.parse(message);
            for (const captain of captains) {
                console.log('captain:', captain);
                const socketId = await redis.get(`user_socket:${captain}`);
                console.log('socketid: ', socketId);
                console.log(await redis.get(`user_socket:${captain}`));
                
                io.sockets.sockets.get(socketId)?.join(`ride_${ride._id}`);
            };
            console.log(io.sockets.adapter.rooms);
            io.to(`ride_${ride._id}`).emit('new-ride', ride);
        }
    });

    redisSubscriber.subscribe('ride-started')
    redisSubscriber.on('message', async (channel, message) => {
        if (channel == 'ride-started') {
            console.log("ride-started");
            const { rideCopy } = JSON.parse(message); 
            console.log(rideCopy);
            console.log(rideCopy.user);
            console.log(await redis.get(`user_socket:${rideCopy.user}`));
            io.to(await redis.get(`user_socket:${rideCopy.user}`)).emit('ride-started', rideCopy);
        }
    })

    io.on('connection', (socket) => {

        console.log('A client connected: ', socket.id);

        socket.on('disconnect', async () => {

            const userId = await redis.get(`socket_user:${socket.id}`);
            if (userId) {
                await redis.del(`user_socket:${userId}`);
                await redis.del(`socket_user:${socket.id}`);
            }
        })

        socket.on('join', async ({ userType, user }) => {
            console.log('A client has joined: ', socket.id);
            console.log(userType);

            await redis.set(`user_socket:${user._id}`, socket.id);
            await redis.set(`socket_user:${socket.id}`, user._id);


        });



        socket.on('update-captain-location', async ({ captainId, ltd, lng }) => {
            
            try {
                await redis.geoadd('captains_locations', lng, ltd, captainId);

                const response = await axios.get(`https://uberclone-gateway-service.onrender.com/ride/active-ride/${captainId}`);
                if (response.status == 200) {
                    const activeRide = response.data;
                    const userSocket = await redis.get(`user_socket:${activeRide.user}`);
                    io.to(userSocket).emit('captain-location-update', { ltd, lng });
                }
            }
            catch (err) {
                console.log('no active ride found for this captain.')
                return;
            }


        })

        socket.on('ride-accepted', async ({ rideId, captainId }) => {
            try {
                const response = await axios.post(`https://uberclone-gateway-service.onrender.com/ride/accept-ride`, {
                    rideId,
                    captainId
                });
                console.log('Ride after accept: ');
                console.log(response.data);
                const ride = response.data;
                const captainDetails = await axios.get(`http://localhost:4000/captains/${captainId}`);
                ride.captain = captainDetails.data;
                console.log('ride in accect-ride in socket.js ', ride);

                io.to(await redis.get(`user_socket:${ride.user}`)).emit('ride-accepted', ride);


                const acceptCaptainSocketId = await redis.get(`user_socket:${ride.captain._id}`);
                const acceptCaptainSocket = io.sockets.sockets.get(acceptCaptainSocketId);
                console.log('acceptSocket: ');
                console.log(acceptCaptainSocketId);
                acceptCaptainSocket.to(`ride_${rideId}`).emit('ride-gone', { rideId, captainId, message: 'This ride has been taken by another captain.' })
                io.in(`ride_${rideId}`).socketsLeave(`ride_${rideId}`);
            }
            catch (err) {
                console.error('ride-accepted error:', err.message);

            }

        })

        socket.on('finish-ride', async (ride) => {
            console.log('ride finished');
            console.log(ride);
            try{
                console.log('before axios.put request');
            const response=await axios.put(`https://uberclone-gateway-service.onrender.com/ride/${ride._id}/complete`);
            const rideRes=response.data;
            console.log('rideRes : ', rideRes);
            console.log('after udating ride complete status');
            redis.publish('ride-completed',JSON.stringify({captainId: rideRes.captain, fare: rideRes.fare,distance:rideRes.distance}));
            console.log('mein chala in ride finished');
            const userSocketId = await redis.get(`user_socket:${rideRes.user}`);
            console.log('userSocketId: ',userSocketId);
            io.to(userSocketId).emit('ride-finished');
            }
            catch(err){
                console.error(err.message);
            }
            
        })

        socket.on('cancel-ride', (socketId) => {
            console.log('cancel ride ', socketId);
            io.to(socketId).emit('ride-cancelled');
        })
    })


}

function sendMessageToSocketId(socketId, message) {
    if (io) {
        console.log('sent new-ride');
        io.to(socketId).emit(message.event, message.data);
    }
    else {
        console.log('Socket.io not initialized');
    }
}

function sendMessage(message) {
    io.emit('ride-accepted', message);
}
function getIo() {
    return io;
}



module.exports = { initializeSocket, sendMessageToSocketId, getIo }
