const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require("./utils/messages")

const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room }, callback) => {
        const data = addUser({ id: socket.id, username, room })
        console.log(data)
        if (data.error) {
            return callback(data.error)
        }
        socket.join(data.user.room)
        console.log("Successfully joined the room!")
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.to(data.user.room).emit('message', generateMessage(`${data.user.username} has joined!`))
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }
        io.to('Center City').emit('message', generateMessage(message))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left.`))
        }
        
    })

    socket.on('sendLocation', (coords, callback) => {
        callback()
        io.emit('locationMessage', generateLocationMessage(`http://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})