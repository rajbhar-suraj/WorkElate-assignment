const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomId: {
        type: String,
        unique: true,
        required:true
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
    }

}, { timestamps: true })

const RoomModel = mongoose.model("RoomModel",roomSchema)
module.exports = RoomModel