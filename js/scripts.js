let pokemonList = [
    
    {name: "bulbasaur", pokedexNumber: "#001", weight: 15, type: ["grass","poison"]},
    {name: "charmander",  pokedexNumber: "#004", weight: 10, type: "fire"},
    {name: "squirtle", pokedexNumber: "#007", weight: 8, type: "water"},
    {name: "pikachu", pokedexNumber: "#025", weight: 5, type: "electric"},
    {name: "eevee", pokedexNumber: "#133", weight: 7, type: "normal"},
    {name: "nidoking", pokedexNumber: "#034", weight: 50, type: ["poison","ground"]},
    {name: "nidoqueen", pokedexNumber: "#031", weight: 45, type: ["poison","ground"]}

];

// when the user click on the button, the following code is executed
document.querySelector('button').addEventListener('click', () => {

    let currentPokemon = document.querySelector('#Pokemon').value;

    document.querySelector('#pokemon-name').innerText = currentPokemon;

    //Commenting this section out because I'm not sure how to call these properties from object pokemonList yet.
    /**document.querySelector('#pokedex-number').innerText =;
    document.querySelector('#pokemon-weight').innerText =;
    document.querySelector('#pokemon-type').innerText =;**/

    
  });