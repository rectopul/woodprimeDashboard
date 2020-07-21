const btnInsertCustom = document.querySelector('.btn-insert-custom')
const custonResource = `custon`

const custom = (() => {
   //Private
   const excludes = { types: [], custons: [], options: [] }

   const getExcludes = () => excludes

   const selectAllTypes = check => {
      check.addEventListener('change', e => {
         const id = check.value

         if (check.checked == true) excludes.types.push(id)
         else excludes.types.splice(excludes.types.indexOf(id), 1)

         console.log(excludes)
      })
   }

   const selectAllCustom = check => {
      check.addEventListener('change', e => {
         const id = check.value

         if (check.checked == true) excludes.custons.push(id)
         else excludes.custons.splice(excludes.custons.indexOf(id), 1)

         console.log(excludes)
      })
   }

   const selectOptions = check => {
      check.addEventListener('click', e => {
         const id = check.dataset.id

         check.classList.toggle('show')

         if (check.classList.contains('show')) excludes.options.push(id)
         else excludes.options.splice(excludes.options.indexOf(id), 1)

         console.log(excludes)
      })
   }

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

   //Destroy card custom
   const destroyCustom = btn => {
      btn.addEventListener('click', e => {
         e.preventDefault()

         //modalActionConfirm
         const inputAction = document.querySelector('.actionConfirm')
         const btnAceptAction = document.querySelector('.aceptAction')

         inputAction.value = `customDestroy`

         btnAceptAction.dataset.id = btn.dataset.id

         $('.modalActionConfirm').modal('show')

         btnAceptAction.addEventListener('click', e => {
            const id = btnAceptAction.dataset.id

            if (inputAction.value == `customDestroy`) {
               return requestDestroyCustom(id)
                  .then(response => {
                     return update(() => {
                        btn.closest('.col-3').remove()

                        const inProdDestroy = document.querySelector(`.productCustonsBody .product-option-${id}`)

                        if (inProdDestroy) inProdDestroy.remove()

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
            }
         })
      })
   }

   //Create card from new customs
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

   //Create custom
   const createCardinProduct = item => {
      const { id, name, type, type_id, description } = item
      const card = document.createElement('div')

      card.classList.add(`col-4`, `productOption`, `product-option-${id}`)

      card.dataset.customName = type.name || null

      card.dataset.custom = id

      card.dataset.id = id

      card.dataset.customName = card.innerHTML = `
      <div class="card border-primary mb-3 productCustom item" data-dismiss="modal" data-option-id="32">
         <div class="card-header productOptionName">
               ${name}
         </div>
   
         <div class="card-body text-primary productOptionDesc">
            <p class="card-text">${description}</p>
         </div>
      </div>`

      const option = card.querySelector('.card')

      clickCustom(option)

      return document.querySelector('.productCustonsBody').append(card)
   }

   //request createCustom
   const requestCreateCustom = object => {
      return new Promise((resolve, reject) => {
         const { name, description, type_id } = object
         //Request
         update(1, `dark`)
         fetch(`/api/${custonResource}`, {
            method: 'POST',
            headers: {
               'content-type': 'application/json',
            },
            body: JSON.stringify({ name, description, type_id }),
         })
            .then(response => {
               if (!response.ok) return reject(`Não foi possível cadastrar a customização`)
               return response.json()
            })
            .then(res => {
               return resolve(res)
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
   }

   const validateCustom = list => {
      return new Promise((resolve, reject) => {
         list.map(item => {
            const { input, msg } = item

            if (!input.value) {
               input.setCustomValidity(msg)

               input.reportValidity()

               return reject(msg)
            }

            return resolve()
         })
      })
   }

   const clickCard = item => {
      return item.addEventListener('click', e => {
         // body
         e.preventDefault()

         //open modal
         $('#options').modal('show')

         //add loader in body
         document.querySelector('.optionsContainer').innerHTML = `
         <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
         </div>`

         //add loader in title modal
         document.querySelector('.modal.options .modal-title').innerHTML = `
         <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
         </div>`

         //add loader in title modal form option
         document.querySelector('.modal.formOptions .modal-title').innerHTML = `
         <div class="spinner-border text-primary" role="status">
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

      $(card.querySelector('.btnShowOptionsCustom')).tooltip()

      return clickCard(card.querySelector('.btnShowOptionsCustom'))
   }

   const createCustom = () => {
      //Pegar inputs
      const inputTypeCustom = document.querySelector('.typeCustom')
      const inputNameCustom = document.querySelector('.nameCustom')
      const inputDescriptionCustom = document.querySelector('.descCustom')

      return validateCustom([
         { input: inputTypeCustom, msg: 'Informe o nome da customização' },
         { input: inputNameCustom, msg: 'Informe uma descrição para a customização' },
         { input: inputDescriptionCustom, msg: 'Selecione o tipo de customização' },
      ])
         .then(res => {
            //Put loader in form
            document.querySelector('.loaderInsertCustom').classList.add('show')

            //Send request
            const customValues = {
               name: inputNameCustom.value,
               description: inputDescriptionCustom.value,
               type_id: inputTypeCustom.value,
            }

            return requestCreateCustom(customValues)
               .then(res => {
                  const { name, description, id } = res

                  return update(() => {
                     //SweetAlert
                     Swal.fire({
                        title: `Customização ${res.name} cadastrada`,
                        icon: 'success',
                        showCloseButton: true,
                     })

                     createCardinProduct(res)

                     document.querySelector('.btn-modal-types').classList.remove('btn-success')
                     document.querySelector('.btn-modal-types').classList.add('btn-primary')
                     document.querySelector('.btn-modal-types').innerHTML = `Items`

                     console.log(inputTypeCustom.value)

                     //insertCard in list tab
                     insertCardCustom({ name, description, id, type: inputTypeCustom.value })

                     //Limpar inputs
                     inputTypeCustom.value = ``
                     inputNameCustom.value = ``
                     inputDescriptionCustom.value = ``

                     return document.querySelector('.loaderInsertCustom').classList.remove('show')
                  }, `dark`)
               })
               .catch(err => {
                  return Swal.fire({
                     title: err,
                     icon: 'error',
                     showCloseButton: true,
                  })
               })
         })
         .catch(err => console.log(err))
   }

   const getOptions = card => {
      card.addEventListener('click', async e => {
         e.preventDefault()

         $('#productCustonsNv1').on('hidden.bs.modal', function(e) {
            // do something...

            $('#productCustonsNv2').modal('show')
            $(this).off('hidden.bs.modal')
         })

         $('#productCustonsNv2').on('hidden.bs.modal', function(e) {
            // do something...

            $('#productCustonsNv1').modal('show')
            $(this).off('hidden.bs.modal')
         })

         try {
            const id = card.dataset.id

            const container = document.querySelector('.listOptionsByCustom')

            container.innerHTML = ``

            if (!id) return console.log('Nenhum id selecionado')

            const custom = await util.request({
               url: `/api/custon/option/${id}`,
               headers: {
                  'content-type': `application/json`,
               },
            })

            const { options } = custom

            if (!options.length) return (container.innerHTML = `Nenhuma opção disponível`)

            container.innerHTML = ``

            options.map(option => container.append(createOption(option)))

            console.log(options)
         } catch (error) {}
      })
   }

   const createOption = object => {
      const { id, name, image } = object
      const card = document.createElement('div')

      card.classList.add('col-md-3')

      card.dataset.id = object.id

      card.innerHTML = `
      <div class="card border-primary mb-3 cardOption" data-id="${id}">
         <div class="card-header">
            <h5>${name}</h5>
         </div>
         <div class="card-body text-primary">
            <p class="card-text">
               <img src="${image}" class="img-thumbnail">
            </p>
         </div>
      </div>
      `

      //selectOptions

      selectOptions(card)

      return card
   }

   const createCard = object => {
      const card = document.createElement('div')

      card.classList.add('col-md-4')

      card.dataset.id = object.id

      card.innerHTML = `
      <div class="card border-primary mb-3">

         <div class="card-header d-flex justify-content-between align-items-center">
         Selecionar Todos
         <input type="checkbox" class="ml-auto selectAllCustom" id="selectAllCustom" value="${object.id}">
         </div>

         <div class="card-body text-primary text-center customNv1Item" data-id="${object.id}" data-dismiss="modal">
         <h6>${object.name}</h6>
         </div>
      </div>
      `
      //

      const checkbox = card.querySelector('.selectAllCustom')

      selectAllCustom(checkbox)

      const openNext = card.querySelector('.customNv1Item')

      getOptions(openNext)

      return card
   }

   const changelvl = card => {
      card.addEventListener('click', async e => {
         e.preventDefault()

         try {
            const id = card.dataset.id

            const containerCustons = document.querySelector('.listCustomByType')

            containerCustons.innerHTML = ``

            $('#productCustons').on('hidden.bs.modal', function(e) {
               // do something...

               $('#productCustonsNv1').modal('show')
               $(this).off('hidden.bs.modal')
            })

            //Error if not exist data id
            if (!id)
               return Swal.fire({
                  title: 'Nenhum id Selecionado',
                  icon: 'error',
                  showCloseButton: true,
               })

            //list all custom by type
            const types = await util.request({
               url: `/api/type/${id}`,
               headers: {
                  'content-type': `application/json`,
               },
            })

            //put all custons in next modal
            const { customization } = types

            if (!customization.length) return (containerCustons.innerHTML = `Nenhuma customisação deste tipo`)

            customization.map(custom => {
               containerCustons.append(createCard(custom))
            })
         } catch (error) {}
      })
   }

   const closeCustom = btn => {
      btn.addEventListener('click', function(e) {
         e.preventDefault()

         $('#productCustonsNv1').on('hidden.bs.modal', function(e) {
            // do something...

            $('#productCustons').modal('show')
            $(this).off('hidden.bs.modal')
         })
      })
   }

   return {
      create: createCustom,
      destroy: destroyCustom,
      showOptions: clickCard,
      createCard: createCardCustom,
      cardCustom: insertCardCustom,
      changelvl,
      closeCustom,
      allTypes: selectAllTypes,
      getExcludes,
   }
})()
//Select all types
const allTypes = document.querySelectorAll('.selectAllType')

if (allTypes) Array.from(allTypes).forEach(type => custom.allTypes(type))

//close custom to types
const btnCloseCustom = document.querySelector('.closeCustom')

if (btnCloseCustom) custom.closeCustom(btnCloseCustom)

const typesCustom = document.querySelectorAll('.typeCustomItem')

if (typesCustom) Array.from(typesCustom).forEach(card => custom.changelvl(card))

btnInsertCustom.addEventListener('click', e => {
   e.preventDefault()
   return custom.create()
})

//Show modal options
const cardCustom = document.querySelectorAll('.btnShowOptionsCustom')

Array.from(cardCustom).forEach(el => {
   return custom.showOptions(el)
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
         if (res.length > 0) {
            update(() => {
               //Caso retorne vazio
               if (!res.length) return (document.querySelector('.container-types').innerHTML = `Nenhum registro encontrado`)
               //limpando dados existentes
               document.querySelector('.container-types').innerHTML = ``
               //mappeando
               return res.forEach(c => {
                  if (c.type_id) {
                     const newCard = custom.createCard({
                        name: c.name,
                        description: c.description,
                        id: c.id,
                        type: c.type_id,
                     })
                     document.querySelector('.container-types').append(newCard)
                  }
               })
            }, `dark`)
         }
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
            return res.forEach(custon => {
               custom.cardCustom({
                  name: custon.name,
                  description: custon.description,
                  id: custon.id,
                  type: custon.type_id,
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

const btnDestroyCustom = document.querySelectorAll('.btnDeleteCustom')

Array.from(btnDestroyCustom).forEach(btn => {
   return custom.destroy(btn)
})
