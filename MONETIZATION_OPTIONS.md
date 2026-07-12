# Monetization options - not implemented yet

This document is for product decisions after the first stable test build.

## Current decision

Do not implement monetization yet.

Reason:

- profiles/diets premium are not final,
- AI usage costs need measurement,
- Google Play test build should prove that login, AI, planner and saving recipes are stable first.

## Google Play rule to remember

If the Android app charges for digital features, app functionality, subscriptions or premium access distributed through Google Play, it generally must use Google Play's billing system unless a specific exception/program applies.

Source:

https://support.google.com/googleplay/android-developer/answer/9858738

## Candidate models

### Option A: Free app with AI daily limits

- Everyone can use core recipe storage.
- AI has daily/monthly free limits.
- Paid tier raises AI limits later.

Pros:

- Easy to understand.
- Protects OpenAI costs.

Risks:

- Requires careful usage counting.
- Users may feel blocked if free limits are too low.

### Option B: Subscription for AI features

- Core organizer remains free.
- AI generation, photo import and dictation beyond a free trial require subscription.

Pros:

- Matches recurring OpenAI costs.
- Cleaner than one-time payment for ongoing AI usage.

Risks:

- Requires Google Play Billing.
- Needs cancellation/restore purchase handling.

### Option C: One-time premium unlock

- One payment unlocks extra organizer features.
- AI may still need separate limits because AI has ongoing cost.

Pros:

- Simple message for users.

Risks:

- Bad fit if AI costs grow over time.

### Option D: Paid app

- User pays before installing.

Pros:

- Simple store model.

Risks:

- Harder to acquire testers/users.
- Does not solve ongoing AI cost unless AI is limited.

## Recommended direction for later

Start with:

```text
Free core organizer + measured AI limits
```

Then, after test data:

```text
Premium/subscription for higher AI limits and advanced planning features
```

## Do not build before deciding

- subscription product IDs,
- premium profile/diet list,
- free AI quota,
- admin unlimited behavior in production,
- whether family sharing or free trials are needed.
