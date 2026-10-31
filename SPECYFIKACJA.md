# Specyfikacja wdrożeniowa serwisu Consultrain
**Wersja:** 1.4 (Zaktualizowana po wdrożeniu podstrony Polityka prywatności oraz przycisku Nasze usługi)  
**Data aktualizacji:** 31.10.2026  
**Status projektu:** Wdrożono Stronę Główną, podstrony ofertowe (Doradztwo, Stabilizowanie projektów IT), Project Cockpit, O firmie, Szkolenia, Formularz kontaktowy oraz dedykowaną podstronę Polityka prywatności (`polityka-prywatnosci.html`).  
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
| **Zewnętrzne bazy danych w chmurze** (Supabase, Firebase, bazy SQL) | **Rezygnacja z chmurowych baz danych**. Obsługa danych lokalnie (pliki JSON / Excel `.xlsx`) lub przesyłanie mailem | Pełna kontrola nad danymi, brak podatności na ataki na bazy danych, zerowe koszty utrzymania chmury. |
| **Zewnętrzne fonty (Google Fonts / CDN)** | **Rezygnacja z zewnętrznych fontów**. Użycie systemowego stosu fontów (`system-ui`, opcjonalnie lokalny Inter) | Eliminacja zewnętrznych zapytań HTTP, ochrona prywatności (RODO / brak wycieku IP do Google), natychmiastowe ładowanie strony bez przesunięć układu (CLS). |
| **Frameworki frontendowe** (React, Tailwind CSS, shadcn/ui) | **Rezygnacja z ciężkich bundle'ów i frameworków**. Czysty HTML + CSS + JS | Kod możliwy do bezpośredniej, ręcznej edycji w dowolnym edytorze HTML/kodu bez konieczności uruchamiania środowisk Node.js / NPM. |
| **Pliki cookies i banery zgód (CMP)** | **Całkowita rezygnacja ze skryptów cookies marketingowych i śledzących** | Strona nie instaluje śledzących plików cookies, dzięki czemu nie wymaga irytującego banera cookies i jest w 100% zgodna z RODO/ePrivacy od pierwszej sekundy. |
| **Zewnętrzne serwisy analityczne** (np. GA4) | **Brak skryptów analitycznych stron trzecich** | Zachowanie prywatności użytkowników oraz maksymalna szybkość działania. |
| **Zewnętrzne widgety kalendarza / spotkań** (np. Calendly, HubSpot Meetings) | **Rezygnacja z zewnętrznych widgetów kalendarza**. Zgłoszenia przez lekki wewnętrzny formularz z celem `cel=doradztwo` lub `cel=stabilizacja` | Uniknięcie zewnętrznych skryptów śledzących, brak zależności od zewnętrznych dostawców SaaS. |
| **Obce nagłówki benchmarkowe w treści doradztwa i stabilizacji** | **Usunięcie przypadkowych tytułów kart/szkiców zewnętrznych firm** | Wyczyszczenie treści podstron z przypadkowo wklejonych nagłówków referencyjnych (np. Kettle Consulting, TrueProject, iCentric) i skupienie na autorskich filarach Consultrain. |
| **Rejestracja użytkowników i newsletter** | **Brak rejestracji kont i brak newslettera** | Potwierdzone w Polityce prywatności: brak zbierania bazy użytkowników, brak profilowania, formularz służy wyłącznie do jednorazowego kontaktu biznesowego. |

---

## 3. Zrealizowany zakres prac

### Etap 1: Fundament wizualny i Strona Główna (`index.html`)
* **Design system:** Kolory marki (granat `#173B5E`, pomarańcz `#F28C28`, grafit `#1E2A36`, jasnoszary `#F4F6F8`), typografia systemowa o wysokiej czytelności, płynne skalowanie `clamp()`.
* **Sekcje strony głównej:**
  1. Hero z kluczowym przekazem i głównymi CTA.
  2. Statystyki / wskaźniki projektowe (3 karty liczbowe).
  3. Trzy filary oferty: Szkolenia, Doradztwo i Stabilizacja, Project Cockpit.
  4. Rozwiązanie problemów projektowych (przed / po wdrożeniu Consultrain).
  5. Sekcja „Dlaczego Consultrain?” (praktyka, brak sztywnych schematów, elastyczność).
  6. Baner CTA z bezpośrednim przejściem do kontaktu.
  7. Spójna stopka z 4 kolumnami nawigacji i danymi formalnymi.

### Etap 2-4: Formularz kontaktowy i podstrony bazowe
* **Formularz kontaktowy (`kontakt.html`):** Weryfikacja antyspamowa, pole-pułapka dla botów (honeypot), walidacja pól, obsługa parametrów predefiniowanego celu kontaktu (`?cel=licencja`, `?cel=doradztwo`, `?cel=stabilizacja`), data kontaktu min. +3 dni robocze.
* **Aplikacja Project Cockpit (`project-cockpit.html`):** Wizualny panel KPI, funkcje, cennik licencyjny, CTA do zamówienia licencji.
* **O firmie (`o-firmie.html`):** Misja, wartości, doświadczenie praktyczne.
* **Szkolenia (`szkolenia.html`) oraz Usługi (`uslugi.html`):** Centra nawigacyjne dla segmentów oferty.

### Etap 5: Podstrona Doradztwo (`doradztwo.html`)
* Wdrożenie pełnej podstrony doradczej na podstawie dostarczonego konspektu biznesowego:
  1. Hero z breadcrumbem i hasłem przewodnim: *„Dobre projekty zaczynają się od dobrych decyzji.”*
  2. Kiedy warto skorzystać z doradztwa (6 kluczowych wyzwań organizacji).
  3. 4 filary wsparcia: Organizacja i procesy projektowe, Planowanie i kontrola projektów, Nadzór nad dostawcami IT, Dobór i wdrażanie metodyk.
  4. Zestawienie 5 wymiernych korzyści dla klienta.
  5. Trzyetapowy proces współpracy (Rozpoznanie -> Rekomendacje -> Wdrożenie i wsparcie).
  6. Dlaczego Consultrain (praktyka, brak zbędnych procedur do szuflady).
  7. Końcowe CTA z linkiem do formularza z parametrem `?cel=doradztwo`.

### Etap 6: Podstrona Stabilizowanie projektów IT (`stabilizowanie-projektow.html`)
* Wdrożenie podstrony dla projektów w kryzysie:
  1. Hero z hasłem: *„Projekt wymyka się spod kontroli? Pomagamy odzyskać nad nim kontrolę.”*
  2. Kiedy projekt potrzebuje interwencji (8 sygnałów ostrzegawczych).
  3. 4 etapy działań naprawczych: Diagnoza, Plan naprawczy, Stabilizacja, Przywrócenie przewidywalności.
  4. Efekty stabilizacji: Kontrola harmonogramu, ograniczenie strat, uporządkowanie zakresu, raportowanie.
  5. 4-krokowy proces stabilizacji w dedykowanym responsywnym układzie siatki (`.dr-steps--4`).
  6. Dlaczego Consultrain (niezależne spojrzenie, doświadczenie zarządcze, znajomość PRINCE2/PMBoK/Agile).
  7. Końcowe CTA prowadzące do formularza kontaktowego z parametrem `?cel=stabilizacja`.

### Etap 7: Przycisk „Nasze usługi” oraz Polityka prywatności (`polityka-prywatnosci.html`)
* **Strona główna (`index.html`):** Zmiana głównego przycisku CTA w sekcji Hero z „Zobacz szkolenia” na „Nasze usługi” z przekierowaniem do centrum usług (`uslugi.html`).
* **Podstrona Polityka prywatności (`polityka-prywatnosci.html`):**
  * Wdrożenie kompletnej treści prawnej zgodnej z RODO:
    1. Administrator danych: CONSULTRAIN, Warszawa, NIP: 951-12-47-29, e-mail: `biuro@consultrain.pl`.
    2. Zakres i cel przetwarzania: brak rejestracji, brak baz danych, brak newslettera; obsługa wyłącznie zapytań z formularza (imię i nazwisko, e-mail, telefon).
    3. Podstawa prawna: art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes) oraz lit. b RODO (działania przedumowne).
    4. Sposób i okres przechowywania danych: przesyłanie mailem, brak zapisu w bazie WWW, archiwizacja w skrzynce pocztowej przez czas uzasadniony sprawą.
    5. Odbiorcy danych: podmioty hostingu/poczty, brak sprzedaży i marketingu.
    6. Prawa osób: dostęp, sprostowanie, usunięcie, ograniczenie, sprzeciw, skarga do Prezesa UODO.
    7. Pliki cookies: brak cookies marketingowych i analitycznych.
    8. Zmiany polityki: data aktualizacji 10.2026.
  * **Formatowanie pisma prawniczego:** Dedykowana klasa CSS `.legal` – mała czcionka (13 px / `.8125rem`), wyjustowany tekst (`text-align: justify`), zoptymalizowana wysokość linii (`1.7`), hierarchiczne numerowane sekcje i listy.
* **Globalna aktualizacja odnośników:**
  * Zastąpienie tymczasowych odnośników `w-przygotowaniu.html?strona=polityka-prywatnosci` bezpośrednim linkiem do `polityka-prywatnosci.html` we wszystkich 10 stopkach stron (`index.html`, `doradztwo.html`, `stabilizowanie-projektow.html`, `uslugi.html`, `szkolenia.html`, `project-cockpit.html`, `o-firmie.html`, `kontakt.html`, `w-przygotowaniu.html`, `polityka-prywatnosci.html`).
  * Aktualizacja odnośnika w checkboxie zgody RODO w formularzu kontaktowym (`kontakt.html`).

---

## 4. Struktura plików w repozytorium GitHub

```text
/
├── index.html                      # Strona główna z przyciskiem „Nasze usługi”
├── doradztwo.html                  # Podstrona usługi doradztwa projektowego IT
├── stabilizowanie-projektow.html   # Podstrona ratowania i stabilizacji projektów IT
├── uslugi.html                     # Centrum usług (doradztwo, stabilizowanie)
├── szkolenia.html                  # Strona oferty szkoleń
├── project-cockpit.html            # Prezentacja i cennik aplikacji Project Cockpit
├── o-firmie.html                   # Strona o firmie, wartości i misja
├── kontakt.html                    # Formularz kontaktowy z obsługą celów i antyspamem
├── polityka-prywatnosci.html       # Dedykowana podstrona Polityki prywatności (format prawniczy)
├── w-przygotowaniu.html            # Bezpieczny komunikat dla pozostałych podstron w trakcie prac
├── favicon.svg                     # Lekki wektorowy logotyp serwisu
├── README.md                       # Dokumentacja techniczna i instrukcja uruchomienia
├── SPECYFIKACJA.md                 # Niniejsza specyfikacja wdrożeniowa i rejestr zmian v1.4
├── css/
│   └── style.css                   # Czysty CSS (zmienne, layout, komponenty, sekcje, .legal, RWD)
└── js/
    ├── config.js                   # Konfiguracja danych kontaktowych
    └── main.js                     # Skrypt obsługi menu, parametrów URL (?cel=) i interakcji
```

---

## 5. Dalsze zaplanowane kroki
1. Uzupełnienie danych firmy w `js/config.js` (dokładny adres, telefon, weryfikacja 10-cyfrowego NIP).
2. Konfiguracja adresu e-mail odbiorcy formularza kontaktowego.
3. Opracowanie podstron: Artykuły (Blog), Regulamin serwisu, Regulamin szkoleń oraz Terminy i zapisy.
