// Importa funções utilitárias de outro módulo (pokedex.js)
import {carregarListaPokemons, carregarPokemom, criarCard} from "./pokedex.js";

// Seleciona o container principal onde os cards dos pokémons serão exibidos
const container = document.getElementsByClassName("paginacao-grid-container")[0];

// Controla a página atual de exibição (começa em 0)
let paginaAtual = 0;

// Input que exibe o número da página atual
let paginaAtualInput = document.getElementById("pagina-atual");

// Botões de navegação de página
let proximo = document.getElementById("proxima");
let anterior = document.getElementById("anterior");

// Array de pokémons favoritos, carregado do localStorage (ou vazio se não houver nada salvo)
let favoritos = JSON.parse(localStorage.getItem("favoritosPokemons")) || [];

// Tipo de filtro atual (por padrão, mostra todos)
let tipoAtual = "todos";

// Quando o documento for completamente carregado...
document.addEventListener("DOMContentLoaded", () => {
    // Atualiza o input para exibir o número da página (humana) — começa em 1
    paginaAtualInput.value = paginaAtual + 1;

    // Carrega os pokémons na tela
    atualizarContainer();
});

// Evento para o botão “próxima página”
proximo.addEventListener("click", () => {
    // Incrementa o contador da página
    paginaAtual += 1;

    // Atualiza o valor mostrado no input
    paginaAtualInput.value = paginaAtual + 1;

    // Recarrega os pokémons da nova página
    atualizarContainer();
});

// Evento para o botão “página anterior”
anterior.addEventListener("click", () => {
    // Impede que a página fique negativa
    if(paginaAtual > 0){
        paginaAtual -= 1;
    }

    // Atualiza o número da página exibido
    paginaAtualInput.value = paginaAtual + 1;

    // Recarrega os pokémons
    atualizarContainer();
});

// Quando o usuário digita manualmente um número de página no input
paginaAtualInput.addEventListener("change", () => {
    // Converte o valor digitado (string) em número e ajusta para índice de array (zero-based)
    let valorDigitado = parseInt(paginaAtualInput.value) - 1;

    // Verifica se o valor é inválido (NaN ou menor que 1)
    if(isNaN(valorDigitado) || valorDigitado < 1){
        paginaAtual = 0;
    }
    else{
        paginaAtual = valorDigitado;
    }

    // Atualiza a interface e o conteúdo
    paginaAtualInput.value = paginaAtual + 1;
    atualizarContainer();
});

// Função principal que atualiza os cards de pokémons no container
function atualizarContainer(){
    // Limpa o conteúdo atual antes de adicionar novos cards
    container.innerHTML = "";

    // Se o filtro for "todos", mostra todos os pokémons
    if(tipoAtual == "todos"){
        // Busca uma lista de pokémons (limitando a 16 por página)
        carregarListaPokemons(16, 0 +(16 * paginaAtual))
        .then(pokemons => {
            // Se não conseguiu carregar, dispara um erro
            if(!pokemons){
                throw new Error("Não foi possivel carregar pokemons!");
            }

            // Cria uma promessa para cada pokémon da lista
            const promises = pokemons.map(p => 
                carregarPokemom(p)
                    .then(pokemom => {
                        // Cria o card visual e adiciona ao container
                        let card = criarCard(pokemom);
                        container.appendChild(card);
                    })
                );

            // Aguarda todas as promessas terminarem (todos os pokémons carregados)
            return Promise.all(promises);
        })
        .then( () => {
            // Após o carregamento, pega todos os botões de favorito exibidos
            let btnsFav = document.getElementsByClassName("fav");

            // Marca visualmente os pokémons que já estão nos favoritos
            for(let btn of btnsFav){
                if(favoritos.includes(btn.id)){
                    btn.classList.add("true");
                }
            }

            // Adiciona eventos de clique aos botões de favorito
            for(let btn of btnsFav){
                btn.addEventListener("click", function(){
                    // Se ainda não está favoritado, adiciona
                    if(!favoritos.includes(btn.id)){
                        adicionarPokemomFav(btn.id, btn.getAttribute("data-tipo"));
                        btn.classList.add("true");
                    }
                    // Se já está, remove dos favoritos
                    else{
                        removerPokemomFav(btn.id);
                        btn.classList.remove("true");
                    }
                    // Mostra o array de favoritos atualizado no console
                    console.log(favoritos);
                })
            }
        })
        .catch((e) => {
            // Se der erro em qualquer etapa, mostra no console e exibe mensagem de falha
            console.log("ERRO: " + e);
            container.innerHTML = `
            <p style="text-align: center;">Não foi Possível Carregar Pokemons!</p>
            ` 
        })
    }
    // Caso o filtro atual seja um tipo específico (ex: fire, water, grass...)
    else{
        filtrarPokemons(16, 0 + 16 * paginaAtual, tipoAtual)
        .then(pokemons => {
            if(!pokemons){
                throw new Error("Não foi possivel carregar pokemons!");
            }
            console.log("passou por aqui");

            // Mesma lógica: cria e carrega todos os cards do tipo filtrado
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

            // Marca os favoritos salvos
            for(let btn of btnsFav){
                if(favoritos.includes(btn.id)){
                    btn.classList.add("true");
                }
            }

            // Adiciona ou remove favoritos ao clicar
            for(let btn of btnsFav){
                btn.addEventListener("click", function(){
                    if(!favoritos.includes(btn.id)){
                        adicionarPokemomFav(btn.id, btn.getAttribute("data-tipo"));
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
}

// Adiciona um pokémon aos favoritos e salva no localStorage
function adicionarPokemomFav(pokemom){
    favoritos.push(pokemom);
    localStorage.setItem("favoritosPokemons", JSON.stringify(favoritos));
}

// Remove um pokémon dos favoritos e atualiza o localStorage
function removerPokemomFav(pokemom){
    favoritos.splice(favoritos.indexOf(pokemom), 1);
    localStorage.setItem("favoritosPokemons", JSON.stringify(favoritos));
}

// Adiciona eventos aos botões de filtro de tipo (ex: fogo, água, grama...)
document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os elementos com classe "filtro" dentro de ".container-filtro"
    const filtros = document.querySelectorAll('.container-filtro .filtro');

    filtros.forEach(filtro => {
      // Quando um filtro é clicado...
      filtro.addEventListener('click', function () {
        // Remove a classe 'ativo' de todos os filtros
        filtros.forEach(f => f.classList.remove('ativo'));

        // Marca o filtro clicado como ativo
        this.classList.add('ativo');

        // Atualiza o tipo atual com base no atributo data-tipo do botão
        tipoAtual = this.getAttribute('data-tipo');

        // Atualiza a tela de acordo com o novo filtro
        atualizarContainer();
      });
    });
  });

// Função que busca pokémons filtrados por tipo na API
async function filtrarPokemons(maximoPokemons, offset, tipo){
    // Requisição à API de tipo (ex: /type/fire)
    let resposta = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
    resposta = await resposta.json();

    // Se não houver resposta, retorna lista vazia
    if(!resposta){
        return [];
    }

    // A resposta contém todos os pokémons daquele tipo
    // Aqui mapeia para extrair apenas os nomes, depois aplica slice para paginação
    return (resposta.pokemon.map(p => p.pokemon.name)).slice(offset, offset + maximoPokemons);
}
