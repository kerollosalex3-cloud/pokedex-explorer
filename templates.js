function emptyTemplate() {
    return `<p data-id="not-found" class="not-found">No match found.</p>`;
}

function cardTemplate(id, number, name, type, image, types) {
    return `<li><button class="pokemon-card type-${type}" data-id="card" data-pokemon="${id}" aria-label="View ${name} details" type="button">
        <div class="card-top"><span class="pokemon-number">${number}</span><span class="card-arrow" aria-hidden="true">↗</span></div>
        <div class="card-art"><img data-id="card-image" src="${image}" alt="${name}" loading="lazy" width="180" height="180"></div>
        <h3>${name}</h3><div class="type-list">${types}</div>
    </button></li>`;
}

function typeTemplate(type, name) {
    return `<span class="type-badge type-${type}">${name}</span>`;
}

