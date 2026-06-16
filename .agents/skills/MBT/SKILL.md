```markdown
# MBT Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill documents the development patterns and workflows for the MBT repository, a Kotlin-based project with modular architecture and clean code conventions. The repository emphasizes clear commit messaging, organized file structure, and repeatable workflows for adding features, managing backend logic, and maintaining agent worktrees. While the main language is Kotlin, some workflows reference Flutter and Firebase Cloud Functions, suggesting a polyglot or multi-platform codebase.

## Coding Conventions

- **File Naming:**  
  Use `snake_case` for all file names.
  ```
  good_example: user_profile_repository.kt
  bad_example: UserProfileRepository.kt
  ```

- **Import Style:**  
  Use **relative imports** within modules.
  ```kotlin
  import ../utils/date_utils
  ```

- **Export Style:**  
  Use **named exports** for clarity.
  ```kotlin
  // In user_profile_repository.kt
  export class UserProfileRepository { ... }
  ```

- **Commit Messages:**  
  Follow [Conventional Commits](https://www.conventionalcommits.org/) with these prefixes:
    - `chore`: for maintenance and non-feature changes
    - `feat`: for new features
  ```
  feat: add habit tracking usecase
  chore: update dependencies
  ```

## Workflows

### Add Feature Module (Clean Architecture, Flutter)
**Trigger:** When implementing a new feature or domain in the Flutter app (e.g., habits, social, challenges, gamification, analytics, AI coach).  
**Command:** `/add-feature-module`

1. **Create Data Layer Files**
    - Models: `lib/features/<feature>/data/models/*.dart`
    - Datasources & Repositories: `lib/features/<feature>/data/repositories/*_repository_impl.dart`
2. **Create Domain Layer Files**
    - Entities: `lib/features/<feature>/domain/entities/*.dart`
    - Repositories: `lib/features/<feature>/domain/repositories/*.dart`
    - Usecases: `lib/features/<feature>/domain/usecases/*.dart`
3. **Create Presentation Layer Files**
    - Providers: `lib/features/<feature>/presentation/providers/*.dart`
    - Screens: `lib/features/<feature>/presentation/screens/*.dart`
    - Widgets: `lib/features/<feature>/presentation/widgets/*.dart`
4. **Update Shared/Core Files** (if needed)
    - e.g., `lib/core/constants.dart`, `lib/core/utils.dart`
5. **Update Dependencies**
    - Edit `pubspec.yaml` as necessary

**Example:**
```bash
/add-feature-module habits
```

---

### Add Firebase Cloud Functions for Feature
**Trigger:** When adding or updating backend logic for a new or existing app feature.  
**Command:** `/add-cloud-function`

1. **Edit or Add Function Files**
    - Main entry: `functions/src/index.ts`
2. **Update Dependencies**
    - Edit `functions/package.json` if new packages are needed
3. **Deploy or Test**
    - Use Firebase CLI to deploy or test the functions

**Example:**
```bash
/add-cloud-function streak-tracking
```

---

### Manage Agent Worktrees
**Trigger:** When cleaning up, adding, or ignoring agent worktree directories created by Claude AI.  
**Command:** `/manage-agent-worktree`

1. **Add or Remove Worktree Directories**
    - `.claude/worktrees/agent-*`
2. **Update .gitignore**
    - Ensure `.claude/worktrees/` is ignored
3. **Commit Changes**
    - Use a `chore` commit message

**Example:**
```bash
/manage-agent-worktree cleanup
```

## Testing Patterns

- **Test File Pattern:**  
  Test files follow the pattern `*.test.*` (e.g., `user_profile.test.kt`)
- **Testing Framework:**  
  The specific framework is unknown, but tests are likely colocated with implementation files or in dedicated test directories.
- **Example:**
  ```kotlin
  // user_profile.test.kt
  import org.junit.Test

  class UserProfileTest {
      @Test
      fun testUserProfileCreation() { ... }
  }
  ```

## Commands

| Command                | Purpose                                                   |
|------------------------|-----------------------------------------------------------|
| /add-feature-module    | Scaffold a new feature module using clean architecture    |
| /add-cloud-function    | Add or update Firebase Cloud Functions for a feature      |
| /manage-agent-worktree | Manage agent worktree directories for Claude AI sessions  |
```
