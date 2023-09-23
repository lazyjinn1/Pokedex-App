//variables to measure lightness and heaviness
const lightPokemon = 20;
const heavyPokemon = 80;
const insanelyHeavyPokemon = 200;

//empty variables used as placeholders for writing everything down onto a list form on the HTML page
var pokemonNameEntry = '';
var pokemonImgEntry = '';
var pokemonNumberEntry = '';
var pokemonHeightEntry = '';
var pokemonTypeEntry = '';

//default false value if pokemon is not found in array
var pokemonFound = false;

let pokemonRepository = (function () {

    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=649';

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (pkmn) {
                let pokemon = {
                    name: pkmn.name,
                    detailsUrl: pkmn.url,
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    function loadDetails(pkmn){
        let url = pkmn.detailsUrl;
        return fetch(url).then(function(response){
            return response.json();
        }).then(function(details){
            pkmn.imageUrl = details.sprites.front_default;
            pkmn.height = details.height;
            pkmn.type = details.types;
            pkmn.pokedexNumber = details.id;
        }).catch(function (e){
            console.error(e);
        });
    }
    
    //returns full pokemonList
    function getAll() {
        return pokemonList;
    }

    //allows you to add pokemon into the array
    function add(pkmn) {
        pokemonList.push(pkmn);
    }

    function showDetails(pkmn) {
        loadDetails(pkmn).then(function(){
            console.log(pkmn.name);
            document.querySelector('#pokemon-name').innerHTML = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
            document.querySelector('#pokemon-Title').innerHTML = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
            document.querySelector('#pokedex-number').innerHTML = '#' + pkmn.pokedexNumber;
            document.querySelector('#pokemon-height').innerHTML = pkmn.height;
            document.querySelector('#pokemon-type').innerHTML = pkmn.type;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            removePokeImage('pokemon-model');
            createPokeImage(pkmn.pokedexNumber, 'pokemon-model');
            playPokemonCry(pkmn.pokedexNumber);
        });
    }

    //writes down the pokemon in an order as buttons
    function addPokeButton(pkmn) {
        pokemonNameEntry = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1) + '<br>';

        let container = document.querySelector('.pokemon-entry');
        let button = document.createElement('button');

        document.querySelector('button');
        button.addEventListener('click', function () {
            showDetails(pkmn);
        });

        button.innerHTML = pokemonNameEntry;
        button.classList.add('dex-entry');
        container.appendChild(button);
    }


    return {
        getAll,
        add,
        addPokeButton,
        loadList,
        loadDetails,
        showDetails,
    }
})();

//function for removing the image of the pokemon so they don't infinitely stack down.
function removePokeImage(containerDiv) {
    var img = document.getElementById(containerDiv);
    img.innerHTML = '';
}

//function for adding in the pictures for pokemon
function createPokeImage(pokeID, containerDiv) {
    var pokeImage = document.createElement('img');
    if(pokeID > 99){
        pokeID;
    }
    else if (pokeID <= 99 && pokeID >= 10){
        pokeID = '0'+ pokeID;
    }
    else {
        pokeID = '00' + pokeID;
    }
        pokeImage.srcset = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`
        var div = document.getElementById(containerDiv);
        div.appendChild(pokeImage);
        pokeImage.setAttribute('id', 'pokeImage');
}
    

//function that triggers a pokemon's voice when summoned
function playPokemonCry(pokeID) {
    let pureNumber = Number(pokeID);
    var pokeCry = new Audio(`assets/cries/${pureNumber}.wav`);
    pokeCry.play();
}

function missingNo(containerDiv) {
    var missingNo = document.createElement('img');
    missingNo.src = `assets/missingno.jpg`
    var div = document.getElementById(containerDiv);
    div.appendChild(missingNo);
    missingNo.setAttribute('id', 'missingNo');
}


//This code checks for when the user clicks the button then executes the following code when the user does.
document.querySelector('button').addEventListener('click', () => {
    //This is the pokemon that is typed in the textbox
    let pokemonInputted = document.querySelector('#Pokemon').value;
                
    //This is here to make it case insensitive
    let currentPokemon = pokemonInputted.toLowerCase();

    //capitalizes the pokemon's name in the title and pokedex entry
    let properCase = currentPokemon.charAt(0).toUpperCase() + currentPokemon.substring(1);

    function pokemonStats(list, pkmn) {
        loadDetails(pkmn).then(function(){
            const selected= list.find(item => item.name == currentPokemon)
            if (selected) {
                if (selected.name === currentPokemon) {
                    console.log(selected)
                    document.querySelector('#pokemon-name').innerHTML = properCase;
                    document.querySelector('#pokemon-Title').innerHTML = properCase;
                    document.querySelector('#pokedex-number').innerHTML = '#' + pkmn.pokedexNumber;
                    document.querySelector('#pokemon-height').innerHTML = pkmn.height;
                    document.querySelector('#pokemon-type').innerHTML = pkmn.types;
                    pokemonFound = true;
                    removePokeImage('pokemon-model');
                    createPokeImage(pkmn.pokedexNumber, 'pokemon-model');
                    playPokemonCry(pkmn.pokedexNumber);
                    console.log(pkmn.pokedexNumber);
                }
            }
            else {
                console.log(selected)
                document.querySelector('#pokemon-Title').innerText = properCase;
                document.querySelector('#pokemon-name').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
                document.querySelector('#pokedex-number').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
                document.querySelector('#pokemon-height').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
                document.querySelector('#pokemon-type').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
                removePokeImage('pokemon-model');
                missingNo('pokemon-model');
            }
        });
    }
    //executes Function
    pokemonRepository.loadList().then(function() {
        pokemonStats(pokemonRepository.getAll(),pkmn);
    })
});


//forEach loop which checks for height and gives values for each pokemons' properties
pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function (pkmn) {
        pokemonRepository.addPokeButton(pkmn)
    })
});

