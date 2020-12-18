<!--Modal Tipos de customização --> 
<div class="modal fade types" tabindex="-1" role="dialog" id="types" role="dialog" aria-labelledby="types" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Tipos de personalização</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body d-flex flex-wrap typesContainer">
          @foreach ($types as $type)
            <div class="card mb-3 card-type" id="type-{{ $type->id }}" style="flex: 0 0 calc(33.333333% - 10px); margin: 0 5px;">
              <div class="card-body text-center">
                <h6 class="card-title mb-0">{{ $type->name }}</h6>
              </div>
              <div class="types-hover">
                <button type="button" class="btn btn-danger del-type" data-delete="#type-{{ $type->id }}">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button type="button" class="btn btn-success select-type" data-dismiss="modal" type-id="{{ $type->id }}" data-select="#type-{{ $type->id }}">
                  <i class="fas fa-check"></i>
                </button>
              </div>
            </div>
          @endforeach
        </div>
        <div class="modal-footer">
          <input type="text" class="typeName" placeholder="Tipo de personalização" name="typeName" id="typeName">
          <button type="button" class="btn btn-primary insertType">Novo</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
</div>