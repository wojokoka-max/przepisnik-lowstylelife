# Backend AI deployment

The mobile app needs this API to be available publicly over HTTPS before it can work for other users.
Local Expo addresses are only for development.

## What this backend does

- `GET /api/healthz` checks whether the server is alive.
- `POST /api/recipe-from-image` powers recipe import from a photo.
- `POST /api/transcribe-audio` powers dictation.
- `POST /api/recipe-from-name` and `POST /api/recipe-from-ingredients` power recipe generation.
- `/api/__clerk` can proxy Clerk when needed for mobile auth.

## Required production variables

Set these on the hosting platform, not in committed files:

- `OPENAI_API_KEY`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CLERK_PROXY_URL=/api/__clerk`
- `PORT` if the platform does not provide it automatically

Use `.env.production.example` as the template.

## Build and start commands

Run commands from the repository root:

```powershell
pnpm install --frozen-lockfile
pnpm --filter @workspace/api-server build
pnpm --filter @workspace/api-server start
```

The server must answer:

```text
https://YOUR_API_DOMAIN/api/healthz
```

Expected response:

```json
{"status":"ok"}
```

## Connect mobile production build

After the backend has a public HTTPS URL, set this for the mobile app before building for Google Play:

```text
EXPO_PUBLIC_API_BASE_URL=https://YOUR_API_DOMAIN/api
```

Do not put `OPENAI_API_KEY` in the mobile app. The key must stay only on the backend.

## Recommended order

1. Deploy this API server to a Node-compatible host.
2. Add production environment variables on that host.
3. Check `/api/healthz`.
4. Test photo import and dictation against the public URL.
5. Set `EXPO_PUBLIC_API_BASE_URL` for the EAS production build.
6. Build the Android `.aab`.
