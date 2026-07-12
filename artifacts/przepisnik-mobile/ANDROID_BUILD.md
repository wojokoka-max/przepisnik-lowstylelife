# Android builds

Use these steps after the public backend and production Clerk are configured.

## 1. Check local release readiness

From the repository root:

```powershell
pnpm --filter @workspace/przepisnik-mobile release:check
pnpm --filter @workspace/przepisnik-mobile typecheck
```

## 2. Log in to Expo/EAS

```powershell
pnpm dlx eas-cli login
```

## 3. Configure EAS project

Run from `artifacts/przepisnik-mobile`:

```powershell
pnpm dlx eas-cli build:configure
```

## 4. Build test APK

Use this before sending anything to Google Play:

```powershell
pnpm dlx eas-cli build --platform android --profile preview
```

Install this APK on Android and test:

- email/password login
- admin GitHub login
- photo import
- dictation
- recipe generator
- editing saved recipes
- planner and shopping list

## 5. Build production AAB

Build this only after preview APK testing is clean:

```powershell
pnpm dlx eas-cli build --platform android --profile production
```

The result is an Android App Bundle `.aab`, the file Google Play uses for store releases.

## Important

Before building production, the mobile environment must use:

```text
EXPO_PUBLIC_API_BASE_URL=https://YOUR_PUBLIC_API_DOMAIN/api
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
EXPO_PUBLIC_ADMIN_GITHUB_USERNAME=wojokoka-max
```

Do not build production while the app still depends on a local computer IP address.
