const { server, app, express } = require('./sockets/socket')
const cors = require('cors');

require('dotenv').config();

const mongoDB = require('./utils/db')
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
app.use(express.json())

app.get('/', (req, res) => {
    res.send("heelle")
})


mongoDB()
const PORT = process.env.PORT
server.listen(PORT, () => console.log(`Server is running on: ${PORT}`))