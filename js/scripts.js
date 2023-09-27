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
            document.body.scrollTop = document.documentElement.scrollTop = 0;

            removePokeImage('pokemon-model');
            createPokeImage(pkmn.pokedexNumber, 'pokemon-model');
            playPokemonCry(pkmn.pokedexNumber);

            showModal(pkmnNameProperCase, pkmn.height, pkmn.pokedexNumber);
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


    function showModal(title, text, pokeID) {
        let modalContainer = document.querySelector('#modal-container');
      
        // Clear all existing modal content
        modalContainer.innerHTML = '';
      
        let modal = document.createElement('div');
        modal.classList.add('modal');
      
        // Add the new modal content
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('close-modal');
        closeButtonElement.innerText = 'Close Modal';
        closeButtonElement.addEventListener('click', hideModal);

        //this closes when user presses Escape
        window.addEventListener('keydown', (e) => {
            let modalContainer = document.querySelector('#modal-container');
            if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
              hideModal();  
            }
        });
        //this closes when user clicks outside window
        modalContainer.addEventListener('click', (e) => {
            let target = e.target;
            if (target === modalContainer) {
              hideModal();
            }
        });

        //this adds the picture to the modal
        if (pokeID > 99) {
            pokeID;
        }
        else if (pokeID <= 99 && pokeID >= 10) {
            pokeID = '0' + pokeID;
        }
        else {
            pokeID = '00' + pokeID;
        }
        let pictureElement = document.createElement('img')
        pictureElement.src = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`
        pictureElement.classList.add('modal-picture');

        let titleElement = document.createElement('h1');
        titleElement.innerText = title;
      
        let contentElement = document.createElement('p');
        contentElement.innerText = text;
      
        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(contentElement);
        modal.appendChild(pictureElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
    }

    function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }

    document.querySelector('.show-modal').addEventListener('click', () => {
        showModal('Modal title', 'This is the modal content!');
    });

    

    return {
        getAll,
        add,
        addPokeButton,
        loadList,
        loadDetails,
        showDetails,
        //pokemonStats,
        showModal,
        hideModal,
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

//This code checks for when the user clicks the button then executes the following code when the user does.
// document.querySelector('button').addEventListener('click', () => {
//     //This is the pokemon that is typed in the textbox
//     let pokemonInputted = document.querySelector('#Pokemon').value;

//     //This is here to make it case insensitive
//     let currentPokemon = pokemonInputted.toLowerCase();
//     //capitalizes the pokemon's name in the title and pokedex entry
//     let properCase = currentPokemon.charAt(0).toUpperCase() + currentPokemon.substring(1);

//     pokemonRepository.loadList(currentPokemon).then(function() {
//         pokemonRepository.loadDetails(currentPokemon).then(function(){
//             pokemonRepository.pokemonStats(pokemonRepository.getAll(),currentPokemon);
//         })
//     })

//     return properCase;
// });


//forEach loop which checks for height and gives values for each pokemons' properties
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pkmn) {
        pokemonRepository.addPokeButton(pkmn)
    })
});

