/* 
    Cria um elemento HTML que representa um card de Pokémon.
    O card é preenchido com as informações do objeto 'pokemom' recebido por parâmetro.
    Retorna o elemento pronto para ser inserido no DOM.
*/
export function criarCard(pokemom){
    const card = document.createElement("div");
    card.innerHTML = `
        <a " href="./detalhes.html?pokemom=${pokemom.name}">
            <div style="width:100%;height:100%;">
                <div class="img-moldura">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemom.id}.png" onerror="this.onerror=null; this.src='./assets/placeholder.png';">
                </div>
                <div class="tipo-pokemom">
                <span>${pokemom.types.map(t => t.type.name)[0]}</span>
                </div>
                <h3>${pokemom.name}</h3>
            </div>
        </a>
        <img class="fav" id="${pokemom.name}" draggable="false" src="./assets/fav.png">
    `;
    card.classList.add("card");
    card.classList.add(pokemom.types.map(t => t.type.name)[0]);

    return card;
}

/*  
    Função responsável por buscar as informações de um Pokémon
    na PokeAPI, utilizando o nome ou ID informado como parâmetro.
*/
export async function carregarPokemom(nome){
    try{
        let pokemom = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
        pokemom = await pokemom.json();

        if(!pokemom){throw new Error("Não foi possivel carregar pokemom!")}

        return pokemom;
    }
    catch(e){
        console.log(e)
        return null;
    }
}

/*
    Retorna uma array de pokemons com base na quantidade definida no parametro maximoPokemons
    iniciando da posição definida em offset, retorna null em caso de erro.
*/
export async function carregarListaPokemons(maximoPokemons, offset){
    try{
        let list = [];
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maximoPokemons}&offset=${offset}`);
        if(!resposta){throw new Error("Não foi póssivel carregar pokemons!")}
        const res = await resposta.json();

        res.results.forEach((re, index) => {
            list[index] = re.name;
        });
        return list;
    }
    catch{
        return null;
    }
}