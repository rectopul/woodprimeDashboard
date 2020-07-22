<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">
        <img src="{{ asset('img/logo.webp') }}" width="170" class="d-inline-block align-top" alt="" loading="lazy">
    </a>

    <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
                <a class="nav-link" href="/dashboard">Painel <span class="sr-only">(current)</span></a>
            </li>
            @auth
            <li class="nav-item dropdown">
                <a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">Conta <b class="caret"></b></a>
                <div class="dropdown-menu dropdown-menu-lg-right" style="width: 320px;max-width: 600px">
                    <div class="card card-profile border-0" style="max-width: 100%;">
                        <div class="card-header bg-transparent">
                            <div class="row">
                                <div class="col-4 px-2">
                                    <img src="http://placehold.it/98x98" alt="Alternate Text" class="img-responsive">
                                    <p class="text-center small"></p>
                                </div>
                                <div class="col-8">
                                    <span>{{ $user->name }}</span>
                                    <p class="text-wrap small">{{ $user->email }}</p>
                                    <div class="divider">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="navbar-footer-content">
                                <div class="row">
                                    <div class="col-md-7">
                                        <a href="#" data-toggle="modal" data-target="#changePasswordModal"
                                            class="btn btn-primary btn-sm">Mudar a senha</a>
                                    </div>
                                    <div class="col-md-5 text-right">
                                        <a href="/logout" class="btn btn-danger btn-sm pull-right">Logout</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            @endauth
        </ul>
    </div>
</nav> <!-- navbar // -->
