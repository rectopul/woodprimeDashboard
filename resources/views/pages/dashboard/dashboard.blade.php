@extends('layouts.app')
<!--Title-->
@section('title', 'Administração')
<!--Content-->
@section('content')
<!-- Just an image -->
@include('components.modalType', ['types' => $types])
@include('components.modalunrelated', ['types' => $types])
@include('components.navbar', ['user', $user])
@include('components.productCustons', ['types' => $customTypes])
@include('components.productOptions')


<div class="row justify-content-center mt-5">
    @include('components.sidebar', ['count' => $count, 'customizationsCount' => $customizationsCount])

    <div class="col-9 pl-3">
        <div class="tab-content" id="v-pills-tabContent">
            <div class="tab-pane fade show active" id="v-pills-customization" role="tabpanel" aria-labelledby="v-pills-customization-tab">
                @yield('custom', View::make('components.customform'))
            </div> <!-- Personalização.// -->

            <div class="tab-pane fade" id="v-pills-product" role="tabpanel" aria-labelledby="v-pills-product-tab">
                @include('components.products')
            </div> <!-- Produto.// -->
            
            <div class="tab-pane fade" id="v-pills-searchCustomization" role="tabpanel" aria-labelledby="v-pills-searchCustomization-tab">
                @include('components.findCustom', ['customTypes', $customTypes])
            </div> <!-- Buscar personalização.// -->

            <div class="tab-pane fade" id="v-pills-searchProduct" role="tabpanel" aria-labelledby="v-pills-searchProduct-tab">
                @include('components.searchProduct')
            </div> <!-- Buscar produto.// -->

            <div class="tab-pane fade" id="v-pills-users" role="tabpanel" aria-labelledby="v-pills-users-tab">
                @include('components.users', ['users', $users])
            </div> <!-- Buscar Usuários.// -->
            
            <div class="tab-pane fade" id="v-pills-unrelated" role="tabpanel" aria-labelledby="v-pills-unrelated">
                @include('components.unrelated', ['unrelated', $unrelated])
            </div> <!-- Buscar Usuários.// -->
        </div>
    </div> <!-- col.// -->
</div> <!-- row // -->
@endsection