//variables to measure lightness and heaviness
const lightPokemon = 20;
const heavyPokemon = 80;
const insanelyHeavyPokemon = 200;

//empty variables used as placeholders for writing everything down onto a list form on the HTML page
var pokemonNameEntry = '';
var pokemonNumberEntry = '';
var pokemonWeightEntry = '';
var pokemonTypeEntry = '';

//default false value if pokemon is not found in array
var pokemonFound = false;

let pokemonRepository = (function () {
    let pokemonList = [

        { name: 'bulbasaur', pokedexNumber: '001', weight: 15, type: ['Grass', 'Poison'], evolvesInto: 'ivysaur' },
        { name: 'charmander', pokedexNumber: '004', weight: 19, type: 'Fire', evolvesInto: 'charmeleon' },
        { name: 'squirtle', pokedexNumber: '007', weight: 19.8, type: 'Water', evolvesInto: 'wartortle' },
        { name: 'pikachu', pokedexNumber: '025', weight: 13, type: 'Electric', evolvesInto: 'raichu' },
        { name: 'eevee', pokedexNumber: '133', weight: 14, type: 'Normal', evolvesInto: ['jolteon', 'vaporeon', 'flareon', 'umbreon', 'espeon', 'leafeon', 'glaceon', 'sylveon'] },
        { name: 'nidoking', pokedexNumber: '034', weight: 137, type: ['Poison', 'Ground'] },
        { name: 'nidoqueen', pokedexNumber: '031', weight: 132, type: ['Poison', 'Ground'] },
        { name: 'chikorita', pokedexNumber: '152', weight: 14, type: 'Grass', evolvesInto: 'bayleaf' },
        { name: 'cyndaquil', pokedexNumber: '155', weight: 17, type: 'Fire', evolvesInto: 'quilava' },
        { name: 'totodile', pokedexNumber: '158', weight: 21, type: 'Water', evolvesInto: 'crocanaw' },
        { name: 'pichu', pokedexNumber: '172', weight: 4.4, type: 'Electric', evolvesInto: 'pikachu' },
        { name: 'umbreon', pokedexNumber: '197', weight: 60, type: 'Dark' },
        { name: 'espeon', pokedexNumber: '196', weight: 58, type: 'Psychic' },
        { name: 'steelix', pokedexNumber: '208', weight: 885, type: ['Steel', 'Ground'] }
    ]
    //returns full pokemonList
    function getAll() {
        return pokemonList;
    }

    //allows you to add pokemon into the array
    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    //writes down the pokemon in an order as buttons
    function addPokeButton(pkmn) {
        pokemonNameEntry = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1) + '<br>';
        pokemonNumberEntry = 'Pokedex #' + pkmn.pokedexNumber + '<br>';
        pokemonWeightEntry = pkmn.weight + ' lbs' + '<br>';
        pokemonTypeEntry = pkmn.type + '<br>';

        let container = document.querySelector('.pokemon-entry');
        let button = document.createElement('button');
        document.querySelector('button');
        button.addEventListener('click',function(){
            showDetails(pkmn);
        });
        button.innerHTML = pokemonNameEntry + pokemonNumberEntry + pokemonWeightEntry + pokemonTypeEntry;
        button.classList.add('dex-entry');
        container.appendChild(button);
        
    }

    function showDetails(pkmn){
        document.querySelector('#pokemon-name').innerHTML = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
        document.querySelector('#pokemon-Title').innerHTML = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
        document.querySelector('#pokedex-number').innerHTML = '#' + pkmn.pokedexNumber;
        document.querySelector('#pokemon-weight').innerHTML = pkmn.weight + ' lbs';
        document.querySelector('#pokemon-type').innerHTML = pkmn.type;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        removePokeImage('pokemon-model');
        createPokeImage(pkmn.pokedexNumber, 'pokemon-model');
        playPokemonCry(pkmn.pokedexNumber);
        console.log(pkmn);
    }

    var i = 0;

    // function next(pkmn) {
    //     let next = document.querySelector('.next-pokemon');
    //     next.addEventListener('click',function(){
    //         if(i === pkmn.length){
    //             pkmn[i++];
    //         }
    //     })
    // }
    // function previous(pkmn) {
    //     let previous = document.querySelector('.previous-pokemon');
    //     previous.addEventListener('click',function(){
    //         if(i === pkmn.length){
    //             pkmn[i--];
    //         }
    //     })
    // }



    return {
        getAll,
        add,
        addPokeButton,
        //next,
        //previous
    }
})();

//testing the add function (Question for Mentor/Tutor, "Why can't I add both of them in on the same add()?")
pokemonRepository.add(
    { name: 'mewtwo', pokedexNumber: '150', weight: 269, type: 'Psychic' },
    //{name:'mew', pokedexNumber:'151', weight: 8.8, type: 'Psychic'}
);
pokemonRepository.add(
    { name: 'mew', pokedexNumber: '151', weight: 8.8, type: 'Psychic' }
);

//function for removing the image of the pokemon so they don't infinitely stack down.
function removePokeImage(containerDiv) {
    var img = document.getElementById(containerDiv);
    img.innerHTML = '';
}

//function for adding in the pictures for pokemon
function createPokeImage(pokeID, containerDiv) {
    var pokeImage = document.createElement('img');
    pokeImage.srcset = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`
    var div = document.getElementById(containerDiv);
    div.appendChild(pokeImage);
    pokeImage.setAttribute('id', 'pokeImage');
    console.log(div);
}

//function that triggers a pokemon's voice when summoned
function playPokemonCry(pokeID) {
    let pureNumber = Number(pokeID);
    var audio = new Audio(`assets/cries/${pureNumber}.wav`);
    audio.play();
}


//This code checks for when the user clicks the button then executes the following code when the user does.
document.querySelector('button').addEventListener('click', () => {
    //This is the pokemon that is typed in the textbox
    let pokemonInputted = document.querySelector('#Pokemon').value;

    //This is here to make it case insensitive
    let currentPokemon = pokemonInputted.toLowerCase();

    //capitalizes the pokemon's name in the title and pokedex entry
    let properCase = currentPokemon.charAt(0).toUpperCase() + currentPokemon.substring(1);

    //This function writes down the pokemon's pokedex #, weight, and type
    function pokemonStats(list) {
        const selected = list.find(item => item.name == currentPokemon)
        if (selected) {
            if (selected.name === currentPokemon) {
                console.log(selected)
                document.querySelector('#pokemon-name').innerHTML = properCase;
                document.querySelector('#pokemon-Title').innerHTML = properCase;
                document.querySelector('#pokedex-number').innerHTML = '#' + selected.pokedexNumber;
                document.querySelector('#pokemon-weight').innerHTML = selected.weight + ' lbs';
                document.querySelector('#pokemon-type').innerHTML = selected.type;
                pokemonFound = true;
                removePokeImage('pokemon-model');
                createPokeImage(selected.pokedexNumber, 'pokemon-model');
                playPokemonCry(selected.pokedexNumber);
                console.log(selected.pokedexNumber)
            }
        }
        else {
            console.log(selected)
            document.querySelector('#pokemon-Title').innerText = properCase;
            document.querySelector('#pokemon-name').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
            document.querySelector('#pokedex-number').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
            document.querySelector('#pokemon-weight').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
            document.querySelector('#pokemon-type').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
            removePokeImage('pokemon-model');
        }
    };
    //executes Function
    pokemonStats(pokemonRepository.getAll());;
});


//forEach loop which checks for weight and gives values for each pokemons' properties
pokemonRepository.getAll().forEach(function(pkmn) {
    pokemonRepository.addPokeButton(pkmn)
});

