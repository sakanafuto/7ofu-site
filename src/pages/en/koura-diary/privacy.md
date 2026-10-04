---
layout: ../../../layouts/DocLayout.astro
title: Privacy Policy
app: Koura Diary
hub: /en/koura-diary/
updated: 2026-10-04
---

> This English text is provided for convenience. In case of any discrepancy, the [Japanese version](/koura-diary/privacy) prevails.

This policy describes how user information is handled in "Koura Diary" (the "App").

## 1. Information We Collect

- **Records you enter**: Animal profiles (name, species, sex, adoption date, etc.), weight, carapace length, temperature/humidity, food, excretion, notes, photos, and so on. These are stored in a storage service (Google Firebase: Firestore / Storage).
- **Account information**: The App starts with an anonymous account. To carry over data or share with family, you can link an Apple or Google account. Authentication is handled by Firebase Authentication, and the App uses the user's identifier (user ID) as the owner of records. Email addresses and the like provided by the sign-in provider (Apple / Google) are used for authentication; the App does not independently store or use them.
- **Nickname (display name)**: To show whose record is whose in household (family) sharing, a nickname you optionally set is stored.
- **Content posted to "Everyone's Turtles" and "Today's Turtle"**: The posted photo, the animal's name, species, and adoption date (used to display time since adoption), the caption on "Everyone's Turtles", and the poster's user ID. We also keep, as operational records, the result of automatic photo screening (scores, linked to the poster's user ID), records of reports (the reporter's user ID), records of suspensions, and daily posting counts (used for rate limiting against abuse). See "4. Publication via the Posting Feature" for handling.
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
- Deciding on publication of posts and handling inappropriate posts and users (automatic photo screening, handling reports, notifications to the developer)
- Displaying machine translations of post captions

## 3. Sharing within a Family (Household)

The App lets you create a "household" and share records with family. **When you share a household, the records, photos, and animal profiles of that household can be viewed and edited by invited members of the same household.** Choose whom to share with at your own discretion and responsibility. You can also leave a household.

## 4. Publication via the Posting Features "Everyone's Turtles" and "Today's Turtle"

When your post to "Everyone's Turtles" is published (after the developer's approval for first-time posts and similar cases, or immediately for users with an established posting history), **the posted photo and the animal's name, species, and time since adoption become visible to all users of the App (including users who have not linked an account).** Please post with this scope of publication in mind.

- Posted photos are stored and published after metadata such as location data (Exif) has been removed.
- You can withdraw (delete) your posts at any time from within the App; withdrawing deletes the photo and information.
- If you block a poster, that information (the other party's identifier and, for your own reference, the animal name from the post) is **stored as your own data** and is not visible to other users or to the person you blocked.
- A caption attached to a post may be machine-translated into the viewer's language by Google Cloud Translation (the original text is also shown).
- To decide on publication and to handle reports, the content of a post (photo, animal name, species, and caption) is also sent as a notification to the messaging service the developer uses for operations (Slack). Only the developer can see these notifications, and they are used solely for moderation.

### Publication via "Today's Turtle" (one photo per day, 24 hours)

- When you post to "Today's Turtle", **the photo and the animal's name, species, and time since adoption are visible to all users of the App for 24 hours.** You can post at most one photo per day, and the post is hidden automatically after 24 hours.
- Before publication, the photo is **screened automatically** by Google Cloud Vision (detection of inappropriate images and human faces). Only photos that pass are published; photos that do not pass are never shown to anyone. No copy of the photo is made for screening. The screening result (scores) is kept as an operational record. Automatic screening does not guarantee accuracy. Photos in which a human face is detected are not published (small faces and the like may not be detected).
- If a published post is reported, it is hidden immediately and the developer is notified (via Slack). Where necessary, the developer may suspend the user's access to "Today's Turtle".
- You can withdraw a post at any time. After a post is hidden, withdrawn, not published, or expires, the photo file may remain on the storage service for **up to a few days** (it is not visible during that time).

## 5. Provision to / Entrustment to Third Parties

The App uses the following external services for storage, authentication, quality improvement, and decisions on publishing posts, and the above information is transmitted to and stored by them. Each company's privacy policy applies, and data may be processed on servers outside your country.

- Google Firebase (Firestore / Storage / Authentication / Crashlytics / App Check / Analytics)
- Google Cloud Vision (automatic screening of "Today's Turtle" photos) and Google Cloud Translation (machine translation of captions)
- Slack (Slack Technologies, LLC): notifications to the developer for publication decisions and handling of reports

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
