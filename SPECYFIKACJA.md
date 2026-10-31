# Specyfikacja wdrożeniowa serwisu Consultrain
**Wersja:** 1.2 (Zaktualizowana po wdrożeniu podstrony Doradztwo)  
**Data aktualizacji:** 31.10.2026  
**Status projektu:** Wdrożono Stronę Główną oraz podstronę Doradztwo (`doradztwo.html`)  
**Repozytorium GitHub:** [https://github.com/piotermaruda-cloud/stronaWWW](https://github.com/piotermaruda-cloud/stronaWWW)

---

## 1. Cel i charakterystyka wdrożenia

Celem projektu jest budowa lekkiego, w pełni niezależnego i bezpiecznego serwisu internetowego dla marki **Consultrain** (szkolenia, doradztwo, stabilizowanie projektów oraz produkt **Project Cockpit**).

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
| **Frameworki frontendowe** (React, Tailwind CSS, shadcn/ui) | **Rezygnacja z ciężkich bundle'ów i frameworków**. Czysty HTML + CSS + JS | Kod możliwy do bezpośredniej, ręcznej edycji w dowolnym edytorze HTML/kodu bez konieczności uruchamiania środowisk Node.js / NPM. |
| **Pliki cookies i banery zgód (CMP)** | **Całkowita rezygnacja ze skryptów cookies** i śledzących | Strona nie instaluje żadnych plików cookies, dzięki czemu nie wymaga irytującego banera cookies i jest w 100% zgodna z RODO/ePrivacy od pierwszej sekundy. |
| **Zewnętrzne serwisy analityczne** (np. GA4) | **Brak skryptów analitycznych stron trzecich** | Zachowanie prywatności użytkowników oraz maksymalna szybkość działania. |
| **Zewnętrzne widgety kalendarza / spotkań** (np. Calendly, HubSpot Meetings) | **Rezygnacja z zewnętrznych widgetów kalendarza**. Zgłoszenia przez lekki wewnętrzny formularz z celem `cel=doradztwo` | Uniknięcie zewnętrznych skryptów śledzących, brak zależności od zewnętrznych dostawców SaaS. |
| **Obce nagłówki benchmarkowe w treści doradztwa** | **Usunięcie przypadkowych tytułów kart/szkiców zewnętrznych firm** | Wyczyszczenie treści podstrony Doradztwo z przypadkowo wklejonych nagłówków referencyjnych i skupienie na autorskich 4 filarach Consultrain. |

---

## 3. Zrealizowany zakres — Etap 1 & Podstrona Doradztwo

### 1. Design System marki Consultrain:
* Kolorystyka: Granat podstawowy (`#173B5E`), ciemny granat (`#0F2740`), pomarańczowy akcent CTA (`#F28C28`), jasne tło sekcji (`#F4F6F8`), ciemny grafit tekstu (`#1E2A36`).
* Kontrast spełniający wymogi WCAG 2.2 AA.
* Pełna responsywność (Desktop, Tablet, Mobile) z menu hamburgerowym obsługiwanym w pełni z klawiatury.
* Nowe komponenty stylów dla podstrony Doradztwo: `.dr-claim`, `.dr-list`, `.dr-ico`, `.dr-gain`, `.dr-steps`, `.dr-steps--4`.

### 2. Strona Główna (`index.html`) z 7 kompletnymi sekcjami:
* Hero, W czym możemy Ci pomóc, Szkolenie główne, Stabilizowanie projektów, Project Cockpit, Wiedza (Blog), Końcowe CTA i Stopka.

### 3. Podstrona Doradztwo (`doradztwo.html`):
* **Hero podstrony:** Nagłówek *„Dobre projekty zaczynają się od dobrych decyzji”*, lead, wyróżniony claim *„Nie narzucamy jednej metodyki. Znajdujemy rozwiązania, które sprawdzają się w Twoim biznesie”* oraz CTA kierujące do kontaktu.
* **Kiedy warto skorzystać:** Wprowadzenie diagnozujące oraz lista 6 kluczowych wyzwań biznesowo-projektowych z dedykowanymi ikonami wektorowymi SVG.
* **W czym możemy Ci pomóc (4 filary doradztwa):**
  1. *Organizacja i procesy projektowe* (model zarządzania, standardy i procedury, role, odpowiedzialności i ścieżki decyzyjne).
  2. *Planowanie i kontrola projektów* (harmonogramy i zarządzanie zakresem, budżetowanie i kontrola kosztów, zarządzanie ryzykiem i zmianami).
  3. *Nadzór nad dostawcami IT* (weryfikacja planów i zobowiązań dostawców, monitorowanie realizacji zakresu i terminów, uporządkowanie komunikacji i eskalacji).
  4. *Dobór i wdrażanie metodyk* (PRINCE2 i PMBOK, Agile, Scrum i AgilePM, podejścia hybrydowe).
* **Co zyskujesz:** 5 filarów wartości: Przejrzystość, Kontrola, Odpowiedzialność, Efektywność, Przewidywalność.
* **Jak wygląda współpraca (3 kroki):** Krok 1: Rozpoznanie sytuacji, Krok 2: Rekomendacje i plan działania, Krok 3: Wdrożenie i wsparcie.
* **Dlaczego Consultrain:** Wyróżniony blok o praktycznym łączeniu perspektywy biznesowej i technologicznej.
* **Końcowe CTA:** Granatowa sekcja zachęcająca do bezpłatnej konsultacji wstępnej (`kontakt.html?cel=doradztwo`).

### 4. Podstrona Stabilizowanie projektów (`stabilizowanie-projektow.html`):
* **Hero podstrony:** Nadtytuł *„STABILIZOWANIE I NAPRAWA PROJEKTÓW IT”*, nagłówek *„Projekt wymyka się spod kontroli? Pomagamy odzyskać nad nim kontrolę”*, lead, wyróżniony claim *„Nie szukamy winnych. Szukamy rozwiązań.”* oraz CTA kierujące do kontaktu (`kontakt.html?cel=stabilizacja`).
* **Kiedy projekt potrzebuje interwencji:** Wprowadzenie diagnozujące oraz lista 8 kluczowych symptomów kryzysu (opóźnienia, przekroczenia budżetu, niewywiązywanie się dostawców, nieustanna zmiana zakresu, utrata kontroli nad zadaniami, niepewne raporty postępów, narastający konflikt, brak wiarygodnych danych dla zarządu).
* **Co robimy, aby ustabilizować projekt (4 filary działań ratunkowych):**
  1. *Diagnoza rzeczywistej sytuacji* (ocena zaawansowania, identyfikacja przyczyn opóźnień i kosztów, weryfikacja planów dostawców, rozpoznanie najważniejszych zagrożeń).
  2. *Plan naprawczy* (uporządkowanie zakresu i priorytetów, aktualizacja harmonogramu i budżetu, plan ograniczenia ryzyk, uzgodnienia z interesariuszami).
  3. *Stabilizacja i odzyskanie kontroli* (nadzór nad realizacją planu, bieżąca kontrola terminów, kosztów i zakresu, uporządkowanie komunikacji i rozwiązywanie eskalacji).
  4. *Przywrócenie przewidywalności* (wiarygodny plan dalszych prac, jasne odpowiedzialności, przejrzysty system monitorowania, regularna informacja o stanie projektu).
* **Jakie efekty chcemy osiągnąć:** 6 wymiernych rezultatów (Odzyskanie kontroli nad harmonogramem, Ograniczenie dalszych strat, Uporządkowanie zakresu, Poprawa współpracy, Przywrócenie wiarygodnego raportowania, Realny plan zakończenia projektu) oraz etyczne zastrzeżenie dotyczące uczciwej i rzetelnej oceny szans ratunku projektu.
* **Jak wygląda proces stabilizacji (4 kroki):** Krok 1: Szybkie rozpoznanie sytuacji, Krok 2: Niezależna ocena i diagnoza, Krok 3: Plan naprawczy, Krok 4: Wdrożenie i nadzór (zrealizowany w responsywnej siatce 4-kolumnowej `.dr-steps--4`).
* **Dlaczego warto powierzyć nam stabilizację:** Praktyczne doświadczenie w podejmowaniu trudnych decyzji projektowych, łączenie perspektywy biznesu i IT, standardy PRINCE2, PMBoK i Agile oraz niezależność w ocenie.
* **Końcowe CTA:** Granatowa sekcja *„Nie czekaj, aż problemy staną się jeszcze większe”* zachęcająca do rozmowy o sytuacji projektu.
* **Wsparcie w `js/main.js`:** Inteligentne mapowanie parametru `?cel=stabilizacja` na odpowiednią opcję w formularzu kontaktowym.

### 5. Plik konfiguracyjny `js/config.js`:
* Centralne, bezpieczne miejsce do edycji danych biznesowych.

---

## 4. Struktura plików w repozytorium GitHub

Kod jest publikowany w repozytorium `https://github.com/piotermaruda-cloud/stronaWWW`:

```text
├── index.html              # Strona główna
├── doradztwo.html          # Pełna podstrona Doradztwo
├── stabilizowanie-projektow.html # Pełna podstrona Stabilizowanie i naprawa projektów IT
├── w-przygotowaniu.html    # Komunikat dla pozostałych podstron w trakcie prac
├── favicon.svg             # Lekki wektorowy logotyp serwisu
├── README.md               # Dokumentacja techniczna i instrukcja uruchomienia
├── SPECYFIKACJA.md         # Niniejsza specyfikacja wdrożeniowa i rejestr zmian
├── css/
│   └── style.css           # Czysty CSS (zmienne, layout, komponenty, sekcje, RWD)
└── js/
    ├── config.js           # Konfiguracja danych
    └── main.js             # Skrypt obsługi menu, dostępności i interakcji
```
