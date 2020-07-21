const typeResource = `type`

let type = (() => {
   //private vars or function
   const request = options => {
      return new Promise((resolve, reject) => {
         const { url, headers, method, body } = options

         const opt = { method }

         if (headers) opt.headers = headers
         if (body) opt.body = JSON.stringify(body)

         fetch(url, opt)
            .then(r => r.json())
            .then(res => resolve(res))
            .catch(error => reject(error))
      })
   }

   //Create new card type and return this
   const cardType = object => {
      const { id, name } = object
      const newType = document.createElement('div')

      newType.classList.add('card', 'mb-3', 'card-type')

      newType.id = `type-${id}`

      newType.style.flex = `0 0 calc(33.333333% - 10px)`
      newType.style.margin = `0 5px`
      newType.innerHTML = `
         <div class="card-body text-center">
            <h6 class="card-title mb-0">${name}</h6>
         </div>
         <div class="types-hover">
            <button type="button" class="btn btn-danger del-type" data-delete="#type-${id}">
            <i class="fas fa-trash-alt"></i>
            </button>
            <button type="button" class="btn btn-success select-type" data-dismiss="modal" type-id="${id}" data-select="#type-${id}">
            <i class="fas fa-check"></i>
            </button>
         </div>`

      //event on click for select type
      newType.querySelector('.select-type').addEventListener('click', e => {
         e.preventDefault()
         selectType(newType.querySelector('.select-type'))
      })

      //event remove type
      const btnDelType = newType.querySelector('.del-type')

      btnDelType.addEventListener('click', e => {
         e.preventDefault()
         destroyType(btnDelType)
      })

      return newType
   }

   //insert card in data-base and put in container
   const insertType = input => {
      if (!input.value) return alert('Informe o nome do tipo de customização')
      update(1, `dark`)
      fetch(`/api/${typeResource}`, {
         method: 'POST',
         headers: {
            'content-type': 'application/json',
         },
         body: JSON.stringify({
            name: input.value,
         }),
      })
         .then(response => {
            update(2, `dark`)
            response
               .json()
               .then(res => {
                  //insert card to modal
                  const newType = cardType({ id: res.id, name: res.name })
                  const typeContainer = document.querySelector('.typesContainer')

                  input.value = ``

                  return update(() => typeContainer.prepend(newType), `dark`)
               })
               .catch(err => console.log(err))
         })
         .catch(err => {
            console.log(err)
         })
   }

   //Destroy type in data-base and remove of container
   const destroyType = input => {
      const inputAction = document.querySelector('.actionConfirm')
      const btnAceptAction = document.querySelector('.aceptAction')

      inputAction.value = `TypeDestroy`

      btnAceptAction.dataset.id = parseInt(input.getAttribute('data-delete').replace('#type-', ''))

      $('.modal.types').on('hidden.bs.modal', function(e) {
         // do something...
         $('.modalActionConfirm').modal('show')
         $(this).off('hidden.bs.modal')
      })

      $('.modal.types').modal('hide')

      btnAceptAction.addEventListener('click', e => {
         if (inputAction.value == `TypeDestroy`) {
            const id = btnAceptAction.dataset.id

            $('.modalActionConfirm').on('hidden.bs.modal', function(e) {
               // do something...
               $('.modal.types').modal('show')
               $(this).off('hidden.bs.modal')
            })

            update(1, `dark`)

            fetch(`/api/${typeResource}/${id}`, {
               method: 'DELETE',
            })
               .then(response => {
                  update(2, `dark`)
                  response
                     .json()
                     .then(res => {
                        //Delete card to modal

                        return update(() => {
                           //tabTypeRemove(id)
                           return input.closest('.card').remove()
                        }, `dark`)
                     })
                     .catch(err => console.log(err))
               })
               .catch(err => {
                  console.log(err)
                  update(() => {
                     Swal.fire({
                        title: `Tivemos um erro de sistema`,
                        icon: 'error',
                        showCloseButton: true,
                     })
                  }, `dark`)
               })
         }
      })
   }

   //select type and put in form value
   const selectType = element => {
      //Pegar id do type
      const idType = element.getAttribute('type-id')

      const inputTypeCustom = document.querySelector('.typeCustom')

      inputTypeCustom.value = idType

      const nameType = element.closest('.card-type').querySelector('.card-title')

      document.querySelector('.btn-modal-types').classList.remove('btn-primary')

      document.querySelector('.btn-modal-types').classList.add('btn-success')

      return (document.querySelector('.btn-modal-types').innerHTML = nameType.innerHTML)
   }

   const removeAllType = input => {
      input.addEventListener('change', async e => {
         try {
            if (input.checked == true) {
               const id = input.value

               await request({
                  url: `/api/types/exclude/${id}`,
                  method: 'POST',
                  headers: {
                     'content-type': 'application/json',
                  },
               })

               input.closest('.card.border-primary').classList.add('exclude')
            }
         } catch (error) {}
      })
   }

   return {
      //public functions or vars
      insertTab: item => {
         //Criando a TAB
         const newType = document.createElement('a')

         const { id, name } = item

         newType.classList.add('list-group-item', 'list-group-item-action')

         newType.setAttribute('id', `list-type-${id}-list`)
         //add role
         newType.setAttribute('role', `tab`)
         //add aria-selected
         newType.setAttribute('aria-selected', `false`)
         //add aria-controls
         newType.setAttribute('aria-controls', `list-type-${id}`)
         //add href
         newType.setAttribute('href', `#list-type-${id}`)

         newType.dataset.toggle = `list`

         newType.innerHTML = name

         //Criando o content
         const pane = document.createElement('div')

         //Adicionar as classes
         pane.classList.add(`tab-pane`, `fade`)

         //Adicionando id
         pane.setAttribute('id', `list-type-${id}`)
         //add Role
         pane.setAttribute('role', `tabpanel`)
         //add aria-labely
         pane.setAttribute('aria-labelledby', `list-type-${id}-list`)

         //CRIANDO PAGINAÇÃO
         const createPagination = () => {
            const pagination = document.createElement('div')

            pagination.classList.add('row')

            pagination.innerHTML = `<div class="col-12">
               <nav aria-label="..." class="paginate-type-${id}" data-resource="type">
                  <ul class="pagination">
                  <li class="page-item disabled">
                     <span class="page-link">Previous</span>
                  </li>
                  <li class="page-item active" aria-current="page">
                     <span class="page-link">
                        1
                        <span class="sr-only">(current)</span>
                     </span>
                  </li>
                  <li class="page-item">
                     <a class="page-link" href="#">Next</a>
                  </li>
                  </ul>
               </nav>
            </div> <!-- Paginação // -->`

            return pagination
         }

         //container of content
         const container = document.createElement('div')

         container.classList.add('row', `container-type-${id}`)

         document.querySelector('.tabContentTypes').append(pane)

         pane.append(createPagination())
         pane.append(container)
         pane.append(createPagination())

         return document.querySelector('.tabTypes').append(newType)
      },
      removeTab: id => {
         document.querySelector(`#list-type-${id}-list`).remove()
         document.querySelector(`#list-type-${id}`).remove()
      },
      create: insertType,
      destroy: destroyType,
      select: selectType,
   }
})()

//Create new Type
const btnInsertType = document.querySelector('.insertType')

btnInsertType.addEventListener('click', e => {
   e.preventDefault()
   return type.create(document.querySelector('.typeName'))
   //insertType(document.querySelector('.typeName'))
})

//Delete types
const btnDeleteType = document.querySelectorAll('.del-type')

Array.from(btnDeleteType).forEach(el => {
   el.addEventListener('click', e => {
      e.preventDefault()
      //return console.log(el)
      return type.destroy(el)
   })
})

//Select type form create custom
let btnSelect = document.querySelectorAll('.select-type')

Array.from(btnSelect).forEach(el => {
   el.addEventListener('click', function(e) {
      return type.select(el)
   })
})
