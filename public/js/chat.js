const socket = io()

// server (emit) -> client (receive) -- acknowledgement --> server 
// client (emit) -> server (receive) -- acknowledgement --> client

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#mesgToUser')
const $messageFormBtn = $messageForm.querySelector('#subBn')
const $locationSendBtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) =>{
    const html = Mustache.render(locationTemplate, {
        url
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormBtn.setAttribute('disabled', 'disabled')
    const mesgToUser = e.target.elements.mesgToUser.value
    console.log(mesgToUser)
    socket.emit('sendMessage', mesgToUser, (error) => {
        $messageFormBtn.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message was delivered.')
    })
})

$locationSendBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
    $locationSendBtn.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
            $locationSendBtn.removeAttribute('disabled')
        })
    })
})