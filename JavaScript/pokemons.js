import {carregarListaPokemons, carregarPokemom, criarCard} from "./pokedex.js";

const container = document.getElementsByClassName("paginacao-grid-container")[0];
let paginaAtual = 0;
let paginaAtualInput = document.getElementById("pagina-atual");
let proximo = document.getElementById("proxima");
let anterior = document.getElementById("anterior");



document.addEventListener("DOMContentLoaded", () => {
    paginaAtualInput.value = paginaAtual + 1;
    atualizarContainer();
})

proximo.addEventListener("click", () => {
    paginaAtual += 1;
    paginaAtualInput.value = paginaAtual + 1;
    atualizarContainer();
})

anterior.addEventListener("click", () => {
    if(paginaAtual > 0){
        paginaAtual -= 1;
    }
    paginaAtualInput.value = paginaAtual + 1;
    atualizarContainer();
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
    atualizarContainer();
})


function atualizarContainer(){
    container.innerHTML = "";
    carregarListaPokemons(16, 0 +(16 * paginaAtual))
    .then(pokemons => {
        if(pokemons){
            pokemons.forEach(pokemom => {
                carregarPokemom(pokemom)
                .then(pokemom => {
                    let card = criarCard(pokemom);
                    container.appendChild(card);
                })
            })
        }
        else{
            throw new Error("Não foi possivel carregar pokemons!");
        }
    })
    .catch((e) => {
        console.log("ERRO: " + e);
        container.innerHTML = `
        <p style="text-align: center;">Não foi Possível Carregar Pokemons!</p>
        ` 
    })
}
