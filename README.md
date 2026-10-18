# Consultrain — statyczna strona WWW

Czysty HTML + CSS + JavaScript. Bez frameworków, bibliotek, CDN, fontów zewnętrznych, analityki i cookies.

## Uruchomienie
- Otwórz `index.html` bezpośrednio w przeglądarce, **lub**
- wgraj zawartość folderu na dowolny serwer/hosting statyczny.

## Struktura
```
index.html              strona główna (Etap 1)
w-przygotowaniu.html    uczciwy komunikat dla podstron z kolejnych etapów
css/style.css           design system: kolory, typografia, komponenty, RWD
js/config.js            DANE do edycji: firma, terminy szkoleń, artykuły
js/main.js              menu, renderowanie danych, stopka
favicon.svg
```

## Edycja treści
Wszystkie dane dynamiczne są w `js/config.js`. Puste pola (`null`, `[]`) = brak potwierdzonych danych
→ strona pokazuje komunikat lub etykietę „Do uzupełnienia”. Przed publikacją ustaw `showTodoMarkers: false`.
