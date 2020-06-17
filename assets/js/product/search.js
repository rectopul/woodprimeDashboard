const vtexAccountName = `woodprime`
const vtexEnvironment = `vtexcommercestable`

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
   getVtexProduct(inputSkuProduct)
      .then(res => {
         console.log(res)
         const { name, id: code, image } = res
         document.querySelector('.resultProduct').classList.add('full')
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
