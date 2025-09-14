const mongoose = require('mongoose');

const drawingSchema = mongoose.Schema({
    roomId: {
        type: String,
        required: true, // which room this command belongs to
    },
    type: {
        type: String,
        enum: ['stroke', 'clear']
    },
    data: {
        type: Object,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const DrawingCommand = mongoose.model("DrawingModel",drawingSchema)
module.exports = {DrawingCommand}