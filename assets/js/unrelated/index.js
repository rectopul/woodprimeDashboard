const customUpdate = object => {
   const { id, name, description, type_id } = object

   update(1, `dark`)
   fetch(`${URL}/api/${custonResource}/${id}`, {
      method: 'PUT',
      headers: {
         'content-type': 'application/json',
      },
      body: JSON.stringify({ name, description, type_id }),
   })
      .then(response => {
         update(() => {
            console.log(response)

            return $('#modalUnrelated').modal('hide')
         }, `dark`)
      })
      .catch(err => {
         console.log(err)
         return update(() => {
            Swal.fire({
               title: `Tivemos um erro de sistema`,
               icon: 'error',
               showCloseButton: true,
            })
         })
      })
}

const editCustom = () => {
   const customs = document.querySelectorAll('.unrelatedCustom')
   const customForm = document.querySelector('.editCustomForm')

   //Submit form
   customForm.addEventListener('submit', e => {
      e.preventDefault()

      const data = {
         id: document.querySelector('.unrelatedCustomId').value,
         name: document.querySelector('#ulName').value,
         description: document.querySelector('#ulDescription').value,
         type_id: parseInt(document.querySelector('#ulTypeId').value),
      }

      return customUpdate(data)

      console.log(data)
   })

   //Click nos cards
   Array.from(customs).forEach(custom => {
      custom.addEventListener('click', e => {
         const id = custom.dataset.id
         const name = custom.querySelector('.unrelatedName').innerHTML
         const description = custom.querySelector('.unrelatedDescription').innerHTML

         document.querySelector('.unrelatedCustomId').value = id
         document.querySelector('#ulName').value = name
         document.querySelector('#ulDescription').value = description

         $('#modalUnrelated').modal('show')
      })
   })
}

editCustom()
