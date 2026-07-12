# Google Play Data safety - draft

This is a working draft for the Google Play Data safety form.

## Current app behavior

- Login: Clerk email/password for users.
- Admin login: GitHub OAuth for owner/admin.
- AI backend: recipe generation, photo import, dictation/transcription.
- No ads configured.
- No monetization configured yet.
- No in-app purchases configured yet.

## Data categories likely to declare

### Personal info

- Email address
- Purpose: account management, authentication
- Shared with service provider: Clerk

### User-generated content

- Recipes, ingredients, notes, planner content, shopping list content
- Purpose: app functionality
- Stored/processed by the app/backend depending on implementation

### Photos and videos

- Photos selected or taken by the user for recipe import
- Purpose: app functionality, AI extraction
- Shared with AI provider through backend when the user chooses photo import

### Audio

- Audio recorded for dictation
- Purpose: transcription and app functionality
- Shared with AI provider through backend when the user chooses dictation

### App activity / diagnostics

- Technical request data may be processed by backend logs
- Purpose: app functionality, security, diagnostics

## Security notes

- OpenAI secret key must stay on backend only.
- Clerk secret key must stay on backend only.
- Mobile app may contain only `EXPO_PUBLIC_` values.
- Production backend must use HTTPS.

## Before submission

Confirm these answers after production backend and storage are final:

- Whether recipe content is stored only locally or also server-side.
- Whether backend logs contain user content or only technical metadata.
- Whether any analytics SDK is added.
- Whether any crash reporting SDK is added.
- Whether monetization, subscriptions or ads are added.

## Sources

- Google Play Data safety:
  https://support.google.com/googleplay/android-developer/answer/10787469
- Google Play User Data policy:
  https://support.google.com/googleplay/android-developer/answer/10144311
