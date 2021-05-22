const socket = io()

// server (emit) -> client (receive) -- acknowledgement --> server 
// client (emit) -> server (receive) -- acknowledgement --> client
socket.on('Message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const mesgToUser = e.target.elements.mesgToUser.value
    console.log(mesgToUser)
    socket.emit('MessageToUser', mesgToUser, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message was delivered.')
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})