const socket = io()

socket.on('Welcome Message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const mesgToUser = document.querySelector('#mesgToUser').value
    socket.emit('MessageToUser', mesgToUser)
})