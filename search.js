let searchQuery = '';
let searchMatches = [];

function registerSearchEvents() {
    document.getElementById('search-form').addEventListener('submit', searchPokemon);
    document.getElementById('search-input').addEventListener('input', handleSearchInput);
    document.getElementById('clear-search').addEventListener('click', clearSearch);
}

function updateSearchButton() {
    const query = document.getElementById('search-input').value.trim();
    const letters = query.match(/[a-z]/gi) || [];
    document.getElementById('search-button').disabled = letters.length < 3 || isLoading;
}

function handleSearchInput() {
    updateSearchButton();
    if (!document.getElementById('search-input').value.trim() && searchQuery) clearSearch();
}

async function searchPokemon(event) {
    event.preventDefault();
    if (document.getElementById('search-button').disabled || isLoading) return;
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    setLoading(true, 'Searching Pokémon…');
    try {
        await findPokemon(query);
    } catch (error) {
        showStatus('Could not search Pokémon. Please try again.', true);
    } finally {
        setLoading(false);
    }
}

async function findPokemon(query) {
    const names = await getCachedData(apiUrl + 'pokemon?limit=100000');
    const matches = names.results.filter(item => item.name.includes(query));
    const firstPage = await Promise.all(matches.slice(0, batchSize).map(item => getCachedData(item.url)));
    searchQuery = query;
    searchMatches = matches;
    renderCards(firstPage);
    document.getElementById('collection-title').textContent = 'Search results';
    document.getElementById('result-count').textContent = matches.length + ' matches';
    document.getElementById('clear-search').hidden = false;
}

async function loadSearchBatch() {
    const page = searchMatches.slice(visiblePokemon.length, visiblePokemon.length + batchSize);
    const pokemon = await Promise.all(page.map(item => getCachedData(item.url)));
    renderCards(visiblePokemon.concat(pokemon));
    document.getElementById('result-count').textContent = searchMatches.length + ' matches';
}

function clearSearch() {
    if (isLoading) return;
    searchQuery = '';
    searchMatches = [];
    document.getElementById('search-input').value = '';
    document.getElementById('collection-title').textContent = 'Meet the Pokémon';
    document.getElementById('clear-search').hidden = true;
    showStatus('');
    renderCards(pokemonList);
    updateSearchButton();
    updateLoadButton();
    document.getElementById('search-input').focus();
}
