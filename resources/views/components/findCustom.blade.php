<div class="row">
    <div class="col-12">
        {{-- <div class="row">
            <div class="col-12">
                <nav aria-label="...">
                    <ul class="pagination">
                    <li class="page-item disabled">
                        <span class="page-link">Previous</span>
                    </li>
                    @for ($i = 0; $i < $customType->customization->lastPage(); $i++)
                            @if ($i+1 == $customType->customization->currentPage())
                                <li class="page-item active" aria-current="page">
                                    <span class="page-link">
                                        {{ $i+1 }}
                                        <span class="sr-only">(current)</span>
                                    </span>
                                </li>
                            @else
                                <li class="page-item">
                                    <a class="page-link" href="page={{ $i+1 }}">{{ $i+1 }}</a>
                                </li>
                            @endif
                    @endfor
                    <li class="page-item">
                        <a class="page-link" href="#">Next</a>
                    </li>
                    </ul>
                </nav>
            </div>
        </div> <!-- Paginação Superior // --> --}}

        <div class="tab-content tabContentTypes filter-basic" id="nav-tabContent">
            <!-- TOPO // -->
            <div class="row pb-3">
                <div class="col-2">
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-sort-amount-up-alt"></i> Filtro
                        </button>
                        <div class="dropdown-menu filtersCustom" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" href="#" data-filter="type-all">
                                All
                            </a>
                            @foreach ($customTypes as $key => $customType)  
                                <a class="dropdown-item" href="#" data-filter="type-{{ $customType->id }}">
                                    {{ $customType->name }}
                                </a>
                            @endforeach
                        </div>
                      </div>
                </div> <!-- FILTROS -->

                <div class="col-10">
                    <form class="formSearchCustom">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                              <span class="input-group-text" id="basic-addon1">
                                <i class="fas fa-dice-d6"></i>
                              </span>
                            </div>
                            <input type="text" class="form-control search-custom" name="customtitle" placeholder="Titulo da customização" aria-label="customtitle" aria-describedby="basic-addon1">
                            <div class="input-group-append">
                                <button class="btn btn-outline-primary customSearchButton" type="button" id="button-addon2">Buscar</button>
                              </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row container-types filter-gallery">
                @foreach ($customTypes as $key => $customType)
                        
                        @foreach ($customType->customization as $customization)
                            <div class="col-3 card-custom-{{ $customization->id }}" data-category="type-{{ $customType->id }}" data-id="{{ $customization->id }}">
                                <div class="card border-primary mb-3 cardCustom item" data-id="{{ $customization->id }}">
                                        <div class="card-header">
                                            {{ $customization->name }}
                                            <button type="button" class="btn btn-danger btn-sm btnDeleteCustom" data-id="{{ $customization->id }}">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>

                                        <div class="card-body text-primary">
                                            <p class="card-text">{{ $customization->description }}</p>
                                            <button type="button" class="btn btn-primary btnShowOptionsCustom" data-custom="{{ $customization->id }}" data-toggle="tooltip" data-placement="top" title="Visualizar opções">
                                                <i class="far fa-eye"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        @endforeach
                @endforeach
            </div><!-- Listagem de customizações // -->
        </div>
    </div>
</div>