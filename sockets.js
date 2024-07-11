// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//     cors: {
//         // origin: "https://inpogram.share.zrok.io",
//         // origin: "*",
// origin: "http://localhost",
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// });


const port = process.env.PORT || 3000

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const express = require('express');
    const app = express();
    const http = require('http').createServer(app);
    const io = require('socket.io')(http, {
        cors: {
            origin: "*", // Izinkan semua origin
            methods: ["GET", "POST"],
            // credential: true
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

    http.listen(port, () => {
        console.log(`WebSocket server running on port ${3000}`);
    });
}