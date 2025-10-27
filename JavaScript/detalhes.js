obterInformacoesPokemom(urlPokemom())
.then(dados => {
    carregarInformacoesPokemoms(dados);
});


// Retorna qual pokemom foi enviado na url
function urlPokemom(){
    const queryUrl = window.location.search;
    const parametrosUrl = new URLSearchParams(queryUrl);
    const pokemom = parametrosUrl.get('pokemom');

    return pokemom;
}

async function obterInformacoesPokemom(pokemom){
    try{
       const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemom}`);
       if(!res.ok){
        throw new Error("Pokemom Nao Encontrado");
       }

       const resposta = await res.json();
       return resposta;
       
    }
    catch(e){
        alert("Não Foi Possível Carregar Pokemom!: " + e);
    }
}

function carregarInformacoesPokemoms(pokemom){
    let evolucoes;
    document.getElementsByClassName("pokedex")[0].classList.add(pokemom.types[0].type.name);
    document.getElementsByClassName("pokedex-info")[0].classList.add(pokemom.types[0].type.name);
    document.getElementsByClassName("comparar")[0].classList.add(pokemom.types[0].type.name);

    Array.from(document.getElementsByClassName("nome")).forEach(nome => {
        nome.textContent = pokemom.name;
    });
    document.getElementById("poke-img").src = pokemom.sprites.other["official-artwork"].front_default;
    Array.from(document.getElementsByClassName("type")).forEach(tipo => {
        tipo.textContent = pokemom.types[0].type.name;
    })
    document.getElementById("weight").textContent = pokemom.weight/10;
    document.getElementById("height").textContent = pokemom.height/10;

    fetch(`${pokemom.species.url}`)
        .then( resposta => resposta.json())
        .then( resposta => {
            document.getElementById('descricao').textContent = resposta.flavor_text_entries.find(f => f.language.name == 'en').flavor_text;
            carregarCadeiaDeEvo(resposta.evolution_chain.url)
            .then(evos => {
                let evo = [];
                let htmlEvolucoes = document.getElementsByClassName("evo");

                evo[0] = evos.chain.species.name;
                evo[1] = evos.chain.evolves_to[0].species.name;
                evo[2] = evos.chain.evolves_to[0].evolves_to[0].species.name;
                
                Array.from(evo).forEach((ev, index) => {
                    obterInformacoesPokemom(ev)
                    .then(dados => {
                        htmlEvolucoes[index].src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dados.id}.png`;
                    });
                })
            })
        });
}

async function carregarCadeiaDeEvo(url){
    try{
        const res = await fetch(url);

        if(!res.ok){
            throw new Error("Não foi possível carregar Evoluções");
        }

        const evolucoes = await res.json();
        return evolucoes;
    }
    catch(e){
        console.log(e);
    }
}