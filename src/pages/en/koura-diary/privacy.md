---
layout: ../../../layouts/DocLayout.astro
title: Privacy Policy
app: Koura Diary
hub: /en/koura-diary/
updated: 2026-08-17
---

> This English text is provided for convenience. In case of any discrepancy, the [Japanese version](/koura-diary/privacy) prevails.

This policy describes how user information is handled in "Koura Diary" (the "App").

## 1. Information We Collect

- **Records you enter**: Animal profiles (name, species, sex, adoption date, etc.), weight, carapace length, temperature/humidity, food, excretion, notes, photos, and so on. These are stored in a storage service (Google Firebase: Firestore / Storage).
- **Account information**: The App starts with an anonymous account. To carry over data or share with family, you can link an Apple or Google account. Authentication is handled by Firebase Authentication, and the App uses the user's identifier (user ID) as the owner of records. Email addresses and the like provided by the sign-in provider (Apple / Google) are used for authentication; the App does not independently store or use them.
- **Nickname (display name)**: To show whose record is whose in household (family) sharing, a nickname you optionally set is stored.
- **Content posted to "Everyone's Turtles"**: The posted photo, the animal's name, species, and adoption date (used to display time since adoption), and the poster's user ID. See "4. Publication via the Posting Feature" for handling.
- **Error / diagnostic information (crash data)**: When the app terminates unexpectedly, information (location of occurrence, device model, OS version, etc.) is collected by Firebase Crashlytics. This is for quality improvement, not to identify individuals. It is not collected in development (debug) builds.
- **Abuse prevention**: Firebase App Check verifies that access comes from a legitimate, untampered app. This confirms device legitimacy and is not personal information.

This app does not display ads. We do not track you for advertising purposes (e.g. IDFA, advertising ID).

- **Usage data (analytics)**: To improve the app, we use Google Firebase Analytics to measure how screens are used (e.g. which screens are used and how often). When you use the in-app tip (support) feature, Google Firebase Analytics also automatically records that a purchase occurred (including the product ID and amount; this does not include payment details such as card numbers). This does not include user content such as pet names or photos. Measurement uses a device/app-scoped identifier (the Analytics app-instance ID), which is not linked to the account information (e.g. email address) described above. We do not use this data for advertising purposes and do not share it with third parties.
- Analytics collection is on by default. You can turn it off anytime from **Settings → Share usage data**. Once turned off, no further data is sent.

## 2. Purposes of Use

- Storing, displaying, and analyzing care records (dietary-balance guides, body-condition guides, etc.)
- Account authentication, data carry-over, and sharing within a family (household)
- Understanding issues and improving the App's quality
- Understanding app usage and improving app quality (screen usage measurement)

## 3. Sharing within a Family (Household)

The App lets you create a "household" and share records with family. **When you share a household, the records, photos, and animal profiles of that household can be viewed and edited by invited members of the same household.** Choose whom to share with at your own discretion and responsibility. You can also leave a household.

## 4. Publication via the Posting Feature "Everyone's Turtles"

When you post to "Everyone's Turtles" and the developer approves publication, **the posted photo and the animal's name, species, and time since adoption become visible to all users of the App (including users who have not linked an account).** Please post with this scope of publication in mind.

- Posted photos are stored and published after metadata such as location data (Exif) has been removed.
- You can withdraw (delete) your posts at any time from within the App; withdrawing deletes the photo and information.
- If you block a poster, that information (the other party's identifier and, for your own reference, the animal name from the post) is **stored as your own data** and is not visible to other users or to the person you blocked.

## 5. Provision to / Entrustment to Third Parties

The App uses the following external services (Google LLC) for storage, authentication, and quality improvement, and the above information is transmitted to and stored by them. Each company's privacy policy applies, and data may be processed on servers outside your country.

- Google Firebase (Firestore / Storage / Authentication / Crashlytics / App Check / Analytics)

The App does not sell or provide user information to any other third party (except as required by law).

## 6. Notifications

Notifications such as reminders are delivered as **local notifications on the device**. No personal information is sent to a server for notifications.

## 7. Your Rights / Managing Data

- Records can be deleted individually at any time within the App.
- From "Settings → Data and Backup," you can **back up (export) and restore (import)** all data, including photos.
- From the bottom of "Settings," you can **delete all data within the App**.
- You can also delete your account and data. See [Account & Data Deletion](/en/koura-diary/account-deletion) for the steps.
- **You can stop sending usage data (analytics) at any time from Settings → Share usage data.**
- For other requests such as disclosure or deletion, please contact us via the contact below.

## 8. Revisions

This policy may be revised without prior notice. Revised content takes effect once posted on this page.

## 9. Contact

For questions about this policy or the handling of personal information, please use the contact form in the app under "Settings → Contact."
