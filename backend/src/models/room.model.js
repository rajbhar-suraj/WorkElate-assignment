const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomName: {
        type: String,
        unique: true,
        required:true,
        min:6,
        max:8
    },
    drawingData: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"DrawingCommand"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActivity:{
        type:Date,
        default:Date.now
    }

}, { timestamps: true })

const RoomModel = mongoose.model("RoomModel",roomSchema)
module.exports = RoomModel