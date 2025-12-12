# 🤝 Contributing to SafeSpace Salone

First off, thank you for considering contributing to SafeSpace Salone! It's people like you that make this mental health platform a reality for young people in Sierra Leone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a safe, welcoming environment. By participating, you are expected to uphold this code.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🎯 How Can I Contribute?

### Reporting Bugs

**Before submitting a bug report:**
- Check the [existing issues](https://github.com/walon-foundation/safespace-salone/issues)
- Ensure you're using the latest version
- Collect information about the bug

**How to submit a good bug report:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. macOS, Windows, Linux]
 - Browser: [e.g. Chrome, Safari]
 - Version: [e.g. 1.0.0]
```

### Suggesting Enhancements

**Before submitting an enhancement:**
- Check if it's already been suggested
- Consider if it aligns with the project's goals
- Provide a clear use case

**How to submit a good enhancement:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots.
```

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `bug` - Something isn't working
- `enhancement` - New feature or request

---

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git
- Neon database account
- Clerk account

### Setup Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/tele-health.git
cd tele-health

# 3. Add upstream remote
git remote add upstream https://github.com/Walon-Foundation/tele-health.git

# 4. Install dependencies
pnpm install

# 5. Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 6. Set up database
pnpm db:push
pnpm db:seed

# 7. Start development server
pnpm dev
```

### Keeping Your Fork Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   pnpm dev  # Test locally
   pnpm build  # Ensure it builds
   ```

4. **Commit your changes** following our commit guidelines

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting the Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added/updated tests
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
```

### Review Process

1. **Automated checks** will run (linting, build)
2. **Maintainers** will review your code
3. **Address feedback** if requested
4. **Approval** - PR will be merged!

---

## 💻 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  username: string;
  avatar: number;
}

function createUser(data: User): Promise<User> {
  // Implementation
}

// ❌ Bad
function createUser(data: any) {
  // No type safety
}
```

### React Components

```tsx
// ✅ Good - Functional component with TypeScript
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// ❌ Bad - No types, unclear props
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

### File Naming

```
✅ Good:
- components/MoodTracker.tsx
- utils/security.ts
- app/api/users/route.ts

❌ Bad:
- components/mood_tracker.tsx
- utils/Security.ts
- app/api/Users/route.ts
```

### Code Style

- **Indentation:** 2 spaces
- **Quotes:** Single quotes for strings
- **Semicolons:** Required
- **Line length:** Max 100 characters
- **Naming:**
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Files: kebab-case or PascalCase

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Good commits
git commit -m "feat(chat): add voice note recording"
git commit -m "fix(auth): resolve Clerk redirect loop"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(api): simplify user creation logic"

# Bad commits
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

### Detailed Example

```
feat(crisis): add AI-powered crisis detection

- Implement keyword matching for suicide prevention
- Add severity levels (normal, concerning, urgent, critical)
- Auto-escalate critical cases to senior counselors
- Display emergency resources when crisis detected

Closes #123
```

---

## 🧪 Testing

### Manual Testing

Before submitting a PR, test:

1. **User Flow:**
   - Signup → Chat → Send message → Voice note

2. **Counselor Flow:**
   - Sign in → View dashboard → Access conversation

3. **Security:**
   - Rate limiting works
   - File uploads validated
   - XSS prevention active

4. **Responsive Design:**
   - Test on mobile (375px)
   - Test on tablet (768px)
   - Test on desktop (1920px)

### Automated Testing (Future)

```bash
# Run tests (when implemented)
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

---

## 📚 Documentation

### When to Update Documentation

Update documentation when you:
- Add a new feature
- Change existing functionality
- Fix a bug that affects usage
- Add new environment variables
- Change API endpoints

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `SETUP.md` | Setup instructions |
| `SECURITY.md` | Security implementation |
| `CONTRIBUTING.md` | This file |
| `CHANGELOG.md` | Version history |

### Code Comments

```typescript
// ✅ Good - Explains WHY
// Use magic byte validation to prevent malicious file uploads
// even if MIME type is spoofed
const isValidAudio = validateAudioFileHeader(buffer);

// ❌ Bad - States the obvious
// Check if audio is valid
const isValidAudio = validateAudioFileHeader(buffer);
```

---

## 🏆 Recognition

Contributors will be recognized in:
- `README.md` acknowledgments section
- GitHub contributors page
- Release notes (for significant contributions)

---

## 📞 Questions?

- **GitHub Discussions:** [Ask a question](https://github.com/walon-foundation/safespace-salone/discussions)
- **Email:** team@safespacesalone.org
- **Discord:** [Join our community](https://discord.gg/safespace-salone)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to SafeSpace Salone!** 💚

Every contribution, no matter how small, helps us provide better mental health support to young people in Sierra Leone.
