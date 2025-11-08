// JavaScript/favoritos.js
import {carregarListaPokemons, carregarPokemom, criarCard} from "./pokedex.js";

// Seleciona os elementos do DOM necessários
const container = document.getElementsByClassName("paginacao-grid-container")[0];

// Variáveis para controle de paginação e favoritos
let paginaAtual = 0;

// Seleciona os elementos do DOM necessários
let paginaAtualInput = document.getElementById("pagina-atual");

// Seleciona os botões de navegação
let proximo = document.getElementById("proxima");

// Seleciona os botões de navegação
let anterior = document.getElementById("anterior");

// Carrega a lista de favoritos do localStorage ou inicializa como um array vazio
let favoritos = JSON.parse(localStorage.getItem("favoritosPokemons")) || [];

// Variável para armazenar o tipo atual selecionado nos filtros
let tipoAtual = "todos";

// Atualiza a exibição dos favoritos quando o conteúdo da página for carregado
document.addEventListener("DOMContentLoaded", () => {

    // chama a função para atualizar a página de favoritos
    paginaAtualInput.value = paginaAtual + 1;

    // chama a função para atualizar a página de favoritos
    atualizarPaginaFavoritos();

})
// Adiciona eventos de clique aos botões de navegação
proximo.addEventListener("click", () => {

    // incrementa a página atual
    paginaAtual += 1;

    // atualiza o valor do input da página atual
    paginaAtualInput.value = paginaAtual + 1;

    // chama a função para atualizar a página de favoritos
    atualizarPaginaFavoritos();
})
// Adiciona eventos de clique aos botões de navegação
anterior.addEventListener("click", () => {
    // decrementa a página atual se não for a primeira página
    if(paginaAtual > 0){

        // decrementa a página atual
        paginaAtual -= 1;
    }
    // atualiza o valor do input da página atual
    paginaAtualInput.value = paginaAtual + 1;

    // chama a função para atualizar a página de favoritos
    atualizarPaginaFavoritos();
})
// Adiciona evento de mudança ao input da página atual
paginaAtualInput.addEventListener("change", () => {

    // obtém o valor digitado pelo usuário e ajusta para o índice correto
    let valorDigitado = parseInt(paginaAtualInput.value) - 1;

    // valida o valor digitado
    if(isNaN(valorDigitado) || valorDigitado < 1){

        // se o valor for inválido, redefine para a primeira página
        paginaAtual = 0 ;
    }
    else{// se o valor for válido, atualiza a página atual
        paginaAtual = valorDigitado;
      
    }// atualiza o valor do input da página atual
    paginaAtualInput.value = paginaAtual + 1;

    // chama a função para atualizar a página de favoritos
    atualizarPaginaFavoritos();
})


// Função para atualizar a exibição dos pokemons favoritos na página
function atualizarPaginaFavoritos(){

    // limpa o container de pokemons
    container.innerHTML = "";

    // obtém a lista de pokemons favoritos com paginação e filtro
    listaFavoritosPaginacao(16, paginaAtual * 16, tipoAtual)

    // processa a lista de pokemons favoritos
    .then(favPokemons => {

        // atualiza o valor do input da página atual
        console.log(favPokemons);

        // se não houver pokemons para mostrar
        if(favPokemons.length == 0){

            // exibe uma mensagem informando que não há mais pokemons
            container.innerHTML = `<h2 style="position: absolute; left: 50%; transform: translate(-50%, 0)";>Sem mais Pokemons para mostrar!</h2>`;

            // encerra a função
            console.log("acabou");
        }
        // para cada pokemon favorito, carrega suas informações e cria um card
        favPokemons.map(f => {

            // carrega as informações do pokemon
            carregarPokemom(f)

            // cria o card do pokemon e o adiciona ao container
            .then( pokemom => {

                // cria o card do pokemom
                let card = criarCard(pokemom);

                // adiciona o card ao container
                container.appendChild(card);
            })
            // fim do then
            .then( () => {

                // adiciona a funcionalidade de favoritos aos botões
                let btnsFav = document.getElementsByClassName("fav");

                // marca os pokemons que já são favoritos
                for(let btn of btnsFav){

                    // verifica se o pokemon é favorito
                    if(favoritos.includes(btn.id)){

                        // marca o botão como favorito
                        btn.classList.add("true");
                    }
                }
                // adiciona eventos de clique aos botões de favoritos
                for(let btn of btnsFav){

                    // adiciona evento de clique ao botão
                    btn.addEventListener("click", function(){

                        // verifica se o pokemon já está nos favoritos
                        if(!favoritos.includes(btn.id)){

                            // adiciona o pokemon aos favoritos
                            adicionarPokemomFav(btn.id);

                            // marca o botão como favorito
                            btn.classList.add("true");
                        }
                        else{// se o pokemon já estiver nos favoritos

                            // remove o pokemon dos favoritos
                            removerPokemomFav(btn.id);

                            // desmarca o botão como favorito
                            btn.classList.remove("true");
                        }
                        // exibe a lista atualizada de favoritos no console
                        console.log(favoritos);
                        
                    })
                }
            })
            // fim do then
            .catch((e) => {

                // em caso de erro, exibe uma mensagem no container
                console.log("ERRO: " + e);

                // exibe uma mensagem de erro no container
                container.innerHTML = `
                <p style="text-align: center;">Não foi Possível Carregar Pokemons!</p>
                ` 
            })// fim do catch
        })
    })
    
}

// Função para adicionar um pokemom aos favoritos
function removerPokemomFav(pokemom){

    // remove o pokemom dos favoritos
    favoritos.splice(favoritos.indexOf(pokemom), 1);

    // atualiza o localStorage
    localStorage.setItem("favoritosPokemons", JSON.stringify(favoritos));

    // atualiza a página de favoritos
    atualizarPaginaFavoritos();
}


// Adiciona evento nos filtros
document.addEventListener('DOMContentLoaded', function () {

    // Seleciona todos os elementos de filtro
const filtros = document.querySelectorAll('.container-filtro .filtro');

// Adiciona evento de clique a cada filtro
filtros.forEach(filtro => {

    // Adiciona evento de clique ao filtro
    filtro.addEventListener('click', function () {

    // Remove classe ativo de todos
    filtros.forEach(f => f.classList.remove('ativo'));

    // Adiciona classe ativo ao clicado
    this.classList.add('ativo');

    // Filtra os cards
    tipoAtual = this.getAttribute('data-tipo');

    // chama a função para atualizar a página de favoritos
    atualizarPaginaFavoritos();
    // filtrarFavoritos(tipo);
    // fim do clique
    });
});
});

// Função para listar os pokemons favoritos com paginação e filtro
async function listaFavoritosPaginacao(maxFavoritos, offset, tipo){

    // declara um array para armazenar os favoritos filtrados
    let listaFav = [];

    // se o tipo for "todos", retorna todos os favoritos com paginação
    if(tipo == "todos"){

        // obtém a lista de favoritos com paginação
        listaFav = favoritos.slice(offset, offset + maxFavoritos);

        // retorna a lista de favoritos
        return listaFav;
    }// se o tipo for específico, filtra os favoritos por tipo
    else{

        // declara um array para armazenar os favoritos filtrados
        let filtrados = [];

        // faz a requisição para obter os pokemons do tipo especificado
        let resposta = await fetch(`https://pokeapi.co/api/v2/type/${tipoAtual}`);

        // converte a resposta para JSON
        resposta = await resposta.json();
        
        // se não houver resposta, retorna um array vazio
        if(!resposta){
            // se não houver resposta, retorna um array vazio
            return [];
        }
        // para cada pokemom na resposta, verifica se está nos favoritos
        resposta.pokemon.forEach(r => {

            // se o pokemom estiver nos favoritos, adiciona à lista filtrada
            if(favoritos.includes(r.pokemon.name)){

                // adiciona o pokemom à lista filtrada
                filtrados.push(r.pokemon.name);
            }
        })  
        // retorna a lista de favoritos filtrados com paginação
        filtrados = filtrados.slice(offset, offset + maxFavoritos);

        // retorna a lista de favoritos filtrados
        console.log(filtrados);

        // retorna a lista de favoritos filtrados
        return filtrados;

        // fim do else
    } 
}