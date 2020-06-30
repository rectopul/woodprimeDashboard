const typeResource = `type`

const tabTypeInsert = item => {
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
}

const tabTypeRemove = id => {
   document.querySelector(`#list-type-${id}-list`).remove()
   document.querySelector(`#list-type-${id}`).remove()
}

const createType = object => {
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
      <button type="button" class="btn btn-success select-type" data-dismiss="modal" type-id="${id}" data-select="#type-${res.id}">
      <i class="fas fa-check"></i>
      </button>
   </div>`

   newType.querySelector('.select-type').addEventListener('click', e => {
      e.preventDefault()
      selectType(newType.querySelector('.select-type'))
   })
}

const insertType = input => {
   if (!input.value) return alert('Informe o nome do tipo de customização')
   update(1, `dark`)
   fetch(`${URL}/api/${typeResource}`, {
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
               const newType = document.createElement('div')
               newType.classList.add('card', 'mb-3', 'card-type')
               newType.id = `type-${res.id}`
               newType.style.flex = `0 0 calc(33.333333% - 10px)`
               newType.style.margin = `0 5px`
               newType.innerHTML = `<div class="card-body text-center">
                <h6 class="card-title mb-0">${res.name}</h6>
              </div>
              <div class="types-hover">
                <button type="button" class="btn btn-danger del-type" data-delete="#type-${res.id}">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button type="button" class="btn btn-success select-type" data-dismiss="modal" type-id="${res.id}" data-select="#type-${res.id}">
                  <i class="fas fa-check"></i>
                </button>
              </div>`

               input.value = ``

               return update(() => {
                  document.querySelector('.typesContainer').prepend(newType)

                  newType.querySelector('.select-type').addEventListener('click', e => {
                     e.preventDefault()
                     console.log('selecionei')
                     selectType(newType.querySelector('.select-type'))
                  })

                  //insert tab
                  //tabTypeInsert({ id: res.id, name: res.name })

                  const btnDelType = newType.querySelector('.del-type')

                  return btnDelType.addEventListener('click', e => {
                     e.preventDefault()
                     deleteType(btnDelType)
                  })
               }, `dark`)
            })
            .catch(err => console.log(err))
      })
      .catch(err => {
         console.log(err)
      })
}

const btnInsertType = document.querySelector('.insertType')

btnInsertType.addEventListener('click', e => {
   e.preventDefault()
   insertType(document.querySelector('.typeName'))
})

const deleteType = input => {
   const id = parseInt(input.getAttribute('data-delete').replace('#type-', ''))
   update(1, `dark`)
   fetch(`${URL}/api/${typeResource}/${id}`, {
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
                  return document.querySelector(input.getAttribute('data-delete')).remove()
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

const btnDeleteType = document.querySelectorAll('.del-type')

Array.from(btnDeleteType).forEach(el => {
   el.addEventListener('click', e => {
      e.preventDefault()
      //return console.log(el)
      return deleteType(el)
   })
})

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

let btnSelect = document.querySelectorAll('.select-type')

Array.from(btnSelect).forEach(el => {
   el.addEventListener('click', function(e) {
      selectType(el)
   })
})
