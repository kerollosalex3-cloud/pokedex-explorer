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

function dialogTemplate(name, number, type, image, types, previous, next) {
    return `<div class="pokemon-detail type-${type}" data-id="overlay-pokemon-name">
        <div class="dialog-hero"><div class="dialog-top"><span class="pokemon-number">${number}</span><button class="close-button" type="button" data-id="close-dialog-button" data-action="close" aria-label="Close Pokémon details">×</button></div>
        <h2 id="dialog-title">${name}</h2><div class="type-list">${types}</div><img class="dialog-pokemon" data-id="dialog-image" src="${image}" alt="${name}" width="200" height="200"></div>
        <div class="dialog-body"><div class="detail-tabs" role="tablist" aria-label="Pokémon information">
            <button class="tab-button" id="tab-about" role="tab" type="button" data-tab="about" aria-label="Show Pokémon information" aria-selected="false" aria-controls="detail-panel" tabindex="-1">About</button>
            <button class="tab-button active" id="tab-stats" role="tab" type="button" data-tab="stats" aria-label="Show Pokémon base stats" aria-selected="true" aria-controls="detail-panel">Base stats</button>
            <button class="tab-button" id="tab-evolution" role="tab" type="button" data-tab="evolution" aria-label="Show Pokémon evolution" aria-selected="false" aria-controls="detail-panel" tabindex="-1">Evolution</button>
        </div><div id="detail-panel" role="tabpanel" aria-labelledby="tab-stats" tabindex="0"></div><p id="detail-status" role="status" aria-live="polite"></p></div>
        <div class="dialog-navigation"><button class="previous" type="button" data-id="prev-button" data-action="previous" aria-label="View previous Pokémon, ${previous}"><span class="nav-arrow" aria-hidden="true">←</span><span>${previous}</span></button><button class="next" type="button" data-id="next-button" data-action="next" aria-label="View next Pokémon, ${next}"><span>${next}</span><span class="nav-arrow" aria-hidden="true">→</span></button></div>
    </div>`;
}

function statTemplate(name, value, width) {
    return `<div class="stat-row"><span>${name}</span><strong>${value}</strong><div class="stat-track" role="progressbar" aria-label="${name}" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="255"><span style="width:${width}%"></span></div></div>`;
}

function statListTemplate(stats) {
    return `<div class="stat-list">${stats}</div>`;
}

function aboutTemplate(height, weight, experience, abilities) {
    return `<div class="about-grid"><div><span>Height</span><strong>${height} m</strong></div><div><span>Weight</span><strong>${weight} kg</strong></div><div><span>Base experience</span><strong>${experience}</strong></div></div><div class="abilities"><span>Abilities</span><strong>${abilities}</strong></div>`;
}

function evolutionTemplate(id, name, image) {
    return `<button class="evolution-card" type="button" data-evolution="${id}" aria-label="View ${name} details"><img src="${image}" alt="${name}" width="80" height="80" loading="lazy"><h4>${name}</h4></button>`;
}

function evolutionListTemplate(cards) {
    return `<p class="evolution-hint">Select a Pokémon to explore its details.</p><div class="evolution-list">${cards}</div>`;
}
