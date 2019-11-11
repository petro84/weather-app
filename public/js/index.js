const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const msg1 = document.querySelector('#msg1')
const msg2 = document.querySelector('#msg2')
const locationButton = document.querySelector('#location')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const location = search.value

    msg1.textContent = 'Loading...'
    msg2.textContent = ''

    fetch(`/weather?address=${location}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                msg1.textContent = data.error
            } else {
                msg1.textContent = data.location
                msg2.textContent = data.summary
            }
        })
    })
})

locationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.setAttribute('disabled', 'disabled')

    msg1.textContent = 'Loading...'
    msg2.textContent = ''

    navigator.geolocation.getCurrentPosition((position) => {
        fetch(`/weather?coords=${position.coords.longitude}, ${position.coords.latitude}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    msg1.textContent = data.error
                } else {
                    msg1.textContent = data.location
                    msg2.textContent = data.summary
                }
                locationButton.removeAttribute('disabled')
            })
        })
    })
})