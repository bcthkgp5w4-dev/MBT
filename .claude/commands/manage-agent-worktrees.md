---
name: manage-agent-worktrees
description: Workflow command scaffold for manage-agent-worktrees in MBT.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /manage-agent-worktrees

Use this workflow when working on **manage-agent-worktrees** in `MBT`.

## Goal

Adds, removes, or ignores agent worktree directories used for Claude AI code sessions.

## Common Files

- `.claude/worktrees/agent-*`
- `.gitignore`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Add or remove .claude/worktrees/agent-* directories
- Update .gitignore to ignore .claude/worktrees/
- Commit changes with appropriate chore message

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.