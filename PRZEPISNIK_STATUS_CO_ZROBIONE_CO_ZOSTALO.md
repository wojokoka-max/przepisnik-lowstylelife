# Przepiśnik - co zrobione i co zostało

Stan na 2026-07-12.

## Co już zrobione

### Repozytorium

- Repo GitHub istnieje: `wojokoka-max/przepisnik-lowstylelife`.
- Główna wersja robocza:

```text
C:\Users\kurpi\OneDrive\Dokumenty\gentlyfy\przepisnik-lowstylelife-import
```

- Kopia do pracy w VS Code:

```text
C:\Users\kurpi\OneDrive\Pulpit\PRZEPISNIK_LOWSTYLELIFE_OTWORZ_W_VSCODE_AKTUALNE_2026-07-07
```

- Ostatnie zmiany zostały commitowane i wypchnięte na GitHub.

### Aplikacja mobilna

- Głównym kierunkiem jest aplikacja mobilna.
- Expo działało na Androidzie.
- Poprawiono ekran logowania.
- Link admin GitHub jest mały i dyskretny.
- Logowanie zaczęło działać.
- Usunięto duży, mylący przycisk dyktowania.
- Dodano informację, że tekst pojawi się po zatrzymaniu nagrania.

### Logowanie i Clerk

- Clerk jest podpięty.
- Działa logowanie email/hasło.
- Działa tryb admin przez GitHub.
- Admin jest ograniczony do konta:

```text
wojokoka-max
```

- Dodano dokument:

```text
artifacts/przepisnik-mobile/CLERK_PRODUCTION_SETUP.md
```

### AI i backend

- Backend lokalny działał na porcie `3001`.
- Import ze zdjęcia został naprawiony przez backend AI.
- Dyktowanie zostało podpięte przez backend i OpenAI.
- Poprawiono jakość dyktowania po polsku.
- Import ze zdjęcia jest praktycznie rozdzielony na składniki i przygotowanie.
- Dodano instrukcję wdrożenia backendu:

```text
artifacts/api-server/DEPLOYMENT.md
```

- Dodano przykłady zmiennych produkcyjnych:

```text
artifacts/api-server/.env.production.example
artifacts/przepisnik-mobile/.env.production.example
```

### Przepisy

- Dodano edycję zapisanego przepisu.
- Dodano notatkę ręczną/manualną.
- Jest ręczne dodawanie przepisu.
- Jest import ze zdjęcia.
- Jest dyktowanie do pól.
- Jest dodawanie z URL.

### Google Play - technicznie

- Ustawiono nazwę aplikacji:

```text
Przepiśnik. Inteligentny organizer kulinarny
```

- Ustawiono Android package:

```text
com.lowstylelife.przepisnik
```

- Ustawiono:

```text
versionCode: 1
```

- Dodano `eas.json`.
- Produkcyjny build Android jest ustawiony jako `.aab`.
- Dodano skrypt:

```powershell
pnpm --filter @workspace/przepisnik-mobile release:check
```

- `release:check` przechodzi.

### Dokumenty publikacyjne

Dodano:

```text
GOOGLE_PLAY_RELEASE_PLAN.md
GOOGLE_PLAY_CONSOLE_CHECKLIST.md
GOOGLE_PLAY_APP_SETUP.md
PRIVACY_POLICY_DRAFT_PL.md
GOOGLE_PLAY_DATA_SAFETY_DRAFT.md
GOOGLE_PLAY_STORE_LISTING_DRAFT.md
GOOGLE_PLAY_TEST_PLAN.md
MONETIZATION_OPTIONS.md
PRODUCTION_ROLLOUT_CHECKLIST.md
```

### Monetyzacja

- Nic płatnego nie zostało jeszcze wdrożone.
- To jest celowe.
- Profile, premium i subskrypcje nie są jeszcze ustalone.
- Dodano tylko dokument z wariantami:

```text
MONETIZATION_OPTIONS.md
```

## Co jeszcze zostało

### 1. Publiczny backend HTTPS

To jest najważniejszy następny krok.

Trzeba wdrożyć backend tak, żeby miał publiczny adres:

```text
https://TWÓJ_BACKEND/api
```

Bez tego u innych użytkowników nie zadziała:

- zdjęcie,
- dyktowanie,
- generator.

### 2. Produkcyjny Clerk

Trzeba ustawić w panelu Clerk:

- produkcyjną aplikację,
- email/hasło,
- GitHub OAuth,
- redirect:

```text
przepisnik://sso-callback
```

- produkcyjny `pk_live_...`,
- produkcyjny `sk_live_...` tylko dla backendu.

### 3. Produkcyjne zmienne środowiskowe

Dla backendu:

```text
OPENAI_API_KEY
CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_PROXY_URL
```

Dla aplikacji mobilnej:

```text
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
EXPO_PUBLIC_API_BASE_URL
EXPO_PUBLIC_ADMIN_GITHUB_USERNAME
EXPO_PUBLIC_CLERK_PROXY_URL
```

### 4. Build APK testowy

Trzeba zrobić APK poza Expo Go:

```powershell
pnpm dlx eas-cli build --platform android --profile preview
```

### 5. Testy aplikacji

Trzeba sprawdzić:

- logowanie email/hasło,
- admin GitHub,
- import zdjęcia,
- dyktowanie,
- generator,
- ręczne dodanie przepisu,
- edycję przepisu,
- notatki,
- planer,
- listę zakupów,
- zachowanie po zamknięciu i ponownym otwarciu aplikacji.

### 6. Google Play Console

Trzeba:

- założyć lub dokończyć konto,
- utworzyć aplikację,
- ustawić język polski,
- ustawić aplikację jako darmową na start,
- nie dodawać jeszcze płatności,
- nie dodawać reklam.

### 7. Test zamknięty Google

Jeśli Google tego zażąda:

- 12 testerów,
- 14 dni testów zamkniętych.

### 8. Polityka prywatności

Szkic jest gotowy, ale trzeba uzupełnić:

- dane właścicielki,
- email kontaktowy,
- datę,
- publiczny link.

### 9. Data safety

Szkic jest gotowy, ale trzeba potwierdzić finalnie:

- czy dane są tylko lokalne czy też serwerowe,
- czy backend zapisuje treści w logach,
- czy dodamy analytics,
- czy dodamy crash reporting,
- czy będzie monetyzacja.

### 10. Listing sklepu

Trzeba przygotować:

- ikonę 512 x 512,
- grafikę 1024 x 500,
- screeny z prawdziwej aplikacji Android,
- finalny krótki opis,
- finalny pełny opis.

### 11. Monetyzacja

Jeszcze nie wdrażać.

Najpierw:

- testy,
- koszt AI,
- decyzja o profilach/premium,
- decyzja czy subskrypcja czy limity.

### 12. Produkcyjny AAB

Po testach APK i konfiguracji produkcyjnej robimy:

```powershell
pnpm dlx eas-cli build --platform android --profile production
```

To daje plik `.aab` do Google Play.

## Najbliższy następny krok

Najbliższy realny krok:

```text
Uruchomić publiczny backend AI pod HTTPS.
```

Bez tego aplikacja może działać u Ciebie lokalnie, ale nie będzie gotowa dla innych użytkowników ani do sensownego testu Google Play.
