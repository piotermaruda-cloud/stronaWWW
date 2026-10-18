/**
 * Consultrain — skrypt strony (Etap 1). Vanilla JS, bez bibliotek.
 *
 * Moduły:
 *  1. Nawigacja: menu mobilne + rozwijane podmenu (klawiatura: Enter/Spacja, Esc, Tab)
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

  // Podmenu: przycisk z aria-expanded steruje listą o id z aria-controls
  var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-dropdown]"));
  function closeAll(except) {
    triggers.forEach(function (t) {
      if (t === except) return;
      t.setAttribute("aria-expanded", "false");
      document.getElementById(t.getAttribute("aria-controls")).hidden = true;
    });
  }
  triggers.forEach(function (t) {
    var menu = document.getElementById(t.getAttribute("aria-controls"));
    t.addEventListener("click", function () {
      var open = t.getAttribute("aria-expanded") !== "true";
      closeAll(t);
      t.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    });
    // Zamknięcie podmenu, gdy fokus opuści cały element (Tab)
    t.parentElement.addEventListener("focusout", function (e) {
      if (!t.parentElement.contains(e.relatedTarget) && !mq.matches) { t.setAttribute("aria-expanded", "false"); menu.hidden = true; }
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = triggers.filter(function (t) { return t.getAttribute("aria-expanded") === "true"; })[0];
    if (open) { closeAll(); open.focus(); }
    else if (toggle && toggle.getAttribute("aria-expanded") === "true") { setMobileOpen(false); toggle.focus(); }
  });
  document.addEventListener("click", function (e) { if (!e.target.closest(".nav__item")) closeAll(); });

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
})();
