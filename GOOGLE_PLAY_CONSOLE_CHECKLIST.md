# Google Play Console checklist

Use this when creating the app in Google Play Console.

## Account

1. Create or open Google Play Console.
2. Confirm whether the developer account is personal or organization.
3. If this is a new personal developer account, prepare for the closed testing requirement:
   - at least 12 testers,
   - at least 14 consecutive days,
   - testers must opt in and keep access during the test.

## New app

Suggested values:

- App name: `Przepiśnik. Inteligentny organizer kulinarny`
- Default language: Polish
- App or game: App
- Free or paid: start as free until monetization is decided
- Declarations:
  - no ads, unless ads are added later,
  - no paid digital goods yet, unless subscriptions/in-app purchases are added later.

## Internal/closed testing

Before production release:

1. Upload the first Android App Bundle `.aab`.
2. Create an internal testing track first.
3. Then create a closed testing track if Google requires it.
4. Add tester emails or a Google Group.
5. Test at minimum:
   - account creation,
   - email/password login,
   - admin GitHub login,
   - recipe from photo,
   - dictation,
   - recipe generator,
   - manual recipe save,
   - recipe editing,
   - planner,
   - shopping list.

## Access for Google review

If the app is closed or requires login, prepare reviewer instructions:

```text
The app requires an account. Reviewers may create an email/password account from the login screen.
Admin GitHub login is only for the owner and is not required for standard app review.
AI features require an internet connection.
```

If the app is still invite-only, create a test account for review before sending the production request.

## Things not to finalize yet

Do not configure paid subscriptions, in-app purchases, or ads until monetization is decided.

## Sources

- App testing requirements:
  https://support.google.com/googleplay/android-developer/answer/14151465
- Create and set up your app:
  https://support.google.com/googleplay/android-developer/answer/9859152
- Prepare your app for review:
  https://support.google.com/googleplay/android-developer/answer/9859455
