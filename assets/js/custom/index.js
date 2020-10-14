const btnInsertCustom = document.querySelector('.btn-insert-custom')
const custonResource = `custon`

const custom = (() => {
    //Private
    const excludes = { types: [], custons: [], options: [], childs: [] }

    const optionsSelected = document.querySelector('.optionsSelected')

    const handleChildForm = child => {
        const { name, id, nameProduct } = child

        const children = document.createElement('div')

        children.classList.add('form-row')

        children.innerHTML = `
         
         <div class="form-group col-12 mt-4">
            <hr>
            <label for="descriptionChildren-${id}">Descrição ${name}</label>
            <textarea class="form-control" id="descriptionChildren-${id}" rows="3" placeholder="Informe uma descrição"></textarea>
            <input type="hidden" id="nameChildren-${id}" value="${nameProduct} - ${name}" required>
            <input type="hidden" id="codeChildren-${id}" value="${id}" required>
         </div>
         <div class="form-group col-12">
            <label for="imageChildren-${id}">Imagem ${name}</label>
            <input type="text" class="form-control" id="imageChildren-${id}" placeholder="https://www.image.com">
         </div>
       `

        return children
    }

    const handleSelectContainers = (object, type) => {
        const { id, name } = object

        const card = document.createElement('div')

        card.classList.add('col-md-3', `${type === `type` ? `typeSelected` : `customSelected`}-${id}`)

        card.dataset.id = id

        card.innerHTML = `
      <div class="card">
         <div class="card-header">
            All ${type === `type` ? `Type` : `Custom`}
         </div>

         <div class="card-body">
            <h3>${name}</h3>
         </div>

         <div class="card-footer text-muted">
            <button class="btn btn-primary" data-id="${id}"><i class="far fa-trash-alt"></i></button>
         </div>
      </div>
      `

        if (type == `type`) destroySelectedType(card.querySelector('button'))
        else destroySelectedCustom(card.querySelector('button'))

        return card
    }

    const handleResetForm = () => {
        //excludes.options = []
        const dynamicElements = document.querySelectorAll('.informationProduct .form-row')

        const subProducts = document.querySelectorAll('.subProducts > div')

        if (subProducts) Array.from(subProducts).forEach(field => field.remove())
        if (dynamicElements) Array.from(dynamicElements).forEach(field => field.remove())
    }

    const handleSelectOption = object => {
        const { name, id } = object

        const card = document.createElement('div')

        card.classList.add('col-md-3', `optionSelected-${id}`)

        card.dataset.id = id

        card.innerHTML = `
      <div class="card">
         <div class="card-header">
            Option
         </div>

         <div class="card-body">
            <h6>${name}</h6>
         </div>

         <div class="card-footer text-muted">
            <button class="btn btn-primary" data-id="${id}">
               <i class="far fa-trash-alt" aria-hidden="true"></i>
            </button>
         </div>
      </div>
      `
        const button = card.querySelector('button')

        destroySelectedOption(button)

        return card
    }

    const destroySelectedCustom = button => {
        button.addEventListener('click', e => {
            e.preventDefault()

            const id = button.dataset.id
            const checkbox = document.querySelector(`.listCustomByType div[data-id="${id}"] .selectAllCustom`)

            //remove from constant
            excludes.custons.splice(excludes.custons.indexOf(id), 1)

            //remove card
            button.closest(`.customSelected-${id}`).remove()

            //unchecked type
            checkbox.checked = false
        })
    }

    const destroySelectedType = button => {
        button.addEventListener('click', e => {
            e.preventDefault()

            const id = button.dataset.id
            const checkbox = document.querySelector(`.productType[data-id="${id}"] .selectAllType`)

            //remove from constant
            excludes.types.splice(excludes.types.indexOf(id), 1)

            //remove card
            button.closest(`.typeSelected-${id}`).remove()

            //unchecked type
            checkbox.checked = false
        })
    }

    const destroySelectedOption = button => {
        button.addEventListener('click', e => {
            e.preventDefault()

            const id = button.dataset.id

            //remove from constant
            excludes.options.splice(excludes.options.indexOf(id), 1)

            //remove card
            button.closest(`.optionSelected-${id}`).remove()
        })
    }

    const getExcludes = () => excludes

    const selectAllTypes = check => {
        check.addEventListener('change', e => {
            const id = check.value
            const name = check.closest('.productType').querySelector('h3').textContent
            const card = check.closest('.productType')

            if (check.checked == true) {
                excludes.types.push(id)

                card.classList.add('selected')

                //put on container
                optionsSelected.append(handleSelectContainers({ id, name }, `type`))
            } else {
                excludes.types.splice(excludes.types.indexOf(id), 1)

                card.classList.remove('selected')

                optionsSelected.querySelector(`.typeSelected-${id}`).remove()
            }
        })
    }

    const selectAllCustom = check => {
        check.addEventListener('change', e => {
            const id = check.value
            const name = check.closest('.card').querySelector('h6').textContent
            const card = check.closest('.col-md-4')

            if (check.checked == true) {
                excludes.custons.push(id)

                card.classList.add('selected')

                //put in container
                optionsSelected.append(handleSelectContainers({ id, name }, `custom`))
            } else {
                excludes.custons.splice(excludes.custons.indexOf(id), 1)

                card.classList.remove('selected')

                //Remove from container
                optionsSelected.querySelector(`.customSelected-${id}`).remove()
            }
        })
    }

    const selectOptions = check => {
        check.addEventListener('click', e => {
            const id = check.dataset.id
            const name = check.querySelector('h5').textContent

            const card = document.querySelector('.listOptionstoSelect > .active')

            card.classList.add('selected')

            check.classList.toggle('show')

            if (check.classList.contains('show')) {
                excludes.options.push(id)

                console.log(excludes)

                if (optionsSelected) optionsSelected.append(handleSelectOption({ id, name }))
            } else {
                excludes.options.splice(excludes.options.indexOf(id), 1)

                console.log(excludes)

                if (!check.closest('.listCustomByType').querySelector('.show')) card.classList.remove('selected')

                //remove option from list
                if (optionsSelected) optionsSelected.querySelector(`.optionSelected-${id}`).remove()
            }
        })
    }

    function handleDeleteCustom() {
        const btnAcceptAction = document.querySelector('.aceptAction')
        const inputAction = document.querySelector('.actionConfirm')

        btnAcceptAction.addEventListener('click', function (e) {
            const id = btnAcceptAction.dataset.id

            if(!id) return

            if (inputAction.value == `customDestroy`) {
                return requestDestroyCustom(id)
                    .then(response => {
                        console.log(response)
                        return update(() => {
                            const theCustomCard = document.querySelector(`.card-custom-${id}`);

                            if (theCustomCard) theCustomCard.remove()

                            return Swal.fire({
                                title: response,
                                icon: 'success',
                                showCloseButton: true,
                            })
                        }, `dark`)
                    })
                    .catch(error => {
                        console.log(error)
                        return update(() => {
                            Swal.fire({
                                title: error,
                                icon: 'error',
                                showCloseButton: true,
                            })
                        }, `dark`)
                    })
            }
        });
    }

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

                    return resolve(`Customização excluída com sucesso!`)
                })
                .catch(erro => {
                    return reject(`Erro ao excluir customização`)
                })
        })
    }

    //Destroy card custom
    const destroyCustom = btn => {


        btn.addEventListener('click', e => {
            e.preventDefault()

            //modalActionConfirm
            const inputAction = document.querySelector('.actionConfirm')
            const btnAceptAction = document.querySelector('.aceptAction')

            inputAction.value = `customDestroy`

            btnAceptAction.dataset.id = btn.dataset.id

            $('.modalActionConfirm').modal('show')
        })
    }

    //Create card from new customs
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

        const btnDeleteCstom = card.querySelector('.btnDeleteCustom')

        destroyCustom(btnDeleteCstom)

        return card
    }

    //Create custom
    const createCardinProduct = item => {
        const { id, name, type, type_id, description } = item
        const card = document.createElement('div')

        card.classList.add(`col-4`, `productOption`, `product-option-${id}`)

        card.dataset.customName = type.name || null

        card.dataset.custom = id

        card.dataset.id = id

        card.dataset.customName = card.innerHTML = `
      <div class="card border-primary mb-3 productCustom item" data-dismiss="modal" data-option-id="32">
         <div class="card-header productOptionName">
               ${name}
         </div>
   
         <div class="card-body text-primary productOptionDesc">
            <p class="card-text">${description}</p>
         </div>
      </div>`

        const option = card.querySelector('.card')

        clickCustom(option)

        return document.querySelector('.productCustonsBody').append(card)
    }

    //request createCustom
    const requestCreateCustom = object => {
        return new Promise((resolve, reject) => {
            const { name, description, typeCustom : type_id , order } = object
            //Request
            update(1, `dark`)
            fetch(`/api/${custonResource}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ name, description, type_id, order }),
            })
                .then(response => {
                    if (!response.ok) return reject(`Não foi possível cadastrar a customização`)
                    return response.json()
                })
                .then(res => {

                    if(res.error) {
                        return reject(res.error)
                    }

                    return resolve(res)
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
    }

    const validateCustom = list => {
        return new Promise((resolve, reject) => {
            list.map(item => {
                const { input, msg } = item

                if (!input.value) {
                    input.setCustomValidity(msg)

                    input.reportValidity()

                    return reject(msg)
                }

                return resolve()
            })
        })
    }

    const clickCard = item => {
        return item.addEventListener('click', e => {
            // body
            e.preventDefault()

            //open modal
            $('#options').modal('show')

            //add loader in body
            document.querySelector('.optionsContainer').innerHTML = `
         <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
         </div>`

            //add loader in title modal
            document.querySelector('.modal.options .modal-title').innerHTML = `
         <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
         </div>`

            //add loader in title modal form option
            document.querySelector('.modal.formOptions .modal-title').innerHTML = `
         <div class="spinner-border text-primary" role="status">
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

        $(card.querySelector('.btnShowOptionsCustom')).tooltip()

        return clickCard(card.querySelector('.btnShowOptionsCustom'))
    }

    const createCustom = () => {
        //Pegar inputs
        const inputTypeCustom = document.querySelector('.typeCustom')
        const inputNameCustom = document.querySelector('.nameCustom')
        const inputDescriptionCustom = document.querySelector('.descCustom')

        const form = document.querySelector('.formCreateCustom');

        const fields = util.serialize(form)

        console.log(fields);

        return validateCustom([
            { input: inputTypeCustom, msg: 'Informe o nome da customização' },
            { input: inputNameCustom, msg: 'Informe uma descrição para a customização' },
            { input: inputDescriptionCustom, msg: 'Selecione o tipo de customização' },
        ])
            .then(res => {
                //Put loader in form
                document.querySelector('.loaderInsertCustom').classList.add('show')

                //Send request
                const customValues = util.serialize(form)

                return requestCreateCustom(customValues)
                    .then(res => {
                        const { name, description, id } = res

                        return update(() => {
                            //SweetAlert
                            Swal.fire({
                                title: `Customização ${res.name} cadastrada`,
                                icon: 'success',
                                showCloseButton: true,
                            })

                            createCardinProduct(res)

                            document.querySelector('.btn-modal-types').classList.remove('btn-success')
                            document.querySelector('.btn-modal-types').classList.add('btn-primary')
                            document.querySelector('.btn-modal-types').innerHTML = `Items`

                            console.log(inputTypeCustom.value)

                            //insertCard in list tab
                            insertCardCustom({ name, description, id, type: inputTypeCustom.value })

                            //Limpar inputs
                            inputTypeCustom.value = ``
                            inputNameCustom.value = ``
                            inputDescriptionCustom.value = ``

                            return document.querySelector('.loaderInsertCustom').classList.remove('show')
                        }, `dark`)
                    })
                    .catch(err => {
                        return Swal.fire({
                            title: err,
                            icon: 'error',
                            showCloseButton: true,
                        })
                    })
            })
            .catch(err => console.log(err))
    }

    const getOptions = card => {
        card.addEventListener('click', async e => {
            e.preventDefault()

            update(1, 'dark')

            try {
                const id = card.dataset.id

                const container = document.querySelector('.listCustomByType')

                container.innerHTML = ``

                if (!id) return console.log('Nenhum id selecionado')

                const custom = await util.request({
                    url: `/api/custon/option/${id}`,
                    headers: {
                        'content-type': `application/json`,
                    },
                })

                return update(() => {
                    const { options } = custom

                    if (!options.length) return (container.innerHTML = `Nenhuma opção disponível`)

                    container.innerHTML = ``

                    options.map(option => container.append(createOption(option)))

                    $('#productCustonsNv1').modal('show')

                    $('#productCustonsNv1').on('hidden.bs.modal', function(e) {
                        // do something...

                        card.closest('.col-md-3.mb-3').classList.remove('active')
                        $(this).off('hidden.bs.modal')
                    })

                    card.closest('.col-md-3.mb-3').classList.add('active')
                }, 'dark')
            } catch (error) {}
        })
    }

    const createOption = object => {
        const { id, name, image } = object
        const card = document.createElement('div')

        card.classList.add('col-md-3')

        if (excludes.options.indexOf(`${id}`) != -1) card.classList.add('show')

        card.dataset.id = object.id

        card.innerHTML = `
      <div class="card border-primary mb-3 cardOption" data-id="${id}">
         <div class="card-header">
            <h5>${name}</h5>
         </div>
         <div class="card-body text-primary">
            <p class="card-text">
               <img src="${image}" class="img-thumbnail">
            </p>
         </div>
      </div>
      `

        //selectOptions

        selectOptions(card)

        return card
    }

    const createCard = object => {
        const card = document.createElement('div')

        card.classList.add('col-md-4')

        card.dataset.id = object.id

        const indexOfCustom = excludes.custons.indexOf(`${object.id}`) != -1 ? `checked` : ``

        card.innerHTML = `
      <div class="card border-primary mb-3">

         <div class="card-header d-flex justify-content-between align-items-center">
         Selecionar Todos
         <input type="checkbox" class="ml-auto selectAllCustom" id="selectAllCustom" value="${object.id}" ${indexOfCustom}>
         </div>

         <div class="card-body text-primary text-center customNv1Item" data-id="${object.id}" data-dismiss="modal">
         <h6>${object.name}</h6>
         </div>
      </div>
      `
        //

        const checkbox = card.querySelector('.selectAllCustom')

        selectAllCustom(checkbox)

        const openNext = card.querySelector('.customNv1Item')

        getOptions(openNext)

        return card
    }

    const changeLevel = card => {
        card.addEventListener('click', async e => {
            e.preventDefault()

            try {
                const id = card.dataset.id

                const containerCustons = document.querySelector('.listCustomByType')

                containerCustons.innerHTML = ``

                $('#productCustons').on('hidden.bs.modal', function(e) {
                    // do something...

                    $('#productCustonsNv1').modal('show')
                    $(this).off('hidden.bs.modal')
                })

                //Error if not exist data id
                if (!id)
                    return Swal.fire({
                        title: 'Nenhum id Selecionado',
                        icon: 'error',
                        showCloseButton: true,
                    })

                //list all custom by type
                const types = await util.request({
                    url: `/api/type/${id}`,
                    headers: {
                        'content-type': `application/json`,
                    },
                })

                //put all custons in next modal
                const { customization } = types

                if (!customization.length) return (containerCustons.innerHTML = `Nenhuma customisação deste tipo`)

                customization.map(custom => {
                    containerCustons.append(createCard(custom))
                })
            } catch (error) {}
        })
    }

    const closeCustom = btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault()

            $('#productCustonsNv1').on('hidden.bs.modal', function(e) {
                // do something...

                //$('#productCustons').modal('show')
                $(this).off('hidden.bs.modal')
            })
        })
    }

    //add custom from excludes
    function selectCustom(id) {
        return excludes.custons.push(parseInt(id))
    }

    //remove custom from excludes
    function removeCustom(id) {
        const filtered = excludes.custons.filter(x => x != id)

        return (excludes.custons = filtered)
    }

    function get(id) {
        return new Promise((resolve, reject) => {
            util.get(`/api/custom/${id}`).then(resolve).catch(reject)
        })
    }

    function change(object) {
        return new Promise((resolve, reject) => {
            const { id, name, description, order} = object

            fetch(`/api/custon/${id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({name, description, order}),
            })
                .then(e => e.json())
                .then(res => {
                    if(res.error) return reject(res.error)

                    return resolve(res)
                })
                .catch(error => console.log(error))
        })
    }

    function handleModalChangeCustom(object) {
        const { name, description, id, order } = object

        const form = document.querySelector('#changeCustomModal form');

        form.elements['name'].value = name
        form.elements['description'].value = description
        form.elements['order'].value = order

        form.dataset.id = id

        return $('#changeCustomModal').modal('show')
    }

    function handleChangeCustom(btn) {
        btn.addEventListener('click', function (e) {
            // body
            const id = btn.dataset.id

            if(!id) return 

            return get(id).then(handleModalChangeCustom).catch(console.log)
        });
    }

    function changeCardCustom(object) {
        const { id, name, description } = object

        const card = document.querySelector(`.card-custom-${id}`);

        if(!card) return

        //change title
        card.querySelector('.card-header > span').innerHTML = name

        //change description
        card.querySelector('.card-body > p').innerHTML = description
    }

    function handleFormChangeCustom(form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault()

            const id = form.dataset.id

            if(!id) return

            const values = util.serialize(form)

            values.id = id

            return change(values).then(res => {
                changeCardCustom(res)

                $('#changeCustomModal').modal('hide')

                $('#changeCustomModal').on('hidden.bs.modal', function (e) {
                    Swal.fire({
                        title: `Customização ${res.name} alterada com sucesso!`,
                        icon: 'success',
                        showCloseButton: true,
                    })

                    $(this).off('#changeCustomModal')
                })

                
            }).catch(err => {
                return Swal.fire({
                    title: err,
                    icon: 'error',
                    showCloseButton: true,
                })
            })
        });
    }

    function changeCustom(target) {
        const elements = [...document.querySelectorAll(target)];

        //get all elements
        if(elements) {
            elements.map(handleChangeCustom)
        }
    }

    return {
        selectCustom,
        removeCustom,
        create: createCustom,
        destroy: destroyCustom,
        showOptions: clickCard,
        createCard: createCardCustom,
        cardCustom: insertCardCustom,
        handleResetForm,
        changeLevel,
        closeCustom,
        allTypes: selectAllTypes,
        getExcludes,
        getOptions,
        handleChild: ({ name, description, image }) => excludes.childs.push({ name, description, image }),
        handleChildForm,
        changeCustom,
        handleFormChangeCustom,
        handleDeleteCustom
    }
})()

custom.handleDeleteCustom()
//change custom
custom.changeCustom('.btnChangeCustom')

const formChangeCustom = document.querySelector('#changeCustomModal form')

if(formChangeCustom) custom.handleFormChangeCustom(formChangeCustom)

//List options in product
const btnGetOptions = document.querySelectorAll('.listOptionstoSelect > div a.btn')

if (btnGetOptions) Array.from(btnGetOptions).forEach(button => custom.getOptions(button))

//Select all types
const allTypes = document.querySelectorAll('.selectAllType')

if (allTypes) Array.from(allTypes).forEach(type => custom.allTypes(type))

//close custom to types
const btnCloseCustom = document.querySelector('.closeCustom')

if (btnCloseCustom) custom.closeCustom(btnCloseCustom)

const typesCustom = document.querySelectorAll('.typeCustomItem')

if (typesCustom) Array.from(typesCustom).forEach(card => custom.changeLevel(card))

btnInsertCustom.addEventListener('click', e => {
    e.preventDefault()
    return custom.create()
})

//Show modal options
const cardCustom = document.querySelectorAll('.btnShowOptionsCustom')

Array.from(cardCustom).forEach(el => {
    return custom.showOptions(el)
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
            if (res.length > 0) {
                update(() => {
                    //Caso retorne vazio
                    if (!res.length) return (document.querySelector('.container-types').innerHTML = `Nenhum registro encontrado`)
                    //limpando dados existentes
                    document.querySelector('.container-types').innerHTML = ``
                    //mappeando
                    return res.forEach(c => {
                        if (c.type_id) {
                            const newCard = custom.createCard({
                                name: c.name,
                                description: c.description,
                                id: c.id,
                                type: c.type_id,
                            })
                            document.querySelector('.container-types').append(newCard)
                        }
                    })
                }, `dark`)
            }
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
                return res.forEach(custon => {
                    custom.cardCustom({
                        name: custon.name,
                        description: custon.description,
                        id: custon.id,
                        type: custon.type_id,
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

const btnDestroyCustom = document.querySelectorAll('.btnDeleteCustom')

Array.from(btnDestroyCustom).forEach(btn => {
    return custom.destroy(btn)
})
