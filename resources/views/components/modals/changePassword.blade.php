<!-- Modal -->
<div class="modal fade changePasswordModal" id="changePasswordModal" tabindex="-1" role="dialog"
    aria-labelledby="changePasswordModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Alterar Senha</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form class="formChangePassword needs-validation" data-id="{{ $user->id }}" novalidate>
                    <div class="form-group">
                        <label for="newPassword">Password</label>
                        <input type="password" class="form-control newPassword" id="newPassword" required>
                        <div class="invalid-feedback">
                            Please provide a new password.
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
