const productResource = `product`

const requestProduct = object => {
   const { name, code, description, image } = object
   update(1, `dark`)
   fetch(`${URL}/api/${productResource}`, {
      method: 'POST',
      headers: {
         'content-type': 'application/json',
      },
      body: JSON.stringify({ name, code, description, image }),
   })
      .then(response => response.json())
      .then(res => {
         update(() => {
            //SweetAlert
            Swal.fire({
               title: `Produto ${res.name} cadastrado`,
               icon: 'success',
               showCloseButton: true,
            })
         }, `dark`)
      })
}

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

   return console.log({
      name: nameProduct.value,
      code: codeProduct.value,
      description: descriptionProduct.value,
      image: imageProduct.value,
   })

   requestProduct({
      name: nameProduct.value,
      code: codeProduct.value,
      description: descriptionProduct.value,
      image: imageProduct.value,
   })
}

const buttonInsert = document.querySelector('.insertProduct')

buttonInsert.addEventListener('click', e => {
   e.preventDefault()

   insertProduct()
})
