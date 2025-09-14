const mongoose = require('mongoose');
require('dotenv').config()

const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Atlas connected")
    } catch (error) {
        console.log("Error in connection",error.message)
        process.exit(1)
    }
}

module.exports = mongoDB