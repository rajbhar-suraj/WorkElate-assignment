const http = require('http')
require('dotenv').config()
const express = require('express')
const { Server } = require('socket.io');
const Room = require("../models/room.model");
const DrawingCommand = require("../models/drawing.model");

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
        // console.log(userId, socket.id)
    }


    //room functionalities
    socket.on("join-room", async (roomId) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {}
        }

        rooms[roomId][userId] = userSocketMap[userId]

        socket.join(roomId)

        io.to(roomId).emit("roomUsers", Object.keys(rooms[roomId]));
        const history = await DrawingCommand.find({ roomId }).sort({ timestamp: 1 });
        io.emit("drawing-history", history);
    })

    socket.on("leave-room", (roomId) => {
        if(!roomId) return
        if (rooms[roomId]) {
            if (rooms[roomId][userId]) {
                delete rooms[roomId][userId];
            }
        }

        socket.leave(roomId);

        // Emit updated users in this room
        io.to(roomId).emit("roomUsers", Object.keys(rooms[roomId]));
    })


    //Canvas functionalities
    socket.on("draw-start", async ({ roomId, data }) => {
        
        await DrawingCommand.create({
            roomId,
            type: 'stroke',
            data
        })

        io.to(roomId).emit('draw-start', data)

    })

    socket.on("draw-move", async ({ roomId, data }) => {
        // console.log(data, roomId)
        await DrawingCommand.create({
            roomId,
            type: 'stroke',
            data
        })

        io.to(roomId).emit('draw-move', data)
    })

    socket.on("draw-end", async ({ roomId, data }) => {
        // console.log(data, roomId)
        await DrawingCommand.create({
            roomId,
            type: 'stroke',
            data
        })

        io.to(roomId).emit('draw-end', data)
    })

    socket.on('clear-canvas', async (roomId) => {
        await DrawingCommand.create({
            roomId,
            type: 'clear',
            data: {},
        });
        io.to(roomId).emit('clear-canvas', {});
    });
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