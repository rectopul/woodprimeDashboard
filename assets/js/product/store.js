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
