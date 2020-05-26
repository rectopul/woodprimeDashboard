<div class="col-3 rounded border py-2">
    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link border-bottom active" id="v-pills-customization-tab" data-toggle="pill" href="#v-pills-customization" role="tab" aria-controls="v-pills-customization" aria-selected="true">
            Personalização
            <span class="badge badge-pill badge-primary">{{ $count }}</span>
        </a>

        <a class="nav-link border-bottom" id="v-pills-product-tab" data-toggle="pill" href="#v-pills-product" role="tab" aria-controls="v-pills-product" aria-selected="false">Cadastro de produto</a>

        <a class="nav-link border-bottom" id="v-pills-searchCustomization-tab" data-toggle="pill" href="#v-pills-searchCustomization" role="tab" aria-controls="v-pills-searchCustomization" aria-selected="false">
            Buscar Personalização
            <span class="badge badge-pill badge-primary pillcustoms">{{ $customizationsCount }}</span>
        </a>

        <a class="nav-link border-bottom" id="v-pills-searchProduct-tab" data-toggle="pill" href="#v-pills-searchProduct" role="tab" aria-controls="v-pills-searchProduct" aria-selected="false">Buscar Produto</a>

        <a class="nav-link" id="v-pills-users-tab" data-toggle="pill" href="#v-pills-users" role="tab" aria-controls="v-pills-users" aria-selected="false">Usuários</a>
    </div>
</div>