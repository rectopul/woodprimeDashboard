<!--Modal Tipos de customização --> 
<div class="modal fade productCustons" tabindex="-1" role="dialog" id="productCustons" role="dialog" aria-labelledby="productCustons" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Selecione as customizações que deseja excluir do produto</h5>
          <button type="button" class="close" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body d-flex flex-wrap productCustonsBody">
            @foreach ($customTypes as $key => $customType)
                <div class="col-4 productType" 
                  data-id="{{ $customType->id }}">

                  <div class="card border-primary mb-3">

                    <div class="card-header d-flex justify-content-between align-items-center">
                      Selecionar Todos
                      <input type="checkbox" class="ml-auto selectAllType" id="selectAllType" value="{{ $customType->id }}">
                    </div>

                    <div class="card-body text-primary text-center typeCustomItem" data-id="{{ $customType->id }}" data-dismiss="modal">
                      <h3>{{ $customType->name }}</h3>
                    </div>
                  </div>
                </div>
            @endforeach
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
</div>