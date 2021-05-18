
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const express = require('express')

const app = express()


const port = process.env.PORT || 3000

// Define path for Express Config
const publicDirectoryPath = path.join(__dirname, '../public')
// Use express meddleware to serve public content
app.use(express.static(publicDirectoryPath))


/**
 * Console which port server is listening to
 */
const server = app.listen(port, () => {
    console.log(`Server is up on ${port} now!`)
})
// const server = http.createServer(app)
socketio.listen(server)

// Setup Socket.io to work with raw http server
const io = socketio(server)
// Set up message when socket.io gets the below message
io.on('connection', (socket) => {
    console.log('New web socket connection')
    socket.emit("Welcome Message", "Welcome!")
    socket.on('MessageToUser', (message) => {
        io.emit('Message', message)
    })
})