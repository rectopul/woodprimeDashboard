const vtexAccountName = `woodprime`
const vtexEnvironment = `vtexcommercestable`

const getVtexProduct = skuProduct => {
   if (!skuProduct.value) return alert('Informe o sku do produto')
   const sku = skuProduct.value

   var myHeaders = new Headers({
      Host: '*',
   })

   fetch(`https://${vtexAccountName}.${vtexEnvironment}.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/skuId${sku}`, {
      method: 'GET',
      headers: {
         'content-type': 'application/json',
         accept: 'application/json',
      },
   })
      .then(response => {
         return response.json()
      })
      .then(data => {
         console.log(data)
      })
      .catch(err => console.log(err))
}

const putValues = object => {
   const { name, code } = object
   document.querySelector('.nameProduct').value = name
   document.querySelector('.codeProduct').value = code
}

const btnSearchProduct = document.querySelector('.btnGetProductVtex')

btnSearchProduct.addEventListener('click', e => {
   e.preventDefault()
   let inputSkuProduct = document.querySelector('.skuProduct')
   //getVtexProduct(inputSkuProduct)
   return putValues({
      name: `Produto Teste`,
      code: `6277`,
   })
})
