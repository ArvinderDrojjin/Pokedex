const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

function onloadFunc() {
    loadData();
}

async function loadData() {
    let response = await fetch(BASE_URL);
    let data = await response.json();
    let pokemonList = data.results;

    let html = ""; // Hier sammeln wir alle Pokémon-Karten als Text

    for (let i = 0; i < pokemonList.length; i++) {
        let pokemon = pokemonList[i];

        let detailResponse = await fetch(pokemon.url);
        let detailData = await detailResponse.json();

        html +=
            "<div class='pokemon-card'>" +
            "<h2>#" + detailData.id + " " + detailData.name + "</h2>" +
            "<img src='" + detailData.sprites.front_default + "' alt='" + detailData.name + "' />" +
            "</div>";
    }

    document.getElementById("pokedex").innerHTML = html;
}