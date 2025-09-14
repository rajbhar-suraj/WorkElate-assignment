const http = require('http')
require('dotenv').config()
const express = require('express')
const { Server } = require('socket.io');


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
})

/*
Socket Events:
- 'join-room'              // User joins room
- 'leave-room'             // User leaves room
- 'cursor-move'            // Cursor position update
- 'draw-start'             // Start drawing stroke
- 'draw-move'              // Drawing path data
- 'draw-end'               // End drawing stroke
- 'clear-canvas'           // Clear entire canvas

User count display

*/

const userSocketMap = {}
/* const room =  {
  room123: { user1: "socket1", user2: "socket2" },
  xyz456: { user3: "socket3" }
};


*/
const rooms = {}
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    if (userId) {
        userSocketMap[userId] = socket.id
        console.log(userId, socket.id)
    }

    socket.on("join-room", (roomId) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {}
        }

        rooms[roomId][userId] = userSocketMap[userId]

        socket.join(roomId)

        io.to(roomId).emit("roomUsers", Object.keys(rooms[roomId]));
    })

    socket.on("leave-room", (roomId) => {
        if (rooms[roomId][userId]) {
            delete rooms[roomId][userId]
        }
        socket.leave(roomId);

        // Emit updated users in this room
        io.to(roomId).emit("roomUsers", Object.keys(rooms[roomId]));
    })

    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        delete userSocketMap[userId]
        let roomId = 1;
        // room.map(user => user.roomId == roomId).
        //     filter(fuser => fuser.userId !== userSocketMap[userId])

        io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })

})



module.exports = { userSocketMap, server, express, app, io }