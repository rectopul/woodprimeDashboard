<div class="col-12">
    <div class="row">
        <div class="col-12">
            <div class="card card-plain">
                <div class="card-header card-header-icon card-header-rose">
                    <div class="card-icon"><i class="fas fa-users"></i></div>
                    <h4 class="card-title mt-0">Lista de usuários</h4>
                    <p class="card-category">Esta é a lista de todos os usuários cadastrados no sistema</p>
                </div>

                <div class="card-body">
                    <div class="row">
                        <div class="col-12 mb-3">
                            <button type="button" data-toggle="modal" data-target="#newUser"class="btn btn-primary">Novo usuário</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <caption>Lista de usuários</caption>
                            <thead>
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nome</th>
                                <th scope="col">E-mail</th>
                                <th class="text-right"scope="col">Ação</th>
                              </tr>
                            </thead>
                            <tbody class="listUserInSistem">
                                @foreach ($users as $user)
                                    <tr>
                                        <th scope="row">{{ $user->id }}</th>
                                        <td>{{ $user->name }}</td>
                                        <td>{{ $user->email }}</td>
                                        <td class="td-actions text-right">
                                            <button type="button" class="btn btn-danger btnRemoveUser" data-id="{{ $user->id }}">
                                                <i class="far fa-trash-alt" aria-hidden="true"></i> Excluir
                                            </button>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- BODY -->
            </div>
            
        </div>
    </div>
    <!-- CORPO -->
</div>