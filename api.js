const apiUrl = 'https://pokeapi.co/api/v2/';
const batchSize = 24;
const dataCache = {};
const pendingRequests = {};
let nextPage = apiUrl + 'pokemon?limit=' + batchSize;

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Could not load Pokémon. Please try again.');
    const data = await response.json();
    dataCache[url] = data;
    if (data.sprites) {
        dataCache[apiUrl + 'pokemon/' + data.id + '/'] = data;
        dataCache[apiUrl + 'pokemon/' + data.name + '/'] = data;
    }
    return data;
}

async function getCachedData(url) {
    if (dataCache[url]) return dataCache[url];
    if (pendingRequests[url]) return pendingRequests[url];
    pendingRequests[url] = fetchData(url);
    try {
        return await pendingRequests[url];
    } finally {
        delete pendingRequests[url];
    }
}

async function loadBatch() {
    if (!nextPage) return;
    const page = await getCachedData(nextPage);
    const newPokemon = await Promise.all(page.results.map(item => getCachedData(item.url)));
    pokemonList = pokemonList.concat(newPokemon);
    nextPage = page.next;
    renderCards(pokemonList);
}
