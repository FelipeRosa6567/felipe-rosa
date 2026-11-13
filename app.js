// Busca elementos pelo id do HTML e guarda o estado da leitura, e dos filtros.
const $ = id => document.getElementById(id);
const categories = { quadrinho: "QUADRINHO", poesia: "POESIA" };
const catalog = [...window.ESTANTE_INICIAL];
let activeBook;
let activeSeries;
let pageIndex = 0;
let filter = "todos";
let touchStart;

// Cria um elemento HTML e insere texto com textContent, sem interpretar o texto como código.
function node(tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (value) element.textContent = value;
  return element;
}

// Filtra a lista de obras e monta cada cartão com capa, sinopse e link de leitura.
function drawShelf() {
  const books = catalog.filter(book => filter === "todos" || book.type === filter);
  $("books").replaceChildren(...books.map(book => {
    const card = node("article", "book");
    const cover = book.cover ? node("img", "book-cover") : node("div", "cover-placeholder", book.title);
    if (book.cover) {
      cover.src = book.cover;
      cover.alt = "";
      cover.loading = "lazy";
    } else {
      cover.setAttribute("aria-hidden", "true");
    }
    const info = node("div", "book-info");
    info.append(node("p", "eyebrow", categories[book.type]), node("h3", "", book.title));
    if (book.label) info.append(node("p", "book-label", book.label));
    info.append(node("p", "summary", book.summary));
    const route = book.chapters ? "#quadrinho/" + book.id : "#ler/" + book.id;
    if (book.chapters || book.pages?.length) {
      const link = node("a", "read-link", book.chapters ? "Ver capítulos →" : "Abrir e ler →");
      link.href = route;
      link.setAttribute("aria-label", link.textContent + " " + book.title);
      info.append(link);
    }
    const reading = resumePoint(book);
    if (reading) {
      const { entry, index } = reading;
      const page = entry.pages[index];
      const pageName = page.label === "Capa" ? "capa" :
        "página " + (entry.label ? index : index + 1);
      const resume = node("a", "resume-link", "Continuar " + (entry.label ? entry.label.toLowerCase() + " · " : "lendo · ") + pageName);
      resume.href = "#ler/" + entry.id + "/" + (index + 1);
      resume.setAttribute("aria-label", resume.textContent + " de " + book.title);
      info.append(resume);
    }
    const coverLink = node("a", "cover-link");
    coverLink.href = route;
    coverLink.setAttribute("aria-label", book.title);
    coverLink.append(cover);
    card.append(coverLink, info);
    return card;
  }));
}

// Cria uma chave diferente por obra para salvar a última página neste navegador.
function storageKey(book) {
  return "estante-pagina-" + book.id;
}

// Reaproveita a página já guardada e identifica o último capítulo aberto.
function stored(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function savedPage(book) {
  const value = stored(storageKey(book));
  const index = Number(value);
  return value !== null && Number.isInteger(index) && index >= 0 && index < book.pages.length ? index : null;
}

function resumePoint(book) {
  const chapters = book.chapters;
  const lastChapter = chapters && stored("estante-capitulo-" + book.id);
  const entry = chapters ? chapters.find(chapter => chapter.id === lastChapter) ||
    [...chapters].reverse().find(chapter => savedPage(chapter) !== null) : book;
  if (!entry?.pages?.length) return null;
  const index = savedPage(entry);
  return index === null ? null : { entry, index };
}

// Mostra a página escolhida, atualiza os botões e salva o ponto de leitura.
function drawPage(index, scroll = false) {
  if (!activeBook) return;
  pageIndex = Math.max(0, Math.min(activeBook.pages.length - 1, index));
  const page = activeBook.pages[pageIndex];
  const element = page.image ? node("img", "comic-page") : node("article", "text-page", page.text);
  if (page.image) {
    element.src = page.image;
    element.alt = page.alt || "Página " + (pageIndex + 1) + " de " + activeBook.title;
    element.draggable = false;
    element.addEventListener("error", () => {
      if (element.isConnected) element.replaceWith(node("p", "status", "Esta página não carregou. Você pode tentar novamente ou avançar."));
    }, { once: true });
  }
  $("reader-stage").replaceChildren(element);
  $("previous").disabled = pageIndex === 0;
  const lastPage = pageIndex === activeBook.pages.length - 1;
  const chapters = activeSeries?.chapters;
  const nextChapter = chapters?.[chapters.indexOf(activeBook) + 1];
  $("next").disabled = lastPage;
  $("next").hidden = Boolean(lastPage && nextChapter);
  const chapterLink = $("next-chapter");
  chapterLink.hidden = !$("next").hidden;
  if (!chapterLink.hidden) {
    chapterLink.textContent = "Ler " + nextChapter.label.toLowerCase() + " →";
    chapterLink.href = "#ler/" + nextChapter.id;
    if (document.activeElement === $("next")) chapterLink.focus();
  } else if (document.activeElement === chapterLink && !$("next").disabled) {
    $("next").focus();
  }
  $("zoom").hidden = !page.image;
  $("jump").value = String(pageIndex);
  $("reader-status").textContent = page.label === "Capa" ? "Capa" :
    "Página " + (page.label ? page.label.replace(" / ", " de ") : (pageIndex + 1) + " de " + activeBook.pages.length);
  try {
    localStorage.setItem(storageKey(activeBook), String(pageIndex));
    if (activeSeries) localStorage.setItem("estante-capitulo-" + activeSeries.id, activeBook.id);
  } catch {}
  if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
}

// Prepara o leitor e abre a página indicada no link ou a última página lida.
function openBook(book, requestedPage, series) {
  activeBook = book;
  activeSeries = series;
  $("reader-title").textContent = book.title;
  $("reader-type").textContent = categories[book.type];
  $("reader-back").href = series ? "#quadrinho/" + series.id : "#estante";
  $("reader-back").textContent = series ? "← Voltar aos capítulos" : "← Voltar à estante";
  $("reader-stage").classList.remove("zoomed");
  $("zoom").setAttribute("aria-pressed", "false");
  $("zoom").textContent = "Ampliar";
  $("jump").replaceChildren(...book.pages.map((page, index) => {
    const option = node("option", "", page.label || (index + 1) + " / " + book.pages.length);
    option.value = index;
    return option;
  }));
  const saved = savedPage(book) ?? 0;
  drawPage(requestedPage ? Number(requestedPage) - 1 : saved, true);
  $("reader-title").focus({ preventScroll: true });
}

// Monta a lista de capítulos. Cada capa aponta para o leitor daquele capítulo.
function openSeries(series) {
  $("series-title").textContent = series.title;
  $("chapters").replaceChildren(...series.chapters.map(chapter => {
    const link = node("a", "chapter");
    link.href = "#ler/" + chapter.id;
    const image = node("img");
    image.src = chapter.cover;
    image.alt = "";
    link.append(image, node("h3", "", chapter.label));
    if (chapter.name) link.append(node("p", "chapter-name", chapter.name));
    return link;
  }));
  window.scrollTo({ top: 0, behavior: "instant" });
  $("series-title").focus({ preventScroll: true });
}

// Lê a parte do endereço que vem depois de # e escolhe qual tela mostrar.
function route() {
  const hash = location.hash.slice(1);
  const bookRoute = hash.match(/^ler\/([a-z0-9-]+)(?:\/(\d+))?$/);
  const series = catalog.find(entry => entry.chapters &&
    (hash === "quadrinho/" + entry.id || hash === "ler/" + entry.id));
  // Mantém os links antigos com número de página funcionando no capítulo 1.
  const bookId = bookRoute?.[1] === "ultima-luz" && bookRoute[2] ? "ultima-luz-cap-1" : bookRoute?.[1];
  const parent = catalog.find(entry => entry.chapters?.some(chapter => chapter.id === bookId));
  const book = parent?.chapters.find(chapter => chapter.id === bookId) ||
    catalog.find(entry => entry.id === bookId && entry.pages?.length);
  const about = hash === "sobre" || hash === "publicar";
  $("home").hidden = Boolean(book || about || series);
  $("about").hidden = !about;
  $("series").hidden = !series;
  $("reader").hidden = !book;
  if (book) openBook(book, bookRoute[2], parent);
  else {
    activeBook = undefined;
    activeSeries = undefined;
    if (!series && !about) drawShelf();
    if (series) {
      openSeries(series);
    } else if (about) {
      window.scrollTo({ top: 0, behavior: "instant" });
      $("about-title").focus({ preventScroll: true });
    } else if (hash === "estante") {
      $("estante").scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }
}

// Ao clicar em um filtro, redesenha a estante com a categoria escolhida.
document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    drawShelf();
  });
});
// Liga os botões, o seletor e a ampliação às ações do leitor.
$("previous").onclick = () => drawPage(pageIndex - 1, true);
$("next").onclick = () => drawPage(pageIndex + 1, true);
$("jump").onchange = event => drawPage(Number(event.target.value), true);
$("zoom").onclick = () => {
  const zoomed = $("reader-stage").classList.toggle("zoomed");
  $("zoom").setAttribute("aria-pressed", String(zoomed));
  $("zoom").textContent = zoomed ? "Ajustar" : "Ampliar";
};
// As setas viram as páginas e Esc volta à estante ou aos capítulos.
document.addEventListener("keydown", event => {
  if (!activeBook || event.altKey || event.ctrlKey || event.metaKey || event.target.closest("select")) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    drawPage(pageIndex + (event.key === "ArrowLeft" ? -1 : 1), true);
  }
  if (event.key === "Escape") location.hash = new URL($("reader-back").href).hash;
});
// Compara a posição inicial e final do dedo para reconhecer um deslize horizontal.
$("reader-stage").addEventListener("touchstart", event => {
  touchStart = event.touches.length === 1 && !$("reader-stage").classList.contains("zoomed") ? event.touches[0] : undefined;
}, { passive: true });
$("reader-stage").addEventListener("touchcancel", () => { touchStart = undefined; });
$("reader-stage").addEventListener("touchend", event => {
  if (!touchStart) return;
  const dx = event.changedTouches[0].clientX - touchStart.clientX;
  const dy = event.changedTouches[0].clientY - touchStart.clientY;
  touchStart = undefined;
  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) drawPage(pageIndex + (dx < 0 ? 1 : -1), true);
}, { passive: true });

// Monta a estante e acompanha os links de navegação do site.
window.addEventListener("hashchange", route);
route();
