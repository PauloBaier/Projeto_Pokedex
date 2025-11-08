/* 
    Cria um elemento HTML que representa um card de Pokémon.
    O card é preenchido com as informações do objeto 'pokemom' recebido por parâmetro.
    Retorna o elemento pronto para ser inserido no DOM.
*/
export function criarCard(pokemom){
    // Cria dinamicamente uma <div> que servirá como o container (card) do Pokémon
    const card = document.createElement("div");

    // Define o conteúdo HTML interno dessa <div> usando template literal
    // As informações são inseridas dinamicamente com base no objeto 'pokemom'
    card.innerHTML = `
        <a " href="./detalhes.html?pokemom=${pokemom.name}">
            <div style="width:100%;height:100%;">
                <div class="img-moldura">
                <!-- A imagem oficial do Pokémon é carregada a partir da PokeAPI -->
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemom.id}.png" 
                     onerror="this.onerror=null; this.src='./assets/placeholder.png';">
                <!-- O atributo onerror substitui a imagem por um placeholder caso o carregamento falhe -->
                </div>
                <div class="tipo-pokemom">
                <!-- Exibe o primeiro tipo do Pokémon (por exemplo: fire, grass, water, etc.) -->
                <span>${pokemom.types.map(t => t.type.name)[0]}</span>
                </div>
                <!-- Exibe o nome do Pokémon -->
                <h3>${pokemom.name}</h3>
            </div>
        </a>
        <!-- Ícone de favorito (imagem), com id igual ao nome do Pokémon -->
        <img class="fav" id="${pokemom.name}" draggable="false" src="../assets/fav.png">
    `;

    // Adiciona a classe "card" à div criada — útil para aplicar o estilo CSS do card
    card.classList.add("card");

    // Adiciona também uma classe com o nome do tipo do Pokémon (ex: "fire", "water", etc.)
    // Isso permite estilizar cada card de acordo com o tipo
    card.classList.add(pokemom.types.map(t => t.type.name)[0]);

    // Retorna o card completo, pronto para ser adicionado ao DOM (ex: via appendChild)
    return card;
}

/*  
    Função responsável por buscar as informações de um Pokémon
    na PokeAPI, utilizando o nome ou ID informado como parâmetro.
*/
export async function carregarPokemom(nome){
    try{
        // Faz uma requisição HTTP (fetch) para a PokeAPI, usando o nome ou ID
        let pokemom = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);

        // Converte a resposta da API (que vem em formato JSON) em um objeto JavaScript
        pokemom = await pokemom.json();

        // Caso o retorno esteja vazio ou inválido, lança um erro personalizado
        if(!pokemom){throw new Error("Não foi possivel carregar pokemom!")}

        // Retorna o objeto Pokémon contendo todos os dados (tipos, habilidades, sprites, etc.)
        return pokemom;
    }
    catch(e){
        // Se ocorrer qualquer erro na requisição ou conversão, ele é exibido no console
        console.log(e)

        // Retorna null para indicar falha no carregamento
        return null;
    }
}

/*
    Retorna uma array de pokemons com base na quantidade definida no parametro maximoPokemons
    iniciando da posição definida em offset, retorna null em caso de erro.
*/
export async function carregarListaPokemons(maximoPokemons, offset){
    try{
        // Cria um array vazio que será preenchido com os nomes dos pokémons
        let list = [];

        // Faz a requisição à PokeAPI para obter uma lista paginada de pokémons
        // limit = quantidade máxima e offset = ponto de partida (paginação)
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maximoPokemons}&offset=${offset}`);

        // Caso a resposta da API seja inválida, lança um erro
        if(!resposta){throw new Error("Não foi póssivel carregar pokemons!")}

        // Converte a resposta da API para JSON
        const res = await resposta.json();

        // Percorre a lista retornada pela API (res.results)
        // e armazena apenas os nomes dos pokémons no array 'list'
        res.results.forEach((re, index) => {
            list[index] = re.name;
        });

        // Retorna o array final contendo os nomes dos pokémons
        return list;
    }
    catch{
        // Em caso de erro (ex: problema de conexão ou resposta inválida), retorna null
        return null;
    }
}
