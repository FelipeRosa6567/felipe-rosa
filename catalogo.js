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
    summary: "O mundo conhecido acabou. Em meio a uma cidade tomada pelos mortos, sobreviver é só o começo.",
    // A ordem desta lista define a ordem em que as capas aparecem na tela de capítulos.
    chapters: [chapter(1, "jpg", "Acorda, Celina"), chapter(2, "webp", "Vamos juntos"), chapter(3, "webp", "Reencontro sob cerco"), chapter(4, "webp", "O que resta"), chapter(5, "webp", "Uma noite de cada vez"), chapter(6, "webp", "Cada um por um lado"), chapter(7, "webp", "Do outro lado da grade"), chapter(8, "webp", "Antes do fim do mês")]
  },
  {
    // O livro de poesia usa uma imagem por página para preservar a diagramação do PDF.
    id: "poesia",
    type: "poesia",
    title: "O diário perdido dos meus poemas",
    cover: "arte/diario/pagina-001.webp",
    summary: "Um livro de poesia sobre amor, saudade e dor.",
    // Sumário do PDF. Os números apontam para as páginas originais.
    contents: [
      {
        title: "Abertura",
        entries: [
          [1, "Capa"],
          [2, "Sumário"],
          [6, "Introdução"],
        ]
      },
      {
        title: "Parte 1 · Prazer eu",
        entries: [
          [7, "Parte 1 · Prazer eu"],
          [8, "O sol e a lua"],
          [9, "01 Ilustração"],
          [10, "Apenas um olhar"],
          [11, "Sou quem sou"],
          [12, "Campos de flores"],
          [13, "02 Ilustração"],
          [14, "Lembranças de um amor não tão distante"],
          [15, "03 Ilustração"],
          [16, "Me sinto amargo"],
          [17, "Happy birthday"],
          [18, "Referências"],
          [19, "Mais um mês"],
          [20, "Achei que me amava"],
          [21, "Vilão"],
          [22, "Constelação"],
          [23, "04 Ilustração"],
          [24, "Desculpas"],
          [25, "Vida repleta de falha"],
          [26, "Dia a dia"],
          [27, "Mudanças"],
          [28, "1"],
          [29, "Apaixonado"],
          [30, "Lua"],
          [31, "05 Ilustração"],
          [32, "A chuva cai lá fora"],
          [33, "06 Ilustração"],
          [34, "Íris"],
          [35, "07 Ilustração"],
          [36, "Desabafo"],
          [37, "Me deixa cuidar de você"],
          [38, "Violetas"],
          [39, "08 Ilustração"],
          [40, "Nós dois"],
        ]
      },
      {
        title: "Parte 2 · Lágrimas de amor ou dor?",
        entries: [
          [41, "Parte 2 · Lágrimas de amor ou dor?"],
          [42, "Você"],
          [43, "Vô"],
          [44, "Aurora boreal"],
          [45, "09 Ilustração"],
          [46, "Tudo melhorou"],
          [47, "Sou seu"],
          [48, "Seu cabelo cacheado"],
          [49, "Eu acho que tô bem"],
          [50, "Porque eu te amo?"],
          [51, "Para bem longe daqui"],
          [52, "Sempre foi você"],
          [53, "Tentação"],
          [54, "Aqueles olhos"],
          [55, "Me diga"],
          [56, "Pesadelos"],
          [57, "10 Ilustração"],
          [58, "Minha linda garota"],
          [59, "Não fica longe"],
          [60, "Lar"],
          [61, "Dimensão"],
          [62, "Obra de arte"],
          [63, "11 Ilustração"],
          [64, "Dependência emocional"],
          [65, "Milhões de pensamentos"],
          [66, "Minha amiga morte"],
          [67, "12 Ilustração"],
          [68, "Nunca foi você"],
          [69, "Sabotar"],
          [70, "Saudades"],
        ]
      },
      {
        title: "Parte 3 · Ódio ou amor?",
        entries: [
          [71, "Parte 3 · Ódio ou amor?"],
          [72, "Despedida"],
          [73, "Gritos"],
          [74, "Esquentadinha"],
          [75, "Um dia ao seu lado"],
          [76, "Apenas uma noite"],
          [77, "13 Ilustração"],
          [78, "Morena bonita"],
          [79, "Não estou mais sozinho"],
          [80, "Brilha brilha"],
          [81, "14 Ilustração"],
          [82, "temporal"],
          [83, "Ódio e orgulho"],
          [84, "Meu tambor"],
          [85, "15 Ilustração"],
          [86, "Simplesmente ela"],
          [87, "Seu poeta"],
          [88, "Piratas"],
          [89, "16 Ilustração"],
          [90, "Amor e dor"],
          [91, "17 Ilustração"],
          [92, "6"],
          [93, "18 Ilustração"],
          [94, "Meu tchan"],
          [95, "19 Ilustração"],
          [96, "Plano A"],
          [97, "Escritor"],
          [98, "Você me faz esquecer"],
          [99, "Ficar sozinho foi um presente"],
          [100, "Ódio"],
          [101, "Mais uma noite ao seu lado"],
          [102, "Porque?"],
          [103, "Perdido"],
        ]
      },
      {
        title: "Parte 4 · FIM?",
        entries: [
          [104, "Parte 4 · FIM?"],
          [105, "AnaLu"],
          [106, "Umbanda"],
          [107, "20 Ilustração"],
          [108, "Vagando pelo espaço"],
          [109, "21 Ilustração"],
          [110, "Grande estrago"],
          [111, "Juntos"],
          [112, "Minha cura"],
          [113, "Acorrentado"],
          [114, "Princesa"],
          [115, "22 Ilustração"],
          [116, "A última flecha"],
          [117, "23 Ilustração"],
          [118, "Não era suficiente"],
          [119, "Vazio"],
          [120, "Rei dos mares"],
          [121, "24 Ilustração"],
          [122, "A poesia cura"],
          [123, "Ao seu lado"],
          [124, "A gente"],
          [125, "Cansei"],
          [126, "Flor"],
          [127, "25 Ilustração"],
          [128, "Não aguento"],
          [129, "Escuridão"],
          [130, "Exausto"],
          [131, "Não me deixe só"],
          [132, "Vô"],
          [133, "26 Ilustração"],
          [134, "Eu te julgava"],
          [135, "Minha mulher"],
          [136, "Segundos paro o fim"],
          [137, "Bonus"],
        ]
      },
    ],
    pages: Array.from({ length: 137 }, (_, index) => ({
      image: "arte/diario/pagina-" + String(index + 1).padStart(3, "0") + ".webp"
    }))
  }
];
