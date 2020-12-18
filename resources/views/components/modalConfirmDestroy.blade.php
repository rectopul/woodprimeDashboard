<div class="modal modalActionConfirm fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title actionConfirmTitle">Confirmar Ação</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body actionConfirmText">
          <p>Você realmente deseja confirmar esta ação</p>
        </div>
        <div class="modal-footer">
            <input type="hidden" class="actionConfirm" name="action-confirm">
            <button type="button" class="btn btn-danger rejectAction" data-dismiss="modal">Não</button>
            <button type="button" class="btn btn-primary aceptAction" data-dismiss="modal">Sim</button>
        </div>
      </div>
    </div>
  </div>