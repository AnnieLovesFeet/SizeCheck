# SizeCheck

Prosta aplikacja przeglądarkowa do porównywania pomiarów i pobierania obrazu wyniku.

## Szybka mapa kodu

- `index.html` — struktura strony, formularz i przyciski.
- `styles.css` — wygląd oraz układ elementów.
- `js/main.js` — punkt startowy; łączy moduły i podpina zdarzenia interfejsu.
- `js/dick.js` — model pomiaru oraz renderowanie podglądu i wyniku.
- `js/comparison.js` — dodawanie/usuwanie pomiarów, puszki i butelki, limity oraz losowanie.
- `js/results.js` — skala wyniku oraz eksport PNG z elementami i znakiem wodnym.

## Gdzie wprowadzać zmiany

- Zasady losowania lub dodawania elementów: `js/comparison.js`.
- Wygląd renderowanego pomiaru: `js/dick.js` i w razie potrzeby `styles.css`.
- Pobieranie i skład obrazu: `js/results.js`.
- Nowe przyciski albo inicjalizacja: `index.html` i `js/main.js`.
- Zmiana tekstu, formularza lub struktury strony: `index.html`.

Moduły korzystają z importów ES; jeśli zmieniasz nazwę eksportowanej funkcji, zaktualizuj jej import w `js/main.js`.

## Uruchomienie

Uruchom lokalny serwer HTTP w katalogu projektu, np. `py -m http.server 8000`, a następnie otwórz `http://localhost:8000`. Serwer jest potrzebny do obsługi modułów ES i wczytania listy krajów z `assets/data.json`. Projekt nie wymaga instalacji pakietów ani procesu buildowania. Eksport PNG ładuje `html2canvas` z CDN, więc ta funkcja wymaga połączenia z internetem.
