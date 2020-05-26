const URL = `http://warm-cliffs-28968.herokuapp.com`
//const URL = `http://localhost`

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

$(document).ready(function() {
   $('.dropdown-toggle').dropdown()
})
