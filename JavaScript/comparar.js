import { carregarPokemom } from "./pokedex.js";

let pokedex1 = document.querySelector(".left");
let pokedex2 = document.querySelector(".right");

let btnPokemom1 = document.querySelector("#btn-pokemom-1");
let btnPokemom2 = document.querySelector("#btn-pokemom-2");

let campoInput1 = document.querySelector("#pokemom-1");
let campoInput2 = document.querySelector("#pokemom-2");

let atributos = ["peso", "altura", "hp", "attack"];

document.addEventListener("DOMContentLoaded", () => {
    let pokemom1 = (new URLSearchParams(window.location.search)).get("pokemom1");
    let pokemom2 = (new URLSearchParams(window.location.search)).get("pokemom2");

    campoInput1.value = pokemom1;
    campoInput2.value = pokemom2;

    preencherPokedex(pokedex1,pokemom1,"left").then(() => {
        preencherPokedex(pokedex2,pokemom2,"right").then(()=>{
            compararAtributos();
        })
    })
})

btnPokemom1.addEventListener("click", () => {
    escolhaPokemon(1);
})
btnPokemom2.addEventListener("click", () => {
    escolhaPokemon(2);
})

function escolhaPokemon(inputEscolhido){
    if(inputEscolhido == 1){
        let nomePokemom = campoInput1.value;
        preencherPokedex(pokedex1,nomePokemom,"left").then(() => {compararAtributos()});
    }else if(inputEscolhido == 2){
        let nomePokemom = campoInput2.value;
        preencherPokedex(pokedex2, nomePokemom,"right").then(() => {compararAtributos()});
    }
}

async function preencherPokedex(pokedex,nomePokemom,lado){
    const pokemom = await carregarPokemom(nomePokemom);

    if(pokemom){
        pokedex.classList = "";
        pokedex.classList.add("pokedex-ui");
        pokedex.classList.add(lado);
        pokedex.classList.add(pokemom.types.map(t => t.type.name)[0]);
        pokedex.querySelector(".tipo-pokemom > span").textContent = pokemom.types.map(t => t.type.name)[0];
        pokedex.querySelector(".img-moldura > img").src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemom.id}.png`;
        pokedex.querySelector("h4").textContent = pokemom.name;
        pokedex.querySelector(".hp").textContent = pokemom.stats.find(s => s.stat.name === "hp").base_stat;
        pokedex.querySelector(".attack").textContent = pokemom.stats.find(s => s.stat.name === "attack").base_stat;
        document.getElementById(lado == "left" ? "nome1":"nome2").textContent = pokemom.name;
        document.getElementById(lado == "left" ? "peso1" : "peso2").textContent = pokemom.weight / 10;
        document.getElementById(lado == "left" ? "altura1" : "altura2").textContent = pokemom.height / 10;
        document.getElementById(lado == "left" ? "hp1" : "hp2").textContent = pokemom.stats.find(s => s.stat.name === "hp").base_stat;
        document.getElementById(lado == "left" ? "attack1" : "attack2").textContent = pokemom.stats.find(s => s.stat.name === "attack").base_stat;
        document.getElementById(lado == "left" ? "tipo1" : "tipo2").textContent = pokemom.types.map(t => t.type.name).join(", ");
    }
    else{
        alert("Pokemom não encontrado! Cheque a escrita.");
        pokedex.classList = "";
        pokedex.classList.add("pokedex-ui");
        pokedex.classList.add(lado);
        pokedex.classList.add("normal");
        pokedex.querySelector(".tipo-pokemom > span").textContent = "";
        pokedex.querySelector(".img-moldura > img").src = "";
        pokedex.querySelector("h4").textContent = "";
        pokedex.querySelector(".hp").textContent = "";
        pokedex.querySelector(".attack").textContent = "";
        document.getElementById(lado == "left" ? "nome1":"nome2").textContent = "";
        document.getElementById(lado == "left" ? "peso1" : "peso2").textContent = "";
        document.getElementById(lado == "left" ? "altura1" : "altura2").textContent = "";
        document.getElementById(lado == "left" ? "hp1" : "hp2").textContent = "";
        document.getElementById(lado == "left" ? "attack1" : "attack2").textContent = "";
        document.getElementById(lado == "left" ? "tipo1" : "tipo2").textContent = "";
    }
}

function compararAtributos(){
    atributos.forEach(a => {
        compararAtributo(a);
    })
}

function compararAtributo(atributo){
    let indicador = document.querySelector(".indicador-"+atributo);
    let atributo1 = document.querySelector("#"+atributo+"1");
    let atributo2 = document.querySelector("#"+atributo+"2");

    if(atributo1.textContent == "" || atributo2.textContent == ""){
        indicador.textContent = "";
        atributo1.classList.remove("ganhador");
        atributo2.classList.remove("ganhador");
    }

    if(parseFloat(atributo1.textContent) > parseFloat(atributo2.textContent)){
        indicador.textContent = ">";
        atributo1.parentElement.classList.add("ganhador");
    }
    else if(parseFloat(atributo1.textContent) < parseFloat(atributo2.textContent)){
        indicador.textContent = "<";
        atributo2.parentElement.classList.add("ganhador");
    }
}
