<form class="formCreateCustom">
  <input type="hidden" name="typeCustom" class="typeCustom" id="typeCustom" value="">
  <!--Type Customization .// -->
  <div class="form-row">
    <div class="form-group col-md-12">
      <input type="text" class="form-control nameCustom" placeholder="Nome da Personalização" name="name" id="name">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-md-12">
      <label for="description">Descrição da personalização</label>
      <textarea name="description" id="" cols="30" rows="5" class="form-control descCustom" placeholder="Descrição da Personalização" name="description" id="description"></textarea>
    </div>
  </div>

  <div class="form-row">
    <div class="form-group col-md-12">
      <label for="order">Ordem ca customização</label>
      <input type="number" class="form-control orderCustom" placeholder="Informe a ordem em que a customização aparecerá" name="order" id="order">
    </div>
  </div>

  <div class="form-row">
    <div class="form-group col-md-6">
      <button type="button" class="btn btn-primary btn-modal-types" data-toggle="modal" data-target="#types">Items</button>
    </div>

    <div class="form-group col-6 text-right loaderInsertCustom">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
  <hr>
  <button type="submit" class="btn btn-primary btn-insert-custom">Criar Personalização</button>
</form>