@extends('layouts.app')
<!--Title-->
@section('title', 'Login')
<!--Content-->
@section('content')
<div class="row justify-content-center mt-5">
    <aside class="col-sm-4">
        <div class="card">
            <div class="card-header text-center">
                <img src="http://localhost/img/logo.webp" width="170" class="d-inline-block align-top" alt="" loading="lazy">
            </div>
            <article class="card-body">
                <h4 class="card-title text-center mb-4 mt-1">{{ __('Login') }}</h4>
                <hr>
                <p class="text-success text-center">Informações de login</p>
                <form class="formLogin" method="POST" action="{{ route('login') }}">
                    {{ csrf_field() }}
                    @csrf
                    <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="fas fa-envelope"></i> </span>
                            </div>
                            <input id="email" name="email" type="email" class="form-control @error('email') is-invalid @enderror" placeholder="E-mail" value="{{ old('email') }}" required autocomplete="email" autofocus>
                        </div> <!-- input-group.// -->

                        @error('email')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div> <!-- form-group// -->

                    <div class="form-group">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
                            </div>
                            <input id="password" name="password" class="form-control @error('password') is-invalid @enderror" placeholder="******" type="password"  required autocomplete="current-password">
                        </div> <!-- input-group.// -->

                        @error('password')
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $message }}</strong>
                            </span>
                        @enderror
                    </div> <!-- form-group// -->

                    <div class="form-group row">
                        <div class="col-md-12">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                <label class="form-check-label" for="remember">
                                    Lembrar-me
                                </label>
                            </div>
                        </div>
                    </div> <!-- form-group// -->

                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-block btn-login"> {{ __('Login') }}  </button>
                    </div> <!-- form-group// -->
                    @if (Route::has('password.request'))
                        <p class="text-center">
                            <a href="{{ route('password.request') }}" class="btn">
                                Recuperar senha
                            </a>
                        </p>
                    @endif
                </form>
            </article>
        </div> <!-- card.// -->

    </aside> <!-- col.// -->
</div> <!-- row // -->
@endsection