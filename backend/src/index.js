const { server, app, express } = require('./sockets/socket')
const cors = require('cors');

require('dotenv').config();

const mongoDB = require('./utils/db')
const roomRouter = require('./routes/rooms.route')

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use('/api',roomRouter)



mongoDB()
const PORT = process.env.PORT
server.listen(PORT, () => console.log(`Server is running on: ${PORT}`))