# Droga do publikacji w Google Play

Stan na 2026-07-12.

## Kolejność kroków

1. Przygotować techniczną tożsamość aplikacji Android.
   - Status: rozpoczęte.
   - Ustawiono nazwę aplikacji: `Przepiśnik. Inteligentny organizer kulinarny`.
   - Ustawiono identyfikator pakietu Android: `com.lowstylelife.przepisnik`.
   - Ustawiono `versionCode: 1`.
   - Dodano konfigurację EAS dla buildów testowych i produkcyjnego pliku `.aab`.

2. Upewnić się, że backend AI działa publicznie, nie tylko lokalnie.
   - Status: rozpoczęte.
   - Dodano szablony zmiennych produkcyjnych dla backendu i aplikacji mobilnej.
   - Dodano instrukcję wdrożenia backendu: `artifacts/api-server/DEPLOYMENT.md`.
   - Generator, import ze zdjęcia i dyktowanie wymagają API.
   - Przed publikacją `EXPO_PUBLIC_API_BASE_URL` musi wskazywać publiczny adres backendu HTTPS.
   - Klucz OpenAI zostaje po stronie backendu, nigdy w aplikacji mobilnej.

3. Przygotować produkcyjne środowisko logowania.
   - Status: rozpoczęte.
   - Dodano checklistę Clerk: `artifacts/przepisnik-mobile/CLERK_PRODUCTION_SETUP.md`.
   - Clerk musi mieć produkcyjną aplikację i poprawne ustawienia Android/deep link.
   - Aplikacja mobilna musi dostać produkcyjny `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
   - Konto admina przez GitHub zostaje jako tryb administracyjny.

4. Zbudować pierwszą wersję testową Android.
   - Status: rozpoczęte.
   - Dodano lokalny skrypt kontroli gotowości: `pnpm --filter @workspace/przepisnik-mobile release:check`.
   - Dodano instrukcję buildów Android: `artifacts/przepisnik-mobile/ANDROID_BUILD.md`.
   - Najpierw build `preview` jako APK do sprawdzenia poza Expo Go.
   - Potem build `production` jako Android App Bundle `.aab` dla Google Play.

5. Założyć lub dokończyć konto Google Play Console.
   - Status: przygotowane.
   - Dodano checklistę: `GOOGLE_PLAY_CONSOLE_CHECKLIST.md`.
   - Jeśli to nowe konto osobiste, Google może wymagać zamkniętych testów: minimum 12 testerów przez 14 kolejnych dni.

6. Utworzyć aplikację w Google Play Console.
   - Typ: aplikacja.
   - Kategoria robocza: jedzenie i napoje albo styl życia, do decyzji po opisie sklepowym.
   - Monetyzacja: jeszcze nieustalona, więc na tym etapie nie dodajemy subskrypcji ani płatności.

7. Przygotować zgodność i deklaracje.
   - Polityka prywatności.
   - Formularz Data safety.
   - Deklaracja reklam: obecnie brak reklam, jeśli nie dodamy ich później.
   - Instrukcja dostępu dla recenzenta, jeżeli część aplikacji wymaga konta lub admina.

8. Przygotować listing sklepu.
   - Ikona 512x512.
   - Grafika wyróżniająca 1024x500.
   - Zrzuty ekranu telefonu.
   - Krótki opis i pełny opis.
   - Uwaga: tytuł sklepu Google Play ma własne limity, więc finalny tytuł listingu może wymagać krótszej wersji niż nazwa aplikacji w systemie.

9. Uruchomić test zamknięty lub wewnętrzny.
   - Zebrać feedback.
   - Poprawić błędy z testów.
   - Przygotować odpowiedzi do wniosku o produkcję, jeśli Google ich wymaga.

10. Dopiero po stabilnej wersji zdecydować o monetyzacji.
    - Możliwe warianty: limit darmowych generowań AI, pakiet premium, subskrypcja, jednorazowy zakup.
    - Decyzję trzeba połączyć z kosztami OpenAI i polityką Google Play Billing.

11. Wypuścić wersję produkcyjną.
    - Najbezpieczniej etapowo: mały procent użytkowników, obserwacja błędów, potem pełne wdrożenie.

## Źródła wymagań

- Google Play: Target API level requirements for Google Play apps
  https://support.google.com/googleplay/android-developer/answer/11926878
- Google Play: App testing requirements for new personal developer accounts
  https://support.google.com/googleplay/android-developer/answer/14151465
- Google Play: Data safety section
  https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play: Preview assets
  https://support.google.com/googleplay/android-developer/answer/9866151
- Expo: Create your first EAS build
  https://docs.expo.dev/build/setup/
- Expo: Submit to the Google Play Store
  https://docs.expo.dev/submit/android/
