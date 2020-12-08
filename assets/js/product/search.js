const vtexAccountName = `woodprime`
const vtexEnvironment = `vtexcommercestable`

const searching = (() => {
    //private var/functions
    const putOnResults = products => {
        const containerPartial = document.querySelector('.productsFound')

        containerPartial.classList.add('show')

        containerPartial.innerHTML = ``

        products.map(prod => {
            const produto = product(prod)

            containerPartial.append(produto)
        })
    }

    const custromDestroy = option => {
        option.addEventListener('click', async e => {
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

    const productDesctroy = button => {
        button.addEventListener('click', async e => {
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

    const listCustom = customList => {
        const custons = customList.map(custom => {
            const { name, image, customization, id } = custom.option

            const list = document.createElement('div')

            list.classList.add('productInSearch', 'col-6', 'col-md-3', 'my-3')

            list.dataset.id = id

            list.innerHTML = `
         <div class="card">
            <img class="card-img-top" src="${image}" alt="Card image cap">
            <div class="card-body">
               <h5 class="card-title">${name}</h5>
               <small>${customization ? customization.name : ``}</small>
            </div>
         </div>
         `

            custromDestroy(list)

            return list
        })

        return custons
    }

    const productStrong = infos => {
        console.log(`infos`, infos)
        const { name, id, image, code, custom, options } = infos

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

        const custons = [...listCustom(options)]

        // custons.map(custom => {
        //     product.querySelector('.productCustoms > .row').append(custom)
        // })

        edit.structure(product.querySelector('.productCustoms'), id)

        return product
    }

    const product = infos => {
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

    const delay_method = (label, callback, time) => {
        if (typeof window.delayed_methods == 'undefined') {
            window.delayed_methods = {}
        }
        delayed_methods[label] = Date.now()
        var t = delayed_methods[label]

        setTimeout(function() {
            if (delayed_methods[label] != t) {
                return
            } else {
                delayed_methods[label] = ''
                callback()
            }
        }, time || 500)
    }

    const search = input => {
        input.addEventListener('keyup', e => {
            const containerPartial = document.querySelector('.productsFound')

            const containerInput = input.closest('div')

            const spinnerExist = containerInput.querySelector('.spinner-border')

            if (!spinnerExist) {
                const spinner = document.createElement('div')

                spinner.classList.add('spinner-border', 'text-success')

                spinner.setAttribute('role', 'status')

                spinner.innerHTML = `<span class="sr-only">Loading...</span>`

                input.closest('div').append(spinner)
            }

            if (!input.value.length) {
                return containerPartial.classList.remove('show')
            }

            if (input.value && input.value.length > 0) {
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

                        containerInput.querySelector('.spinner-border').remove()

                        if (products.length) return putOnResults(products)
                    } catch (error) {
                        console.log(error)
                    }
                })
            }
        })
    }

    const select = button => {
        const productContainer = document.querySelector('.listProduct')
        button.addEventListener('click', async e => {
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
    custom.handleResetForm()
    let inputSkuProduct = document.querySelector('.skuProduct')
    const olderText = btnSearchProduct.innerHTML
    btnSearchProduct.innerHTML = ``
    btnSearchProduct.append(spinner(`ligth`, 'small'))
    getVtexProduct(inputSkuProduct)
        .then(res => {
            console.log(res)
            const { name, id: code, image, skus } = res

            //subitens
            if (skus && skus.length > 1) {
                const subProducts = document.querySelector('.subProducts')
                if (subProducts) subProducts.innerHTML = ``
                skus.map(sku => {
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
        .catch(res => {
            return Swal.fire({
                title: res,
                icon: 'error',
                showCloseButton: true,
            })
        })
})
