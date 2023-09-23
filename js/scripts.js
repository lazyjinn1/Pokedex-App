//empty variables used as placeholders for writing everything down onto a list form on the HTML page
var pokemonNameEntry = '';
var pokemonImgEntry = '';
var pokemonNumberEntry = '';
var pokemonHeightEntry = '';
var pokemonTypeEntry = '';

let pokemonRepository = (function () {

    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=649';

    //loads pokemon list from pokeAPI and pushes it to our pokemonList Array with name and detailsUrl properties
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (pkmn) {
                pkmn = {
                    name: pkmn.name,
                    detailsUrl: pkmn.url,
                };
                add(pkmn);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    //returns data about pokemon. Used in combination with for each to display all information about a pokemon needed.
    function loadDetails(pkmn) {
        let url = pkmn.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            pkmn.imageUrl = details.sprites.front_default;
            pkmn.height = details.height;
            pkmn.pokedexNumber = details.id;
            pkmn.type = details.types;
        }).catch(function (e) {
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

    //Used in combination with loadDetails. This is the "effect" of clicking one of the buttons on the pokeList
    function showDetails(pkmn) {
        loadDetails(pkmn).then(function () {
            let pkmnNameProperCase = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
            //console.log(pkmn.name);
            document.querySelector('#pokemon-name').innerHTML = pkmnNameProperCase;
            document.querySelector('#pokemon-Title').innerHTML = pkmnNameProperCase;
            document.querySelector('#pokedex-number').innerHTML = '#' + pkmn.pokedexNumber;
            document.querySelector('#pokemon-height').innerHTML = pkmn.height + ' dm';
            if (pkmn.type.length > 1) {
                document.querySelector('#pokemon-type').innerHTML = 
                    pkmn.type[0].type.name.charAt(0).toUpperCase() + pkmn.type[0].type.name.substring(1)
                    + ' and ' +
                    pkmn.type[1].type.name.charAt(0).toUpperCase() + pkmn.type[1].type.name.substring(1);

            }
            else {
                document.querySelector('#pokemon-type').innerHTML = 
                    pkmn.type[0].type.name.charAt(0).toUpperCase() + pkmn.type[0].type.name.substring(1);
            }
            //console.log(pkmn.type);  

            //scrolls to the top when a button is clicked
            document.body.scrollTop = document.documentElement.scrollTop = 0;

            removePokeImage('pokemon-model');
            createPokeImage(pkmn.pokedexNumber, 'pokemon-model');
            playPokemonCry(pkmn.pokedexNumber);
        });
    }

    //writes down the pokemon in an order as buttons
    function addPokeButton(pkmn) {
        loadDetails(pkmn).then(function () {
            pokemonNameEntry = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
            //console.log(pkmn.pokedexNumber);

            let container = document.querySelector('.pokemon-entry');
            let button = document.createElement('button');
            let img = document.createElement('img');

            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.pokedexNumber}.png`;

            button.classList.add('dex-entry');
            img.classList.add('pokemon-sprites');

            if(pokemonNameEntry.indexOf('-')===-1){
                button.innerText = pokemonNameEntry
            }
            else{
                button.innerText = pokemonNameEntry.slice(0, pokemonNameEntry.indexOf('-'));
            }
            button.appendChild(img);
            container.appendChild(button);

            document.querySelector('button');
            button.addEventListener('click', function () {
                showDetails(pkmn);
            });
        })
    }

    //CURRENTLY BROKEN
    // function pokemonStats(pkmn) {
    //     loadDetails(pkmn).then(function(){
    //         const selected= pkmn.find(item => item.name == currentPokemon)
    //         if (selected) {
    //             if (selected.name === currentPokemon) {
    //                 console.log(selected)
    //                 alert('success');
    //                 document.querySelector('#pokemon-name').innerHTML = properCase;
    //                 document.querySelector('#pokemon-Title').innerHTML = properCase;
    //                 document.querySelector('#pokedex-number').innerHTML = '#' + pkmn.pokedexNumber;
    //                 document.querySelector('#pokemon-height').innerHTML = pkmn.height;
    //                 document.querySelector('#pokemon-type').innerHTML = pkmn.types;
    //                 removePokeImage('pokemon-model');
    //                 createPokeImage(pkmn.pokedexNumber, 'pokemon-model');
    //                 playPokemonCry(pkmn.pokedexNumber);
    //                 console.log(pkmn.pokedexNumber);
    //             }
    //         }
    //         else {
    //             alert(selected);
    //             document.querySelector('#pokemon-Title').innerText = 'missingNo';
    //             document.querySelector('#pokemon-name').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
    //             document.querySelector('#pokedex-number').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
    //             document.querySelector('#pokemon-height').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
    //             document.querySelector('#pokemon-type').innerText = 'ERROR. ' + currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
    //             removePokeImage('pokemon-model');
    //             missingNo('pokemon-model');
    //         }
    //     });
    //}

    return {
        getAll,
        add,
        addPokeButton,
        loadList,
        loadDetails,
        showDetails,
        //pokemonStats
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
    if (pokeID > 99) {
        pokeID;
    }
    else if (pokeID <= 99 && pokeID >= 10) {
        pokeID = '0' + pokeID;
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

// CURRENTLY BROKEN
// //This code checks for when the user clicks the button then executes the following code when the user does.
// document.querySelector('button').addEventListener('click', () => {
//     //This is the pokemon that is typed in the textbox
//     let pokemonInputted = document.querySelector('#Pokemon').value;

//     //This is here to make it case insensitive
//     let currentPokemon = pokemonInputted.toLowerCase();
//     //capitalizes the pokemon's name in the title and pokedex entry
//     let properCase = currentPokemon.charAt(0).toUpperCase() + currentPokemon.substring(1);

//     pokemonRepository.loadList(pkmn).then(function() {
//         pokemonRepository.pokemonStats(pokemonRepository.getAll(),currentPokemon);
//     })

//     return properCase;
// });


//forEach loop which checks for height and gives values for each pokemons' properties
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pkmn) {
        pokemonRepository.addPokeButton(pkmn)
    })
});

