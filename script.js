const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

let allPokemonData = []; // globale Liste aller geladenen Pokémon

let currentOffset = 0;

let currentPokemonIndex = 0;

function onloadFunc() {
    loadData();
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

    // Alles verstecken & Spinner zeigen
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
    for (let detailData of pokemonArray) {
        let typeClass = detailData.types[0].type.name;
        let capitalizedName = detailData.name.charAt(0).toUpperCase() + detailData.name.slice(1);
        html +=
            "<div class='pokemon_card' onclick='openOverlay(" + JSON.stringify(detailData) + ")'>" +
            "<h2>#" + detailData.id + " " + capitalizedName + "</h2>" +
            "<div class='image-box " + typeClass + "'>" +
            "<img src='" + detailData.sprites.front_default + "' alt='" + detailData.name + "' />" +
            "</div>" +
            "</div>";
    }
    document.getElementById("pokedex").innerHTML = html;
}

function filterPokemon() {
    let input = document.getElementById("pokemon_name").value.toLowerCase();
    let filtered = allPokemonData.filter(pokemon => pokemon.name.startsWith(input));
    renderPokemonCards(filtered);
}

let currentPokemon = null;

function openOverlay(pokemon) {
    currentPokemon = pokemon;
    currentPokemonIndex = allPokemonData.findIndex(p => p.id === pokemon.id);
    let overlayRef = document.getElementById('poke-overlay');
    overlayRef.style.display = "flex";
    renderOverlay(currentPokemon);
}

function closeOverlay() {
    document.getElementById('poke-overlay').style.display = "none";
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
    // Zähler aktualisieren
    document.getElementById('imgCounter').textContent = `${currentPokemonIndex + 1}/${allPokemonData.length}`;

    showMainInfo(pokemon);
}

function prevPokemon() {
    if (allPokemonData.length === 0) return;

    currentPokemonIndex--;
    if (currentPokemonIndex < 0) {
        currentPokemonIndex = allPokemonData.length - 1; // springt zum letzten Pokémon
    }

    currentPokemon = allPokemonData[currentPokemonIndex];
    renderOverlay(currentPokemon);
}

function nextPokemon() {
    if (allPokemonData.length === 0) return;

    currentPokemonIndex++;
    if (currentPokemonIndex >= allPokemonData.length) {
        currentPokemonIndex = 0; // springt zum ersten Pokémon
    }

    currentPokemon = allPokemonData[currentPokemonIndex];
    renderOverlay(currentPokemon);
}

function showMainInfo(pokemon) {
    let infoDiv = document.querySelector(".dialog_info");
    infoDiv.innerHTML =
        "<p><strong>Height:</strong> " + pokemon.height + "</p>" +
        "<p><strong>Weight:</strong> " + pokemon.weight + "</p>" +
        "<p><strong>Type:</strong> " + pokemon.types.map(t => t.type.name).join(", ") + "</p>";
}

function showStats(pokemon) {
    let infoDiv = document.querySelector(".dialog_info");
    let statsHtml = "";

    for (let stat of pokemon.stats) {
        statsHtml += "<p><strong>" + stat.stat.name + ":</strong> " + stat.base_stat + "</p>";
    }

    infoDiv.innerHTML = statsHtml;
}

function stopPropagation(event) {
    event.stopPropagation()
}