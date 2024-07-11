const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Izinkan semua origin
        methods: ["GET", "POST"]
    }
});
const cors = require('cors');

app.use(cors());

io.on('connection', (socket) => {
    socket.on('join_room', (room_id) => {
        socket.join(room_id);
    });

    socket.on('update_time', (data) => {
        io.to(data.room_id).emit('update_time', data.time);
    });

    socket.on('comment', (data) => {
        io.to(data.room_id).emit('new_comment', data);
    });

    socket.on('video_control', (data) => {
        io.to(data.room_id).emit('video_control', data.action);
    })
});

http.listen(3000, () => {
    console.log('WebSocket server running on port 3000');
});