// API Endpoints:
// - POST /api/rooms/join     // Join/create room
// - GET /api/rooms/:roomId   // Get room info

const router = require('express').Router();

router.post('/rooms/join',controller)
router.get('/rooms/:roomId',controller)
