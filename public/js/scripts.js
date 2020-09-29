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

const util = (() => {
    //private var/functions
    const request = options => {
        return new Promise((resolve, reject) => {
            const { headers, body, method, url } = options
            var myHeaders = new Headers()

            if (headers['content-type']) myHeaders.append('Content-Type', headers['content-type'])

            var myInit = {
                method: method || 'GET',
                headers: myHeaders,
            }

            if (body) myInit.body = JSON.stringify(body)

            var myRequest = new Request(url, myInit)

            fetch(myRequest)
                .then(r => r.json())
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    return {
        //public var/functions
        request,
    }
})()

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

//Form validation
// Example starter JavaScript for disabling form submissions if there are invalid fields
;('use strict')
window.addEventListener(
    'load',
    function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation')
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener(
                'submit',
                function(event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                },
                false
            )
        })
    },
    false
)

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
            <textarea class="form-control" id="descriptionChildren-${id}" rows="3" placeholder="Informe uma descrição" required></textarea>
            <input type="hidden" id="nameChildren-${id}" value="${nameProduct} - ${name}" required>
            <input type="hidden" id="codeChildren-${id}" value="${id}" required>
         </div>
         <div class="form-group col-12">
            <label for="imageChildren-${id}">Imagem ${name}</label>
            <input type="text" class="form-control" id="imageChildren-${id}" placeholder="https://www.image.com" required>
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

            btnAceptAction.addEventListener('click', e => {
                const id = btnAceptAction.dataset.id

                if (inputAction.value == `customDestroy`) {
                    return requestDestroyCustom(id)
                        .then(response => {
                            return update(() => {
                                btn.closest('.col-3').remove()

                                const inProdDestroy = document.querySelector(`.productCustonsBody .product-option-${id}`)

                                if (inProdDestroy) inProdDestroy.remove()

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
                }
            })
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
            const { name, description, type_id } = object
            //Request
            update(1, `dark`)
            fetch(`/api/${custonResource}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ name, description, type_id }),
            })
                .then(response => {
                    if (!response.ok) return reject(`Não foi possível cadastrar a customização`)
                    return response.json()
                })
                .then(res => {
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

        return validateCustom([
            { input: inputTypeCustom, msg: 'Informe o nome da customização' },
            { input: inputNameCustom, msg: 'Informe uma descrição para a customização' },
            { input: inputDescriptionCustom, msg: 'Selecione o tipo de customização' },
        ])
            .then(res => {
                //Put loader in form
                document.querySelector('.loaderInsertCustom').classList.add('show')

                //Send request
                const customValues = {
                    name: inputNameCustom.value,
                    description: inputDescriptionCustom.value,
                    type_id: inputTypeCustom.value,
                }

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
    }
})()
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

const insertUser = object => {
    return new Promise((resolve, reject) => {
        const { name, email, password } = object

        update(1, `dark`)

        fetch(`/api/user`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
            }),
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

        console.log({
            name,
            email,
            password,
        })

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

        insertUser({
            name,
            email,
            password,
        })
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

        fetch(`/api/user/${id}`, {
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

//Change password
const user = (() => {
    //private var/functions

    //Change password
    const handleFormPassword = form => {
        form.addEventListener('submit', e => {
            e.preventDefault()

            if (form.checkValidity()) {
                const id = form.dataset.id
                const password = form.querySelector('.newPassword').value

                update(1, `dark`)
                util.request({
                    method: `PUT`,
                    url: `/api/user/${id}`,
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: {
                        password,
                    },
                }).then(res => {
                    return update(() => {
                        $('#changePasswordModal').modal('hide')

                        $('#changePasswordModal').on('hidden.bs.modal', function(e) {
                            // do something...

                            if (document.querySelector('.modal-backdrop')) document.querySelector('.modal-backdrop').remove()

                            return Swal.fire({
                                title: `Senha atualizada`,
                                icon: 'success',
                                showCloseButton: true,
                            })
                        })
                    }, `dark`)
                })
            }
        })
    }

    return {
        //public var/functions
        changePassword: handleFormPassword,
    }
})()

const formChangePassword = document.querySelector('.formChangePassword')

if (formChangePassword) user.changePassword(formChangePassword)

const optionResource = `option`

const editCard = object => {
    const { id, name, image } = object

    const theCard = document.querySelector(`.cardOption[data-id="${id}"]`)

    //return console.log(theCard)

    //set name
    theCard.querySelector('.optionTitle').innerHTML = name

    //set image
    return (theCard.querySelector('.card-body img').src = image)
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
        body: JSON.stringify({ name, image }),
    })
        .then(response => {
            update(() => {
                formOption.querySelector('.saveOption').dataset.editId = ``

                //set form name
                formOption.querySelector('.optionName').value = ``

                // set form price
                formOption.querySelector('.optionImage').value = ``

                //change card
                editCard({ id, name, image })

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
        const price = 0

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
                        'Não há opções castradas para esta customização')
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

const vtexAccountName = `woodprime`
const vtexEnvironment = `vtexcommercestable`

const searching = (() => {
    //private var/functions
    const putOnResults = (products) => {
        const containerPartial = document.querySelector('.productsFound')

        containerPartial.classList.add('show')

        containerPartial.innerHTML = ``

        products.map((prod) => {
            const produto = product(prod)

            containerPartial.append(produto)
        })
    }

    const custromDestroy = (option) => {
        option.addEventListener('click', async (e) => {
            try {
                e.preventDefault()

                option.closest('.col-6.col-md-3').style.display = `none`

                const option_id = option.dataset.id

                const product_id = option.closest('.productFind').dataset.id

                //remove from product
                await request({
                    url: `/api/product_opt`,
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: { option_id, product_id },
                })

                //remove from list

                option.closest('.col-6.col-md-3').remove()
            } catch (error) {
                option.closest('.col-6.col-md-3').style.display = `flex`
                console.log(error)
            }
        })
    }

    const productDesctroy = (button) => {
        button.addEventListener('click', async (e) => {
            try {
                e.preventDefault()

                button.closest('.productFind').style.display = `none`

                const id = button.dataset.id

                await request({
                    url: `/api/product/${id}`,
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json',
                    },
                })

                return button.closest('.productFind').remove()
            } catch (error) {
                button.closest('.productFind').style.display = `flex`
                console.log(error)
            }
        })
    }

    const listCustom = (customList) => {
        const custons = customList.map((custom) => {
            const list = document.createElement('div')

            list.classList.add('productInSearch', 'col-6', 'col-md-3', 'my-3')

            list.dataset.id = custom.id

            list.innerHTML = `
         <div class="card">
            <img class="card-img-top" src="${custom.image}" alt="Card image cap">
            <div class="card-body">
               <h5 class="card-title">${custom.name}</h5>
               <small>${custom.customization ? custom.customization.name : ``}</small>
            </div>
         </div>
         `

            custromDestroy(list)

            return list
        })

        return custons
    }

    const productStrong = (infos) => {
        const { name, id, image, code, custom } = infos

        const product = document.createElement('div')

        product.classList.add('col-12', 'productFind')

        product.dataset.id = id

        product.innerHTML = `
      <div class="row">
         <div class="col-md-4">
         <img src="${image}" alt="" class="img-thumbnail" style="width: 100%">
         </div>

         <div class="col-md">
            <h4>${name}</h4>

            <p>${code}</p>
         </div>

         <div class="col-2 text-right">
            <button type="button" class="btn btn-danger destrProduct" data-id="${id}">Deletar</button>
         </div>
      </div>

      <hr>

      <div class="row">
         <h1 class="text-center mx-auto mb-4">Customizações</h1>
         <div class="col-12 productCustoms">
            <div class="row"></div>
         </div>
      </div>
      `
        const btnDestroy = product.querySelector('.destrProduct')

        if (btnDestroy) productDesctroy(btnDestroy)

        const custons = [...listCustom(custom)]

        custons.map((custom) => {
            product.querySelector('.productCustoms > .row').append(custom)
        })

        return product
    }

    const product = (infos) => {
        const { id, image, name } = infos
        const div = document.createElement('div')

        div.classList.add('col-12')

        div.dataset.id = id

        div.innerHTML = `
      <div class="row">
         <img src="${image}" alt="produto" width="40px" class="img-thumbnail">
         <!--name of product -->
         <span>${name}</span>
      </div>
      `

        select(div)

        return div
    }

    const request = (options) => {
        return new Promise((resolve, reject) => {
            const { url, headers, method, body } = options

            const opt = { method }

            if (headers) opt.headers = headers
            if (body) opt.body = JSON.stringify(body)

            fetch(url, opt)
                .then((r) => r.json())
                .then((res) => resolve(res))
                .catch((error) => reject(error))
        })
    }

    const delay_method = (label, callback, time) => {
        if (typeof window.delayed_methods == 'undefined') {
            window.delayed_methods = {}
        }
        delayed_methods[label] = Date.now()
        var t = delayed_methods[label]

        setTimeout(function () {
            if (delayed_methods[label] != t) {
                return
            } else {
                console.log(arguments)
                delayed_methods[label] = ''
                callback()
            }
        }, time || 500)
    }

    const search = (input) => {
        input.addEventListener('keyup', (e) => {
            const containerPartial = document.querySelector('.productsFound')

            if (!input.value.length) {
                return containerPartial.classList.remove('show')
            }

            if (input.value && input.value.length > 3) {
                delay_method('check date parallel', async () => {
                    try {
                        const find = input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

                        const products = await request({
                            url: `/api/product_search/${find}`,
                            method: 'GET',
                            headers: {
                                'content-type': 'application/json',
                            },
                        })

                        if (products.length) return putOnResults(products)
                    } catch (error) {
                        console.log(error)
                    }
                })
            }
        })
    }

    const select = (button) => {
        const productContainer = document.querySelector('.listProduct')
        button.addEventListener('click', async (e) => {
            e.preventDefault()

            const id = button.dataset.id

            const product = await request({
                url: `/api/product/${id}`,
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                },
            })

            //esconde a pesquisa
            button.closest('.productsFound').classList.remove('show')

            productContainer.innerHTML = ``

            if (productContainer) productContainer.append(productStrong(product))
        })
    }

    return {
        //public var/functions
        search,
    }
})()

const inputSearch = document.querySelector('.productParamSearch')

if (inputSearch) searching.search(inputSearch)

const createProductBySearch = (object) => {
    return new Promise((resolve, reject) => {
        const { name, code, image, options, id } = object

        const div = document.createElement('div')

        let productOptions = ``
        if (options.length) {
            options.forEach((opt) => {
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

        Array.from(linkRemoveOption).forEach((link) => {
            actionRemoveOption(link)
        })

        //remove product
        const btnsDestroyProduct = div.querySelector('.productDestroy')

        product.destroy(btnsDestroyProduct)

        return resolve(div)
    })
}

const searchProduct = (slug) => {
    update(1, `dark`)
    fetch(`/api/product_search/${slug}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((res) => {
            update(() => {
                return res.forEach((product) => {
                    document.querySelector('.listProduct').innerHTML = ``
                    return createProductBySearch(product).then((res) => {
                        return document.querySelector('.listProduct').append(res)
                    })
                })
            }, `dark`)
        })
        .catch((err) => {
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
        .then((response) => response.json())
        .then((res) => {
            update(() => {
                return res.forEach((product) => {
                    document.querySelector('.listProduct').innerHTML = ``
                    return createProductBySearch(product).then((res) => {
                        return document.querySelector('.listProduct').append(res)
                    })
                })
            }, `dark`)
        })
        .catch((err) => {
            return Swal.fire({
                title: err,
                icon: 'error',
                showCloseButton: true,
            })
        })
}

const internalRequest = (id) => {
    return new Promise((resolve, reject) => {
        fetch(`/api/${productResource}/${id}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((res) => {
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

const getVtexProduct = (skuProduct) => {
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
            .then((response) => response.json())
            .then((data) => {
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

                if (product.vtexData.items.length) {
                    retorno.skus = product.vtexData.items
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
            .catch((err) => reject(err))
    })
}

const putValues = (object) => {
    const { name, code, image } = object
    document.querySelector('.nameProduct').value = name
    document.querySelector('.codeProduct').value = code
    document.querySelector('.productNameInsert').innerHTML = name
    document.querySelector('.productCodeInsert b').innerHTML = `Código do produto: ${code}`
    document.querySelector('.productImageInsert').setAttribute(`src`, image)
}

const btnSearchProduct = document.querySelector('.btnGetProductVtex')

btnSearchProduct.addEventListener('click', (e) => {
    e.preventDefault()
    custom.handleResetForm()
    let inputSkuProduct = document.querySelector('.skuProduct')
    const olderText = btnSearchProduct.innerHTML
    btnSearchProduct.innerHTML = ``
    btnSearchProduct.append(spinner(`ligth`, 'small'))
    getVtexProduct(inputSkuProduct)
        .then((res) => {
            console.log(res)
            const { name, id: code, image, skus } = res

            //subitens
            if (skus && skus.length > 1) {
                const subProducts = document.querySelector('.subProducts')
                if (subProducts) subProducts.innerHTML = ``
                skus.map((sku) => {
                    const subProduct = document.createElement('div')

                    subProduct.classList.add('col-md-2', 'mt-3')

                    subProduct.innerHTML = `
                     <div class="card">
                        <img class="card-img-top" src="${sku.images[0].imageUrl}" alt="Card image cap">
                        <div class="card-body text-center" style="border-top: 1px solid rgba(0,0,0,.125)">
                           <h6 class="card-title">${sku.name}</h6>
                        </div>
                     </div>
                     `

                    document
                        .querySelector('.informationProduct')
                        .append(custom.handleChildForm({ id: sku.id || sku.itemId, name: sku.name, nameProduct: name }))

                    if (subProducts) subProducts.append(subProduct)
                })
            }

            document.querySelector('.resultProduct').classList.add('full')
            btnSearchProduct.innerHTML = olderText
            return putValues({ name, code, image })
        })
        .catch((res) => {
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
        const { name, code, description, image, options, excludes, children } = object
        update(1, `dark`)
        fetch(`/api/${productResource}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ name, code, description, image, options, excludes, children }),
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
                    const formRows = document.querySelectorAll(`.formInsertProduct .form-row`)
                    const showClass = document.querySelectorAll(`.listCustomByType .show`)

                    //Limpa opções listOptionstoSelect
                    const listOptions = document.querySelectorAll(`.listOptionstoSelect .selected`)

                    if (showClass) Array.from(showClass).forEach(option => option.classList.remove('show'))

                    if (listOptions) Array.from(listOptions).forEach(option => option.classList.remove('selected'))

                    Array.from(formRows).forEach(div => div.remove())

                    if (typeof res === `object`) {
                        return Swal.fire({
                            title: `Produto ${res[0].name} cadastrado`,
                            icon: 'success',
                            showCloseButton: true,
                        })
                    }

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
    const insertProduct = form => {
        form.addEventListener('submit', e => {
            e.preventDefault()

            const nameProduct = document.querySelector('.nameProduct')
            const codeProduct = document.querySelector('.codeProduct')
            const descriptionProduct = document.querySelector('.descriptionProduct')
            const imageProduct = document.querySelector('.imageProduct')

            //validar formulário
            if (form.checkValidity()) {
                const inputs = [...form.elements]

                const object = { children: [] }

                inputs.map(input => {
                    if (input.tagName != `BUTTON`) {
                        const inputId = input.getAttribute('id')
                        //Get product name
                        if (input.classList.contains('nameProduct')) object.name = input.value

                        //Get code of product
                        if (input.classList.contains('codeProduct')) object.code = input.value

                        //get description
                        if (input.classList.contains('descriptionProduct')) object.description = input.value

                        //get image
                        if (input.classList.contains('imageProduct')) object.image = input.value

                        //get children's of product
                        if (inputId) {
                            if (inputId.indexOf('descriptionChildren') !== -1) {
                                object.children.push({
                                    //get description of children
                                    description: input.value,

                                    //get name of children
                                    name: input.closest('div').querySelector('input[id*="nameChildren"]').value,

                                    //get code of children
                                    code: input.closest('div').querySelector('input[id*="codeChildren"]').value,

                                    //get image of children
                                    image: input.closest('.form-row').querySelector('input[id*="imageChildren"]').value,
                                })
                            }
                        }
                    }
                })

                const excludes = custom.getExcludes()

                const { name, description, code, image, children } = object

                return requestProduct({
                    name,
                    code: parseFloat(code),
                    description,
                    image,
                    options: excludes,
                    excludes,
                    children,
                })
            }
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

    function customInsert(input) {
        input.addEventListener('change', function(e) {
            e.preventDefault()

            if (input.checked !== true) return custom.removeCustom(input.value)

            custom.selectCustom(input.value)
        })
    }

    return {
        // declare public variables and/or functions
        customInsert,
        create: insertProduct,
        destroy: clickDestroyProduct,
    }
})()

const allCheckCustom = [...document.querySelectorAll('#selectAllCustom')]

if (allCheckCustom) allCheckCustom.map(product.customInsert)

//modal
$('#modalProductOptions').on('hidden.bs.modal', function(e) {
    // do something...
    $('#productCustons').modal('show')
})

const destroyProductOption = id => {
    update(1, `dark`)
    fetch(`/api/product_option/${id}`, {
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

    fetch(`/api/option?custom=${custom}`, {
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

//formInsertProduct

const formInsertProduct = document.querySelector('.formInsertProduct')
const productOption = document.querySelectorAll('.productOption .card')

Array.from(productOption).forEach(option => {
    clickCustom(option)
})

if (formInsertProduct) product.create(formInsertProduct)

const typeResource = `type`

let type = (() => {
   //private vars or function
   const request = options => {
      return new Promise((resolve, reject) => {
         const { url, headers, method, body } = options

         const opt = { method }

         if (headers) opt.headers = headers
         if (body) opt.body = JSON.stringify(body)

         fetch(url, opt)
            .then(r => r.json())
            .then(res => resolve(res))
            .catch(error => reject(error))
      })
   }

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
      const inputAction = document.querySelector('.actionConfirm')
      const btnAceptAction = document.querySelector('.aceptAction')

      inputAction.value = `TypeDestroy`

      btnAceptAction.dataset.id = parseInt(input.getAttribute('data-delete').replace('#type-', ''))

      $('.modal.types').on('hidden.bs.modal', function(e) {
         // do something...
         $('.modalActionConfirm').modal('show')
         $(this).off('hidden.bs.modal')
      })

      $('.modal.types').modal('hide')

      btnAceptAction.addEventListener('click', e => {
         if (inputAction.value == `TypeDestroy`) {
            const id = btnAceptAction.dataset.id

            $('.modalActionConfirm').on('hidden.bs.modal', function(e) {
               // do something...
               $('.modal.types').modal('show')
               $(this).off('hidden.bs.modal')
            })

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
                           return input.closest('.card').remove()
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

   const removeAllType = input => {
      input.addEventListener('change', async e => {
         try {
            if (input.checked == true) {
               const id = input.value

               await request({
                  url: `/api/types/exclude/${id}`,
                  method: 'POST',
                  headers: {
                     'content-type': 'application/json',
                  },
               })

               input.closest('.card.border-primary').classList.add('exclude')
            }
         } catch (error) {}
      })
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
    const {
        id,
        name,
        description,
        type_id
    } = object

    update(1, `dark`)
    fetch(`/api/${custonResource}/${id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                type_id
            }),
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
