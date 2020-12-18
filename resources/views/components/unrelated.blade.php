<div class="col-12">
    <div class="row">
        @foreach ($unrelated as $key => $card)
            <div class="col-3 unrelatedCustom card-custom-unrelated-{{ $card->id }}" data-id="{{ $card->id }}">
                <div class="card border-primary mb-3 customUnrelated item" data-id="{{ $card->id }}">
                    <div class="card-header unrelatedName">{{ $card->name }}</div>
                    <div class="card-body text-primary">
                        <p class="card-text unrelatedDescription">{{ $card->description }}</p>
                    </div>
                </div>
            </div>
        @endforeach
    </div> <!-- LISTA DE PERSONALIZAÇÕES -->
</div>