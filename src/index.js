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
        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(data.user.room).emit('message', generateMessage('Admin', `${data.user.username} has joined!`))
        io.to(data.room).emit('roomdata', {
            room: data.room,
            users: getUsersInRoom(data.room)
        })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left.`))
            io.to(user.room).emit('roomdata', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        callback()
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `http://google.com/maps?q=${coords.latitude},${coords.longitude}`))
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})