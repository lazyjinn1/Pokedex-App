let pokemonRepository = (function(){
    let pokemonList = [
    
        {name: 'bulbasaur', pokedexNumber: '001', weight: 15, type: ['Grass','Poison'], evolvesInto: 'ivysaur'},
        {name: 'charmander',  pokedexNumber: '004', weight: 19, type: 'Fire', evolvesInto: 'charmeleon'},
        {name: 'squirtle', pokedexNumber: '007', weight: 19.8, type: 'Water', evolvesInto: 'wartortle'},
        {name: 'pikachu', pokedexNumber: '025', weight: 13, type: 'Electric', evolvesInto: 'raichu'},
        {name: 'eevee', pokedexNumber: '133', weight: 14, type: 'Normal', evolvesInto: ['jolteon','vaporeon','flareon','umbreon','espeon','leafeon','glaceon','sylveon']},
        {name: 'nidoking', pokedexNumber: '034', weight: 137, type: ['Poison','Ground']},
        {name: 'nidoqueen', pokedexNumber: '031', weight: 132, type: ['Poison','Ground']},
        {name: 'chikorita', pokedexNumber: '152', weight: 14, type: 'Grass', evolvesInto: 'bayleaf'},
        {name: 'cyndaquil',  pokedexNumber: '155', weight: 17, type: 'Fire', evolvesInto: 'quilava'},
        {name: 'totodile', pokedexNumber: '158', weight: 21, type: 'Water', evolvesInto: 'crocanaw'},
        {name: 'pichu', pokedexNumber: '172', weight: 4.4, type: 'Electric', evolvesInto: 'pikachu'},
        {name: 'umbreon', pokedexNumber: '197', weight: 60, type: 'Dark'},
        {name: 'espeon', pokedexNumber: '196', weight: 58, type: 'Psychic'},
        {name: 'steelix', pokedexNumber: '208', weight: 885, type: ['Steel','Ground']}
    ]
    //returns full pokemonList
    function getAll(){
        return pokemonList;
    }

    //allows you to add pokemon into the array
    function add(pokemon){
            pokemonList.push(pokemon);
    }

    return {
        getAll,
        add
    }
})();

//testing the add function (Question for Mentor/Tutor, "Why can't I add both of them in on the same add()?")
pokemonRepository.add(
    {name:'mewtwo', pokedexNumber:'150', weight: 269, type: 'Psychic'},
);
pokemonRepository.add(
    {name:'mew', pokedexNumber:'151', weight: 8.8, type: 'Psychic'}
);


//This code checks for when the user clicks the button then executes the following code when the user does.
document.querySelector('button').addEventListener('click',()=>{

    //function for removing the image of the pokemon so they don't infinitely stack down.
    function removePokeImage(containerDiv){
        var img = document.getElementById(containerDiv);
        img.innerHTML = ''; 
    }

    //function for adding in the pictures for pokemon
    function createPokeImage(pokeID, containerDiv){
        var pokeImage = document.createElement('img');
        pokeImage.srcset =`https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${pokeID}.png`
        var div = document.getElementById(containerDiv);
        div.appendChild(pokeImage);
        console.log(div);
    }

    function playPokemonCry(pokeID){
        let pureNumber = Number(pokeID);
        var audio = new Audio(`assets/cries/${pureNumber}.wav`);
        audio.play();
    }

    //This is the pokemon that is typed in the textbox
    let pokemonInputted = document.querySelector('#Pokemon').value;
    //console.log(pokemonInputted);

    //This is here to make it case insensitive
    let currentPokemon = pokemonInputted.toLowerCase();
    //console.log(currentPokemon);

    //capitalizes the pokemon's name in the title and pokedex entry
    let properCase = currentPokemon.charAt(0).toUpperCase() + currentPokemon.substring(1);
    //console.log(properCase);

    var pokemonFound = false;

    //This function writes down the pokemon's pokedex #, weight, and type
    function pokemonStats(list){
        const selected = list.find(item => item.name==currentPokemon)
        if(selected){
            if (selected.name === currentPokemon) 
            {
                console.log(selected)
                document.querySelector('#pokemon-name').innerText = properCase;
                document.querySelector('#pokemon-Title').innerText = properCase;
                document.querySelector('#pokedex-number').innerText = '#' + selected.pokedexNumber;
                document.querySelector('#pokemon-weight').innerText = selected.weight + ' lbs';
                document.querySelector('#pokemon-type').innerText = selected.type;
                pokemonFound = true;
                removePokeImage('pokemon-model');
                createPokeImage(selected.pokedexNumber,'pokemon-model');
                playPokemonCry(selected.pokedexNumber);
                console.log(selected.pokedexNumber)
            }
        }
            else{
                console.log(selected)
                document.querySelector('#pokemon-Title').innerText = properCase;
                document.querySelector('#pokemon-name').innerText = 'ERROR. '+ currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
                document.querySelector('#pokedex-number').innerText = 'ERROR. '+ currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
                document.querySelector('#pokemon-weight').innerText = 'ERROR. '+ currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
                document.querySelector('#pokemon-type').innerText = 'ERROR. '+ currentPokemon.toUpperCase() + ' IS NOT IN DATABASE.';
                removePokeImage('pokemon-model');
            }
    };
    //executes Function
    pokemonStats(pokemonRepository.getAll());;
});
//variables to measure lightness and heaviness
const lightPokemon = 20;
const heavyPokemon = 80;
const insanelyHeavyPokemon = 200;

//empty variable used as a placeholder for writing everything down onto a list form on the HTML page
var pokemon = '';

//forEach loop which checks for weight and gives values for each pokemons' properties
function pokedexEntry (list)
{
    list.forEach(function(pkmn){
        if(pkmn.weight >= insanelyHeavyPokemon){
            weightChecker = '(Good luck carrying this pokemon!)';
        }
        else if(pkmn.weight > heavyPokemon){
            weightChecker = '(This pokemon is heavy!)';
        }
        else if (pkmn.weight < heavyPokemon && pkmn.weight > lightPokemon){
            weightChecker = '(This pokemon is average)';
        }
        else{
            weightChecker = '(This pokemon is light!)';
        }

        pokemon += pkmn.name.charAt(0).toUpperCase()+ pkmn.name.substring(1) + weightChecker + '<br>' ;
        pokemon += 'Pokedex Number: #' + pkmn.pokedexNumber + '<br>';
        pokemon += pkmn.weight + ' lbs' + '<br>';
        pokemon += pkmn.type + '<br>' + '<br>' + '<br>';
        
        //add a class name 
        document.querySelector('.pokemon-entry').innerHTML = pokemon;
    }); 
}
console.log(pokemonRepository.getAll());
pokedexEntry(pokemonRepository.getAll());
