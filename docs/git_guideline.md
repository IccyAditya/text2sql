## Git Branching Rules

To ensure smooth collaboration and maintain a clean and stable codebase, the following branching rules must be followed for all feature development:

### Branch Structure

1. **Main Branch (`main`)**
   - The `main` branch should always contain the most stable and deployable version of the code.
   - Direct commits to the `main` branch are not allowed. All changes must come through **Pull Requests** (PRs) from feature branches or hotfix branches.
   - Every commit to `main` should be tested and reviewed.

2. **Develop Branch (`develop`)**
   - The `develop` branch is the main integration branch for features and is considered the latest working version of the code.
   - New features or bug fixes should branch off from `develop` and be merged back into `develop` once complete and tested.
   - Only when the `develop` branch is deemed stable, will it be merged into `main` for a release.

3. **Feature Branches (`feature/feature-name`)**
   - Every new feature should be developed in its own feature branch created from `develop`.
   - Branch names should follow this format: `feature/<feature-name>`. For example, if you're working on user authentication, the branch name could be `feature/user-auth`.
   - Once a feature is complete, submit a **Pull Request** (PR) to `develop` for review and integration.

4. **Bugfix Branches (`bugfix/bug-name`)**
   - Small bug fixes should be handled in branches named `bugfix/<bug-name>`.
   - Like feature branches, bugfix branches should also be created from `develop` and merged back into `develop` after fixing.

5. **Hotfix Branches (`hotfix/hotfix-name`)**
   - Hotfix branches are reserved for critical issues in the `main` branch that need to be addressed immediately.
   - Hotfix branches should be created from `main`, and after the fix is applied, the branch should be merged into both `main` and `develop`.

### Git Workflow

1. **Start a New Feature**
   - Create a new branch from `develop`:
     ```bash
     git checkout develop
     git pull origin develop
     git checkout -b feature/<feature-name>
     ```

2. **Work on the Feature**
   - Make sure to regularly commit your changes with clear and concise commit messages.
   - Commit message format: `type(scope): message`
     - Example: `feat(nlp): added tokenization logic`
     - Commit types:
       - `feat`: A new feature.
       - `fix`: A bug fix.
       - `docs`: Changes to documentation.
       - `style`: Code style or formatting (not affecting logic).
       - `refactor`: Code refactoring without changing external behavior.
       - `test`: Adding or modifying tests.

3. **Sync with Develop Branch**
   - Regularly pull the latest changes from `develop` to keep your feature branch up to date:
     ```bash
     git checkout develop
     git pull origin develop
     git checkout feature/<feature-name>
     git merge develop
     ```

4. **Complete the Feature and Submit a Pull Request**
   - After completing the feature, push your branch to the remote repository:
     ```bash
     git push origin feature/<feature-name>
     ```
   - Open a Pull Request (PR) from your feature branch to `develop`. Ensure that your feature passes all tests and is reviewed before merging.

5. **Merging to Develop**
   - After your Pull Request is approved, merge it into `develop` using the **Squash and Merge** option to maintain a clean commit history:
     - Example commit message for squash merge: `feat: added user authentication feature`.
   - Ensure that the merged code is tested before closing the PR.

6. **Releases**
   - When `develop` is stable and ready for release, merge it into `main`:
     ```bash
     git checkout main
     git merge develop
     git push origin main
     ```

### Branch Naming Conventions

- **Feature Branch**: `feature/<feature-name>`
- **Bugfix Branch**: `bugfix/<bug-name>`
- **Hotfix Branch**: `hotfix/<hotfix-name>`

### Example Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/nlp-module
   ```
2. Work on the feature and commit your changes:
   ```bash
   git add .
   git commit -m "feat(nlp): added rule-based NLP tokenization"
   ```
3. Push your feature branch:
   ```bash
   git push origin feature/nlp-module
   ```
4. Open a Pull Request to `develop` from GitHub, review, and merge once approved.
