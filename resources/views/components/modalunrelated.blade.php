<!--Modal Tipos de customização --> 
<div class="modal fade modalUnrelated" tabindex="-1" role="dialog" id="modalUnrelated" role="dialog" aria-labelledby="modalUnrelated" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Opções de customização</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="modal-body d-flex flex-wrap modalUnrelatedContainer">
            <div class="col-12">
                <form class="editCustomForm">
                    <input type="hidden" name="custom_id" class="unrelatedCustomId" value="">
                    <div class="form-group">
                      <label for="ulName">Name</label>
                      <input type="text" class="form-control" id="ulName" aria-describedby="ulName" placeholder="nome da customização">
                    </div>
                    <div class="form-group">
                      <label for="ulDescription">Descrição</label>
                      <textarea class="form-control" id="ulDescription" rows="3" placeholder="Descrição"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="ulTypeId">Tipo de customização</label>
                        <select class="form-control" id="ulTypeId">
                            @foreach ($types as $type)
                                <option value="{{ $type->id }}">{{ $type->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>

            </div>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
</div>