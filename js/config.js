/**
 * Consultrain — konfiguracja treści dynamicznych (Etap 1).
 *
 * To jedyne miejsce, w którym edytuje się dane biznesowe strony głównej.
 * Zasada ze specyfikacji: NIE wpisujemy niepotwierdzonych danych.
 * Pole ustawione na null = brak danych → strona pokaże uczciwy komunikat
 * lub etykietę „Do uzupełnienia”.
 *
 * Model danych:
 *  company   — dane rejestrowe i kontaktowe (stopka)
 *  training  — szkolenie główne + lista opublikowanych edycji (terminów)
 *  articles  — maks. 3 najnowsze/wyróżnione artykuły na stronie głównej
 */
window.CONSULTRAIN_CONFIG = {
  /** Pokazuj oznaczenia „Do uzupełnienia” (wyłącz przed publikacją). */
  showTodoMarkers: true,

  company: {
    legalName: null,   // np. "Consultrain Jan Kowalski"
    address: null,     // np. "ul. Przykładowa 1, 00-000 Warszawa"
    nip: null,
    email: null,       // np. "kontakt@consultrain.pl"
    phone: null        // np. "+48 600 000 000"
  },

  training: {
    name: "Podstawy zarządzania projektami",
    url: "w-przygotowaniu.html?strona=szkolenia-terminy",
    /**
     * Edycje szkolenia. Format jednej edycji:
     * { start: "2026-11-20", end: "2026-11-21", form: "online na żywo",
     *   hours: 16, priceGross: 1990, seatsLeft: 4, published: true }
     * Pusta lista → komunikat o braku terminów (bez fikcyjnych dat).
     */
    editions: []
  },

  /**
   * Artykuły: { title, excerpt, slug, category, featured, published }
   * Pusta lista → komunikat, że artykuły są w przygotowaniu.
   */
  articles: []
};
