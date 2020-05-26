const URL = `http://warm-cliffs-28968.herokuapp.com`

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



const optionResource = `option`

const editCard = object => {
   const { id, name, price, image } = object

   const theCard = document.querySelector(`.cardOption[data-id="${id}"]`)

   //return console.log(theCard)

   //set name
   theCard.querySelector('.optionTitle').innerHTML = name

   //set image
   theCard.querySelector('.card-body img').src = image

   const intPrice = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

   //set price
   return (theCard.querySelector('.priceOption').innerHTML = intPrice)
}

//Cancel form option cancelSaveOption
const cancelSaveOption = document.querySelectorAll('.cancelSaveOption, .formOptions .close')

Array.from(cancelSaveOption).forEach(el => {
   el.addEventListener('click', e => {
      const formOption = document.querySelector('.formOptions')

      formOption.querySelector('.saveOption').dataset.editId = ``

      //Set null as values
      //set form name
      formOption.querySelector('.optionName').value = ``

      // set form price
      formOption.querySelector('.optionImage').value = ``

      // set form price
      formOption.querySelector('.optionPrice').value = ``
   })
})

const setFormEditOption = (id, object) => {
   const { name, price, image } = object

   const formOption = document.querySelector('.formOptions')

   formOption.classList.add('edit')

   //set form name
   formOption.querySelector('.optionName').value = name

   // set form price
   formOption.querySelector('.optionImage').value = image

   // set form image
   formOption.querySelector('.optionPrice').value = price

   //set button saveOption
   formOption.querySelector('.saveOption').dataset.editId = id
}

const updateOption = () => {
   const formOption = document.querySelector('.formOptions')

   formOption.classList.add('edit')

   //set form name
   const name = formOption.querySelector('.optionName').value

   // set form price
   const image = formOption.querySelector('.optionImage').value

   // set form price
   const price = formOption.querySelector('.optionPrice').value

   //set button saveOption
   const id = formOption.querySelector('.saveOption').dataset.editId

   update(1)

   fetch(`${URL}/api/${optionResource}/${id}`, {
      method: 'PUT',
      headers: {
         'content-type': 'application/json',
      },
      body: JSON.stringify({ name, image, price }),
   }).then(response => {
      update(() => {
         formOption.querySelector('.saveOption').dataset.editId = ``

         //set form name
         formOption.querySelector('.optionName').value = ``

         // set form price
         formOption.querySelector('.optionImage').value = ``

         // set form price
         formOption.querySelector('.optionPrice').value = ``

         //change card
         editCard({ id, name, image, price })

         $('#formOptions').modal('hide')

         return $('#formOptions').on('hidden.bs.modal', function(e) {
            // do something...
            $('#options').modal('show')
            $(this).off('hidden.bs.modal')
         })
      })
   })
}

const clickUpdateOption = button => {
   const id = button.dataset.id

   button.addEventListener('click', e => {
      //get values for inputs
      //get name
      const name = button
         .closest('.row')
         .querySelector('.optionTitle')
         .innerText.replace('\n', '')
      //get image
      const image = button.closest('.cardOption').querySelector('.card-text > img').src
      //get price
      const price = parseFloat(
         button
            .closest('.cardOption')
            .querySelector('.priceOption')
            .innerText.replace('R$', '')
            .replace(',', '.')
      )

      const openFormOption = document.querySelector('.insertOption')

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

      return setFormEditOption(id, { name, image, price })
   })
}

const deleteOption = element => {
   const id = element.dataset.id
   //return console.log(element.closest('.option'))
   update(1)
   fetch(`${URL}/api/${optionResource}/${id}`, {
      method: 'DELETE',
      headers: {
         'content-type': 'application/json',
      },
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            element.closest('.option').remove()
         })
      })
}

const clickRemoveOption = element => {
   element.addEventListener('click', e => {
      e.preventDefault()
      deleteOption(element)
   })
}

const showOptions = id => {
   //Request
   update(1, `dark`)
   fetch(`${URL}/api/${optionResource}?custom=${id}`)
      .then(response => response.json())
      .then(res => {
         update(() => {
            //SweetAlert

            //change title modal
            document.querySelector('.modal.options .modal-title').innerHTML = res.name

            //change title modal form option
            document.querySelector('.modal.formOptions .modal-title').innerHTML = `Adicionar ${res.name}`

            const { options } = res

            document.querySelector('.optionsContainer').innerHTML = ''

            if (!options.length) {
               return (document.querySelector('.optionsContainer').innerHTML = 'Não há opções dacastradas para esta customização')
            }

            options.forEach(option => {
               const optionPrice = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price)
               //return console.log(optionPrice)
               let divOption = document.createElement('div')
               divOption.classList.add('col-4', 'option')
               divOption.innerHTML = `
                     <div class="card border-primary mb-3 cardOption" data-id="${option.id}">
                        <div class="card-header">
                            <div class="row">
                                <div class="col-6 optionTitle">
                                    ${option.name} 
                                </div>
                                <div class="col-6 ml-auto">
                                    <button class="btn btn-primary btn-sm editOption" data-dismiss="modal" data-id="${option.id}" type="submit">
                                       <i class="fas fa-edit"></i>
                                    </button>
                                    
                                    <button class="btn btn-danger btn-sm" data-id="${option.id}" type="submit">
                                        <i class="far fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body text-primary">
                            <p class="card-text">
                                <img src="${option.image}" class="img-thumbnail">
                            </p>
                        </div>
                        <div class="card-footer bg-transparent">
                            <a href="#" class="btn btn-primary priceOption">${optionPrice}</a>
                        </div>
                     </div>`
               clickRemoveOption(divOption.querySelector('.card-header .btn-danger'))
               //edit options
               clickUpdateOption(divOption.querySelector('.card-header .editOption'))
               return document.querySelector('.optionsContainer').append(divOption)
            })
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
}

const InsertOption = id => {
   const name = document.querySelector('.optionName')
   const image = document.querySelector('.optionImage')
   const price = document.querySelector('.optionPrice')

   const divOption = document.createElement('div')

   divOption.classList.add('col-4', 'option')

   //validação
   if (!name.value) {
      name.setCustomValidity('Informe um nome para esta opção')
      return name.reportValidity()
   }
   if (!image.value) {
      image.setCustomValidity('Informe a url da imagem')
      return image.reportValidity()
   }
   if (!price.value) {
      price.setCustomValidity('Informe um preço para esta opção')
      return price.reportValidity()
   }

   const objectOption = {
      customization_id: id,
      name: name.value,
      image: image.value,
      price: parseFloat(price.value),
   }

   //verify quantity
   if (!document.querySelectorAll('.optionsContainer > div').length) document.querySelector('.optionsContainer').innerHTML = ``

   //Request
   update(1)
   fetch(`${URL}/api/${optionResource}`, {
      method: 'POST',
      headers: {
         'content-type': 'application/json',
      },
      body: JSON.stringify(objectOption),
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            const optionPrice = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(res.price)

            divOption.innerHTML = `
                  <div class="card border-primary mb-3 cardOption" data-id="${res.id}">
                        <div class="card-header">
                            <div class="row">
                                <div class="col-6 optionTitle">
                                    ${res.name} 
                                </div>
                                <div class="col-6 ml-auto">
                                    <button class="btn btn-primary btn-sm editOption" data-id="${res.id}" type="submit">
                                       <i class="fas fa-edit"></i>
                                    </button>

                                    <button class="btn btn-danger btn-sm" data-id="${res.id}" type="submit">
                                        <i class="far fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                          <div class="card-body text-primary">
                              <p class="card-text">
                                  <img src="${res.image}" class="img-thumbnail">
                              </p>
                          </div>
                          <div class="card-footer bg-transparent">
                             <a href="#" class="btn btn-primary priceOption">${optionPrice}</a>
                          </div>
                  </div>`

            document.querySelector('.optionsContainer').prepend(divOption)

            clickRemoveOption(divOption.querySelector('.card-header .btn-danger'))

            //edit option
            clickUpdateOption(divOption.querySelector('.card-header .editOption'))

            $('#formOptions').modal('hide')

            document.querySelector('.insertOption').dataset.insert = false

            return $('#formOptions').on('hidden.bs.modal', function(e) {
               // do something...
               $('#options').modal('show')
               $(this).off('hidden.bs.modal')
            })
         })
      })
      .catch(err => {
         Swal.fire({
            title: `Tivemos um erro de sistema`,
            icon: 'error',
            showCloseButton: true,
         })

         return console.log(err)
      })
}

const btnSaveOption = document.querySelector('.saveOption')

btnSaveOption.addEventListener('click', e => {
   e.preventDefault()

   if (btnSaveOption.dataset.editId) return updateOption()

   InsertOption(document.querySelector('.insertOption').dataset.option)
})

const getVtexProduct = skuProduct => {
   if (!skuProduct.value) return alert('Informe o sku do produto')
   const sku = skuProduct.value

   var myHeaders = new Headers({
      Host: '*',
   })

   fetch(`https://www.woodprime.com.br/produto/sku/${sku}`)
      .then(response => {
         return response.json()
      })
      .then(data => {
         console.log(data)
      })
      .catch(err => console.log(err))
}

const btnSearchProduct = document.querySelector('.btnGetProductVtex')

btnSearchProduct.addEventListener('click', e => {
   e.preventDefault()
   let inputSkuProduct = document.querySelector('.skuProduct')
   getVtexProduct(inputSkuProduct)
})

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

                  newType.addEventListener('click', function(e) {
                     selectType(newType)
                  })

                  //insert tab
                  tabTypeInsert({ id: res.id, name: res.name })

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
                  tabTypeRemove(id)
                  return document.querySelector(input.getAttribute('data-delete')).remove()
               }, `dark`)
            })
            .catch(err => console.log(err))
      })
      .catch(err => {
         console.log(err)
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
