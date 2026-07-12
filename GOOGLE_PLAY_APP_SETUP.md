# Google Play app setup draft

Use this when creating the app record in Google Play Console.

## Basic setup

- App name: `Przepiśnik. Inteligentny organizer kulinarny`
- Default language: Polish (`pl-PL`)
- App or game: App
- Free or paid: Free for now
- App category: choose later after store copy is final; likely `Food & Drink` or `Lifestyle`
- Contains ads: No, unless ads are added later
- In-app purchases/subscriptions: No for now, because monetization is not decided yet

## Important naming note

The app can keep the full display name in Expo/Android config. If Google Play rejects the store listing title because of character limits, use:

```text
Przepiśnik
```

and put the phrase below in the short description:

```text
Inteligentny organizer kulinarny
```

Do not change monetization just to complete this screen.

## Initial access model

Current release posture:

- email/password login for regular users,
- small admin GitHub link for the owner,
- early/closed access messaging is still present,
- AI features require the production backend.

For Google review, the safest option is to provide a regular reviewer account or allow reviewers to create one.

## Values that must match the build

- Android package name: `com.lowstylelife.przepisnik`
- First production `versionCode`: `1`
- Backend URL: to be filled after public backend deployment
- Clerk production key: to be filled after production Clerk setup

## Do not configure yet

- paid app price,
- subscriptions,
- in-app products,
- ads mediation,
- premium profiles or diet tiers.

These belong after the first stable test build.
