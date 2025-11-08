// Carrega as informações do pokemom enviado na url
obterInformacoesPokemom(urlPokemom())
.then(dados => {
    // Carrega as informações na página
    carregarInformacoesPokemoms(dados);
});


// Retorna qual pokemom foi enviado na url
function urlPokemom(){

    // obtém a query string da URL
    const queryUrl = window.location.search;

    // cria um objeto URLSearchParams para manipular os parâmetros da URL
    const parametrosUrl = new URLSearchParams(queryUrl);

    // obtém o valor do parâmetro 'pokemom'
    const pokemom = parametrosUrl.get('pokemom');

    
    // verifica se o valor do parâmetro é válido
    // se for nulo, vazio ou indefinido, retorna um pokemom padrão
    // caso contrário, retorna o valor do parâmetro
    return pokemom;
}
// Função para obter as informações do pokemom na API
async function obterInformacoesPokemom(pokemom){

    // faz a requisição para a API do pokemom
    try{
        // faz a requisição para a API do pokemom
       const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemom}`);

       // verifica se a resposta foi bem-sucedida
       if(!res.ok){
        // se a resposta não for bem-sucedida, lança um erro
        throw new Error("Pokemom Nao Encontrado");
       }

        // converte a resposta para JSON
       const resposta = await res.json();
       // retorna os dados do pokemom
       return resposta;
       
    }
    // trata erros de requisição
    catch(e){
        // exibe uma mensagem de erro
        alert("Não Foi Possível Carregar Pokemom!: " + e);
    }
}
// Função para carregar as informações do pokemom na página
function carregarInformacoesPokemoms(pokemom){

    // adiciona a classe do tipo do pokemom na pokedex
    let evolucoes;

    // adiciona a classe do tipo do pokemom na pokedex
    document.getElementsByClassName("pokedex")[0].classList.add(pokemom.types[0].type.name);

    // adiciona a classe do tipo do pokemom na pokedex-info e comparar
    document.getElementsByClassName("pokedex-info")[0].classList.add(pokemom.types[0].type.name);

    // adiciona a classe do tipo do pokemom na comparar
    document.getElementsByClassName("comparar")[0].classList.add(pokemom.types[0].type.name);

    // adiciona a classe do tipo do pokemom na evoluções
    Array.from(document.getElementsByClassName("nome")).forEach(nome => {
        
        // define o nome do pokemom
        nome.textContent = pokemom.name;
    });
    // define a imagem do pokemom
    document.getElementById("poke-img").src = pokemom.sprites.other["official-artwork"].front_default;
    // define o número do pokemom
    Array.from(document.getElementsByClassName("type")).forEach(tipo => {
        // define o tipo do pokemom
        tipo.textContent = pokemom.types[0].type.name;
    })
    // define o número do pokemom
    document.getElementById("weight").textContent = pokemom.weight/10;

    // define a altura do pokemom
    document.getElementById("height").textContent = pokemom.height/10;


    // busca a descrição do pokemom
    fetch(`${pokemom.species.url}`)
    // converte a resposta para JSON
        .then( resposta => resposta.json())
        // adiciona a descrição na página
        .then( resposta => {
            // define a descrição do pokemom
            document.getElementById('descricao').textContent = resposta.flavor_text_entries.find(f => f.language.name == 'en').flavor_text;
            // carrega as evoluções do pokemom
                carregarCadeiaDeEvo(resposta.evolution_chain.url)
                // adiciona as evoluções na página
                .then(evos => {
                    // se houver evoluções
                    if(evos){
                        // define um array para armazenar os nomes das evoluções    
                        let evo = [];
                        // obtém os elementos HTML para as evoluções
                        let htmlEvolucoes = document.getElementsByClassName("evo");
                        // preenche o array com os nomes das evoluções
                        evo[0] = evos.chain.species.name;
                        // verifica se há uma segunda evolução
                        evo[1] = evos.chain.evolves_to[0].species.name;
                        // verifica se há uma terceira evolução
                        evo[2] = evos.chain.evolves_to[0].evolves_to[0].species.name;
                        
                        // para cada evolução, obtém as informações e define a imagem correspondente
                        Array.from(evo).forEach((ev, index) => {
                            // chama a função para obter as informações do pokemom
                            obterInformacoesPokemom(ev)
                            // converte a resposta para JSON
                            .then(dados => {
                                // define a imagem do pokemom
                                htmlEvolucoes[index].src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dados.id}.png`;
                            })// fim do then
                        })// fim do forEach
                    }// se não houver evoluções
                    else{   // lança um erro
                        throw new Error("Erro");
                    }// fim do else
                })// fim do then
                .catch(() => {
                    // se houver um erro, exibe uma mensagem de evolução indisponível
                    document.getElementsByClassName("evolucoes-container")[0].innerHTML = '<p style="width: 100%; text-align: center;">Evolução Indisponivél</p>';  
                })
        });
}
// Função para carregar a cadeia de evoluções
async function carregarCadeiaDeEvo(url){
    try{
        // faz a requisição para a URL da cadeia de evoluções
        const res = await fetch(url);
        // verifica se a resposta foi bem-sucedida
        if(!res.ok){
            // se a resposta não for bem-sucedida, lança um erro
            throw new Error("Não foi possível carregar Evoluções");
        }
        // converte a resposta para JSON
        const evolucoes = await res.json();
        //  retorna os dados das evoluções
        return evolucoes;
    }// trata erros de requisição
    catch(e){
        // exibe o erro no console
        console.log(e);
    }
}