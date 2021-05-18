
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

const server = http.createServer(app)
 
const io = socketio(server)
 
io.on('connection', (socket) => {
    console.log('New web socket connection')
    socket.emit("Welcome Message", "Welcome!")
    socket.on('MessageToUser', (message) => {
        io.emit('Message', message)
    })
})
 
server.listen(3000)