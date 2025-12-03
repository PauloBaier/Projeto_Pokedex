let barraPesquisa = document.querySelector("#barra-pesquisa");
let bannerBarraPesquisa = document.querySelector("#banner-barra-de-busca");

if (barraPesquisa) {
    barraPesquisa.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = `procura.html?procura=${(barraPesquisa.value).toLowerCase()}`;
        }
    })
}

if (bannerBarraPesquisa) {
    document.querySelector("#ir").addEventListener("click", () => {
        window.location.href = `procura.html?procura=${(bannerBarraPesquisa.value).toLowerCase()}`;
    })
    bannerBarraPesquisa.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            window.location.href = `procura.html?procura=${(bannerBarraPesquisa.value).toLowerCase()}`;
        }
    })
}

