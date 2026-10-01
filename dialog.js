let activeIndex = 0;
let dialogPokemon = [];
let activeTab = 'stats';
let detailVersion = 0;
let evolutionPokemon = [];
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
    if (button.dataset.evolution) openEvolution(Number(button.dataset.evolution));
}

function handleDialogKeys(event) {
    if (event.target.matches('[role="tab"]')) return handleTabKeys(event);
    if (event.key === 'ArrowLeft') changePokemon(-1);
    if (event.key === 'ArrowRight') changePokemon(1);
}

function handleTabKeys(event) {
    const tabs = ['about', 'stats', 'evolution'];
    let index = tabs.indexOf(activeTab);
    if (event.key === 'ArrowLeft') index = (index + 2) % 3;
    else if (event.key === 'ArrowRight') index = (index + 1) % 3;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = 2;
    else return;
    event.preventDefault();
    selectDetailTab(tabs[index]);
    document.getElementById('tab-' + tabs[index]).focus();
}

function selectDetailTab(tab) {
    activeTab = tab;
    detailVersion++;
    updateDetailTabs();
    const pokemon = dialogPokemon[activeIndex];
    document.getElementById('detail-status').textContent = '';
    if (tab === 'stats') showStats(pokemon);
    if (tab === 'about') showAbout(pokemon);
    if (tab === 'evolution') showEvolution(pokemon, detailVersion);
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

async function showEvolution(pokemon, version) {
    document.getElementById('detail-panel').innerHTML = '';
    document.getElementById('detail-status').textContent = 'Loading evolution…';
    try {
        const species = await getCachedData(pokemon.species.url);
        const chain = await getCachedData(species.evolution_chain.url);
        const evolution = await loadEvolution(chain.chain);
        if (version === detailVersion) renderEvolution(evolution);
    } catch (error) {
        if (version === detailVersion) document.getElementById('detail-status').textContent = 'Could not load evolution. Select the tab to try again.';
    }
}

async function loadEvolution(chain) {
    const names = collectEvolutionNames(chain);
    return Promise.all(names.map(name => getCachedData(apiUrl + 'pokemon/' + name + '/')));
}

function collectEvolutionNames(chain) {
    let names = [chain.species.name];
    for (const evolution of chain.evolves_to) {
        names = names.concat(collectEvolutionNames(evolution));
    }
    return names;
}

function renderEvolution(pokemon) {
    evolutionPokemon = pokemon;
    const cards = pokemon.map(item => evolutionTemplate(item.id, formatName(item.name), getImage(item))).join('');
    document.getElementById('detail-panel').innerHTML = evolutionListTemplate(cards);
    document.getElementById('detail-status').textContent = '';
}

function openEvolution(id) {
    const pokemon = evolutionPokemon.find(item => item.id === id);
    if (!dialogPokemon.some(item => item.id === id)) dialogPokemon.push(pokemon);
    activeIndex = dialogPokemon.findIndex(item => item.id === id);
    renderDialog();
    document.getElementById('tab-stats').focus();
}

function closeDialog() {
    document.getElementById('pokemon-dialog').close();
}

function restoreScroll() {
    detailVersion++;
    document.body.classList.remove('dialog-open');
}
