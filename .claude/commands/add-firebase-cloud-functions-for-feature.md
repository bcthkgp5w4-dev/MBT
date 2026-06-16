---
name: add-firebase-cloud-functions-for-feature
description: Workflow command scaffold for add-firebase-cloud-functions-for-feature in MBT.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-firebase-cloud-functions-for-feature

Use this workflow when working on **add-firebase-cloud-functions-for-feature** in `MBT`.

## Goal

Adds or updates Firebase Cloud Functions to support new backend logic for app features (e.g., streak tracking, XP awards, push notifications, leaderboard).

## Common Files

- `functions/src/index.ts`
- `functions/package.json`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or add files in functions/src/ (e.g., index.ts)
- Update functions/package.json if new dependencies are needed
- Deploy or test the updated functions

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.