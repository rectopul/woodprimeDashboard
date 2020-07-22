//const URL = `http://woodprime.herokuapp.com/`
const URL = `http://192.168.0.10`

function update(callback, theme) {
    var element = document.querySelector('.barload')

    if (theme && theme == `dark`) {
        element.classList.add('dark')
    } else {
        element.classList.remove('dark')
    }

    var width = 1

    if (typeof callback === `function`) {
        width = 33
        var identity = setInterval(scene, 14)

        function scene() {
            if (width >= 100) {
                width = 1
                element.style.width = 0 + '%'
                callback()
                clearInterval(identity)
            } else {
                width++
                element.style.width = width + '%'
            }
        }
    }

    if (typeof callback === `number` && callback === 2) {
        width = 33
        var identity = setInterval(scene, 14)

        function scene() {
            if (width === 65) {
                return clearInterval(identity)
            } else {
                width++
                element.style.width = width + '%'
            }
        }
    }

    if (typeof callback == `number` && callback === 1) {
        width = 1
        var identity = setInterval(scene, 7)

        function scene() {
            if (width === 33) {
                return clearInterval(identity)
            } else {
                width++
                element.style.width = width + '%'
            }
        }
    }
}

const util = (() => {
    //private var/functions
    const request = options => {
        return new Promise((resolve, reject) => {
            const {
                headers,
                body,
                method,
                url
            } = options
            var myHeaders = new Headers()

            if (headers['content-type']) myHeaders.append('Content-Type', headers['content-type'])

            var myInit = {
                method: method || 'GET',
                headers: myHeaders
            }

            if (body) myInit.body = JSON.stringify(body)

            var myRequest = new Request(url, myInit)

            fetch(myRequest)
                .then(r => r.json())
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    return {
        //public var/functions
        request,
    }
})()

const spinner = (color, size) => {
    const spinner = document.createElement('div')

    spinner.classList.add('spinner-border', `text-${color ? color : 'primary'}`)

    if (size && size === `small`) spinner.classList.add('spinner-border-sm')

    spinner.setAttribute('role', 'status')

    spinner.innerHTML = `<span class="sr-only">Loading...</span>`

    return spinner
}

const animateCSS = async (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`
        const node = element

        node.classList.add(`${prefix}animated`, animationName)

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd() {
            node.classList.remove(`${prefix}animated`, animationName)
            node.removeEventListener('animationend', handleAnimationEnd)

            resolve('Animation ended')
        }

        node.addEventListener('animationend', handleAnimationEnd)
    })

$(document).ready(function () {
    $('.dropdown-toggle').dropdown()
    $('[data-toggle="tooltip"]').tooltip()
})

//Form validation
// Example starter JavaScript for disabling form submissions if there are invalid fields
'use strict';
window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}, false);
