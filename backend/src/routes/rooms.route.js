// API Endpoints:
// - POST /api/rooms/join     // Join/create room
// - GET /api/rooms/:roomId   // Get room info

const router = require('express').Router();
const RoomModel = require('../models/room.model')

router.post('/rooms/join', async (req, res) => {
    try {
        const { roomId } = req.body;

        if (!roomId) return res.status(400).json({ message: "RoomId is required" })

        let room = await RoomModel.findOne({ roomId }).populate("drawingData");

        if (!room) {
            room = await RoomModel.create({ roomId })

            return res.status(201).json({ message: 'Room created successfully', room })
        }

        return res.status(200).json({ message: 'Room joined successfully', room });
    } catch (error) {
        console.log("Error while creating/joining room", error.message);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

router.get('/rooms/:roomId', async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await RoomModel.findOne({ roomId }).populate("drawingData");

        if (!room) return res.status(404).json({ message: "Room not found" });

        return res.status(200).json(room);
    } catch (error) {
        console.log("Error while fetching room", error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = { router }