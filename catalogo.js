// Monta os dados de um capítulo a partir do número e da extensão das imagens. A página 00 é a capa.
function chapter(number, extension, name) {
  const folder = "arte/capitulo-" + number + "/";
  const image = page => folder + "pagina-" + String(page).padStart(2, "0") + "." + extension;
  return {
    id: "ultima-luz-cap-" + number,
    type: "quadrinho",
    title: "A Última Luz — Capítulo " + number,
    label: "Capítulo " + number,
    name,
    cover: image(0),
    pages: Array.from({ length: 26 }, (_, page) => ({
      image: image(page),
      label: page === 0 ? "Capa" : page + " / 25"
    }))
  };
}

// Catálogo que vem junto com o site. O app.js lê esta lista para mostrar as obras na estante.
window.ESTANTE_INICIAL = [
  {
    id: "ultima-luz",
    type: "quadrinho",
    title: "A Última Luz",
    cover: "arte/capa-ultima-luz.jpg",
    label: "2 capítulos",
    summary: "O mundo conhecido acabou. Em meio a uma cidade tomada pelos mortos, sobreviver é só o começo.",
    // A ordem desta lista define a ordem em que as capas aparecem na tela de capítulos.
    chapters: [chapter(1, "jpg", "Acorda, Celina"), chapter(2, "webp", "Vamos juntos")]
  },
  {
    // O livro de poesia usa uma imagem por página para preservar a diagramação do PDF.
    id: "poesia",
    type: "poesia",
    title: "O diário perdido dos meus poemas",
    cover: "arte/diario/pagina-001.webp",
    summary: "Um livro de poesia sobre amor, saudade e dor.",
    pages: Array.from({ length: 137 }, (_, index) => ({
      image: "arte/diario/pagina-" + String(index + 1).padStart(3, "0") + ".webp"
    }))
  }
];
