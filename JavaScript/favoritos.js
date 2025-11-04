import {carregarListaPokemons, carregarPokemom, criarCard} from "./pokedex.js";

const container = document.getElementsByClassName("paginacao-grid-container")[0];
let paginaAtual = 0;
let paginaAtualInput = document.getElementById("pagina-atual");
let proximo = document.getElementById("proxima");
let anterior = document.getElementById("anterior");
let favoritos = JSON.parse(localStorage.getItem("favoritosPokemons")) || [];
let tipoAtual = "todos";

document.addEventListener("DOMContentLoaded", () => {
    paginaAtualInput.value = paginaAtual + 1;
    atualizarPaginaFavoritos();

})

proximo.addEventListener("click", () => {
    paginaAtual += 1;
    paginaAtualInput.value = paginaAtual + 1;
    atualizarPaginaFavoritos();
})

anterior.addEventListener("click", () => {
    if(paginaAtual > 0){
        paginaAtual -= 1;
    }
    paginaAtualInput.value = paginaAtual + 1;
    atualizarPaginaFavoritos();
})

paginaAtualInput.addEventListener("change", () => {
    let valorDigitado = parseInt(paginaAtualInput.value) - 1;
    if(isNaN(valorDigitado) || valorDigitado < 1){
        paginaAtual = 0 ;
    }
    else{
        paginaAtual = valorDigitado;
    }
    paginaAtualInput.value = paginaAtual + 1;
    atualizarPaginaFavoritos();
})



function atualizarPaginaFavoritos(){
    container.innerHTML = "";

    listaFavoritosPaginacao(16, paginaAtual * 16, tipoAtual)
    .then(favPokemons => {
        console.log(favPokemons);

        if(favPokemons.length == 0){
            container.innerHTML = `<h2 style="position: absolute; left: 50%; transform: translate(-50%, 0)";>Sem mais Pokemons para mostrar!</h2>`;
            console.log("acabou");
        }

        favPokemons.map(f => {
            carregarPokemom(f)
            .then( pokemom => {
                let card = criarCard(pokemom);
                container.appendChild(card);
            })
            .then( () => {
                let btnsFav = document.getElementsByClassName("fav");

                for(let btn of btnsFav){
                    if(favoritos.includes(btn.id)){
                        btn.classList.add("true");
                    }
                }

                for(let btn of btnsFav){

                    btn.addEventListener("click", function(){
                        if(!favoritos.includes(btn.id)){
                            adicionarPokemomFav(btn.id);
                            btn.classList.add("true");
                        }
                        else{
                            removerPokemomFav(btn.id);
                            btn.classList.remove("true");
                        }
                        
                        console.log(favoritos);
                        
                    })
                }
            })
            .catch((e) => {
                console.log("ERRO: " + e);
                container.innerHTML = `
                <p style="text-align: center;">Não foi Possível Carregar Pokemons!</p>
                ` 
            })
        })
    })
    
}

function removerPokemomFav(pokemom){
    favoritos.splice(favoritos.indexOf(pokemom), 1);
    localStorage.setItem("favoritosPokemons", JSON.stringify(favoritos));
    atualizarPaginaFavoritos();
}


// Adiciona evento nos filtros
document.addEventListener('DOMContentLoaded', function () {
const filtros = document.querySelectorAll('.container-filtro .filtro');
filtros.forEach(filtro => {
    filtro.addEventListener('click', function () {
    // Remove classe ativo de todos
    filtros.forEach(f => f.classList.remove('ativo'));
    // Adiciona classe ativo ao clicado
    this.classList.add('ativo');
    // Filtra os cards
    tipoAtual = this.getAttribute('data-tipo');
    atualizarPaginaFavoritos();
    // filtrarFavoritos(tipo);
    });
});
});

async function listaFavoritosPaginacao(maxFavoritos, offset, tipo){
    let listaFav = [];

    if(tipo == "todos"){
        listaFav = favoritos.slice(offset, offset + maxFavoritos);
        return listaFav;
    }
    else{
        let filtrados = [];
        let resposta = await fetch(`https://pokeapi.co/api/v2/type/${tipoAtual}`);
        resposta = await resposta.json();
        
        if(!resposta){
            return [];
        }

        resposta.pokemon.forEach(r => {
            if(favoritos.includes(r.pokemon.name)){
                filtrados.push(r.pokemon.name);
            }
        })  
        filtrados = filtrados.slice(offset, offset + maxFavoritos);
        console.log(filtrados);
        return filtrados;
    } 
}