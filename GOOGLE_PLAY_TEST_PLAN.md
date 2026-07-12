# Google Play test plan

Use this for internal or closed testing before production release.

## Test group

If Google requires closed testing for a new personal developer account:

- prepare at least 12 testers,
- keep the test running for at least 14 consecutive days,
- collect notes about crashes, login problems and confusing screens.

## Test build

Start with:

```powershell
pnpm --filter @workspace/przepisnik-mobile release:check
pnpm --filter @workspace/przepisnik-mobile typecheck
pnpm dlx eas-cli build --platform android --profile preview
```

Only after preview testing is clean, build production:

```powershell
pnpm dlx eas-cli build --platform android --profile production
```

## Critical flows

Each tester should check:

1. Install the app from the test track or APK.
2. Create account with email/password.
3. Log out and log in again.
4. Add recipe manually.
5. Add ingredients and confirm they display one per line.
6. Add recipe from photo:
   - title/notes manually,
   - ingredients from photo,
   - preparation from photo.
7. Add recipe by dictation.
8. Add recipe from URL.
9. Edit a saved recipe.
10. Add a handwritten/manual note.
11. Use generator from dish name.
12. Use generator from ingredients.
13. Add recipe to planner.
14. Check that planner meals do not repeat in a single day.
15. Add items to shopping list.
16. Restart the app and confirm saved data still appears.

## Admin-only checks

Owner/admin should check:

1. GitHub admin login works for `wojokoka-max`.
2. Admin AI limit shows correctly.
3. A non-admin GitHub account is rejected.

## Regression watchlist

Pay special attention to:

- blue refresh screen after login,
- Clerk OAuth redirect loops,
- AI backend unavailable errors,
- photo import producing mixed or broken text,
- dictation language quality,
- Android keyboard hiding important buttons,
- long recipe text overflowing cards,
- planner duplicates across meals/diets.

## Release decision

Do not request production access until:

- no critical login bugs remain,
- AI photo import and dictation work outside Expo Go,
- at least one full day planner can be generated without obvious repetition,
- privacy policy and Data safety answers are final,
- store listing screenshots are made from the real Android build.
