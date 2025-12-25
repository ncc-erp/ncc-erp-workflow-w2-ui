# Commit Guideline for NCC ERP Workflow W2 UI

This project uses **Husky** and **Commitlint** to enforce commit message conventions and run pre-commit checks. Follow this guide to ensure your commits meet the project's standards.

---

## 1. Commit Message Format

Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard:

```
<type>(W2-<ticket-number>): <description>
```

### Examples:
- `feat(W2-123): add login functionality`
- `fix(W2-456): resolve task creation bug`
- `docs(W2-789): update README with setup instructions`
- `refactor(W2-101): improve code structure`
- `test(W2-112): add unit tests for TaskService`

### Allowed Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `revert`: Reverting a previous commit
- `BREAKING CHANGE`: Introduces a breaking change

### Rules:
- **Scope**: Must always follow the format `W2-<ticket-number>` (e.g., `W2-123`).
- **Subject**: Must be in lowercase (e.g., `add login functionality`).

---

## 2. Pre-commit Checks

Before committing, the following checks are automatically run by Husky:

1. **Run Tests**:
   ```bash
   pnpm test
   ```
2. **Build Project**:
   ```bash
   pnpm build
   ```
3. **Lint Staged Files**:
   ```bash
   npx lint-staged --allow-empty
   ```

If any of these checks fail, the commit will be aborted.

---

## 3. Commitlint Rules

Commitlint ensures that your commit messages follow the defined rules. The configuration is located in `commitlint.config.cjs`:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'test',
        'revert',
        'hotfix',
        'BREAKING CHANGE',
      ],
    ],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'upper-case'],
    'scope-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
  },
};
```

---

## 4. How to Commit

1. **Stage your changes**:
   ```bash
   git add .
   ```

2. **Commit with a proper message**:
   ```bash
   git commit -m "feat(W2-123): add login functionality"
   ```

3. **If commit fails due to message format**:
   - Amend the commit message:
     ```bash
     git commit --amend -m "fix(W2-456): resolve task creation bug"
     ```
   - Push with `--force` if necessary:
     ```bash
     git push --force
     ```

---

## 5. Troubleshooting

### A. **Husky Errors**
If you encounter errors like `husky - commit-msg hook exited with code 1`, ensure:
1. Husky is installed:
   ```bash
   pnpm prepare
   ```
2. Files in `.husky/` have executable permissions:
   ```bash
   chmod +x .husky/*
   chmod +x .husky/_/husky.sh
   ```

### B. **Commitlint Errors**
If your commit message fails validation:
- Ensure the **type** is valid (e.g., `feat`, `fix`).
- Ensure the **scope** follows the format `W2-<ticket-number>`.
- Ensure the **subject** is lowercase.

### C. **Pre-commit Checks Fail**
- Fix any issues reported by tests, build, or lint-staged.

---

## 6. Useful Commands

- **Run Tests**:
  ```bash
  pnpm test
  ```
- **Run Lint**:
  ```bash
  pnpm lint
  ```
- **Run Build**:
  ```bash
  pnpm build
  ```

---

## 7. File Locations

- **Husky Hooks**: `.husky/`
  - `pre-commit`: Runs tests, build, and lint-staged.
  - `commit-msg`: Validates commit message format.
- **Commitlint Config**: `commitlint.config.cjs`
- **Lint-staged Config**: Defined in `package.json`:
  ```json
  "lint-staged": {
    "*.{js,ts,jsx,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ]
  }
  ```

---

## 8. Notes

- Always follow the commit message format to avoid errors.
- If you need to bypass Husky checks (not recommended), use:
  ```bash
  git commit --no-verify -m "your message"
  ```
- For more details, refer to the project README or ask your team.

---
