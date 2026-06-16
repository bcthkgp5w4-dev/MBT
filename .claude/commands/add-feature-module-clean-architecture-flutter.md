---
name: add-feature-module-clean-architecture-flutter
description: Workflow command scaffold for add-feature-module-clean-architecture-flutter in MBT.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-feature-module-clean-architecture-flutter

Use this workflow when working on **add-feature-module-clean-architecture-flutter** in `MBT`.

## Goal

Adds a new feature module to the Flutter app using clean architecture (domain, data, presentation layers), including models, repositories, entities, usecases, providers, and screens/widgets.

## Common Files

- `lib/features/*/data/models/*.dart`
- `lib/features/*/data/repositories/*_repository_impl.dart`
- `lib/features/*/domain/entities/*.dart`
- `lib/features/*/domain/repositories/*.dart`
- `lib/features/*/domain/usecases/*.dart`
- `lib/features/*/presentation/providers/*.dart`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create data layer files: models, datasources, repositories
- Create domain layer files: entities, repositories, usecases
- Create presentation layer files: providers, screens, widgets
- Update shared/core files if necessary (e.g., constants, utils)
- Update pubspec.yaml if dependencies are needed

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.