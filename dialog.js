let activeIndex = 0;
let dialogPokemon = [];
let activeTab = 'stats';
let detailVersion = 0;
const statNames = ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'];

function registerDialogEvents() {
    document.getElementById('pokemon-list').addEventListener('click', handleCardClick);
    const dialog = document.getElementById('pokemon-dialog');
    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('keydown', handleDialogKeys);
    dialog.addEventListener('close', restoreScroll);
}

function handleCardClick(event) {
    const card = event.target.closest('[data-pokemon]');
    if (card) openPokemon(Number(card.dataset.pokemon));
}

function openPokemon(id) {
    dialogPokemon = visiblePokemon.slice();
    activeIndex = dialogPokemon.findIndex(pokemon => pokemon.id === id);
    if (activeIndex < 0) return;
    renderDialog();
    document.getElementById('pokemon-dialog').showModal();
    document.body.classList.add('dialog-open');
}

function renderDialog() {
    detailVersion++;
    activeTab = 'stats';
    const pokemon = dialogPokemon[activeIndex];
    const number = '#' + String(pokemon.id).padStart(3, '0');
    const previous = formatName(dialogPokemon[getNeighbourIndex(-1)].name);
    const next = formatName(dialogPokemon[getNeighbourIndex(1)].name);
    document.getElementById('dialog-content').innerHTML = dialogTemplate(formatName(pokemon.name), number, pokemon.types[0].type.name, getImage(pokemon), createTypes(pokemon.types), previous, next);
    showStats(pokemon);
}

function getNeighbourIndex(direction) {
    return (activeIndex + direction + dialogPokemon.length) % dialogPokemon.length;
}

function changePokemon(direction) {
    activeIndex = getNeighbourIndex(direction);
    renderDialog();
    const button = direction === 1 ? 'next-button' : 'prev-button';
    document.querySelector('[data-id="' + button + '"]').focus();
}

function handleDialogClick(event) {
    if (event.target === event.currentTarget) return closeDialog();
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.action === 'close') closeDialog();
    if (button.dataset.action === 'previous') changePokemon(-1);
    if (button.dataset.action === 'next') changePokemon(1);
    if (button.dataset.tab) selectDetailTab(button.dataset.tab);
}

function handleDialogKeys(event) {
    if (event.target.matches('[role="tab"]')) return;
    if (event.key === 'ArrowLeft') changePokemon(-1);
    if (event.key === 'ArrowRight') changePokemon(1);
}

function selectDetailTab(tab) {
    activeTab = tab;
    detailVersion++;
    updateDetailTabs();
    const pokemon = dialogPokemon[activeIndex];
    document.getElementById('detail-status').textContent = '';
    if (tab === 'stats') showStats(pokemon);
    if (tab === 'about') showAbout(pokemon);
}

function updateDetailTabs() {
    document.querySelectorAll('[data-tab]').forEach(button => {
        const selected = button.dataset.tab === activeTab;
        button.classList.toggle('active', selected);
        button.setAttribute('aria-selected', selected);
        button.tabIndex = selected ? 0 : -1;
    });
    document.getElementById('detail-panel').setAttribute('aria-labelledby', 'tab-' + activeTab);
}

function showStats(pokemon) {
    const stats = pokemon.stats.map((stat, index) => statTemplate(statNames[index], stat.base_stat, stat.base_stat / 255 * 100));
    document.getElementById('detail-panel').innerHTML = statListTemplate(stats.join(''));
}

function showAbout(pokemon) {
    const abilities = pokemon.abilities.map(item => formatName(item.ability.name)).join(', ');
    document.getElementById('detail-panel').innerHTML = aboutTemplate(pokemon.height / 10, pokemon.weight / 10, pokemon.base_experience ?? 'Unknown', abilities);
}

function closeDialog() {
    document.getElementById('pokemon-dialog').close();
}

function restoreScroll() {
    detailVersion++;
    document.body.classList.remove('dialog-open');
}
