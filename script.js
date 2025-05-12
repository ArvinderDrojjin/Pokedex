const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

let allPokemonData = []; // globale Liste aller geladenen Pokémon

function onloadFunc() {
    loadData();
}

async function loadData() {
    let response = await fetch(BASE_URL);
    let data = await response.json();
    let pokemonList = data.results;

    allPokemonData = []; // wichtig, um Mehrfachladefehler zu vermeiden

    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];
        let detailResponse = await fetch(pokemon.url);
        let detailData = await detailResponse.json();
        allPokemonData.push(detailData);
    }

    renderPokemonCards(allPokemonData); // zeigt alle Pokémon
}

function renderPokemonCards(pokemonArray) {
    let html = "";
    for (let detailData of pokemonArray) {
        let typeClass = detailData.types[0].type.name;
        html +=
            "<div class='pokemon_card' onclick='toggleOverlay(" + JSON.stringify(detailData) + ")'>" +
            "<h2>#" + detailData.id + " " + detailData.name + "</h2>" +
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

function toggleOverlay(pokemon) {
    currentPokemon = pokemon;
    let overlayRef = document.getElementById('poke-overlay');

    if (overlayRef.style.display === "none" || overlayRef.style.display === "") {
        overlayRef.style.display = "flex";

        let typeClass = pokemon.types[0].type.name;
        let imageBox = document.getElementById('image-box-overlay');
        imageBox.className = "image-box " + typeClass;

        document.getElementById('current-img').src = pokemon.sprites.front_default;
        document.getElementById('current-title').textContent = "#" + pokemon.id + " " + pokemon.name;
        document.getElementById('tab-btn-main').textContent = "Main";
        document.getElementById('tab-btn-stats').textContent = "Stats";
        document.getElementById('tab-btn-chain').textContent = "Entwicklung";

        showMainInfo(pokemon);
    } else {
        overlayRef.style.display = "none";
    }
}

function showMainInfo(pokemon) {
    let infoDiv = document.querySelector(".dialog_info");
    infoDiv.innerHTML =
        "<p><strong>Größe:</strong> " + pokemon.height + "</p>" +
        "<p><strong>Gewicht:</strong> " + pokemon.weight + "</p>" +
        "<p><strong>Typ:</strong> " + pokemon.types.map(t => t.type.name).join(", ") + "</p>";
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