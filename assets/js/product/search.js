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

            const customName = option.customization ? `(${option.customization.name})` : ``

            productOptions += `
            <tr class="text-left optionProduct">
               <th scope="row" class="px-1 productOptionName">
                  ${option.name} ${customName}
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

      product.destroy(btnsDestroyProduct)

      return resolve(div)
   })
}

const searchProduct = slug => {
   update(1, `dark`)
   fetch(`/api/product_search/${slug}`, {
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
   fetch(`/api/product`, {
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
      fetch(`/api/${productResource}/${id}`, {
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
