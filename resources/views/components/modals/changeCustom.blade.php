<!-- Modal -->
<div class="modal fade changeCustomModal" id="changeCustomModal" tabindex="-1" role="dialog" aria-labelledby="changeCustomModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">

            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Alterar Customização</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="modal-body">
                <form class="formChangeCustomizations needs-validation" data-id="{{ $user->id }}" novalidate>

                    <!-- Nome // -->
                    <div class="form-group">
                        <label for="customName">Nome da customização</label>
                        <input type="text" class="form-control" name="name" id="customName" aria-describedby="nameHelp">
                        <small id="emailHelp" class="form-text text-muted">
                            Caso deixe em branco o campo não será modificado.
                        </small>
                    </div>


                    <!-- Descrição // -->
                    <div class="form-group">
                        <label for="customDesc">Descrição</label>
                        <textarea class="form-control" name="description" id="customDesc" rows="3"></textarea>

                        <small id="emailHelp" class="form-text text-muted">
                            Caso deixe em branco o campo não será modificado.
                        </small>
                    </div>

                    <!-- Ordem // -->
                    <div class="form-group">
                        <label for="customOrder">Ordem</label>
                        <input type="number" class="form-control" name="order" id="customOrder" aria-describedby="orderHelp">
                        <small id="emailHelp" class="form-text text-muted">
                            Caso deixe em branco o campo não será modificado.
                        </small>
                    </div>

                    <button type="submit" class="btn btn-primary">Atualizar</button>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>