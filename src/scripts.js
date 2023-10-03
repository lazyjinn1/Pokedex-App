//IIFE that contains most of the pokemonRepository functions
let pokemonRepository = (function () {

    //this is my main array. It starts empty but is filled in using a combination of loadlist() and add()
    let pokemonList = [];

    //general sounds used throughout project
    let error = new Audio(`assets/error.mp3`)
    let exit = new Audio(`assets/exit.mp3`)
    let beep = new Audio(`assets/beep.mp3`)

    //general sound function
    function Sound(file) {
        let sound = file;
        sound.play();
        sound.volume = 0.1;
        if (sound.currentTime === 0) {
            sound.remove();
        }
    }

    //loads pokemon list from pokeAPI and pushes it to our pokemonList Array with name and detailsUrl properties
    async function loadList(start, end) {
        pokemonList = [];
        const apiUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${start}&limit=${end}`;
        try {
            const res = await fetch(apiUrl);
            const json = await res.json();
            for (const result of json.results) {
                add({
                    name: result.name,
                    detailsUrl: result.url
                });
            }
        } catch (error) {
            console.error(error);
        };
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
                //Lines 53-61 is there because I needed to filter out the english pokemon 'genus' and 'flavor_texts' for my modal
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
                let pokemonNameEntry = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
                let container = document.querySelector('.list-group');

                //creating new elements
                let li = document.createElement('li');
                let button = document.createElement('button');
                let img = document.createElement('img');

                //This is the source I used for the sprites
                img.src = pkmn.imageUrl;

                //adding classes to my newly created elements
                li.classList.add('list-group-item');
                button.classList.add('dex-entry');
                img.classList.add('pokemon-sprites');
                button.innerText = pokemonNameEntry;

                //sticking everything together!
                button.appendChild(img);
                li.appendChild(button);
                container.appendChild(li);

                //adding an event to the newly created button
                document.querySelector('button');
                button.addEventListener('click', function () {
                    showDetails(pkmn);
                    //this automatically scrolls to the top so that you don't have to scroll to the top yourself.
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                });
            });
        }

        //Used in combination with loadDetails. This is the main function of the app. Details pokemon
        function showDetails(pkmn) {
            loadDetails(pkmn).then(function () {

                //This is because for some reason there are random arrows and line breaks in the flavor text
                let pkmnEntryFixed = pkmn.pkdxEntry.replace(/(\n|\f)/gm, " ");

                //simply adds 'The' before the pokemon's genus
                let pokemonGenusEntry = 'The ' + pkmn.pkdxTitle;

                //Capitalizes every pokemon's name
                let pkmnNameProperCase = pkmn.name.charAt(0).toUpperCase() + pkmn.name.substring(1);
                //console.log(pkmn.name);
                document.querySelector('#pokemon-name').innerText = 'Pokemon Name: ' + pkmnNameProperCase;
                document.querySelector('#pokemon-Title').innerText = pkmnNameProperCase;
                document.querySelector('#pokedex-number').innerText = 'Pokedex #: ' + pkmn.pokedexNumber;
                document.querySelector('#pokemon-height').innerText = 'Height: ' + pkmn.height / 10 + ' m';

                //If a pokemon has more than 1 type, this writes down both types.
                if (pkmn.type.length > 1) {
                    document.querySelector('#pokemon-type').innerText =
                        'Types: ' +
                        pkmn.type[0].type.name.charAt(0).toUpperCase() + pkmn.type[0].type.name.substring(1)
                        + ' and ' +
                        pkmn.type[1].type.name.charAt(0).toUpperCase() + pkmn.type[1].type.name.substring(1);
                }

                //if it only has one, then it only writes the first (and only) type.
                else {
                    document.querySelector('#pokemon-type').innerText =
                        'Type: ' +
                        pkmn.type[0].type.name.charAt(0).toUpperCase() + pkmn.type[0].type.name.substring(1);
                }

                //this removes any potential images still present in the app from a previous entry
                removePokeImage('pokemon-model');
                //this creates a new pokemon image based on the new pokemon and where it shows
                createPokeImage(pkmn.pokedexNumber, 'pokemon-model');
                //this plays a distinct pokemon cry
                playPokemonCry(pkmn.pokedexNumber);
                //this adds a function to the show modal button which displays more info about the pokemon
                document.querySelector('.show-modal').addEventListener('click', () => {
                    showModal(pkmnNameProperCase, pokemonGenusEntry, pkmnEntryFixed, pkmn.pokedexNumber);
                });
            });
        }

        //function for when the modal pops up.
        function showModal(title, genus, text, pokeID) {

            //quick little beep sound effect to showcase opening modal
            Sound(beep);
            let modalContainer = document.querySelector('#modal-container');

            // Clear all existing modal content
            modalContainer.innerHTML = '';

            let modal = document.createElement('div');
            modal.classList.add('modal');

            // This is the button that closes the modal for me
            let closeButtonElement = document.createElement('button');
            closeButtonElement.classList.add('close-modal');
            closeButtonElement.innerText = ' X ';
            closeButtonElement.addEventListener('click', () => {
                hideModal();
            });


            //this closes when user presses Escape
            window.addEventListener('keydown', (e) => {
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

            //this adds the picture to the modal. This if-else statement is there because the pokemon source is written
            //with 3 digit notation (e.g. 003 instead of 3 like in pokeAPI). so it's there to fulfill that.
            if (pokeID > 99) {
                pokeID;
            }
            else if (pokeID <= 99 && pokeID >= 10) {
                pokeID = '0' + pokeID;
            }
            else {
                pokeID = '00' + pokeID;
            }

            //lets create some elements!!!
            let pictureElement = document.createElement('img');
            pictureElement.src = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`;
            pictureElement.classList.add('modal-picture');

            let titleElement = document.createElement('h1');
            titleElement.innerText = title;

            let genusElement = document.createElement('h2');
            genusElement.innerText = genus;

            let contentElement = document.createElement('p');
            contentElement.innerText = text;
            contentElement.classList.add('modal-content');

            //NOW LETS STICK EVERYTHING TOGETHER
            modal.appendChild(closeButtonElement);
            modal.appendChild(titleElement);
            modal.appendChild(genusElement);
            modal.appendChild(contentElement);
            modal.appendChild(pictureElement);
            modalContainer.appendChild(modal);

            //Now modal is visible!
            modalContainer.classList.add('is-visible');
        }

        //function to hide the modal- Goodbye Modal
        function hideModal() {
            let modalContainer = document.querySelector('#modal-container');
            modalContainer.classList.remove('is-visible');
            Sound(exit);
        }

        function removePokeButtons() {
            let buttons = document.querySelectorAll('.dex-entry');
            let elements = document.querySelectorAll('.list-group-item')
            for (let i = 0; i < buttons.length; i++) {
                const elem = buttons[i];
                elem.parentNode.removeChild(elem);
                pokemonList = [];
            }
            for (let i = 0; i < elements.length; i++) {
                const elem = elements[i];
                elem.parentNode.removeChild(elem);
                pokemonList = [];
            }
            pokemonList = [];
        }

        function generationCheck(a, b) {
            Sound(beep);
            removePokeButtons();
            loadList(a, b).then(function loadDetails() {
                getAll().forEach(function (pkmn) {
                    addPokeButton(pkmn);
                });
            });
        };



        //RETURN ALL THE THINGS.
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
            generationCheck,
            error,
            beep,
            exit,
        };
    }) ();

    //function for removing the image of the pokemon so they don't infinitely stack down.
    function removePokeImage(containerDiv) {
        let img = document.getElementById(containerDiv);
        img.innerHTML = '';
    }

    //function for adding in the pictures for pokemon. 
    //This is the same URL as the one on the showModal so thats why its here again
    function createPokeImage(pokeID, containerDiv) {
        let pokeImage = document.createElement('img');
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
        let div = document.getElementById(containerDiv);
        div.appendChild(pokeImage);

        //gives pokeImage, the class = 'pokeImage', I know unique right?
        pokeImage.setAttribute('class', 'pokeImage');
    }

    //function that triggers a pokemon's voice when summoned
    //pureNumber is called because this one WANTS pure number notation, so it wants '1' and not 001.
    function playPokemonCry(pokeID) {
        let pureNumber = Number(pokeID);
        let pokeCry = new Audio(`assets/cries/${pureNumber}.wav`);
        pokeCry.play();
        pokeCry.volume = 0.7;
    }

    // forEach loop which checks for pokemon's details and makes a custom button for it.
    pokemonRepository.loadList(0, 151).then(function () {
        pokemonRepository.getAll().forEach(function (pkmn) {
            pokemonRepository.addPokeButton(pkmn);
        });
    });

    //function that triggers missingNo to appear if the search is invalid
    function missingNo(input, containerDiv) {
        removePokeImage(containerDiv);
        let missingNo = document.createElement('img');
        missingNo.src = `assets/missingno.png`;
        missingNo.setAttribute('class', 'pokeImage');
        let div = document.getElementById(containerDiv);
        div.appendChild(missingNo);

        document.querySelector('#pokemon-name').innerHTML = 'ERROR ' + input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
        document.querySelector('#pokemon-Title').innerHTML = 'MissingNo.';
        document.querySelector('#pokedex-number').innerHTML = 'ERROR ' + input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
        document.querySelector('#pokemon-height').innerHTML = 'ERROR ' + input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
        document.querySelector('#pokemon-type').innerHTML = 'ERROR ' + input.toUpperCase() + ' IS NOT AN AVAILABLE POKEMON';
    }

    //adds an event listener to the search button using filters to find the pokemon
    let searchButton = document.getElementById('search');
    if (searchButton) {
        searchButton.addEventListener('click', function () {
            //searchInput is whatever you write into the text box in the intro!
            let searchInput = document.getElementById('search-input').value;
            //if search input is empty then missingNo comes out and error sound plays
            if (searchInput === "") {
                missingNo(searchInput, 'pokemon-model');
                pokemonRepository.Sound(pokemonRepository.error);
            }
            //if alls well and you actually wrote something then we go through this!
            else {
                //we retrieve the main pokemon array, pokemonRepository.getAll() and call it pokemonList
                let pokemonList = pokemonRepository.getAll();
                //we then filter said list so that we only return pokemon that have the same name as our search!
                let filteredPokemonList = pokemonList.filter(function (pkmn) {
                    return (pkmn.name.toLowerCase() === searchInput.toLowerCase());
                });
                //Now if that filtered array is 0 (because the filter couldn't find any pokemon), then missingNo will come back
                if (filteredPokemonList.length === 0) {
                    missingNo(searchInput, 'pokemon-model');
                    pokemonRepository.Sound(pokemonRepository.error);

                } else {
                    //If the filter DID find a pokemon then this will show the details of said
                    filteredPokemonList.forEach(function (pkmn) {
                        pokemonRepository.showDetails(pkmn);
                    });

                    //after a new pokemon is spawned, the search input is reset back to empty.
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

    //creates a button that randomizes the current pokemon. Have fun! This is a self-sufficient function btw
    (function randomButton() {
        let randomButton = document.querySelector('.randomizer');
        randomButton.addEventListener('click', function () {
            //This works by calling our main array, pokemonRepository.getAll(), and making it multiple the length of it by 
            //Math.random which calls a random number between 0 and 1. Math.floor rounds down the answer, which 
            //calls the random pokemon as a showDetails.
            let random = pokemonRepository.getAll()[Math.floor(Math.random() * pokemonRepository.getAll().length)];
            pokemonRepository.showDetails(random);
        });
    }());


    let button1 = document.querySelector('#gen-one');
    button1.addEventListener('click', function () {
        pokemonRepository.generationCheck(0, 151)
    });


    let button2 = document.querySelector('#gen-two');
    button2.addEventListener('click', function () {
        pokemonRepository.generationCheck(151, 100)
    });


    let button3 = document.querySelector('#gen-three');
    button3.addEventListener('click', function () {
        pokemonRepository.generationCheck(251, 135)
    });


    let button4 = document.querySelector('#gen-four');
    button4.addEventListener('click', function () {
        pokemonRepository.generationCheck(386, 107)
    });


    let button5 = document.querySelector('#gen-five');
    button5.addEventListener('click', function () {
        pokemonRepository.generationCheck(493, 156)
    });
