function generatePokemonCard(pokemon) {
    const typeClass = pokemon.types[0].type.name;
    const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    return `
        <div class='pokemon_card' onclick='openOverlay(${JSON.stringify(pokemon)})'>
            <h2>#${pokemon.id} ${capitalizedName}</h2>
            <div class='image-box ${typeClass}'>
                <img src='${pokemon.sprites.front_default}' alt='${pokemon.name}' />
            </div>
        </div>
    `;
}

function generateMainInfo(pokemon) {
    return `
    <div class="dialog-main-info">
        <p><strong>Height:</strong> ${pokemon.height}</p>
        <p><strong>Weight:</strong> ${pokemon.weight}</p>
        <p><strong>Type:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
    </div>
    `;
}

function generateStatsInfo(pokemon) {
    return pokemon.stats.map(stat => `
        <p><strong>${stat.stat.name}:</strong> ${stat.base_stat}</p>
    `).join("");
}