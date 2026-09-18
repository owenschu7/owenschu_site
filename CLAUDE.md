# Branch policy

Work only on the `staging` branch. Do not touch `main`:

- Never `git checkout main`, `git switch main`, or otherwise check out `main`.
- Never merge, rebase onto, or commit to `main`.
- Never `git push` anything to `main`, or `staging`.
- Never delete or force-push any branch without explicit confirmation.

If a task seems to require touching `main`, stop and ask first.
