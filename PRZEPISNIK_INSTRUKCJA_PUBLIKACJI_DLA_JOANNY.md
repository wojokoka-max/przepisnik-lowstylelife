# Przepiśnik - instrukcja publikacji dla Joanny

Ten plik prowadzi krok po kroku przez rzeczy, które trzeba ustawić poza kodem, żeby aplikacja mogła trafić do Google Play.

## 1. Najpierw: publiczny backend AI

To jest najważniejszy kolejny krok.

Bez publicznego backendu innym osobom nie zadziałają:

- import przepisu ze zdjęcia,
- dyktowanie,
- generator przepisów.

Backend nie może działać tylko na Twoim komputerze. Musi mieć publiczny adres HTTPS, na przykład:

```text
https://twoj-adres-backendu.pl/api
```

Co trzeba ustawić na hostingu backendu:

```text
OPENAI_API_KEY=twój_klucz_openai
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_PROXY_URL=/api/__clerk
```

Uwaga: `OPENAI_API_KEY` i `CLERK_SECRET_KEY` są sekretami. Nie wklejać ich do aplikacji mobilnej.

Po wdrożeniu backendu sprawdź w przeglądarce:

```text
https://TWÓJ_BACKEND/api/healthz
```

Powinno pokazać:

```json
{"status":"ok"}
```

## 2. Clerk - logowanie produkcyjne

W panelu Clerk trzeba mieć produkcyjną aplikację, nie tylko testową.

W Clerk ustaw:

1. Email/password sign-in: włączone.
2. GitHub OAuth: włączone.
3. Redirect URL dla zbudowanej aplikacji:

```text
przepisnik://sso-callback
```

4. Skopiuj produkcyjny publishable key:

```text
pk_live_...
```

Ten klucz będzie potrzebny w Expo/EAS jako:

```text
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

5. Skopiuj secret key:

```text
sk_live_...
```

Ten klucz dajesz tylko backendowi jako:

```text
CLERK_SECRET_KEY=sk_live_...
```

## 3. Expo/EAS - zmienne do builda mobilnego

Przed buildem produkcyjnym aplikacja mobilna musi znać:

```text
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
EXPO_PUBLIC_API_BASE_URL=https://TWÓJ_BACKEND/api
EXPO_PUBLIC_ADMIN_GITHUB_USERNAME=wojokoka-max
```

Opcjonalnie, jeśli używamy proxy Clerk przez backend:

```text
EXPO_PUBLIC_CLERK_PROXY_URL=https://TWÓJ_BACKEND/api/__clerk
```

Ważne:

- wartości zaczynające się od `EXPO_PUBLIC_` mogą trafić do aplikacji,
- sekretów typu `sk_live_...` i `OPENAI_API_KEY` nie wolno wkładać do aplikacji mobilnej.

## 4. VS Code - sprawdzenie gotowości

W VS Code otwórz folder:

```text
C:\Users\kurpi\OneDrive\Pulpit\PRZEPISNIK_LOWSTYLELIFE_OTWORZ_W_VSCODE_AKTUALNE_2026-07-07
```

W terminalu wpisz:

```powershell
pnpm --filter @workspace/przepisnik-mobile release:check
```

Powinno pokazać same linie `OK` i na końcu:

```text
Release readiness check passed.
```

Potem wpisz:

```powershell
pnpm --filter @workspace/przepisnik-mobile typecheck
```

Jeśli nie ma błędów, konfiguracja aplikacji mobilnej jest spójna.

## 5. Build testowy APK

Najpierw budujemy testowy APK, a nie od razu wersję do sklepu.

W terminalu, z folderu aplikacji mobilnej:

```powershell
cd artifacts\przepisnik-mobile
pnpm dlx eas-cli login
pnpm dlx eas-cli build --platform android --profile preview
```

Ten build służy do testowania na telefonie poza Expo Go.

Testujesz:

- logowanie email/hasło,
- logowanie admin GitHub,
- import zdjęcia,
- dyktowanie,
- generator,
- zapis ręczny,
- edycję przepisu,
- notatki,
- planer,
- listę zakupów.

## 6. Build produkcyjny AAB

Dopiero po udanym APK robimy plik dla Google Play:

```powershell
pnpm dlx eas-cli build --platform android --profile production
```

To wygeneruje plik `.aab`.

Ten plik wgrywa się do Google Play Console.

## 7. Google Play Console

W Google Play Console utwórz nową aplikację.

Ustawienia startowe:

```text
Typ: aplikacja
Język domyślny: polski
Płatna/darmowa: darmowa na start
Reklamy: nie
Zakupy/subskrypcje: jeszcze nie
```

Nazwa produktu:

```text
Przepiśnik. Inteligentny organizer kulinarny
```

Jeśli Google odrzuci nazwę jako za długą, użyj:

```text
Przepiśnik
```

a w krótkim opisie wpisz:

```text
Inteligentny organizer kulinarny
```

## 8. Testy Google Play

Jeśli konto Google Play Developer jest nowe i osobiste, Google może wymagać:

- minimum 12 testerów,
- minimum 14 kolejnych dni testów zamkniętych.

Do testów przygotuj:

- listę maili testerów albo grupę Google,
- instrukcję instalacji,
- testowe konto, jeśli recenzent nie ma sam zakładać konta.

## 9. Polityka prywatności

Masz szkic:

```text
PRIVACY_POLICY_DRAFT_PL.md
```

Trzeba uzupełnić:

- imię/nazwę właścicielki lub działalności,
- email kontaktowy,
- datę,
- finalny publiczny link.

Google Play wymaga publicznego URL polityki prywatności. Sam plik w repo nie wystarczy.

## 10. Data safety

Masz szkic:

```text
GOOGLE_PLAY_DATA_SAFETY_DRAFT.md
```

Przed wysłaniem do Google trzeba potwierdzić:

- czy przepisy zostają tylko lokalnie czy też na serwerze,
- czy backend zapisuje treści w logach,
- czy dodamy analytics,
- czy dodamy crash reporting,
- czy dodamy płatności lub reklamy.

## 11. Listing sklepu

Masz szkic:

```text
GOOGLE_PLAY_STORE_LISTING_DRAFT.md
```

Trzeba przygotować:

- ikonę 512 x 512,
- grafikę wyróżniającą 1024 x 500,
- prawdziwe screeny z telefonu,
- krótki opis,
- pełny opis.

Screeny muszą być z aplikacji mobilnej Android, nie z wersji webowej.

## 12. Monetyzacja

Na razie niczego nie ustawiaj jako płatne.

Nie ustawiaj jeszcze:

- subskrypcji,
- zakupów w aplikacji,
- płatnej aplikacji,
- reklam,
- premium profili.

Najpierw trzeba przetestować aplikację i policzyć koszt AI.

Potem można wybrać model:

- darmowy core + limity AI,
- subskrypcja dla większych limitów AI,
- premium funkcje planowania,
- jednorazowy zakup.

Jeśli płacimy za funkcje cyfrowe w aplikacji Android, trzeba użyć Google Play Billing.

## 13. Kiedy wolno wypuścić produkcję

Nie wysyłaj produkcji, jeśli:

- backend działa tylko lokalnie,
- logowanie wpada w pętlę lub niebieski ekran,
- AI nie działa poza Expo Go,
- nie ma publicznej polityki prywatności,
- Data safety nie jest spójne z aplikacją,
- nie ma testów APK poza Expo Go.

Można iść do produkcji dopiero, gdy:

- publiczny backend HTTPS działa,
- Clerk produkcyjny działa,
- APK działa na telefonie,
- AI działa u Ciebie poza Expo Go,
- testy zamknięte są przeprowadzone, jeśli Google ich wymaga,
- polityka prywatności jest publiczna,
- listing i screeny są gotowe.
