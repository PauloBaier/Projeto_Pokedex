const carousel = document.querySelectorAll('.carousel-item');
let index = 0;

function atualizarPosicaocarousel(){
    carousel.forEach((item) => item.classList.remove("active", "next", "prev"));
    carousel[index].classList.add("active");
    carousel[(index + 1) % carousel.length].classList.add("next");
    carousel[(index - 1 + carousel.length) % carousel.length].classList.add("prev");
    
}

document.getElementById("btn-next").onclick = () => {
    index = (index + 1) % carousel.length;
    atualizarPosicaocarousel();
}

document.getElementById("btn-prev").onclick = () => {
    index = (index - 1 + carousel.length) % carousel.length;
    atualizarPosicaocarousel();
}

atualizarPosicaocarousel();