<div class="row">
    <div class="col-4">
        <div class="list-group tabTypes" id="list-tab" role="tablist">
            @foreach ($customTypes as $key => $customType)
                <a class="list-group-item list-group-item-action @if ($key == 0) active @endif" id="list-type-{{ $customType->id }}-list" data-toggle="list" href="#list-type-{{ $customType->id }}" role="tab" aria-controls="home">{{ $customType->name }}</a>
            @endforeach
        </div>
    </div>
    <div class="col-8">
        <div class="tab-content tabContentTypes" id="nav-tabContent">
            @foreach ($customTypes as $key => $customType)
                <div class="tab-pane fade @if ($key == 0) show active @endif" id="list-type-{{ $customType->id }}" role="tabpanel" aria-labelledby="list-type-{{ $customType->id }}-list">
                    <div class="row">
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
                    </div> <!-- Paginação Superior // -->
                    <div class="row container-type-{{ $customType->id }}">
                        @foreach ($customType->customization as $customization)
                            <div class="col-6 card-custom-{{ $customization->id }}" data-id="{{ $customization->id }}">
                                <div class="card border-primary mb-3 cardCustom" data-id="{{ $customization->id }}">
                                        <div class="card-header">{{ $customization->name }}</div>
                                        <div class="card-body text-primary">
                                            <p class="card-text">{{ $customization->description }}</p>
                                        </div>
                                    </div>
                                </div>
                        @endforeach
                    </div><!-- Listagem de customizações // -->
                    <div class="row">
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
                    </div> <!-- Paginação Inferior // -->
                </div>
            @endforeach
        </div>
    </div>
</div>