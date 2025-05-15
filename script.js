const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

let allPokemonData = [];

let currentOffset = 0;

let currentPokemonIndex = 0;

function onloadFunc() {
    const spinnerOverlay = document.getElementById("fullscreen-spinner");
    const pokedex = document.getElementById("pokedex");

    pokedex.style.display = "none";
    spinnerOverlay.style.display = "flex";

    loadData().then(() => {
        spinnerOverlay.style.display = "none";
        pokedex.style.display = "flex";
    });
}

async function loadData(append = false) {
    const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${currentOffset}`;
    let response = await fetch(BASE_URL);
    let data = await response.json();
    let pokemonList = data.results;
    let newPokemonData = [];

    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let detailResponse = await fetch(pokemon.url);
        let detailData = await detailResponse.json();
        newPokemonData.push(detailData);
    }
    allPokemonData = append ? allPokemonData.concat(newPokemonData) : newPokemonData;
    renderPokemonCards(allPokemonData);
    currentOffset += 20;
}

function loadMorePokemon() {
    const spinnerOverlay = document.getElementById("fullscreen-spinner");
    const pokedex = document.getElementById("pokedex");

    pokedex.style.display = "none";
    spinnerOverlay.style.display = "flex";

    setTimeout(() => {
        loadData(true).then(() => {
            spinnerOverlay.style.display = "none";
            pokedex.style.display = "flex";
        });
    }, 3000);
}

function renderPokemonCards(pokemonArray) {
    let html = "";
    for (let pokemon of pokemonArray) {
        html += generatePokemonCard(pokemon);
    }
    document.getElementById("pokedex").innerHTML = html;
}

function filterPokemon() {
    const input = document.getElementById("pokemon_name").value.toLowerCase();
    const feedback = document.getElementById("search-feedback");

    if (input.length === 0) {
        feedback.style.display = "none";
        renderPokemonCards(allPokemonData);
        return;
    }

    if (input.length < 3) {
        feedback.textContent = "Bitte mindestens 3 Buchstaben eingeben";
        feedback.style.display = "block";
        renderPokemonCards(allPokemonData);
        return;
    }

    feedback.style.display = "none";
    const filtered = allPokemonData.filter(pokemon => pokemon.name.startsWith(input));
    renderPokemonCards(filtered);
}

let currentPokemon = null;

function openOverlay(pokemon) {
    currentPokemon = pokemon;
    currentPokemonIndex = allPokemonData.findIndex(p => p.id === pokemon.id);
    let overlayRef = document.getElementById('poke-overlay');
    overlayRef.style.display = "flex";

    document.body.classList.add('no-scroll');

    renderOverlay(currentPokemon);
}

function closeOverlay() {
    document.getElementById('poke-overlay').style.display = "none";
    document.body.classList.remove('no-scroll');
}

function renderOverlay(pokemon) {
    let typeClass = pokemon.types[0].type.name;
    let imageBox = document.getElementById('image-box-overlay');
    imageBox.className = "image-box " + typeClass;

    document.getElementById('current-img').src = pokemon.sprites.front_default;
    let capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    document.getElementById('current-title').textContent = "#" + pokemon.id + " " + capitalizedName;

    document.getElementById('tab-btn-main').textContent = "About";
    document.getElementById('tab-btn-stats').textContent = "Stats";
    document.getElementById('imgCounter').textContent = `${currentPokemonIndex + 1}/${allPokemonData.length}`;

    showMainInfo(pokemon);
}

function prevPokemon() {
    if (allPokemonData.length === 0) return;

    currentPokemonIndex--;
    if (currentPokemonIndex < 0) {
        currentPokemonIndex = allPokemonData.length - 1;
    }

    currentPokemon = allPokemonData[currentPokemonIndex];
    renderOverlay(currentPokemon);
}

function nextPokemon() {
    if (allPokemonData.length === 0) return;

    currentPokemonIndex++;
    if (currentPokemonIndex >= allPokemonData.length) {
        currentPokemonIndex = 0; 
    }

    currentPokemon = allPokemonData[currentPokemonIndex];
    renderOverlay(currentPokemon);
}

function showMainInfo(pokemon) {
    let infoDiv = document.querySelector(".dialog_info");
    infoDiv.innerHTML = generateMainInfo(pokemon);
}

function showStats(pokemon) {
    let infoDiv = document.querySelector(".dialog_info");
    infoDiv.innerHTML = generateStatsInfo(pokemon);
}

function stopPropagation(event) {
    event.stopPropagation()
}