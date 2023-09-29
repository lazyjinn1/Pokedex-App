
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
        });
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
                pkmn.speciesUrl = details.species.url;
                return fetch (pkmn.speciesUrl).then(function(response){
                        return response.json();
                    }).then(function(details1){
                        const filteredFlavorText = details1.flavor_text_entries.filter((a)=>a.language.name === "en");
                        const filteredTitleText = details1.genera.filter((a)=>a.language.name === "en");
                        
                        pkmn.pkdxTitle = filteredTitleText[0].genus;
                        pkmn.pkdxEntry = filteredFlavorText[0].flavor_text;
                    });
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

       //writes down the pokemon in an order as buttons
    function addPokeButton(pkmn) {
        loadDetails(pkmn).then(function () {
            let pokemonNameEntry = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
            //console.log(pkmn.pokedexNumber);

            let container = document.querySelector('.pokemon-entry');
            let button = document.createElement('button');
            let img = document.createElement('img');

            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.pokedexNumber}.png`;

            button.classList.add('dex-entry');
            img.classList.add('pokemon-sprites');

            if (pokemonNameEntry.indexOf('-') === -1) {
                button.innerText = pokemonNameEntry;
            }
            else {
                button.innerText = pokemonNameEntry.slice(0, pokemonNameEntry.indexOf('-'));
            }
            button.appendChild(img);
            container.appendChild(button);

            document.querySelector('button');
            button.addEventListener('click', function () {
                showDetails(pkmn);
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });
        });
    }

    //Used in combination with loadDetails. This is the "effect" of clicking one of the buttons on the pokeList
    function showDetails(pkmn) {
        loadDetails(pkmn).then(function () {
            let pkmnEntryFixed = pkmn.pkdxEntry.replace(/(\n|\f)/gm," ");
            let pokemonGenusEntry = 'The ' + pkmn.pkdxTitle;

            let pkmnNameProperCase = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
            //console.log(pkmn.name);
            document.querySelector('#pokemon-name').innerHTML = pkmnNameProperCase;
            document.querySelector('#pokemon-Title').innerHTML = pkmnNameProperCase;
            document.querySelector('#pokedex-number').innerHTML = '#' + pkmn.pokedexNumber;
            document.querySelector('#pokemon-height').innerHTML = pkmn.height / 10 + ' m';

            

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
            removePokeImage('pokemon-model');
            createPokeImage(pkmn.pokedexNumber, 'pokemon-model');
            playPokemonCry(pkmn.pokedexNumber);
            document.querySelector('.show-modal').addEventListener('click', () => {
                showModal(pkmnNameProperCase, pokemonGenusEntry, pkmnEntryFixed, pkmn.pokedexNumber);
            });
        });
    }

    function showModal(title, genus, text, pokeID) {
        Sound('beep');
        let modalContainer = document.querySelector('#modal-container');

        // Clear all existing modal content
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

        // Add the new modal content
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('close-modal');
        closeButtonElement.innerText = ' X ';
        closeButtonElement.addEventListener('click', () => {
            hideModal();
        });
        

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
            if (target === modalContainer && modalContainer.classList.contains('is-visible')) {
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
        let pictureElement = document.createElement('img');
        pictureElement.src = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`;
        pictureElement.classList.add('modal-picture');

        let titleElement = document.createElement('h1');
        titleElement.innerText = title;

        let genusElement = document.createElement ('h2');
        genusElement.innerText = genus;

        let contentElement = document.createElement('p');
        contentElement.innerText = text;
        contentElement.classList.add('modal-content');

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(genusElement);
        modal.appendChild(contentElement);
        modal.appendChild(pictureElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
    }

    //function to hide the modal
    function hideModal() {
        let modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
        Sound('exit');
    }

    // function removepokeButtons(){
    //     $("ul li").removeClass( "dex-entry" ).addClass( "removed" );
    // }

    return {
        getAll,
        add,
        addPokeButton,
        loadList,
        loadDetails,
        showDetails,
        showModal,
        hideModal,
        //removepokeButtons
    };
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
    pokeImage.srcset = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`;
    var div = document.getElementById(containerDiv);
    div.appendChild(pokeImage);
    pokeImage.setAttribute('class', 'pokeImage');
}


//function that triggers a pokemon's voice when summoned
function playPokemonCry(pokeID) {
    let pureNumber = Number(pokeID);
    var pokeCry = new Audio(`assets/cries/${pureNumber}.wav`);
    pokeCry.play();
    pokeCry.volume = 0.7;
}

function Sound(file){
    var sound = new Audio(`assets/${file}.mp3`)
    sound.play();
    sound.volume = 0.1;
    if (sound.currentTime === 0){
        sound.remove();
    }
}

//forEach loop which checks for height and gives values for each pokemons' properties
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pkmn) {
        pokemonRepository.addPokeButton(pkmn);
    });
});

//function that triggers missingNo to appear if the search is invalid
function missingNo(input,containerDiv) {
    removePokeImage(containerDiv);
    var missingNo = document.createElement('img');
    missingNo.src = `assets/missingno.png`;
    missingNo.setAttribute('class', 'pokeImage');
    var div = document.getElementById(containerDiv);
    div.appendChild(missingNo);

    document.querySelector('#pokemon-name').innerHTML = 'ERROR '+ input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
    document.querySelector('#pokemon-Title').innerHTML = 'MissingNo.';
    document.querySelector('#pokedex-number').innerHTML = 'ERROR '+ input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
    document.querySelector('#pokemon-height').innerHTML = 'ERROR '+ input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
    document.querySelector('#pokemon-type').innerHTML = 'ERROR '+ input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
}

//adds an event listener to the search button using filters to find the pokemon
var searchButton = document.getElementById('search');
if(searchButton){
    searchButton.addEventListener('click', function() 
    {   
        var searchInput = document.getElementById('search-input').value;
        if (searchInput === ""){
            missingNo(searchInput,'pokemon-model');
            Sound('error');
        }
        else{
            var pokemonList = pokemonRepository.getAll();
            var filteredPokemonList = pokemonList.filter(function(pkmn) 
            {
                return pkmn.name.toLowerCase().includes(searchInput.toLowerCase());
            });
            if (filteredPokemonList.length === 0) {
                missingNo(searchInput,'pokemon-model');
                Sound('error');
            } else {
                filteredPokemonList.forEach(function(pkmn) {
                    pokemonRepository.showDetails(pkmn);
                });
            }
        }
    });
}

//creates a button that randomizes the current pokemon. Have fun!
(function randomButton(){
    let randomButton = document.querySelector('.randomizer');
    randomButton.addEventListener('click', function(){
        var random = pokemonRepository.getAll()[Math.floor(Math.random()*pokemonRepository.getAll().length)];
        console.log(random.name);
        pokemonRepository.showDetails(random);
    });
}());


// function generationOneFilter(pkmn){
//     return pkmn.pokedexNumber > 0 && pkmn.pokedexNumber < 152;
// }

// function generationOne(pkmn){
//     pokemonRepository.removepokeButtons();
//     var pokemonList = pokemonRepository.getAll();
//     var genOneList = pokemonList.filter(generationOne(pkmn))
//     genOneList.forEach(function(pkmn) {
//         pokemonRepository.addPokeButton(pkmn);
//     });
// }


