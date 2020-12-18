<!--Modal Tipos de customização -->
<div class="modal fade formOptions" tabindex="-1" role="dialog" id="formOptions" role="dialog" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Criar nova opção de customização</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body d-flex flex-wrap optionsContainer">
        <form class="col-12">
          <div class="form-group">
            <div class="input-group mb-2 mr-sm-2">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i class="fas fa-tag"></i>
                </div>
              </div>
              <input type="text" class="form-control optionName" id="optionName" placeholder="Nome da opção">
            </div>
          </div>
          <div class="form-group">
            <div class="input-group mb-2 mr-sm-2">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <i class="fas fa-image"></i>
                </div>
              </div>
              <input type="text" class="form-control optionImage" id="optionImage" placeholder="URL da imagem">
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary saveOption"><i class="fas fa-save"></i> Salvar</button>
        <button type="button" class="btn btn-secondary cancelSaveOption" data-dismiss="modal">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</div>