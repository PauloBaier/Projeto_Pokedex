const carousel = document.querySelectorAll('.carousel-item');
let index = 0;

function atualizarPosicaocarousel(direction){
    carousel.forEach((item) => item.classList.remove("active", "next", "prev"));
    carousel[index].classList.add("active");
    carousel[(index + 1) % carousel.length].classList.add("next");
    carousel[(index - 1 + carousel.length) % carousel.length].classList.add("prev");

    if(direction == "prev"){
        carousel[(index + 1) % carousel.length].style.zIndex = "1";
        carousel[(index - 1 + carousel.length) % carousel.length].style.zIndex = "0";
        carousel[index].style.zIndex = "2";
    }
    if(direction == "next"){
        carousel[(index + 1) % carousel.length].style.zIndex = "0";
        carousel[(index - 1 + carousel.length) % carousel.length].style.zIndex = "1";
        carousel[index].style.zIndex = "2";
    }
}

document.getElementById("btn-next").onclick = () => {
    index = (index + 1) % carousel.length;
    atualizarPosicaocarousel("next");
}

document.getElementById("btn-prev").onclick = () => {
    index = (index - 1 + carousel.length) % carousel.length;

    atualizarPosicaocarousel('prev');
}

atualizarPosicaocarousel();