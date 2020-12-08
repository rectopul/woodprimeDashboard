const edit = (() => {
    //private var/functions

    const dataOptions = {
        options: [],
        custons: null,
        childs: null,
        exclude: [],
        types: null,
    }

    function requestUpdate(id, data) {
        return new Promise((resolve, reject) => {
            const options = {
                url: `/api/product/${id}`,
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
            }

            fetch(options.url, {
                method: options.method,
                headers: options.headers,
                body: JSON.stringify(data),
            })
                .then(res => res.json())
                .then(resolve)
                .catch(reject)
        })
    }

    async function handleUpdateProduct(button) {
        try {
            const id = button.dataset.id

            if (!id) return

            const data = dataOptions

            data.id = id

            const update = await requestUpdate(id, data)

            Swal.fire({
                title: 'Produto Atualizado',
                icon: 'success',
                showCloseButton: true,
            })
        } catch (error) {
            Swal.fire({
                title: error,
                icon: 'warning',
                showCloseButton: true,
            })
        }
    }

    function updateOption(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault()

            handleUpdateProduct(button)
        })
    }

    function checkHasOption(id, custom) {
        const filterOptions = dataOptions.options.filter(x => {
            if (x.id === id && x.custom === custom) return true
        })

        if (filterOptions.length) return false

        return true
    }

    function handleInsertOption(id, custom) {
        if (!custom || !id) return

        if (checkHasOption(id, custom)) {
            const exclude = dataOptions.exclude.filter(x => x.id != id)

            dataOptions.exclude = exclude

            return dataOptions.options.push({ id, custom })
        }
    }

    function handleRemoveOption(id, custom) {
        const exclude = dataOptions.options.filter(x => x.id != id)

        dataOptions.options = exclude

        dataOptions.exclude.push({ id, custom })
    }

    function insertOptions(modal) {
        $(modal).on('hide.bs.modal', function(e) {
            const itens = [...$(modal)[0].querySelectorAll('.optionItem')]

            if (itens) {
                itens.forEach(option => {
                    if (!option.classList.contains('remove')) {
                        const id = option.dataset.id
                        const custom = option.dataset.custom

                        return handleInsertOption(id, custom)
                    }
                })
            }

            $(this).off('hide.bs.modal')
        })
    }

    function indexOptions(custom) {
        const options = {
            url: `/api/option?custom=${custom}`,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
        }

        const { url, method, headers } = options

        return new Promise((resolve, reject) => {
            fetch(url, {
                method,
                headers,
            })
                .then(res => res.json())
                .then(resolve)
                .catch(reject)
        })
    }

    function toggleOption(e) {
        e.preventDefault()

        let target = e.target

        if (!target.classList.contains('optionItem')) target = target.closest('.optionItem')

        const id = target.dataset.id
        const custom = target.dataset.custom

        if (!target.classList.contains('remove')) {
            const optionsFilter = dataOptions.options.filter(x => {
                if (x.id != id && x.custom != custom) return true

                return false
            })

            dataOptions.options = optionsFilter

            dataOptions.exclude.push({ id, custom })
        }

        target.classList.toggle('remove')
    }

    async function listOptions(custom, options) {
        const modal = document.querySelector('.modalOptionsList')

        insertOptions(modal)

        const container = modal.querySelector('.optionsListBySearch')

        container.innerHTML = ``

        const theCustom = await indexOptions(custom)

        theCustom.options.forEach(option => {
            const theOption = document.createElement('div')

            theOption.classList.add('col-md-3', 'optionItem')

            theOption.dataset.id = option.id
            theOption.dataset.custom = option.customization_id

            if (!hasOption(option.id, options)) theOption.classList.add('remove')

            theOption.innerHTML = `<div class="card">
                <div class="card-header">${option.name}</div>
                <div class="card-body" style="height: 180px;">
                    <figure>
                        <img src="${option.image}" style='height: 100%; width: 100%; object-fit: contain'>
                    </figure>
                </div>
            </div>`

            theOption.addEventListener('click', toggleOption)

            container.append(theOption)
        })

        $(modal).modal('show')
    }

    function getProduct(id) {
        const options = {
            url: `/api/product/${id}`,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
        }

        const { url, method, headers } = options

        return new Promise((resolve, reject) => {
            fetch(url, {
                method,
                headers,
            })
                .then(res => res.json())
                .then(resolve)
                .catch(reject)
        })
    }

    function indexCustom(id) {
        return new Promise((resolve, reject) => {
            fetch(`/api/custon${id ? '/' + id : ''}`, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                },
            })
                .then(res => res.json())
                .then(resolve)
                .catch(reject)
        })
    }

    function hasOption(option, list) {
        const check = list.filter(x => x.option.id == option)

        if (dataOptions.options.length || dataOptions.exclude.length) {
            const checkInternal = dataOptions.options.filter(x => parseInt(x.id) == option)

            const exclude = dataOptions.exclude.filter(x => parseInt(x.id) == option)

            if (exclude.length) return false

            if (checkInternal.length) return true
        }

        if (check.length) {
            return true
        }

        return false
    }

    function checkOptions(list, custom) {
        const check = list.filter(x => x.option.customization_id == custom)

        if (check.length) return true

        return false
    }

    async function handleChangeCustom(id, remove) {
        const custom = await indexCustom(id)

        const { options } = custom

        options.forEach(option => {
            if (remove) return handleRemoveOption(option.id, option.customization_id)
            else return handleInsertOption(option.id, option.customization_id)
        })

        console.log(dataOptions)
    }

    function checkCustom(element) {
        element.addEventListener('change', function(e) {
            const id = element.dataset.id

            if (element.checked == false) {
                handleChangeCustom(id, true)
            } else {
                handleChangeCustom(id)
            }
        })
    }

    function handleCustons(custons, product) {
        const structure = document.createElement('div')

        structure.classList.add('listCustonsBySearch__list', 'row', 'my-5')

        structure.innerHTML = `<div class="col-12"> <h1>Editar customizações</h1></div>`

        custons.forEach(custom => {
            const element = document.createElement('div')

            element.classList.add('col-md-3', 'my-3', 'listCustonsBySearch__item')

            element.innerHTML = `
            <div class="card">
                <div class="card-header">${custom.name}</div>
                <div class="card-body text-center">
                    <input type="checkbox" class="includeThisCustom mx-auto"
                        ${checkOptions(product.options, custom.id) ? 'checked' : ''} 
                        data-id="${custom.id}">

                </div>
                <div class="card-footer">
                    <small>Clique no checkbox para marcar todos</small>
                </div>
            </div>
            `

            const input = element.querySelector('input')

            checkCustom(input)

            element.querySelector('.card-header').addEventListener('click', function(e) {
                return listOptions(custom.id, product.options)
            })

            structure.append(element)
        })

        return structure
    }

    async function structure(target, productID) {
        const custons = await indexCustom()

        const product = await getProduct(productID)

        const structure = handleCustons(custons, product)

        const button = document.createElement('div')

        button.classList.add('col-12', 'the_button_update', 'my-5', 'px-0')

        button.innerHTML = `<button type="button" class="btn btn-primary" data-id="${productID}">Salvar</button>`

        const btnUpdate = button.querySelector('button')

        updateOption(btnUpdate)

        target.append(structure)

        target.append(button)

        //reset
        dataOptions.options = []
        dataOptions.exclude = []
    }

    return {
        //public var/functions
        structure,
    }
})()
