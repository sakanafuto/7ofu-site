---
layout: ../../../layouts/DocLayout.astro
title: Account & Data Deletion
app: Koura Diary
hub: /en/koura-diary/
updated: 2026-07-15
---

> This English text is provided for convenience. In case of any discrepancy, the [Japanese version](/koura-diary/account-deletion) prevails.

This page explains how to delete your account and data in "Koura Diary" (developer: 7ofu).

## Delete in the app (recommended — takes effect immediately)

You can delete your data yourself at any time.

1. Open Koura Diary
2. Open the **Settings** tab and scroll to the **bottom**
3. Tap **"Delete data and account"**
4. Review the confirmation dialog and proceed

This deletes your **account (Apple / Google link) and all of the data listed below**. This cannot be undone.

- If you share records with a family (household), first **leave the household from "Settings → Family sharing"** before proceeding (a household's data belongs to its host).
- To delete **only your data** while keeping your account, use **"Delete all data"** in the same place (this deletes animals, records, photos, and food items, and keeps the Apple / Google link).

## Request deletion without the app

If you cannot operate the app (e.g. a lost device), request deletion via the contact form below. We will process it after verifying your identity.

- [Contact form](/en/koura-diary/contact) (`https://7ofu.dev/en/koura-diary/contact`)

## Data deleted / retained

**Data deleted (on account deletion):**

- Animal profiles (name, species, care type, sex, adoption date, notes, favorite/disliked foods)
- Daily records (weight, carapace length, temperature / water temperature, humidity, meals, excretion, care, notes)
- Photos (today's photo & shell photos) and their files
- The food list
- Your account (Firebase Authentication, Apple / Google link)

**Data retained / retention period:**

- **Crash diagnostics** are collected anonymously and are not linked to you or your account. By the Google Firebase Crashlytics default, they are automatically deleted after **up to 90 days**.
- Files you **exported (backed up) yourself** remain on your device, under your control. Please delete them yourself if needed.
- Except where retention is required by law, no personal data other than the above is retained by the developer.

**Timing:** In-app deletion is **immediate**. Requests via the contact form are processed **promptly (typically within a few days)** after verifying your identity.
