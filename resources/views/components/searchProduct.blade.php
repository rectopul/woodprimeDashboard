<form>
    <div class="form-row align-items-center">
      <div class="col-10">
        <label class="sr-only" for="skuProduct">SKU do produto</label>
        <div class="input-group mb-2">
          <div class="input-group-prepend">
            <div class="input-group-text"><i class="fas fa-shopping-cart"></i></div>
          </div>
          <input type="text" class="form-control productParamSearch" id="skuProduct" name="skuProduct" placeholder="ID do produto">
        </div>
      </div>
      <div class="col-auto">
        <button type="submit" class="btn btn-primary mb-2 searchProductInternal">Buscar</button>
      </div>
    </div>
</form> <!-- Form Product // -->

<div class="listProduct row">
  <!-- $products -->
    @foreach ($products as $product)
      @if ($product)
        <div class="col-md-6 productItem my-2">
          <div class="card border-primary mb-3 cardProduct item" data-id="{{ $product->id }}">
            <div class="card-header text-center searchProductName">
                {{ $product->name }}
                <button type="button" class="btn btn-danger btn-sm productDestroy" data-id="{{ $product->id }}">
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
                  <tbody>
                    @if ($product->options)

                      @foreach ($product->options as $option)
                        @if ($option)
                        <tr class="text-left optionProduct">
                          <th scope="row" class="px-1 productOptionName">
                            @if ($option->option->name)
                            {{ $option->option->name }} 
                            @endif
                          </th>
                          
                          
                          <td>{{ $option->option->price }}</td>
                          <td class="text-right px-1 productRemoveOption">
                            <a href="#" data-id="{{ $option->id }}">
                              <i class="fas fa-trash-alt"></i>
                            </a>
                          </td>
                        </tr>
                        @endif
                      @endforeach
                        
                    @endif
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      @endif
    @endforeach

</div>
