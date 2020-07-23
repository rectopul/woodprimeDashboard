<form>
  <div class="form-row align-items-center">
    <div class="col-10">
      <label class="sr-only" for="skuProduct">SKU do produto</label>
      <div class="input-group mb-2">
        <div class="input-group-prepend">
          <div class="input-group-text"><i class="fas fa-shopping-cart"></i></div>
        </div>
        <input type="text" class="form-control skuProduct" id="skuProduct" name="skuProduct"
          placeholder="SKU do produto">
      </div>
    </div>
    <div class="col-auto">
      <button type="submit" class="btn btn-primary mb-2 btnGetProductVtex">Buscar</button>
    </div>
  </div>
</form> <!-- Form Product // -->

<div class="resultProduct row">
  <div class="col-12">
    <div class="row">
      <div class="col-12">
        <div class="row pt-5">
          <div class="col-auto">
            <img src="https://via.placeholder.com/200" alt="..." width="210" class="img-thumbnail productImageInsert">
          </div> <!-- Form Image // -->
          <div class="col-8">
            <h5 class="productNameInsert">Titulo do produto</h5>
            <p class="productCodeInsert"><small><b>Código do produto</b></small></p>
          </div> <!-- Form Info // -->
        </div><!-- PRODUTO BUSCADO -->

        <div class="row subProducts">

        </div>

        <div class="row">
          <div class="col-12 mt-5">
            <form class="formInsertProduct needs-validation" novalidate>
              <input type="hidden" class="nameProduct" name="" value="Teste" required>
              <input type="hidden" class="codeProduct" name="" value="Teste" required>

              <div class="informationProduct">
                <div class="form-group">
                  <label for="exampleFormControlTextarea1">Descrição</label>
                  <textarea class="form-control descriptionProduct" rows="3" placeholder="Informe uma descrição"
                    required></textarea>
                </div>

                <div class="form-group">
                  <label for="exampleFormControlInput1">Imagem</label>
                  <input type="text" class="form-control imageProduct" placeholder="http://www.image.com" required>
                </div>
              </div>

              <!--CUSTOMIZAÇÕES -->

              <hr class="my-5">

              <div class="col-12 px-0">
                <div class="row mb-3">
                  <div class="col-12">
                    <h4>Selecione as excessões</h4>
                  </div>
                </div>


                <div class="row py-2 mb-4 listOptionstoSelect">
                  <!-- OPTIONS SELECTED -->
                  @foreach ($customTypes as $type)
                  <!--custom // -->
                  @foreach ($type->customization as $custom)
                  <div class="col-md-3 mb-3">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title">{{$custom->name}}</h5>
                        <p class="card-text">{{$custom->description}}</p>
                        <a href="#" class="btn btn-primary" data-id="{{$custom->id}}">Selecionar Opções</a>
                      </div>
                    </div>
                  </div>
                  @endforeach
                  <!-- CUSTOM // -->
                  @endforeach
                </div>
              </div>

              <button class="btn btn-primary insertProduct">Atualizar Produto</button>
            </form>
          </div><!-- FORMU;ÁRIO DE CADASTRO -->
        </div>
      </div>
    </div>
  </div>
  {{-- <div class="col-4 productSearchImage"><img src="" alt="..." class="img-thumbnail"></div>
    <div class="col-8"><h5 class="productSearchTitle"></h5></div>
    <div class="col-12 productSearchDescription">
    </div> --}}
</div>