let pokemonList = [];
let visiblePokemon = [];
let isLoading = false;

function init() {
    document.getElementById('load-more-button').addEventListener('click', loadMore);
    loadMore();
}

async function loadMore() {
    if (isLoading) return;
    setLoading(true, 'Loading Pokémon…');
    try {
        await loadBatch();
    } catch (error) {
        showStatus('Could not load Pokémon. Please try again.', true);
    } finally {
        setLoading(false);
    }
}

function setLoading(loading, message) {
    isLoading = loading;
    document.getElementById('loading-screen').hidden = !loading;
    document.getElementById('loading-text').textContent = message;
    document.getElementById('pokemon-list').setAttribute('aria-busy', loading);
    document.getElementById('load-more-button').disabled = loading;
    document.getElementById('load-more-button').hidden = !nextPage;
    if (loading) showStatus('');
}

function renderCards(pokemon) {
    visiblePokemon = pokemon;
    document.getElementById('pokemon-list').innerHTML = pokemon.map(createCard).join('');
    document.getElementById('result-count').textContent = pokemon.length + ' Pokémon';
    document.getElementById('empty-state').innerHTML = pokemon.length ? '' : emptyTemplate();
}

function createCard(pokemon) {
    const name = formatName(pokemon.name);
    const types = createTypes(pokemon.types);
    const number = '#' + String(pokemon.id).padStart(3, '0');
    return cardTemplate(pokemon.id, number, name, pokemon.types[0].type.name, getImage(pokemon), types);
}

function createTypes(types) {
    return types.map(item => typeTemplate(item.type.name, formatName(item.type.name))).join('');
}

function getImage(pokemon) {
    return pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default || 'assets/pokeball.svg';
}

function formatName(name) {
    return name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function showStatus(message, isError = false) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.classList.toggle('error', isError);
}
