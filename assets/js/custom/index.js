const btnInsertCustom = document.querySelector('.btn-insert-custom')
const custonResource = `custon`

const createCardCustom = item => {
   const card = document.createElement('div')

   const { id, name, description, type } = item

   card.classList.add('col-3', `card-custom-${id}`)

   card.dataset.category = `type-${type}`
   card.dataset.id = id

   card.innerHTML = `
    <div class="card border-primary mb-3 cardCustom" data-id="${id}">
         <div class="card-header">
            ${name}
            <button type="button" 
               class="btn btn-danger btn-sm btnDeleteCustom" 
               data-id="${id}"
            >
               <i class="fas fa-trash-alt"></i>
            </button>
         </div>
        <div class="card-body text-primary">
            <p class="card-text">${description}</p>
            <button type="button"
               class="btn btn-primary btnShowOptionsCustom"
               data-custom="${id}"
               data-toggle="tooltip"
               data-placement="top"
               title="Visualizar opções"
            >
               <i class="far fa-eye"></i>
            </button>
        </div>
    </div>`

   const btnDeleteCstom = card.querySelector('.btnDeleteCustom')

   destroyCustom(btnDeleteCstom)

   return card
}

const clickCard = item => {
   return item.addEventListener('click', e => {
      // body
      e.preventDefault()

      //open modal
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
      document.querySelector('.insertOption').dataset.option = item.dataset.custom

      //load options
      return showOptions(item.dataset.custom)
   })
}

const insertCardCustom = item => {
   const { id, name, description, type } = item

   const card = createCardCustom(item)

   document.querySelector(`.container-types`).prepend(card)

   const pillCustoms = document.querySelector('.pillcustoms')

   const countcustom = parseInt(pillCustoms.innerHTML)

   pillCustoms.innerHTML = countcustom + 1

   $(card.querySelector('.btnShowOptionsCustom')).tooltip()

   return clickCard(card.querySelector('.btnShowOptionsCustom'))
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

   console.log('cliquei no custom')

   document.querySelector('.loaderInsertCustom').classList.add('show')

   //Request
   update(1, `dark`)
   fetch(`/api/${custonResource}`, {
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
            document.querySelector('.btn-modal-types').innerHTML = `Items`

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
         console.log(err)
         return update(() => {
            Swal.fire({
               title: `Tivemos um erro de sistema`,
               icon: 'error',
               showCloseButton: true,
            })
         })
      })
})

//Show modal options
const cardCustom = document.querySelectorAll('.btnShowOptionsCustom')

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

//SEARCH CUSTOMS
/**
 * fetch nos custom
 */
const controller = new AbortController()
const signal = controller.signal
const indexCustom = () => {
   fetch(`/api/${custonResource}`, {
      method: 'GET',
      headers: {
         'content-type': 'application/json',
      },
      signal: signal,
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            //Caso retorne vazio
            if (!res.length) return (document.querySelector('.container-types').innerHTML = `Nenhum registro encontrado`)
            //limpando dados existentes
            document.querySelector('.container-types').innerHTML = ``
            //mappeando
            return res.forEach(custom => {
               if (custom.type_id) {
                  return insertCardCustom({
                     name: custom.name,
                     description: custom.description,
                     id: custom.id,
                     type: custom.type_id,
                  })
               }
            })
         }, `dark`)
      })
      .catch(error => {
         // catch the abort if you like
         if (error.name === 'AbortError') {
            console.log(`abortado`)
         }
      })
}
const findCustoms = text => {
   fetch(`/api/${custonResource}/search/${text}`, {
      method: 'GET',
      headers: {
         'content-type': 'application/json',
      },
      signal: signal,
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            //Caso retorne vazio
            if (!res.length) return (document.querySelector('.container-types').innerHTML = `Nenhum registro encontrado`)
            //limpando dados existentes
            document.querySelector('.container-types').innerHTML = ``
            //mappeando
            return res.forEach(custom => {
               insertCardCustom({
                  name: custom.name,
                  description: custom.description,
                  id: custom.id,
                  type: custom.type_id,
               })
            })
         }, `dark`)
      })
      .catch(error => {
         // catch the abort if you like
         if (error.name === 'AbortError') {
            console.log(`abortado`)
         }
      })
}
const searchCustom = () => {
   const inputSearch = document.querySelector('.search-custom')
   const btnSearchCustom = document.querySelector('.customSearchButton')
   const searchFormCustom = document.querySelector('.formSearchCustom')

   btnSearchCustom.addEventListener('click', function(e) {
      e.preventDefault()
      const text = inputSearch.value
      if (text.length < 3) {
         update(1, `dark`)
         return indexCustom(text)
      }

      if (text.length > 3) {
         update(1, `dark`)
         return findCustoms(text)
      }
   })
   searchFormCustom.addEventListener('submit', function(e) {
      e.preventDefault()
      const text = inputSearch.value
      if (text.length > 3) {
         update(1, `dark`)
         return findCustoms(text)
      }
   })
}

searchCustom()

//Filtro
const filter = () => {
   const buttons = document.querySelectorAll('.filtersCustom > a')

   Array.from(buttons).forEach(el => {
      el.addEventListener('click', function(e) {
         e.preventDefault()

         const dataFilter = el.dataset.filter

         //pega todos que não possuem o filtro selecionados
         const cards = document.querySelectorAll('.container-types > div')
         const cardshide = document.querySelectorAll(`.container-types > div[data-category="${dataFilter}"]`)

         if (dataFilter == `type-all`) {
            Array.from(cards).forEach(nofilter => {
               nofilter.classList.remove('hide')
            })
            return Array.from(cards).forEach(nofilter => {
               return animateCSS(nofilter, 'fadeIn')
            })
         }

         let cardsIn = [],
            cardsOut = []

         Array.from(cards).forEach(nofilter => {
            const datanofilter = nofilter.dataset.category

            if (datanofilter != dataFilter) {
               return cardsOut.push(nofilter)
            }

            return cardsIn.push(nofilter)
         })

         async function hidecards() {
            await Array.from(cardsOut).forEach(async card => {
               return await animateCSS(card, 'bounceOut').then(() => card.classList.add('hide'))
            })

            await Array.from(cardsIn).forEach(async card => {
               card.classList.remove('hide')
               return await animateCSS(card, 'fadeIn')
            })
         }

         hidecards()
      })
   })
}

filter()

//DELETE CUSTOM
//request Delete Custom
const requestDestroyCustom = id => {
   return new Promise((resolve, reject) => {
      update(1, `dark`)
      fetch(`/api/${custonResource}/${id}`, {
         method: 'DELETE',
         headers: {
            'content-type': 'application/json',
         },
      })
         .then(response => response.json())
         .then(res => {
            update(2, `dark`)
            if (res === 0) return reject(`Customização não existe`)

            return resolve(`Customização excluida com sucesso!`)
         })
         .catch(erro => {
            return reject(`Erro ao excluir customização`)
         })
   })
}
//btnDeleteCustom
const destroyCustom = btn => {
   btn.addEventListener('click', e => {
      e.preventDefault()

      const id = btn.dataset.id

      return requestDestroyCustom(id)
         .then(response => {
            return update(() => {
               btn.closest('.col-3').remove()
               return Swal.fire({
                  title: response,
                  icon: 'success',
                  showCloseButton: true,
               })
            }, `dark`)
         })
         .catch(error => {
            return update(() => {
               Swal.fire({
                  title: error,
                  icon: 'error',
                  showCloseButton: true,
               })
            }, `dark`)
         })
   })
}

const btnDestroyCustom = document.querySelectorAll('.btnDeleteCustom')

Array.from(btnDestroyCustom).forEach(btn => {
   return destroyCustom(btn)
})
