<!--Modal Tipos de customização --> 
<div class="modal fade productCustons" tabindex="-1" role="dialog" id="productCustons" role="dialog" aria-labelledby="productCustons" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Selecione as customizações que deseja inserir neste produto</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body d-flex flex-wrap productCustonsBody">
            <div class="row">
                <div class="col-12 ProductcustonsContainer">
                    @foreach ($customTypes as $key => $customType)
                        @foreach ($customType->customization as $customization)
                            <div class="col-4 product-option-{{ $customization->id }}" data-custom="type-{{ $customType->id }}" data-id="{{ $customization->id }}">
                                <div class="card border-primary mb-3 productCustom item" data-option-id="{{ $customization->id }}">
                                        <div class="card-header productOptionName">
                                            {{ $customization->name }}
                                        </div>

                                        <div class="card-body text-primary productOptionDesc">
                                            <p class="card-text">{{ $customization->description }}</p>
                                        </div>
                                    </div>
                                </div>
                        @endforeach
                @endforeach
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary insertOption" data-dismiss="modal">
                <i class="fas fa-plus"></i> Novo
            </button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
</div>