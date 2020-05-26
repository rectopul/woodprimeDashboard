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
