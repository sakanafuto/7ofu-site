---
layout: ../../../layouts/DocLayout.astro
title: Privacy Policy
app: Kamekoro
hub: /en/kamekoro/
updated: 2026-07-11
---

> This English text is provided for convenience. In case of any discrepancy, the [Japanese version](/kamekoro/privacy) prevails.

"Kamekoro" (the "App") is a reptile-feeding physics puzzle game developed and
operated by an individual developer, 7ofu (the "Developer"). This policy
explains what information the App collects and how it is used.

## 1. Information We Collect and Why

The App does not ask you to enter your real name, email address, or phone
number. The information the App does collect is limited to the following.

| Data | Description | Purpose |
|---|---|---|
| Anonymous auth ID (uid) | A machine-generated identifier created by Firebase Anonymous Authentication that does not identify you personally | To recognize "your" record for the leaderboard feature |
| Score | Your gameplay result | Displayed on the all-time and daily leaderboards (**visible to all users**) |
| Nickname | An optional display name you enter (1–12 characters) | Displayed on the leaderboard (**visible to all users**) |
| Date ("day") | The date a score was submitted (YYYY-MM-DD) | Used to compile the daily leaderboard |
| Update timestamp (updatedAt) | The server-side date/time the score was recorded (assigned automatically by the server) | Records when the leaderboard entry was last updated |
| Crash / diagnostic data | Stack traces and similar technical data collected via Firebase Crashlytics when the App crashes | Used to identify and fix bugs (**collected only in release builds and does not include personally identifying information**) |
| Device identifier (Firebase Installation ID) | An install-scoped identifier that Firebase Crashlytics automatically issues to associate diagnostic data with a device (not something the Developer collects explicitly) | Aggregating crash/diagnostic data (**release builds only**) |

The anonymous auth ID, score, nickname, date, and update timestamp are only
sent when you use the leaderboard feature. If you play entirely offline,
none of this data leaves your device.

### About Nicknames (Important)

Nicknames are **publicly visible to all users** on the leaderboard. Please do
not enter your real name or any information you would not want made public.
Inappropriate words, URLs, and control characters are blocked by an in-app
filter, but the filter is not perfect. If you notice a nickname (including
your own, or another user's) that slipped through the filter, please contact
us using the address in Section 7 below.

## 2. Information We Do Not Collect

The App does **not** collect any of the following:

- Real name, address, phone number, or email address
- Location data
- Contacts (address book)
- Advertising identifiers (IDFA / Google Advertising ID)
- Any tracking or behavioral-advertising data derived from the above

The App does not display any advertising (see ADR-0013).

## 3. Information Stored Only on Your Device (Never Transmitted)

The following data is stored locally on your device (via shared_preferences)
only, and is never sent to the Developer's servers or any third party:

- Your personal best scores (top 3)
- Settings (nickname draft, language, skin, BGM/sound effect toggles)
- Your collection ("Dex") records
- A local cache of your in-app purchase (IAP) unlock status (the source of
  truth is Apple's/Google's payment platform; the App only caches this
  locally to avoid a flash of the locked state while offline)

Uninstalling the App removes this data from your device.

## 4. Third-Party Sharing (Data Processing)

To provide the functionality described in Section 1, the App uses the
following Google (Firebase) services. This is not a "sale" or "sharing" of
your data to a third party in the marketing sense — it is a data-processing
arrangement necessary to operate the App's features.

- **Firebase Authentication** (issues the anonymous auth ID)
- **Cloud Firestore** (stores scores/nicknames; computes and serves the
  leaderboards)
- **Firebase Crashlytics** (collects crash/diagnostic data)
- **Firebase App Check** (blocks abusive requests; does not collect
  additional personal information)

For details on how Google handles data on these services, see the
[Google Privacy Policy](https://policies.google.com/privacy).

If you make an in-app purchase (IAP), payment is processed entirely by the
Apple App Store / Google Play. The App never collects or stores your payment
information (e.g., credit card numbers).

We do not share your information with any third party other than as
described above.

## 5. Where Your Data Is Stored

Scores, nicknames, and related data are stored in Cloud Firestore (Firebase)
on Google Cloud Platform. The physical location of the underlying data
centers is determined by Google's operational policies.

## 6. Children's Privacy (Note for Parents)

The App is rated 4+ (suitable for all ages) and may be used by children. The
App does not collect real names, email addresses, location data, or any
other information that would identify a child personally.

However, because the leaderboard's nickname feature publicly displays
whatever text is entered, **we ask parents to review and guide their
children when choosing a nickname, to make sure it does not contain a real
name or other personally identifying text**. Inappropriate words and URLs
are automatically filtered, but the filter is not exhaustive. If you are
concerned about public display, your child can still fully enjoy the App's
core features — playing the puzzle, tracking a local personal best, and
viewing the collection — entirely offline, without using the leaderboard.

Consistent with the intent of child-directed privacy regulations such as the
U.S. Children's Online Privacy Protection Act (COPPA), the App does not use
behavioral-advertising targeting or third-party tracking directed at
children (and does not display any advertising at all).

## 7. Contact Us / Requesting Deletion

For questions about how the App handles personal information, to report an
inappropriate nickname, or to request deletion of your data, please contact
us at the address below.

**Contact: 7ofu.dev@gmail.com**

### About Data Deletion (An Honest Explanation)

Because the App does not store any contact information (such as an email
address) alongside your data, it is technically difficult to reliably
identify "which record belongs to you" from an anonymous auth ID (uid)
alone. For this reason, **we cannot guarantee that we can reliably and
promptly locate and delete a specific score or nickname record based solely
on a user's request**.

That said, if you contact us at the address above, we will do what we can.
For example, providing details that help identify your record — such as the
approximate date and time you played, the score you recorded, and your
nickname — may allow us to manually locate and delete the matching record
via the Firebase console. If you would like all of your records removed
from the leaderboards entirely, please state this explicitly in your
message.

Note that simply uninstalling the App does not automatically delete any
score or nickname you have already submitted to the leaderboard (only the
on-device data described in Section 3 is removed).

## 8. Changes to This Policy

We may update this policy from time to time to reflect legal requirements
or changes to the App's features. When we make a material change, we will
update this page and try to notify users through the App where practical.
The current version of this policy is always available on this page.

## 9. About the Operator

- Name: 7ofu (individual developer)
- Contact: 7ofu.dev@gmail.com
