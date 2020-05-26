const btnInsertCustom = document.querySelector('.btn-insert-custom')
const custonResource = `custon`

const createCardCustom = item => {
   const card = document.createElement('div')

   const { id, name, description } = item

   card.classList.add('col-6', `card-custom-${id}`)

   card.dataset.id = id

   card.innerHTML = `
    <div class="card border-primary mb-3 cardCustom" data-id="${id}">
        <div class="card-header">${name}</div>
        <div class="card-body text-primary">
            <p class="card-text">${description}</p>
        </div>
    </div>`

   return card
}

const clickCard = item => {
   return item.addEventListener('click', e => {
      // body
      e.preventDefault()
      $('#options').modal('show')

      //add loader in body
      document.querySelector('.optionsContainer').innerHTML = `<div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
              </div>`
      //add loader in title modal
      document.querySelector('.modal.options .modal-title').innerHTML = `<div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
              </div>`
      //add loader in title modal form option
      document.querySelector(
         '.modal.formOptions .modal-title'
      ).innerHTML = `<div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
              </div>`

      //set the option
      document.querySelector('.insertOption').dataset.option = item.dataset.id

      //load options
      return showOptions(item.dataset.id)
   })
}

const insertCardCustom = item => {
   const { id, name, description, type } = item

   const card = createCardCustom(item)

   document.querySelector(`.container-type-${type}`).prepend(card)

   const pillCustoms = document.querySelector('.pillcustoms')

   const countcustom = parseInt(pillCustoms.innerHTML)

   pillCustoms.innerHTML = countcustom + 1

   return clickCard(card)
}

btnInsertCustom.addEventListener('click', e => {
   e.preventDefault()
   //Pegar inputs
   const inputTypeCustom = document.querySelector('.typeCustom')
   const inputNameCustom = document.querySelector('.nameCustom')
   const inputDescriptionCustom = document.querySelector('.descCustom')
   //Validação
   if (!inputNameCustom.value) {
      inputNameCustom.setCustomValidity('Informe o nome da customização')
      return inputNameCustom.reportValidity()
   }
   if (!inputDescriptionCustom.value) {
      inputDescriptionCustom.setCustomValidity('Informe uma descrição para a customização')
      return inputDescriptionCustom.reportValidity()
   }
   if (!inputTypeCustom.value) {
      inputTypeCustom.setCustomValidity('Selecione o tipo de customização')
      return inputTypeCustom.reportValidity()
   }

   document.querySelector('.loaderInsertCustom').classList.add('show')

   //Request
   update(1, `dark`)
   fetch(`${URL}/api/${custonResource}`, {
      method: 'POST',
      headers: {
         'content-type': 'application/json',
      },
      body: JSON.stringify({
         name: inputNameCustom.value,
         description: inputDescriptionCustom.value,
         type_id: inputTypeCustom.value,
      }),
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            //SweetAlert
            Swal.fire({
               title: `Customização ${res.name} cadastrada`,
               icon: 'success',
               showCloseButton: true,
            })

            document.querySelector('.btn-modal-types').classList.remove('btn-success')
            document.querySelector('.btn-modal-types').classList.add('btn-primary')
            document.querySelector('.btn-modal-types').innerHTML = `Tipos de customização`

            console.log(inputTypeCustom.value)

            //insertCard in list tab
            insertCardCustom({ name: res.name, description: res.description, id: res.id, type: inputTypeCustom.value })

            //Limpar inputs
            inputTypeCustom.value = ``
            inputNameCustom.value = ``
            inputDescriptionCustom.value = ``

            return document.querySelector('.loaderInsertCustom').classList.remove('show')
         }, `dark`)
      })
      .catch(err => {
         Swal.fire({
            title: `Tivemos um erro de sistema`,
            icon: 'error',
            showCloseButton: true,
         })

         return console.log(err)
      })
})

//Show modal options
const cardCustom = document.querySelectorAll('.cardCustom')

Array.from(cardCustom).forEach(el => {
   clickCard(el)
})

const openFormOption = document.querySelector('.insertOption')

openFormOption.addEventListener('click', function(e) {
   e.preventDefault()

   $('#options').on('hidden.bs.modal', function(e) {
      // do something...
      $('#formOptions').modal('show')
      $(this).off('hidden.bs.modal')
   })

   $('#formOptions').on('hidden.bs.modal', function(e) {
      // do something...
      $('#options').modal('show')
   })
})
