# 🌿 GitHub Workflow

To ensure smooth collaboration and maintain a stable codebase, the team follows a feature-branch workflow.

---

## Branch Structure

### `main`

- Production-ready code.
- Only receives code from the `development` branch.
- Direct commits are **not allowed**.

---

### `development`

- Integration branch.
- All completed features are merged here after review.
- This branch should always remain stable.

---

### `feature/*`

Each team member develops their assigned task in a separate feature branch.

Examples:

```
feature/authentication
feature/dashboard
feature/questionnaire
feature/workshops
feature/resources
feature/profile
```

---

# 👨‍💻 Development Workflow

## Step 1 — Pick an Assigned Task

Each team member works only on the feature assigned to them.

Example:

- Authentication
- Dashboard
- Questionnaire
- Workshops
- Resources

---

## Step 2 — Update Your Local Repository

Always start from the latest development branch.

```bash
git checkout development
git pull origin development
```

---

## Step 3 — Create a Feature Branch

Create a new branch for your task.

```bash
git checkout -b feature/feature-name
```

Example:

```bash
git checkout -b feature/authentication
```

---

## Step 4 — Develop the Feature

Work only within your assigned module.

Commit regularly with meaningful commit messages.

Example:

```bash
git add .
git commit -m "Implement JWT authentication"
```

---

## Step 5 — Keep Your Branch Up-to-Date

Before opening a Pull Request, synchronize your branch with the latest development branch.

```bash
git checkout development
git pull origin development

git checkout feature/authentication
git merge development
```

Resolve any merge conflicts before continuing.

---

## Step 6 — Push Your Branch

```bash
git push origin feature/authentication
```

---

## Step 7 — Open a Pull Request

Create a Pull Request with:

- **Base Branch:** `development`
- **Compare Branch:** `feature/authentication`

Include:

- Description of the feature
- Screenshots (if UI changes)
- Testing performed

---

## Step 8 — Code Review

At least one team member reviews the Pull Request before it is merged.

Review checklist:

- Code follows project standards
- No unnecessary files committed
- Feature works as expected
- No merge conflicts
- No broken functionality

Only approved Pull Requests may be merged.

---

## Step 9 — Merge into Development

Once approved, merge the feature branch into the `development` branch.

Delete the feature branch after a successful merge.

---

## Step 10 — Final Release

When all features are complete and tested:

```
development
        │
        ▼
      main
```

The `main` branch represents the final submission or production-ready version.

---

# 📌 Team Collaboration Guidelines

To maintain a clean and organized repository, all team members should follow these guidelines:

- Never commit directly to the `main` branch.
- Always create a new feature branch before starting work.
- Pull the latest changes from `development` before coding.
- Write clear and meaningful commit messages.
- Keep Pull Requests focused on a single feature.
- Review another team member's code before approving a merge.
- Resolve merge conflicts on your feature branch before requesting a review.
- Test your feature locally before pushing to GitHub.
- Do not modify another team member's assigned module without discussion.

---

# ✅ Commit Message Convention

Use concise, descriptive commit messages.

Examples:

```
feat: implement JWT authentication
feat: add wellness questionnaire
feat: create workshop registration API

fix: resolve login validation bug
fix: correct assessment score calculation

refactor: reorganize Flask routes

docs: update README

style: improve dashboard layout

test: add authentication unit tests
```

---

# 📋 Pull Request Checklist

Before requesting a review, ensure that:

- [ ] Code compiles successfully
- [ ] No merge conflicts exist
- [ ] Feature has been tested
- [ ] Documentation has been updated (if required)
- [ ] No unnecessary files are included
- [ ] Commit messages follow the project convention