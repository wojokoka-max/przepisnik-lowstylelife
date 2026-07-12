# Production rollout checklist

Use this only after internal/closed testing.

## Must be done before production

- Public backend HTTPS is live.
- `https://YOUR_API_DOMAIN/api/healthz` returns `{"status":"ok"}`.
- Production Clerk keys are configured.
- GitHub admin login works in a non-Expo Android build.
- Email/password login works in a non-Expo Android build.
- Photo import works in a non-Expo Android build.
- Dictation works in a non-Expo Android build.
- Recipe generator works in a non-Expo Android build.
- Saved recipes can be edited.
- Planner does not create obvious repeated meals in one day.
- Privacy policy URL is public.
- Data safety form matches the privacy policy.
- Store listing screenshots come from the real Android app.
- No monetization claims are present unless monetization is actually implemented.

## First production release

Recommended approach:

1. Upload production `.aab`.
2. Fill release notes.
3. Start with a limited/staged rollout if available.
4. Watch crashes, login issues and AI backend errors.
5. Increase rollout only after the first users can complete the core flows.

## First release notes draft

```text
Pierwsza wersja Przepiśnika: organizer przepisów, planner posiłków, lista zakupów oraz funkcje AI do tworzenia i importowania przepisów.
```

## Do not release if

- login loops or blue refresh screen still appear,
- AI depends on a local computer address,
- production Clerk keys are missing,
- privacy policy is not public,
- tester feedback shows critical recipe saving bugs,
- app still needs Expo Go to work.
