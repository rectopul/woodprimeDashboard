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

    //set button saveOption
    const id = formOption.querySelector('.saveOption').dataset.editId

    update(1)

    fetch(`/api/${optionResource}/${id}`, {
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
    fetch(`/api/${optionResource}/${id}`, {
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
    fetch(`/api/${optionResource}?custom=${id}`)
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
                    return (document.querySelector('.optionsContainer').innerHTML =
                        'Não há opções dacastradas para esta customização')
                }

                options.forEach(option => {
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

    const objectOption = {
        customization_id: id,
        name: name.value,
        image: image.value,
        price: 00,
    }

    //verify quantity
    if (!document.querySelectorAll('.optionsContainer > div').length) document.querySelector('.optionsContainer').innerHTML = ``

    //Request
    update(1)
    fetch(`/api/${optionResource}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(objectOption),
    })
        .then(response => response.json())
        .then(res => {
            update(() => {
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
