import {carregarListaPokemons, carregarPokemom, criarCard} from "./pokedex.js";

const container = document.getElementsByClassName("paginacao-grid-container")[0];
let paginaAtual = 0;
let paginaAtualInput = document.getElementById("pagina-atual");
let proximo = document.getElementById("proxima");
let anterior = document.getElementById("anterior");
let favoritos = JSON.parse(localStorage.getItem("favoritosPokemons")) || [];

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

        if(!pokemons){
            throw new Error("Não foi possivel carregar pokemons!");
        }
        const promises = pokemons.map(p => 
            carregarPokemom(p)
                .then(pokemom => {
                    let card = criarCard(pokemom);
                    container.appendChild(card);
                })
            )

        return Promise.all(promises);
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
}

function adicionarPokemomFav(pokemom){
    favoritos.push(pokemom);
    localStorage.setItem("favoritosPokemons", JSON.stringify(favoritos));
}

function removerPokemomFav(pokemom){
    favoritos.splice(favoritos.indexOf(pokemom), 1);
    localStorage.setItem("favoritosPokemons", JSON.stringify(favoritos));
}
  // Função para filtrar os cards
  function filtrarFavoritos(tipo) {
    const cards = document.querySelectorAll('.paginacao-grid-container .card');
    cards.forEach(card => {
      if (tipo === 'todos' || card.classList.contains(tipo)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
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
        const tipo = this.getAttribute('data-tipo');
        filtrarFavoritos(tipo);
      });
    });
  });