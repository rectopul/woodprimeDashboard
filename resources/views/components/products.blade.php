<form>
    <div class="form-row align-items-center">
      <div class="col-10">
        <label class="sr-only" for="skuProduct">SKU do produto</label>
        <div class="input-group mb-2">
          <div class="input-group-prepend">
            <div class="input-group-text"><i class="fas fa-shopping-cart"></i></div>
          </div>
          <input type="text" class="form-control skuProduct" id="skuProduct" name="skuProduct" placeholder="SKU do produto">
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

        <div class="row">
          <div class="col-12 mt-5">
            <form>
              <input type="hidden" class="nameProduct" name="" value="Teste">
              <input type="hidden" class="codeProduct" name="" value="Teste">
              <div class="form-group">
                <label for="exampleFormControlTextarea1">Descrição</label>
                <textarea class="form-control descriptionProduct" rows="3" placeholder="Informe uma descrição"></textarea>
              </div>

              <div class="form-group">
                <label for="exampleFormControlInput1">Imagem</label>
                <input type="text" class="form-control imageProduct" placeholder="http://www.image.com">
              </div>
              <!--CUSTOMIZAÇÕES -->
              
              <div class="col-12">
                <div class="row">
                  <h4>Customizações selecionadas</h4>
                </div>

                <div class="row mb-2">
                  <button class="btn btn-primary optionsSelect">
                    Selecionar opções do produto
                  </button>
                </div>

                <div class="row rounded py-2 mb-4 border optionsSelected">
                  <!-- OPTIONS SELECTED -->
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
