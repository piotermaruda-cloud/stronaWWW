# Specyfikacja wdrożeniowa serwisu Consultrain
**Wersja:** 1.1 (Zaktualizowana po realizacji Etapu 1)  
**Data aktualizacji:** 18.10.2026  
**Status projektu:** Etap 1 zakończony (Fundament wizualny i Strona Główna)  
**Repozytorium GitHub:** [https://github.com/piotermaruda-cloud/stronaWWW](https://github.com/piotermaruda-cloud/stronaWWW)

---

## 1. Cel i charakterystyka wdrożenia

Celem projektu jest budowa lekkiego, w pełni niezależnego i bezpiecznego serwisu internetowego dla marki **Consultrain** (szkolenia, doradztwo, ratowanie projektów oraz produkt **Project Cockpit**).

### Kluczowe założenia architektoniczne:
* **Brak zewnętrznych zależności (Zero Dependency):** Serwis nie odpytuje zewnętrznych API, nie ładuje zewnętrznych bibliotek JS, CDN-ów, fontów z Google Fonts ani skryptów śledzących.
* **Czysty stos statyczny:** Wszystkie pliki to semantyczny HTML5, nowoczesny CSS (zmienne CSS, Flexbox/Grid, clamp) oraz lekki Vanilla JavaScript.
* **Pełna przenośność (Portability):** Całość działa bezpośrednio po otwarciu pliku `index.html` z dysku lokalnego lub po wrzuceniu na dowolny statyczny serwer WWW (np. Cloudflare Pages, GitHub Pages, Apache, Nginx).
* **Bezpieczeństwo (Cybersecurity):** Brak bazy danych SQL w chmurze i brak serwerowego środowiska wykonawczego całkowicie eliminuje wektory ataków typu SQL Injection, Server-Side Request Forgery czy przejęcie sesji.

---

## 2. Rejestr zmian i modyfikacji (Elementy, z których zrezygnowano)

Zgodnie z dyspozycją inwestora, w celu zachowania maksymalnej niezależności, lekkości i bezpieczeństwa, wprowadzono następujące modyfikacje względem pierwotnej specyfikacji:

| Pierwotny zapis w specyfikacji | Zmiana / rezygnacja | Uzasadnienie biznesowo-techniczne |
| :--- | :--- | :--- |
| **Bramki płatności i sklep online** (koszyk, transakcje, checkout) | **Rezygnacja z e-commerce** na rzecz formularzy zapytań i rezerwacji | Uproszczenie architektury, brak opłat prowizyjnych, brak ryzyka awarii procesorów płatności, zgodność z modelem B2B opartym na bezpośrednim kontakcie. |
| **Zewnętrzne bazy danych w chmurze** (Supabase, Firebase, bazy SQL) | **Rezygnacja z chmurowych baz danych**. Obsługa danych lokalnie (pliki JSON / Excel `.xlsx`) | Pełna kontrola nad danymi, brak podatności na ataki na bazy danych, zerowe koszty utrzymania chmury. |
| **Zewnętrzne fonty (Google Fonts / CDN)** | **Rezygnacja z zewnętrznych fontów**. Użycie systemowego stosu fontów (`system-ui`, opcjonalnie lokalny Inter) | Eliminacja zewnętrznych zapytań HTTP, ochrona prywatności (RODO / brak wycieku IP do Google), natychmiastowe ładowanie strony bez przesunięć układu (CLS). |
| **Frameworki frontendowe** (React, Tailwind CSS, shadcn/ui) | **Rezygnacja z ciężkich bundlerów i frameworków**. Czysty HTML + CSS + JS | Kod możliwy do bezpośredniej, ręcznej edycji w dowolnym edytorze HTML/kodu bez konieczności uruchamiania środowisk Node.js / NPM. |
| **Pliki cookies i banery zgód (CMP)** | **Całkowita rezygnacja ze skryptów cookies** i śledzących | Strona nie instaluje żadnych plików cookies, dzięki czemu nie wymaga irytującego banera cookies i jest w 100% zgodna z RODO/ePrivacy od pierwszej sekundy. |
| **Zewnętrzne serwisy analityczne** (np. GA4) | **Brak skryptów analitycznych stron trzecich** | Zachowanie prywatności użytkowników oraz maksymalna szybkość działania. |

---

## 3. Zrealizowany zakres — Etap 1

W ramach pierwszej iteracji wdrożono:

1. **Design System marki Consultrain:**
   * Kolorystyka: Granat podstawowy (`#173B5E`), ciemny granat (`#0F2740`), pomarańczowy akcent CTA (`#F28C28`), jasne tło sekcji (`#F4F6F8`), ciemny grafit tekstu (`#1E2A36`).
   * Kontrast spełniający wymogi WCAG 2.2 AA (tekst na pomarańczu i szarości pomocnicze dobrane pod kątem czytelności).
   * Pełna responsywność (Desktop, Tablet, Mobile) z menu hamburgerowym obsługiwanym również w pełni z klawiatury (Escape, Tab, Enter/Spacja).
2. **Strona Główna (`index.html`) z 7 kompletnymi sekcjami:**
   * **Hero:** Hasło główne „Projekty pod kontrolą. Cele osiągnięte.”, opis, główne CTA, link do ratowania projektów oraz autorski wektorowy schemat cyklu zarządzania projektem (zastępujący generyczne zdjęcia).
   * **W czym możemy Ci pomóc:** 3 ścieżki (Rozwijam kompetencje, Potrzebuję wsparcia, Szukam narzędzia).
   * **Szkolenie główne:** Dynamiczne renderowanie faktów o szkoleniu z pliku konfiguracyjnego (brak fikcyjnych dat – przy braku wpisów wyświetla się rzetelny komunikat informacyjny).
   * **Stabilizowanie projektów:** Sekcja ratunkowa z bezpośrednim CTA do rozmowy.
   * **Project Cockpit:** Wprowadzenie do aplikacji przeglądarkowej.
   * **Wiedza (Blog):** Wizytówka bazy wiedzy z bezpiecznym renderowaniem artykułów (lub komunikatem o przygotowaniu materiałów).
   * **Końcowe CTA i spójna Stopka:** Pełne dane firmy, linki do regulaminów i polityk, prawa autorskie.
3. **Plik konfiguracyjny `js/config.js`:**
   * Centralne, bezpieczne miejsce do edycji danych biznesowych (dane rejestrowe firmy, edycje i terminy szkoleń, wpisy blogowe).
   * Flaga `showTodoMarkers: true/false` umożliwiająca podgląd elementów oczekujących na uzupełnienie przed oficjalną publikacją.
4. **Podstrona informacyjna `w-przygotowaniu.html`:**
   * Zgodnie z wytycznymi specyfikacji – brak „martwych” lub pozorowanych podstron. Każdy odnośnik do dalszych etapów prowadzi do czytelnego komunikatu o trwających pracach.

---

## 4. Struktura plików w repozytorium GitHub

Kod został wysłany do repozytorium `https://github.com/piotermaruda-cloud/stronaWWW`:

```text
├── index.html              # Kompletna strona główna (Etap 1)
├── w-przygotowaniu.html    # Uczciwy komunikat dla podstron kolejnych etapów
├── favicon.svg             # Lekki wektorowy logotyp serwisu
├── README.md               # Dokumentacja techniczna i instrukcja uruchomienia
├── css/
│   └── style.css           # Czysty CSS (zmienne, layout, komponenty, RWD)
└── js/
    ├── config.js           # Konfiguracja danych (dane firmy, szkolenia, wpisy)
    └── main.js             # Skrypt obsługi menu, dostępności i renderowania
```

---

## 5. Plan kolejnych etapów

* **Etap 2 — Podstrony usługowe i oferta:**
  * Utworzenie stron dedykowanych: `/szkolenia.html`, `/podstawy-zarzadzania-projektami.html`, `/doradztwo.html`, `/ratowanie-projektow.html`.
* **Etap 3 — Prezentacja produktu Project Cockpit:**
  * Strony: `/project-cockpit.html`, cennik licencji w modelu zapytań, FAQ.
* **Etap 4 — Bezpieczne formularze i obsługa danych:**
  * Formularze kontaktowe i zapytania o szkolenia z mechanizmem `mailto:` lub bezpiecznym przesyłaniem na wskazany adres e-mail.
  * Moduł eksportu zapytań do pliku Excel (`.xlsx` / `.csv`) bezpośrednio w przeglądarce.
  * Zabezpieczenia antyspamowe (honeypot, walidacja danych wejściowych).
* **Etap 5 — Baza wiedzy (Blog), podstrony formalne i finalizacja:**
  * Szablon artykułów `/blog.html` i `/artykul.html`, strony formalne (`/regulamin.html`, `/polityka-prywatnosci.html`), `sitemap.xml` i optymalizacja meta tagów SEO.
