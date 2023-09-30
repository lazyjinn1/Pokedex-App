//IIFE that contains most of the pokemonRepository functions
var pokemonRepository = (function () {

    var pokemonList = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

    //general sounds used throughout project
    var error = new Audio(`assets/error.mp3`)
    var exit = new Audio(`assets/exit.mp3`)
    var beep = new Audio(`assets/beep.mp3`)

    //general sound function
    function Sound(file) {
        var sound = file;
        sound.play();
        sound.volume = 0.1;
        if (sound.currentTime === 0) {
            sound.remove();
        }
    }

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
        var url = pkmn.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(async function (details) {
            pkmn.imageUrl = details.sprites.front_default;
            pkmn.height = details.height;
            pkmn.pokedexNumber = details.id;
            pkmn.type = details.types;
            pkmn.speciesUrl = details.species.url;
            return fetch(pkmn.speciesUrl).then(function (response) {
                return response.json();
            }).then(function (details1) {
                const filteredFlavorText = details1.flavor_text_entries.filter((a) => a.language.name === "en");
                const filteredTitleText = details1.genera.filter((a) => a.language.name === "en");

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
            var pokemonNameEntry = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
            var container = document.querySelector('.list-group');
            var li = document.createElement('li');
            var button = document.createElement('button');
            var img = document.createElement('img');

            pokemonList.sort((a, b) => a.pokedexNumber - b.pokedexNumber);

            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pkmn.pokedexNumber}.png`;

            li.classList.add('list-group-item');
            button.classList.add('btn-primary');
            img.classList.add('pokemon-sprites');

            if (pokemonNameEntry.indexOf('-') === -1) {
                button.innerText = pokemonNameEntry;
            }
            else {
                button.innerText = pokemonNameEntry.slice(0, pokemonNameEntry.indexOf('-'));
            }
            button.appendChild(img);
            li.appendChild(button);
            container.appendChild(li);

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
            var pkmnEntryFixed = pkmn.pkdxEntry.replace(/(\n|\f)/gm, " ");
            var pokemonGenusEntry = 'The ' + pkmn.pkdxTitle;

            var pkmnNameProperCase = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
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

    //function for when the modal pops up.
    function showModal(title, genus, text, pokeID) {
        Sound(beep);
        var modalContainer = document.querySelector('#modal-container');

        // Clear all existing modal content
        modalContainer.innerHTML = '';

        var modal = document.createElement('div');
        modal.classList.add('modal');

        // Add the new modal content
        var closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('close-modal');
        closeButtonElement.innerText = ' X ';
        closeButtonElement.addEventListener('click', () => {
            hideModal();
        });


        //this closes when user presses Escape
        window.addEventListener('keydown', (e) => {
            var modalContainer = document.querySelector('#modal-container');
            if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
                hideModal();
            }
        });
        //this closes when user clicks outside window
        modalContainer.addEventListener('click', (e) => {
            var target = e.target;
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
        var pictureElement = document.createElement('img');
        pictureElement.src = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`;
        pictureElement.classList.add('modal-picture');

        var titleElement = document.createElement('h1');
        titleElement.innerText = title;

        var genusElement = document.createElement('h2');
        genusElement.innerText = genus;

        var contentElement = document.createElement('p');
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
        var modalContainer = document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
        Sound(exit);
    }


    return {
        getAll,
        add,
        addPokeButton,
        loadList,
        loadDetails,
        showDetails,
        showModal,
        hideModal,
        Sound,
        error,
        beep,
        exit,
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
    var pureNumber = Number(pokeID);
    var pokeCry = new Audio(`assets/cries/${pureNumber}.wav`);
    pokeCry.play();
    pokeCry.volume = 0.7;
}

//forEach loop which checks for pokemon's details and makes a custom button for it.
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pkmn) {
        pokemonRepository.addPokeButton(pkmn);
    });
});

//function that triggers missingNo to appear if the search is invalid
function missingNo(input, containerDiv) {
    removePokeImage(containerDiv);
    var missingNo = document.createElement('img');
    missingNo.src = `assets/missingno.png`;
    missingNo.setAttribute('class', 'pokeImage');
    var div = document.getElementById(containerDiv);
    div.appendChild(missingNo);

    document.querySelector('#pokemon-name').innerHTML = 'ERROR ' + input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
    document.querySelector('#pokemon-Title').innerHTML = 'MissingNo.';
    document.querySelector('#pokedex-number').innerHTML = 'ERROR ' + input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
    document.querySelector('#pokemon-height').innerHTML = 'ERROR ' + input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
    document.querySelector('#pokemon-type').innerHTML = 'ERROR ' + input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
}

//adds an event listener to the search button using filters to find the pokemon
var searchButton = document.getElementById('search');
if (searchButton) {
    searchButton.addEventListener('click', function () {
        var searchInput = document.getElementById('search-input').value;
        if (searchInput === "") {
            missingNo(searchInput, 'pokemon-model');
            pokemonRepository.Sound(pokemonRepository.error);
        }
        else {
            var pokemonList = pokemonRepository.getAll();
            var filteredPokemonList = pokemonList.filter(function (pkmn) {
                return pkmn.name.toLowerCase().includes(searchInput.toLowerCase());
            });
            if (filteredPokemonList.length === 0) {
                missingNo(searchInput, 'pokemon-model');
                pokemonRepository.Sound(pokemonRepository.error);
            } else {
                filteredPokemonList.forEach(function (pkmn) {
                    pokemonRepository.showDetails(pkmn);
                });
                document.getElementById('search-input').value = '';
            }
        }
    })
}

//this enables pressing enter to submit instead of clicking the button
$('#search-input').keypress(function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        $('#search').click();
    }
});

//creates a button that randomizes the current pokemon. Have fun!
(function randomButton() {
    var randomButton = document.querySelector('.randomizer');
    randomButton.addEventListener('click', function () {
        var random = pokemonRepository.getAll()[Math.floor(Math.random() * pokemonRepository.getAll().length)];
        console.log(random.name);
        pokemonRepository.showDetails(random);
    });
}());
