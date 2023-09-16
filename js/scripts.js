//array which shows all of our data.
let pokemonList = [
    
    {name: 'bulbasaur', pokedexNumber: '#001', weight: 15, type: ['Grass','Poison']},
    {name: 'charmander',  pokedexNumber: '#004', weight: 19, type: 'Fire'},
    {name: 'squirtle', pokedexNumber: '#007', weight: 19.8, type: 'Water'},
    {name: 'pikachu', pokedexNumber: '#025', weight: 13, type: 'Electric'},
    {name: 'eevee', pokedexNumber: '#133', weight: 14, type: 'Normal'},
    {name: 'nidoking', pokedexNumber: '#034', weight: 137, type: ['Poison','Ground']},
    {name: 'nidoqueen', pokedexNumber: '#031', weight: 132, type: ['Poison','Ground']}

];

//variables to measure lightness and heaviness
const lightPokemon = 15;
const heavyPokemon = 30;

//empty variable used as a placeholder for writing everything down onto a list form on the HTML page
var pokemon = '';

//for loop which checks for weight and gives values for each pokemons' properties
for (let i = 0; i < pokemonList.length; i++){
    if(pokemonList[i].weight >= heavyPokemon){
        weightChecker = '(This pokemon is heavy!)';
    }
    else if (pokemonList[i].weight < heavyPokemon && pokemonList[i].weight > lightPokemon){
        weightChecker = '(This pokemon is average)';
    }
    else{
        weightChecker = '(This pokemon is light!)';
    }

    pokemon += pokemonList[i].name.charAt(0).toUpperCase()+ pokemonList[i].name.substring(1) + weightChecker + '<br>' ;
    pokemon += pokemonList[i].pokedexNumber + '<br>';
    pokemon += pokemonList[i].weight + ' lbs' + '<br>';
    pokemon += pokemonList[i].type + '<br>' + '<br>' + '<br>';

} 

//This is what actually writes down the text
document.querySelector('.pokemon-entry').innerHTML = pokemon;



//This code checks for when the user clicks the button then executes the following code when the user does.
document.querySelector('button').addEventListener('click', () => {

        //This is the pokemon that is typed in the textbox
        let PokemonInputted = document.querySelector('#Pokemon').value;

        //These are there to make it case insensitive
        let currentPokemon = PokemonInputted.toLowerCase();
        let properCase = currentPokemon.charAt(0).toUpperCase() + currentPokemon.substring(1);


        //This writes down the pokemon's name in the Title in the middle and on the side data
        document.querySelector('#pokemon-name').innerText = properCase;
        document.querySelector('#pokemon-Title').innerText = properCase;


        //This writes down the pokemon's pokedex #, weight
        for (let i = 0; i < pokemonList.length; i++){
            if (pokemonList[i].name == currentPokemon) {
                document.querySelector('#pokedex-number').innerText = pokemonList[i].pokedexNumber;
                document.querySelector('#pokemon-weight').innerText = pokemonList[i].weight;
                document.querySelector('#pokemon-type').innerText = pokemonList[i].type;
            }
        }

        //This creates a picture of said pokemon. That said, it is just a placeholder for now and has no way of using the array
        const pokemonModel = document.createElement('img');
        pokemonModel.src = 'https://placehold.co/600x400';
        var src = document.getElementById('pokemon-model');
        src.appendChild(pokemonModel);
    }
)





