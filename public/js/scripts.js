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

$(document).ready(function() {
   $('.dropdown-toggle').dropdown()
   $('[data-toggle="tooltip"]').tooltip()
})

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

const insertUser = object => {
   return new Promise((resolve, reject) => {
      const { name, email, password } = object

      update(1, `dark`)

      fetch(`${URL}/api/user`, {
         method: 'POST',
         headers: {
            'content-type': 'application/json',
         },
         body: JSON.stringify({ name, email, password }),
      })
         .then(response => response.json())
         .then(res => {
            if (res.error) return reject(`Erro ao inserir novo usuário`)
            update(2, `dark`)
            return resolve(res)
         })
         .catch(error => {
            return reject(error)
         })
   })
}

const formNewUser = button => {
   button.addEventListener('click', e => {
      e.preventDefault()

      const inputName = document.querySelector('.newUserName')
      const inputEmail = document.querySelector('.newUserMail')
      const inputPassword = document.querySelector('.newUserPassword')

      const name = inputName.value
      const email = inputEmail.value
      const password = inputPassword.value

      console.log({ name, email, password })

      if (!name) {
         inputName.setCustomValidity('Informe o nome do usuário')
         return inputName.reportValidity()
      }
      if (!email) {
         inputEmail.setCustomValidity('Informe o e-mail do usuário')
         return inputEmail.reportValidity()
      }
      if (!password) {
         inputPassword.setCustomValidity('Informe uma senha para o usuário')
         return inputPassword.reportValidity()
      }

      insertUser({ name, email, password })
         .then(user => {
            const { success } = user

            return update(() => {
               //insert user and button
               //listUserInSistem
               const newUser = document.createElement('tr')

               newUser.innerHTML = `
                <th scope="row">${success.id}</th>
                <td>${success.name}</td>
                <td>${success.email}</td>
                <td class="td-actions text-right">
                    <button type="button" class="btn btn-danger btnRemoveUser" data-id="${success.id}">
                        <i class="far fa-trash-alt" aria-hidden="true"></i> Excluir
                    </button>
                </td>
                `

               document.querySelector('.listUserInSistem').append(newUser)

               clickToDestroyUser(newUser.querySelector('.btnRemoveUser'))

               $('#newUser').modal('hide')

               return $('#newUser').on('hidden.bs.modal', function(e) {
                  // do something...
                  Swal.fire({
                     title: `Usuário ${success.name} criado com sucesso!`,
                     icon: 'success',
                     showCloseButton: true,
                  })

                  return document.querySelector('.modal-backdrop').remove()
               })
            }, `dark`)
         })
         .catch(error => {
            update(() => {
               return Swal.fire({
                  title: error,
                  icon: 'error',
                  showCloseButton: true,
               })
            }, `dark`)
         })
   })
}

const formInsertNewUser = document.querySelector('.btnInsertNewUser')

formNewUser(formInsertNewUser)

//Destroy user
const destroyUser = id => {
   return new Promise((resolve, reject) => {
      update(1, `dark`)

      fetch(`${URL}/api/user/${id}`, {
         method: 'DELETE',
         headers: {
            'content-type': 'application/json',
         },
      })
         .then(response => response.json())
         .then(res => {
            if (res.error) return reject(`Erro ao inserir novo usuário`)
            update(2, `dark`)
            return resolve(res)
         })
         .catch(error => {
            return reject(error)
         })
   })
}

const clickToDestroyUser = btn => {
   btn.addEventListener('click', function(e) {
      const id = btn.dataset.id

      return destroyUser(id)
         .then(() => {
            btn.closest('tr').remove()
            return update(() => {
               Swal.fire({
                  title: `Usuário deletado com sucesso!`,
                  icon: 'success',
                  showCloseButton: true,
               })
            }, `dark`)
         })
         .catch(error => {
            return update(() => {
               Swal.fire({
                  title: `Erro ao deletar usuário!`,
                  icon: 'error',
                  showCloseButton: true,
               })
            }, `dark`)
         })
   })
}

const btnsRemoveUser = document.querySelectorAll('.btnRemoveUser')

Array.from(btnsRemoveUser).forEach(btn => {
   return clickToDestroyUser(btn)
})

const vtexAccountName = `woodprime`
const vtexEnvironment = `vtexcommercestable`

const createProductBySearch = object => {
   return new Promise((resolve, reject) => {
      const { name, code, image, options, id } = object

      const div = document.createElement('div')

      let productOptions = ``
      if (options.length) {
         options.forEach(opt => {
            const { id, option } = opt

            productOptions += `
            <tr class="text-left optionProduct">
               <th scope="row" class="px-1 productOptionName">
                  ${option.name} (${option.customization.name})
               </th>
               
               <td>${option.price}</td>
               <td class="text-right px-1 productRemoveO\ption">
                  <a href="#" data-id="${id}">
                  <i class="fas fa-trash-alt"></i>
                  </a>
               </td>
            </tr>
            `
         })
      }

      div.classList.add('col-4', 'productItem', 'my-2')

      div.innerHTML = `
      <div class="card border-primary mb-3 cardProduct item" data-id="${id}">
         <div class="card-header text-center searchProductName">
            ${name}
            <button type="button" class="btn btn-danger btn-sm productDestroy" data-id="${id}">
               <i class="fas fa-trash-alt"></i>
            </button>
         </div>
   
         <div class="card-body text-primary searchProductOptionsBody text-center px-1">
            <table class="table table-hover searchProductOptions mb-0">
               <thead>
                  <tr>
                     <th scope="col" class="text-left px-1">Option</th>
                     <th scope="col">Preço</th>
                     <th scope="col" class="text-right px-1">Action</th>
                  </tr>
               </thead>
   
               <tbody> ${productOptions} </tbody>
            </table>
            <!-- TABLE // -->
         </div>
      </div>
      `

      //remove option
      const linkRemoveOption = div.querySelectorAll('.productRemoveOption > a')

      Array.from(linkRemoveOption).forEach(link => {
         actionRemoveOption(link)
      })

      //remove product
      const btnsDestroyProduct = div.querySelector('.productDestroy')

      clickDestroyProduct(btnsDestroyProduct)

      return resolve(div)
   })
}

const searchProduct = slug => {
   update(1, `dark`)
   fetch(`${URL}/api/product_search/${slug}`, {
      method: 'GET',
      headers: {
         'content-type': 'application/json',
      },
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            return res.forEach(product => {
               document.querySelector('.listProduct').innerHTML = ``
               return createProductBySearch(product).then(res => {
                  return document.querySelector('.listProduct').append(res)
               })
            })
         }, `dark`)
      })
      .catch(err => {
         return Swal.fire({
            title: err,
            icon: 'error',
            showCloseButton: true,
         })
      })
}

const indexProducts = () => {
   update(1, `dark`)
   fetch(`${URL}/api/product`, {
      method: 'GET',
      headers: {
         'content-type': 'application/json',
      },
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            return res.forEach(product => {
               document.querySelector('.listProduct').innerHTML = ``
               return createProductBySearch(product).then(res => {
                  return document.querySelector('.listProduct').append(res)
               })
            })
         }, `dark`)
      })
      .catch(err => {
         return Swal.fire({
            title: err,
            icon: 'error',
            showCloseButton: true,
         })
      })
}

const btnSearchProductInternal = document.querySelector('.searchProductInternal')

btnSearchProductInternal.addEventListener('click', function(e) {
   e.preventDefault()
   const inputParamSearch = document.querySelector('.productParamSearch')

   if (inputParamSearch.value) {
      return searchProduct(inputParamSearch.value)
   } else {
      return indexProducts()
   }
})

const internalRequest = id => {
   return new Promise((resolve, reject) => {
      fetch(`${URL}/api/${productResource}/${id}`, {
         method: 'GET',
         headers: {
            'content-type': 'application/json',
         },
      })
         .then(response => response.json())
         .then(res => {
            if (!res) return reject(`Não há produtos`)

            const { name, code: id, image } = res
            const retorno = {
               name,
               id,
               image,
            }
         })
   })
}

const getVtexProduct = skuProduct => {
   return new Promise((resolve, reject) => {
      if (!skuProduct.value) return reject('Informe o sku do produto')
      const sku = skuProduct.value
      const URLSKU = `https://sistema.moveispracasa.com.br/api/admin/products/${sku}`

      var myHeaders = new Headers({
         Host: '*',
      })

      fetch(URLSKU, {
         method: 'GET',
         headers: {
            'content-type': 'application/json',
            accept: 'application/json',
         },
      })
         .then(response => response.json())
         .then(data => {
            const { product } = data
            if (!product) return reject(`Produto não encontrado`)

            //check ative
            const { isActiveOnVtex } = product

            if (!isActiveOnVtex) return reject(`Este produto está inativo na Vtex`)

            //vtexData.itemMetadata.items
            const { product_name, id, productName, productId } = product.vtexData

            let items

            if (product.vtexData.itemMetadata) {
               items = product.vtexData.itemMetadata.items
            } else {
               items = product.vtexData.items
            }

            if (!items.length) return reject(`Não há itens`)

            const retorno = {
               name: product_name || productName,
               id: id || productId,
            }

            if (items[0] && items[0].MainImage) {
               const { MainImage } = items[0]
               retorno.image = MainImage
            } else {
               const { images } = items[0]

               if (!images) return reject(`Não há imagem no produto`)

               retorno.image = images[0].imageUrl
            }

            return resolve(retorno)
         })
         .catch(err => reject(err))
   })
}

const putValues = object => {
   const { name, code, image } = object
   document.querySelector('.nameProduct').value = name
   document.querySelector('.codeProduct').value = code
   document.querySelector('.productNameInsert').innerHTML = name
   document.querySelector('.productCodeInsert b').innerHTML = `Código do produto: ${code}`
   document.querySelector('.productImageInsert').setAttribute(`src`, image)
}

const btnSearchProduct = document.querySelector('.btnGetProductVtex')

btnSearchProduct.addEventListener('click', e => {
   e.preventDefault()
   let inputSkuProduct = document.querySelector('.skuProduct')
   const olderText = btnSearchProduct.innerHTML
   btnSearchProduct.innerHTML = ``
   btnSearchProduct.append(spinner(`ligth`, 'small'))
   getVtexProduct(inputSkuProduct)
      .then(res => {
         console.log(res)
         const { name, id: code, image } = res
         document.querySelector('.resultProduct').classList.add('full')
         btnSearchProduct.innerHTML = olderText
         return putValues({ name, code, image })
      })
      .catch(res => {
         return Swal.fire({
            title: res,
            icon: 'error',
            showCloseButton: true,
         })
      })
})

const productResource = `product`
let optionsProduct = []

const product = (() => {
   // declare private variables and/or functions

   //Send request from create product
   const requestProduct = object => {
      const { name, code, description, image, options } = object
      update(1, `dark`)
      fetch(`${URL}/api/${productResource}`, {
         method: 'POST',
         headers: {
            'content-type': 'application/json',
         },
         body: JSON.stringify({ name, code, description, image, options }),
      })
         .then(response => response.json())
         .then(res => {
            update(() => {
               if (res.error)
                  return Swal.fire({
                     title: res.error,
                     icon: 'warning',
                     showCloseButton: true,
                  })

               //reset Form
               optionsProduct = []
               document.querySelector('.nameProduct').value = ``
               document.querySelector('.codeProduct').value = ``
               document.querySelector('.descriptionProduct').value = ``
               document.querySelector('.imageProduct').value = ``
               document.querySelector('.skuProduct').value = ``
               document.querySelector('.resultProduct').classList.remove('full')

               //remove as opcoes
               document.querySelector(`.optionsSelected`).innerHTML = ``

               //SweetAlert
               return Swal.fire({
                  title: `Produto ${res.name} cadastrado`,
                  icon: 'success',
                  showCloseButton: true,
               })
            }, `dark`)
         })
         .catch(err => {
            update(() => {
               return Swal.fire({
                  title: `Erro ao inserir novo produto`,
                  icon: 'error',
                  showCloseButton: true,
               })
            }, `dark`)
         })
   }

   //Create product and put in container
   const insertProduct = () => {
      const nameProduct = document.querySelector('.nameProduct')
      const codeProduct = document.querySelector('.codeProduct')
      const descriptionProduct = document.querySelector('.descriptionProduct')
      const imageProduct = document.querySelector('.imageProduct')

      //validar formulário

      //Nome
      if (!nameProduct.value) {
         nameProduct.setCustomValidity('Informe o nome do produto')
         return nameProduct.reportValidity()
      }
      //code
      if (!codeProduct.value) {
         codeProduct.setCustomValidity('Informe o nome do produto')
         return codeProduct.reportValidity()
      }
      //description
      if (!descriptionProduct.value) {
         descriptionProduct.setCustomValidity('Informe o nome do produto')
         return descriptionProduct.reportValidity()
      }
      //image
      if (!imageProduct.value) {
         imageProduct.setCustomValidity('Informe o nome do produto')
         return imageProduct.reportValidity()
      }

      return requestProduct({
         name: nameProduct.value,
         code: parseFloat(codeProduct.value),
         description: descriptionProduct.value,
         image: imageProduct.value,
         options: optionsProduct,
      })
   }

   //Request from destroy product and remove card of container
   const destroyProduct = id => {
      return new Promise((resolve, reject) => {
         update(1, `dark`)
         fetch(`/api/product/${id}`, {
            method: 'DELETE',
         })
            .then(response => {
               if (!response.ok) return reject(new Error('HTTP status ' + response.status))

               return resolve(`Produto excluído com sucesso!`)
            })
            .catch(err => {
               return reject(err)
            })
      })
   }

   //action from destroy product
   const clickDestroyProduct = btn => {
      btn.addEventListener('click', e => {
         e.preventDefault()
         const id = btn.dataset.id

         return destroyProduct(id)
            .then(res => {
               update(() => {
                  const productDelete = document.querySelector(`.productDestroy[data-id="${id}"]`).closest('.productItem')

                  productDelete.remove()
                  return Swal.fire({
                     title: res,
                     icon: 'success',
                     showCloseButton: true,
                  })
               }, `dark`)
            })
            .catch(err => {
               update(() => {
                  console.log(err)
                  return Swal.fire({
                     title: `Erro ao excluir produto!`,
                     icon: 'warning',
                     showCloseButton: true,
                  })
               }, `dark`)
            })
      })
   }

   return {
      // declare public variables and/or functions
      create: insertProduct,
      destroy: clickDestroyProduct,
   }
})()

//modal
$('#modalProductOptions').on('hidden.bs.modal', function(e) {
   // do something...
   $('#productCustons').modal('show')
})

const destroyProductOption = id => {
   update(1, `dark`)
   fetch(`${URL}/api/product_option/${id}`, {
      method: 'DELETE',
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            const optionDelete = document.querySelector(`.productRemoveOption a[data-id="${id}"]`).closest('.optionProduct')

            optionDelete.remove()
            return Swal.fire({
               title: `Customização removida com sucesso!`,
               icon: 'success',
               showCloseButton: true,
            })
         }, `dark`)
      })
}

const actionRemoveOption = link => {
   link.addEventListener('click', e => {
      e.preventDefault()

      const linkId = link.dataset.id

      destroyProductOption(linkId)
   })
}

const linkRemoveOption = document.querySelectorAll('.productRemoveOption > a')

Array.from(linkRemoveOption).forEach(link => {
   actionRemoveOption(link)
})

const btnsDestroyProduct = document.querySelectorAll('.productDestroy')

Array.from(btnsDestroyProduct).forEach(btn => {
   return product.destroy(btn)
})

const clickOption = option => {
   option.addEventListener('click', function(e) {
      // body
      const name = option.querySelector('.productOptionName').innerHTML
      const id = option.dataset.id
      const custom = option.dataset.custom
      const custom_name = option.dataset.customName
      const image = option.querySelector('.card-body img').getAttribute('src')

      option.classList.add('active')

      if (!document.querySelector(`.optionsSelected div[data-option="${id}"]`)) {
         optionInsert({ name, id, custom, custom_name, image })

         return optionsProduct.push(parseInt(id))
      }
   })
}

const optionInsert = object => {
   const { id, name, custom, custom_name, image } = object

   const div = document.createElement('div')

   div.classList.add('col-3', 'optionSelect')
   div.dataset.option = id

   div.innerHTML = `<div class="card">
      <div class="card-header text-center productCustomName" data-custom="${custom}">
         <button type="button" class="btn btn-danger btn-sm optionSelectDel" data-id="${id}">
            <i class="fas fa-trash-alt" aria-hidden="true"></i>
         </button>
         ${custom_name}
      </div>
      <div class="card-body productOptionName text-center">
         <p>${name}</p>
         <div class="row">
            <div class="col-12">
               <img src="${image}" alt="..." width="100" class="img-thumbnail">
            </div>
         </div>
      </div>
   </div>`

   //remove
   const btnDel = div.querySelector(`.optionSelectDel`)
   btnDel.addEventListener('click', e => {
      const id = btnDel.dataset.id

      optionsProduct.splice(optionsProduct.indexOf(parseInt(id)), 1)

      return btnDel.closest('.optionSelect').remove()
   })

   return document.querySelector('.optionsSelected').append(div)
}

const optionsCreate = object => {
   const { id, name, image, custom, custom_name } = object
   const containerOptions = document.querySelector('.modalProductOptionsContainer')

   const option = document.createElement('div')

   option.classList.add('col-3')

   option.dataset.custom = custom
   option.dataset.customName = custom_name
   option.dataset.id = id

   option.innerHTML = `
   <div class="card productOption">
      <div class="card-header productOptionName">${name}</div>
      <div class="card-body">
      <img src="${image}" alt="..." width="150" class="img-thumbnail">
      </div>
   </div>
   `

   clickOption(option)

   return containerOptions.append(option)
}

const getOptions = custom => {
   document.querySelector('.modalProductOptionsContainer').innerHTML = ``
   document.querySelector('.modalProductOptionsContainer').append(spinner())

   fetch(`${URL}/api/option?custom=${custom}`, {
      method: 'GET',
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            const { options } = res

            document.querySelector('.modalProductOptionsContainer').innerHTML = ``

            return options.forEach(option => {
               return optionsCreate({
                  id: option.id,
                  custom: option.customization_id,
                  custom_name: res.name,
                  name: option.name,
                  image: option.image,
               })
            })
         }, `dark`)
      })
}

const clickCustom = option => {
   option.addEventListener('click', function(e) {
      e.preventDefault()

      const custom = option.closest('.col-4').dataset.custom

      $('#productCustons').on('hidden.bs.modal', function(e) {
         // do something...
         $('#modalProductOptions').modal('show')
         $(this).off('hidden.bs.modal')
      })

      $('#modalProductOptions').on('hidden.bs.modal', function(e) {
         // do something...
         $('#productCustons').modal('show')
      })

      return getOptions(custom)
   })
}

const customCreate = object => {
   const { id, name, custom, custom_name } = object

   const div = document.createElement('div')

   div.classList.add('col-3')
   div.dataset.option = id

   div.innerHTML = `<div class="card">
      <div class="card-header productCustomName" data-custom="${custom}">${custom_name}</div>
      <div class="card-body productOptionName">
      ${name}
      </div>
   </div>`

   return document.querySelector('.optionsSelected').append(div)
}

const buttonInsert = document.querySelector('.insertProduct')
const modalOptionProduct = document.querySelector('.optionsSelect')
const productOption = document.querySelectorAll('.productOption .card')

Array.from(productOption).forEach(option => {
   clickCustom(option)
})

modalOptionProduct.addEventListener('click', e => {
   e.preventDefault()
   $('.productCustons').modal('show')
})

buttonInsert.addEventListener('click', e => {
   e.preventDefault()

   return product.create()
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
   })
      .then(response => {
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
               divOption.classList.add('col-6', 'col-lg-4', 'option')
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

const InsertOption = id => {
   const name = document.querySelector('.optionName')
   const image = document.querySelector('.optionImage')
   const price = document.querySelector('.optionPrice')

   const divOption = document.createElement('div')

   divOption.classList.add('col-6', 'col-lg-4', 'option')

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
                                    <button class="btn btn-primary btn-sm editOption" data-dismiss="modal" data-id="${res.id}" type="submit">
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
         update(() => {
            Swal.fire({
               title: `Tivemos um erro de sistema`,
               icon: 'error',
               showCloseButton: true,
            })
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

const typeResource = `type`

let type = (() => {
   //private vars or function

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
      const id = parseInt(input.getAttribute('data-delete').replace('#type-', ''))

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
