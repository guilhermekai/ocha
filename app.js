// Ochá: vitrine. Tudo aqui é opcional: sem JavaScript o site continua funcionando e os botões abrem o WhatsApp.
(function () {
  var raiz = document.documentElement;

  // 1. Botões do WhatsApp: abre a conversa já com a mensagem escrita.
  var NUMERO = "554188660763";
  document.querySelectorAll("a[data-zap]").forEach(function (a) {
    a.href = "https://wa.me/" + NUMERO + "?text=" + encodeURIComponent(a.getAttribute("data-zap"));
    a.target = "_blank";
    a.rel = "noopener";
  });

  // 2. Tamanho da letra (A− / A+), guardado para a próxima visita.
  var NIVEIS = [0.9, 1, 1.15, 1.3, 1.5];
  var nivel = 1;
  try { var g = parseInt(localStorage.getItem("ocha-letra"), 10); if (g >= 0 && g < NIVEIS.length) nivel = g; } catch (e) {}
  function aplicarLetra() {
    raiz.style.setProperty("--letra", NIVEIS[nivel]);
    document.getElementById("letra-menos").disabled = nivel === 0;
    document.getElementById("letra-mais").disabled = nivel === NIVEIS.length - 1;
    try { localStorage.setItem("ocha-letra", nivel); } catch (e) {}
  }
  document.getElementById("letra-menos").addEventListener("click", function () { if (nivel > 0) { nivel--; aplicarLetra(); } });
  document.getElementById("letra-mais").addEventListener("click", function () { if (nivel < NIVEIS.length - 1) { nivel++; aplicarLetra(); } });
  aplicarLetra();

  // 3. Natal: some sozinho depois do último dia de pedidos (15/12/2026, horário de Brasília).
  if (Date.now() >= Date.parse("2026-12-16T00:00:00-03:00")) {
    document.querySelectorAll("[data-natal]").forEach(function (el) { el.hidden = true; });
  }

  // 4. Botão flutuante: só aparece depois que o botão do início saiu da tela.
  var flut = document.getElementById("flutuante");
  var primeiro = document.querySelector(".heroi a[data-zap]");
  if ("IntersectionObserver" in window && flut && primeiro) {
    flut.classList.add("guardado");
    new IntersectionObserver(function (itens) { flut.classList.toggle("guardado", itens[0].isIntersecting); }).observe(primeiro);
  }

  // 5. Animações: só para quem não pediu menos movimento no aparelho.
  var calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cena = document.querySelector(".heroi-cena");
  var rever = document.getElementById("rever");
  if (calmo) {
    cena.classList.add("pronta");
    rever.hidden = true;
  } else {
    raiz.classList.add("anima");
    var tocar = function () { cena.classList.remove("tocando"); void cena.offsetWidth; cena.classList.add("tocando"); };
    setTimeout(tocar, 500);
    rever.addEventListener("click", tocar);
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (itens) {
        itens.forEach(function (i) { if (i.isIntersecting) { i.target.classList.add("visivel"); obs.unobserve(i.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".aparece").forEach(function (el) { obs.observe(el); });
    } else {
      raiz.classList.remove("anima");
    }
  }
})();
