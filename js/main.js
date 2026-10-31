/**
 * Consultrain — skrypt strony (Etap 1). Vanilla JS, bez bibliotek.
 *
 * Moduły:
 *  1. Nawigacja: menu mobilne (Esc zamyka); bez list rozwijanych
 *  2. Renderowanie danych szkolenia z config.js (formaty PL, strefa Europe/Warsaw)
 *  3. Renderowanie artykułów (maks. 3)
 *  4. Stopka: dane firmy, rok, znaczniki „Do uzupełnienia”
 */
(function () {
  "use strict";
  var cfg = window.CONSULTRAIN_CONFIG || {};

  /* ---------- Formatery (PL) ---------- */
  var fmtDate = new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Warsaw" });
  var fmtPLN = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 });
  function date(iso) { return fmtDate.format(new Date(iso + "T12:00:00")); } // DD.MM.RRRR
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- 1. Nawigacja ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  var mq = window.matchMedia("(max-width: 960px)");

  function setMobileOpen(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("span").textContent = open ? "Zamknij" : "Menu";
    nav.dataset.open = String(open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  function syncLayout() {
    if (!nav) return;
    if (mq.matches) setMobileOpen(false); else { nav.dataset.open = "true"; document.body.style.overflow = ""; }
  }
  if (toggle) toggle.addEventListener("click", function () { setMobileOpen(toggle.getAttribute("aria-expanded") !== "true"); });
  mq.addEventListener ? mq.addEventListener("change", syncLayout) : mq.addListener(syncLayout);
  syncLayout();

  // Esc zamyka menu mobilne (menu główne nie ma list rozwijanych — etap 2)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle && toggle.getAttribute("aria-expanded") === "true") { setMobileOpen(false); toggle.focus(); }
  });

  /* ---------- 2. Szkolenie główne ---------- */
  var tEl = document.getElementById("training-facts");
  if (tEl && cfg.training) {
    var today = new Date().toISOString().slice(0, 10);
    var next = (cfg.training.editions || [])
      .filter(function (e) { return e.published && e.start >= today; })
      .sort(function (a, b) { return a.start < b.start ? -1 : 1; })[0];

    if (!next) {
      tEl.innerHTML = '<div class="notice notice--info" role="status"><p>Aktualnie nie ma opublikowanych terminów. ' +
        'Skontaktuj się z nami, aby zapytać o kolejny termin.</p></div>';
    } else {
      var seats = next.seatsLeft > 0
        ? '<span class="badge badge--ok">Wolne miejsca: ' + next.seatsLeft + "</span>"
        : '<span class="badge badge--err">Brak wolnych miejsc</span>';
      var range = next.end && next.end !== next.start ? date(next.start) + " – " + date(next.end) : date(next.start);
      tEl.innerHTML = '<dl class="facts">' +
        "<div><dt>Najbliższy termin</dt><dd>" + range + "</dd></div>" +
        "<div><dt>Forma</dt><dd>" + esc(next.form) + "</dd></div>" +
        "<div><dt>Czas trwania</dt><dd>" + esc(next.hours) + " h</dd></div>" +
        "<div><dt>Cena brutto</dt><dd>" + fmtPLN.format(next.priceGross) + "</dd></div>" +
        "<div><dt>Dostępność</dt><dd>" + seats + "</dd></div></dl>";
    }
  }

  /* ---------- 3. Artykuły ---------- */
  var aEl = document.getElementById("articles");
  if (aEl) {
    var list = (cfg.articles || []).filter(function (a) { return a.published; })
      .sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }).slice(0, 3);
    aEl.innerHTML = list.length
      ? list.map(function (a) {
          return '<article class="card"><div class="card__index">' + esc(a.category || "Artykuł") + "</div><h3>" + esc(a.title) +
            "</h3><p>" + esc(a.excerpt) + '</p><a class="text-link" href="w-przygotowaniu.html?strona=blog">Czytaj artykuł</a></article>';
        }).join("")
      : '<div class="empty" style="grid-column:1/-1"><p style="margin:0">Pierwsze artykuły są w przygotowaniu. Wkrótce znajdziesz tu praktyczne teksty o zarządzaniu projektami.</p></div>';
  }

  /* ---------- 4. Stopka ---------- */
  var c = cfg.company || {};
  var todo = cfg.showTodoMarkers ? '<span class="todo-label">Do uzupełnienia</span>' : "";
  var compEl = document.getElementById("company-data");
  if (compEl) {
    var parts = [c.legalName, c.address, c.nip ? "NIP: " + c.nip : null].filter(Boolean).map(esc);
    var contact = [];
    if (c.email) contact.push('<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + "</a>");
    if (c.phone) contact.push('<a href="tel:' + esc(c.phone.replace(/\s/g, "")) + '">' + esc(c.phone) + "</a>");
    compEl.innerHTML = (parts.length ? parts.join(" · ") : "Dane firmy " + todo) +
      (contact.length ? "<br>" + contact.join(" · ") : "");
  }
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  // Ustawienia cookies: strona nie używa cookies ani zewnętrznych skryptów
  var ck = document.getElementById("cookie-settings");
  if (ck) ck.addEventListener("click", function () {
    alert("Ta strona nie używa plików cookies ani narzędzi śledzących. Nie ma ustawień do zmiany.");
  });

  /* ---------- 5. Animacje przy przewijaniu i aktywna sekcja (etap 3) ----------
   * Elementy .reveal pojawiają się, gdy wejdą w widok. Brak animacji przy
   * prefers-reduced-motion lub braku IntersectionObserver (treść zawsze widoczna). */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    document.documentElement.classList.add("js-reveal");
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); ro.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }
  // Podświetlenie bieżącej sekcji w pasku .pc-subnav
  var subLinks = document.querySelectorAll(".pc-subnav a[href^='#']");
  if (subLinks.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        subLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    subLinks.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t) so.observe(t); });
  }

  /* ---------- 6. Przycisk „do góry” (etap 4) ---------- */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var onScroll = function () { toTop.classList.toggle("is-visible", window.scrollY > 500); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    toTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------- 7. Formularz kontaktowy (etap 4) ----------
   * Walidacja po stronie przeglądarki + ochrona przed botami:
   *  - losowe działanie do rozwiązania,
   *  - ukryte pole-pułapka (wypełnia je tylko bot),
   *  - minimalny czas 3 s od wczytania strony.
   * Najwcześniejsza data kontaktu: dziś + 3 dni robocze (bez sob./niedz.). */
  var form = document.getElementById("contact-form");
  if (form) {
    var CEL = { licencja: "Zapytanie o licencję", doradztwo: "Zapytanie o usługę doradczą", szkolenie: "Zapytanie o szkolenie" };
    var loadedAt = Date.now();
    var f = form.elements;
    var cf = cfg.contactForm || {};

    /** Zwraca datę przesuniętą o n dni roboczych (pomija soboty i niedziele). */
    function addWorkdays(d, n) {
      var r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      while (n > 0) { r.setDate(r.getDate() + 1); var w = r.getDay(); if (w !== 0 && w !== 6) n--; }
      return r;
    }
    function isoLocal(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    var minDate = isoLocal(addWorkdays(new Date(), 3));
    f.termin.min = minDate;
    document.getElementById("termin-hint").textContent = "Najwcześniej: " + minDate.split("-").reverse().join(".");

    // Wstępny wybór celu z adresu, np. kontakt.html?cel=licencja&pakiet=professional
    var qs = new URLSearchParams(location.search);
    // "stabilizacja" (strona Stabilizowanie projektów) to też usługa doradcza
    var celQ = qs.get("cel") === "stabilizacja" ? "doradztwo" : qs.get("cel");
    if (CEL[celQ]) f.cel.value = celQ;
    var pakiet = { starter: "Starter", professional: "Professional", enterprise: "Enterprise" }[qs.get("pakiet")];
    if (pakiet) { f.cel.value = "licencja"; f.tresc.value = "Pakiet: " + pakiet + "\n"; }

    // Licznik znaków
    var counter = document.getElementById("tresc-licznik");
    function updCount() { counter.textContent = "Pozostało: " + (500 - f.tresc.value.length) + " znaków"; }
    f.tresc.addEventListener("input", updCount); updCount();

    // Gwiazdka przy e-mailu / telefonie zależnie od formy kontaktu
    function updReq() {
      document.querySelector('[data-req="email"]').textContent = f.forma.value === "email" ? "*" : "";
      document.querySelector('[data-req="telefon"]').textContent = f.forma.value === "telefon" ? "*" : "";
    }
    f.forma.addEventListener("change", updReq); updReq();

    // Zadanie anty-botowe
    var a, b;
    function newCaptcha() { a = 2 + Math.floor(Math.random() * 8); b = 1 + Math.floor(Math.random() * 9); document.getElementById("captcha-q").textContent = "ile to jest " + a + " + " + b + "?"; f.captcha.value = ""; }
    newCaptcha();

    if (!cf.email) document.getElementById("form-config-notice").innerHTML =
      '<div class="notice notice--warn" role="status" style="margin-bottom:var(--space-3)"><p>Adres do wysyłki zapytań jest w przygotowaniu.</p></div>';

    var errBox = document.getElementById("form-errors");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errs = [], v = function (n) { return f[n].value.trim(); };
      form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.removeAttribute("aria-invalid"); });
      function bad(n, msg) { errs.push(msg); f[n].setAttribute("aria-invalid", "true"); }
      if (!CEL[v("cel")]) bad("cel", "Wybierz cel kontaktu.");
      if (v("imie").length < 2) bad("imie", "Podaj imię i nazwisko.");
      if (!v("termin") || v("termin") < minDate) bad("termin", "Wybierz datę nie wcześniejszą niż " + minDate.split("-").reverse().join(".") + ".");
      if (!v("forma")) bad("forma", "Wybierz preferowaną formę kontaktu.");
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email"));
      if ((v("forma") === "email" || v("email")) && !emailOk) bad("email", "Podaj poprawny adres e-mail.");
      var telOk = /^\+?[0-9 ()-]{9,20}$/.test(v("telefon"));
      if ((v("forma") === "telefon" || v("telefon")) && !telOk) bad("telefon", "Podaj poprawny numer telefonu.");
      if (v("tresc").length < 10) bad("tresc", "Treść zapytania powinna mieć co najmniej 10 znaków.");
      if (parseInt(v("captcha"), 10) !== a + b) bad("captcha", "Błędny wynik działania weryfikacyjnego.");
      if (!f.zgoda.checked) bad("zgoda", "Zaznacz zgodę na przetwarzanie danych.");
      if (errs.length) {
        errBox.hidden = false; errBox.querySelector("p").innerHTML = errs.map(esc).join("<br>");
        if (f.captcha.getAttribute("aria-invalid")) newCaptcha();
        form.querySelector("[aria-invalid]").focus(); return;
      }
      // Bot: wypełnione pole-pułapka lub zbyt szybkie wysłanie → udajemy sukces, nic nie wysyłamy
      var isBot = f.website.value !== "" || Date.now() - loadedAt < 3000;
      if (!isBot && cf.email) {
        var subject = (cf.subjectPrefix || "Zapytanie ze strony") + ": " + CEL[v("cel")];
        var body = ["Cel: " + CEL[v("cel")], "Imię i nazwisko: " + v("imie"), "Firma: " + (v("firma") || "-"),
          "Kontakt najpóźniej do: " + v("termin").split("-").reverse().join("."), "Forma kontaktu: " + (v("forma") === "email" ? "e-mail" : "telefon"),
          "E-mail: " + (v("email") || "-"), "Telefon: " + (v("telefon") || "-"), "", v("tresc")].join("\n");
        location.href = "mailto:" + cf.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      }
      form.hidden = true;
      var t = document.getElementById("form-thanks"); t.hidden = false; t.focus();
    });
  }
})();
