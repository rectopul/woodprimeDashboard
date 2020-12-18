<!--Modal Tipos de customização --> 
<div class="modal fade newUser" tabindex="-1" role="dialog" id="newUser" role="dialog" aria-labelledby="newUser" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Preencha os campos abaixo para cadastrar um novo usuário</h5>
          <button type="button" class="close" data-dismiss="modal"aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body d-flex flex-wrap newUserBody">
            <div class="col-12">
                <!-- FORM -->
                <form class="newUserForm">
                    <div class="form-group">
                      <label for="newUserName">Nome</label>
                      <input type="text" class="form-control newUserName" id="newUserName">
                    </div>
                    <div class="form-group">
                      <label for="newUserMail">E-mail</label>
                      <input type="email" class="form-control newUserMail" id="newUserMail" aria-describedby="emailHelp">
                      <small id="emailHelp" class="form-text text-muted">Nunca compartilharemos seu email com mais ninguém.</small>
                    </div>
                    <div class="form-group">
                      <label for="newUserPassword">Password</label>
                      <input type="password" class="form-control newUserPassword" id="newUserPassword">
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btnInsertNewUser">Cadastrar</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
        </div>
      </div>
    </div>
</div>