# Clerk production setup for mobile release

This app uses Clerk for regular email/password users and GitHub OAuth for the admin account.

## App identity

- Android package: `com.lowstylelife.przepisnik`
- Expo scheme: `przepisnik`
- Admin GitHub username: `wojokoka-max`

## Required Clerk settings

In the production Clerk application:

1. Enable email/password sign-in.
2. Enable GitHub OAuth as a social connection.
3. Add the admin GitHub account as the only account allowed to enter admin mode in the app:
   - mobile env: `EXPO_PUBLIC_ADMIN_GITHUB_USERNAME=wojokoka-max`
4. Copy the production publishable key into the mobile production environment:
   - `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...`
5. Copy the production secret key into the backend production environment:
   - `CLERK_SECRET_KEY=sk_live_...`
6. If the Clerk proxy is used, set:
   - backend: `CLERK_PROXY_URL=/api/__clerk`
   - mobile: `EXPO_PUBLIC_CLERK_PROXY_URL=https://YOUR_API_DOMAIN/api/__clerk`

## Redirect URLs to allow

For the installed Android build:

```text
przepisnik://sso-callback
```

For Expo Go development builds, keep using the redirect URL printed by Expo/Clerk during local testing. It changes with the local Expo session and should not be treated as the production URL.

## Production checklist

Before building the `.aab` for Google Play:

- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_live_`.
- Backend `CLERK_SECRET_KEY` starts with `sk_live_`.
- GitHub OAuth is enabled in the same Clerk production application.
- `przepisnik://sso-callback` is allowed in Clerk redirect settings.
- Login with email/password works in an Android build outside Expo Go.
- Admin GitHub login works only for `wojokoka-max`.
- A non-admin GitHub account is rejected by the app.

## Notes

Do not store `CLERK_SECRET_KEY` in the mobile app. It belongs only on the backend.
