// var request = new XMLHttpRequest()

// request.open('GET', 'http://pokeapi.co/api/v2/pokemon/?limit=1021',true)
// request.onload = function (){
//     var data = JSON.parse(this.response)
// }

// data.forEach ((pokemon) => {
//     console.log(pokemon.name)
// })

// request.send()

//array which shows all of our data.
let pokemonList = [
    
    {name: 'bulbasaur', pokedexNumber: '001', weight: 15, type: ['Grass','Poison']},
    {name: 'charmander',  pokedexNumber: '004', weight: 19, type: 'Fire'},
    {name: 'squirtle', pokedexNumber: '007', weight: 19.8, type: 'Water'},
    {name: 'pikachu', pokedexNumber: '025', weight: 13, type: 'Electric'},
    {name: 'eevee', pokedexNumber: '133', weight: 14, type: 'Normal'},
    {name: 'nidoking', pokedexNumber: '034', weight: 137, type: ['Poison','Ground']},
    {name: 'nidoqueen', pokedexNumber: '031', weight: 132, type: ['Poison','Ground']}

];

let pokemonList2 = [
    
    {name: 'chikorita', pokedexNumber: '152', weight: 14, type: 'Grass'},
    {name: 'cyndaquil',  pokedexNumber: '155', weight: 17, type: 'Fire'},
    {name: 'totodile', pokedexNumber: '158', weight: 21, type: 'Water'},
    {name: 'pichu', pokedexNumber: '172', weight: 4.4, type: 'Electric'},
    {name: 'umbreon', pokedexNumber: '197', weight: 60, type: 'Dark'},
    {name: 'espeon', pokedexNumber: '196', weight: 58, type: 'Psychic'},
    {name: 'steelix', pokedexNumber: '208', weight: 885, type: ['Steel','Ground']}

];

//PROTOTYPE
// let TypeChart = [
//     {type: 'Normal', weaknesses: 'Fighting', resistances: 'N/A'},
//     {type: 'Grass', weaknesses: ['Fire','Flying','Ice','Bug','Poison'], resistances: 'N/A'},
//     {type: 'Fire', weaknesses: ['Water','Rock','Ground'], resistances: 'N/A'},
//     {type: 'Water', weaknesses: ['Electric','Grass'], resistances: 'N/A'},
//     {type: 'Electric', weaknesses: 'Ground', resistances: 'N/A'},
//     {type: 'Flying', weaknesses: ['Rock','Electric','Ice'], resistances: 'N/A'},
//     {type: 'Rock', weaknesses: ['Grass', 'Water', 'Ground', 'Steel', 'Fighting'], resistances: 'N/A'},
//     {type: 'Ground', weaknesses: ['Grass', 'Water', 'Ice'], resistances: 'N/A'},
//     {type: 'Ghost', weaknesses: ['Ghost', 'Dark'], resistances: 'N/A'},
//     {type: 'Bug', weaknesses: ['Fire', 'Flying', 'Rock',], resistances: 'N/A'},
//     {type: 'Psychic', weaknesses: ['Bug', 'Ghost', 'Dark'], resistances: 'N/A'},
//     {type: 'Dark', weaknesses: ['Fighting', 'Bug'], resistances: 'N/A'},
//     {type: 'Fairy', weaknesses: ['Poison', 'Steel'], resistances: 'N/A'},
//     {type: 'Dragon', weaknesses: ['Dragon', 'Fairy'], resistances: 'N/A'},
//     {type: 'Steel', weaknesses: ['Fire', 'Fighting', 'Ground'], resistances: 'N/A'},
//     {type: 'Ice', weaknesses: ['Fighting', 'Fire', 'Steel'], resistances: 'N/A'},
//     {type: 'Poison', weaknesses: ['Psychic', 'Ground'] ,resistances: 'N/A'}
// ]

//This code checks for when the user clicks the button then executes the following code when the user does.
document.querySelector('button').addEventListener('click',()=>{

    //function for adding in the pictures for pokemon
    function createPokeImage(pokeID, containerDiv){
        pokeImage = document.createElement('img');
        pokeImage.srcset =`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`
        var div = document.getElementById(containerDiv);
        div.appendChild(pokeImage);
    }

    //This is the pokemon that is typed in the textbox
    let PokemonInputted = document.querySelector('#Pokemon').value;

    //These are there to make it case insensitive
    let currentPokemon = PokemonInputted.toLowerCase();

    //This makes sure the pokemon are capitalized correctly
    let properCase = currentPokemon.charAt(0).toUpperCase() + currentPokemon.substring(1);

    //defines pokemonFound outside
    var pokemonFound = false;
    //This function writes down the pokemon's pokedex #, weight, and type
    function pokemonStats(list){
        for (let i = 0; i < list.length; i++){
            if (list[i].name === currentPokemon) {
                document.querySelector('#pokemon-name').innerText = properCase;
                document.querySelector('#pokemon-Title').innerText = properCase;
                document.querySelector('#pokedex-number').innerText = list[i].pokedexNumber;
                document.querySelector('#pokemon-weight').innerText = list[i].weight + ' lbs';
                document.querySelector('#pokemon-type').innerText = list[i].type;
                pokemonFound = true;
                createPokeImage(list[i].pokedexNumber,'pokemon-model');
                break;
            }
        }
        
        for (let i = 0; i < list.length; i++){
            if (list[i].name !== currentPokemon && pokemonFound === false){
                document.querySelector('#pokemon-Title').innerText = 'ERROR';
                document.querySelector('#pokemon-name').innerText = 'ERROR. POKEMON IS NOT IN DATABASE.';
                document.querySelector('#pokedex-number').innerText = 'ERROR. POKEMON IS NOT IN DATABASE.';
                document.querySelector('#pokemon-weight').innerText = 'ERROR. POKEMON IS NOT IN DATABASE.';
                document.querySelector('#pokemon-type').innerText = 'ERROR. POKEMON IS NOT IN DATABASE.';
            }
        }
    }
        //checks to see if pokemon was already found in the first array or not.
        pokemonStats(pokemonList);
        if (pokemonFound === false){
            pokemonStats(pokemonList2);
        }
    }
)

//variables to measure lightness and heaviness
const lightPokemon = 20;
const heavyPokemon = 80;
const insanelyHeavyPokemon = 200;

//empty variable used as a placeholder for writing everything down onto a list form on the HTML page
var pokemon = '';

//for loop which checks for weight and gives values for each pokemons' properties
function pokedexEntry (list)
{
    for (let i = 0; i < list.length; i++){
        if(list[i].weight >= insanelyHeavyPokemon){
            weightChecker = '(Good luck carrying this pokemon!)';
        }
        else if(list[i].weight > heavyPokemon){
            weightChecker = '(This pokemon is heavy!)';
        }
        else if (list[i].weight < heavyPokemon && list[i].weight > lightPokemon){
            weightChecker = '(This pokemon is average)';
        }
        else{
            weightChecker = '(This pokemon is light!)';
        }

        pokemon += list[i].name.charAt(0).toUpperCase()+ list[i].name.substring(1) + weightChecker + '<br>' ;
        pokemon += list[i].pokedexNumber + '<br>';
        pokemon += list[i].weight + ' lbs' + '<br>';
        pokemon += list[i].type + '<br>' + '<br>' + '<br>';

    } 

//This is what actually writes down the text
    document.querySelector('.pokemon-entry').innerHTML = pokemon;
}

//calls both functions
pokedexEntry(pokemonList);
pokedexEntry(pokemonList2);





