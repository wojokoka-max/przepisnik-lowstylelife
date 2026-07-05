# Przepiśnik LowStyleLife

Repozytorium zawiera eksport projektu z Replit. Aktywnym frontem aplikacji jest aplikacja mobilna Expo.

## Aktywna aplikacja

- `artifacts/przepisnik-mobile` - aplikacja mobilna Expo / React Native. To jest główna aplikacja do dalszego rozwoju i publikacji w Google Play.
- `artifacts/api-server` - backend/API używany przez aplikację.
- `lib` - współdzielone biblioteki i wygenerowany klient API.

## Artefakty archiwalne

- `artifacts/przepisnik` - webowy artefakt Vite/React z eksportu. Nie usuwać bez osobnego audytu, bo może zawierać historyczną logikę, dane albo komponenty przydatne dla mobilki.
- `artifacts/mockup-sandbox` - sandbox/mockupy z eksportu. Nie jest aktywną aplikacją mobilną.

## Zasada pracy

Przy zmianach produktu mobilnego pracujemy w `artifacts/przepisnik-mobile` oraz, jeśli trzeba, w `artifacts/api-server` i `lib`. Nie usuwamy archiwalnych artefaktów tylko dlatego, że nie są obecnie aktywną apką mobilną.
