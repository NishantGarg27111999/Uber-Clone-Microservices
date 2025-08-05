const redisSub = require('./shared/redis-client');

redisSub.on('message', (channel, message) => {
  if (channel === 'new-ride') {
    const { ride, captains } = JSON.parse(message);
    captains.forEach(captain => {
      io.sockets.sockets.get(captain.socketId)?.join(`ride_${ride._id}`);
    });
    io.to(`ride_${ride._id}`).emit('new-ride', ride);
  }
});