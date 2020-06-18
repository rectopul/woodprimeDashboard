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
