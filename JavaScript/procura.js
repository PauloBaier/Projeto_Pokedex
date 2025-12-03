// Importa funções utilitárias de outro módulo (pokedex.js)
import { carregarListaPokemons, carregarPokemom, criarCard } from "./pokedex.js";

// Seleciona o container principal onde os cards dos pokémons serão exibidos
const container = document.getElementsByClassName("paginacao-grid-container")[0];

// Controla a página atual de exibição (começa em 0)
let paginaAtual = 0;

// Input que exibe o número da página atual
let paginaAtualInput = document.getElementById("pagina-atual");

// Botões de navegação de página
let proximo = document.getElementById("proxima");
let anterior = document.getElementById("anterior");

// Array de pokémons resultado, carregado do localStorage (ou vazio se não houver nada salvo)
let favoritos = JSON.parse(localStorage.getItem("favoritosPokemons")) || [];

// Tipo de filtro atual (por padrão, mostra todos)
let tipoAtual = "todos";

let procura = (new URLSearchParams(window.location.search)).get("procura");


document.addEventListener("DOMContentLoaded", () => {
    atualizarListagem();

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
            atualizarListagem();
        });
    });
})

proximo.addEventListener("click", () => {
    paginaAtual += 1;
    paginaAtualInput.value = paginaAtual + 1;
    atualizarListagem();
});

anterior.addEventListener("click", () => {
    if (paginaAtual > 0) {
        paginaAtual -= 1;
    }
    paginaAtualInput.value = paginaAtual + 1;
    atualizarListagem();
});

paginaAtualInput.addEventListener("change", () => {
    let valorDigitado = parseInt(paginaAtualInput.value) - 1;

    if (isNaN(valorDigitado) || valorDigitado < 1) {
        paginaAtual = 0;
    }
    else {
        paginaAtual = valorDigitado;
    }

    paginaAtualInput.value = paginaAtual + 1;
    atualizarListagem()
});


function atualizarListagem() {
    container.innerHTML = "";

    procurarPokemons(tipoAtual, 16, 16 * paginaAtual)
        .then(resultado => {
            const promises = resultado.map(p => {
                return carregarPokemom(p)
                    .then(pokemon => {
                        let card = criarCard(pokemon);
                        container.appendChild(card);
                    });
            })

            return Promise.all(promises);
        })
        .then(() => {
            let btnsFav = document.getElementsByClassName("fav");

            for (let btn of btnsFav) {
                console.log(btn.id);
                if (favoritos.includes(btn.id)) {
                    btn.classList.add("true");
                }
            }

            for (let btn of btnsFav) {
                btn.addEventListener("click", function () {
                    if (!favoritos.includes(btn.id)) {
                        adicionarPokemomFav(btn.id, btn.getAttribute("data-tipo"));
                        btn.classList.add("true");
                    }
                    else {
                        removerPokemomFav(btn.id);
                        btn.classList.remove("true");
                    }
                })
            }
        })

}

function adicionarPokemomFav(pokemom) {
    favoritos.push(pokemom);
    localStorage.setItem("favoritosPokemons", JSON.stringify(favoritos));
}

function removerPokemomFav(pokemom) {
    favoritos.splice(favoritos.indexOf(pokemom), 1);
    localStorage.setItem("favoritosPokemons", JSON.stringify(favoritos));
}

async function procurarPokemons(tipo, maximoPokemons, offset) {
    let filtrados = [];
    let data;

    if (tipo == "todos") {
        let res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000`);
        data = await res.json();

        data.results.forEach(p => {
            if (similaridade(p.name, procura) >= 0.50) {
                filtrados.push(p.name);
            }
        });
    }
    else {
        let res = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
        data = await res.json();

        data.pokemon.forEach(p => {
            if (similaridade(p.pokemon.name, procura) >= 0.50) {
                filtrados.push(p.pokemon.name);
            }
        });
    }

    return filtrados.slice(offset, offset + maximoPokemons);
}



function similaridade(string1, string2) {
    const distancia = distanciaLevenshstein(string1, string2);
    const maxLen = Math.max(string1.length, string2.length);
    return 1 - (distancia / maxLen);
}

function distanciaLevenshstein(string1, string2) {
    let mat = [];

    let x, y, custo;

    for (x = 0; x <= string1.length; x++) {
        mat[x] = [];
        mat[x][0] = x;
    }

    for (y = 0; y <= string2.length; y++) {
        mat[0][y] = y;
    }

    for (x = 1; x <= string1.length; x++) {
        for (y = 1; y <= string2.length; y++) {
            if (string1[x - 1] === string2[y - 1]) {
                custo = 0;
            }
            else {
                custo = 1;
            }

            let deletar = mat[x - 1][y] + 1;
            let inserir = mat[x][y - 1] + 1;
            let substituir = mat[x - 1][y - 1] + custo;

            let menor = deletar;
            if (inserir < menor) menor = inserir;
            if (substituir < inserir) menor = substituir;

            mat[x][y] = menor;
        }
    }

    return mat[string1.length][string2.length];
}