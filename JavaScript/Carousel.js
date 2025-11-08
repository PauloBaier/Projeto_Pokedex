// seleciona todos os itens do carrossel
const carousel = document.querySelectorAll('.carousel-item');

// índice inicial do carrossel
let index = 0;

// função para atualizar a posição do carrossel
function atualizarPosicaocarousel(direction){

    // remove todas as classes ativas
    carousel.forEach((item) => item.classList.remove("active", "next", "prev"));

    // adiciona as classes conforme o índice atual
    carousel[index].classList.add("active");

    // calcula o próximo e o anterior usando o operador módulo para circular
    carousel[(index + 1) % carousel.length].classList.add("next");

    // calcula o índice anterior considerando o wrap-around
    carousel[(index - 1 + carousel.length) % carousel.length].classList.add("prev");
    
    
    // se a direção for "prev"
    if(direction == "prev"){
        // define os z-index para criar o efeito de sobreposição
        carousel[(index + 1) % carousel.length].style.zIndex = "1";

        // calcula o índice anterior considerando o wrap-around
        carousel[(index - 1 + carousel.length) % carousel.length].style.zIndex = "0";

        // se não houver direção (inicialização)
        carousel[index].style.zIndex = "2";

    } // se a direção for "next"
    if(direction == "next"){
        // define os z-index para criar o efeito de sobreposição
        carousel[(index + 1) % carousel.length].style.zIndex = "0";
        
        // calcula o índice anterior considerando o wrap-around
        carousel[(index - 1 + carousel.length) % carousel.length].style.zIndex = "1";
        
        // se não houver direção (inicialização)
        carousel[index].style.zIndex = "2";
    }
}
// adiciona eventos de clique aos botões
document.getElementById("btn-next").onclick = () => {

    // atualiza o índice para o próximo item
    index = (index + 1) % carousel.length;

    // chama a função para atualizar a posição do carrossel
    atualizarPosicaocarousel("next");
}
// adiciona evento de clique ao botão anterior
document.getElementById("btn-prev").onclick = () => {
    
    // atualiza o índice para o item anterior
    index = (index - 1 + carousel.length) % carousel.length;

    // chama a função para atualizar a posição do carrossel
    atualizarPosicaocarousel('prev');
}
// inicializa o carrossel
atualizarPosicaocarousel();