# Contributing to Apsara

Thank you for your interest in contributing to Apsara! This guide will help you understand how to contribute effectively to this project.

## Table of Contents

- [Contributing to Apsara](#contributing-to-apsara)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Development Workflow](#development-workflow)
  - [Code Style Guidelines](#code-style-guidelines)
  - [Component Development](#component-development)
  - [Documentation Development](#documentation-development)
    - [Component Documentation Format](#component-documentation-format)
    - [Working with Documentation](#working-with-documentation)
  - [VS Code Extension Development](#vs-code-extension-development)
    - [Working with the VS Code Extension](#working-with-the-vs-code-extension)
  - [Pull Request Process](#pull-request-process)
    - [Pull Request Guidelines](#pull-request-guidelines)
  - [Commit Convention](#commit-convention)
  - [Release Process](#release-process)
    - [Release Types](#release-types)
    - [Creating a Release](#creating-a-release)
      - [For Maintainers](#for-maintainers)
    - [Release Workflow Details](#release-workflow-details)
    - [NPM Publishing](#npm-publishing)
  - [Getting Help](#getting-help)
  - [Code of Conduct](#code-of-conduct)

## Getting Started

Before contributing, please review our [Development Guide](./DEVELOPMENT.md) to set up your local development environment.

Quick setup:
```bash
git clone https://github.com/raystack/apsara.git
cd apsara
pnpm install
pnpm dev
```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Start the development server**:
   ```bash
   # Start both library development and documentation site
   pnpm start
   
   # Or start just the library development server
   pnpm dev
   ```

3. **Make your changes** in the appropriate directories:
   - **Components**: `packages/raystack/`
   - **Documentation**: `apps/www/`

4. **Test your changes**:
   ```bash
   # Run tests with Vitest
   pnpm test:apsara
   
   # Run tests in watch mode
   cd packages/raystack && pnpm test:watch
   
   # Build to ensure no build errors
   pnpm build
   ```

5. **Format your code**:
   ```bash
   pnpm format
   ```

6. **Commit your changes** following conventional commit format:
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

## Code Style Guidelines

- Use TypeScript for all new code
- Follow existing component patterns
- Use Biome for code formatting: `pnpm format`
- Write tests for new components and features

## Component Development

1. Create components in `packages/raystack/`
2. Follow the existing component structure:
   ```
   component-name/
   ├── index.ts         # Export barrel file
   ├── component-name.tsx # Main component
   ├── component-name.module.css # Styles
   └── __tests__/         # Tests
       └── component-name.test.tsx
   ```

3. Export new components from `packages/raystack/index.ts`
4. Update the component documentation in `apps/www/content/docs`

## Documentation Development

The project includes a documentation website for the library `apps/www`:

- Built with Next.js and Fumadocs
- Uses MDX for component documentation

### Component Documentation Format

Each component folder in `apps/www/src/content/docs/` contains:

```
component-name/
├── index.mdx    # Main documentation with examples and usage
├── props.ts     # TypeScript definitions for component props
└── demo.ts      # Code for interactive playground and examples
```

### Working with Documentation

1. **Adding new component docs**:
   - Create a new folder in `apps/www/src/content/docs/components/`
   - Add `index.mdx` with component description and examples
   - Add `props.ts` with TypeScript prop definitions
   - Add `demo.ts` with interactive examples

2. **Testing documentation changes**:
   ```bash
   # Start the docs site
   cd apps/www && pnpm dev
   ```

## VS Code Extension Development

The project includes a VS Code extension (`packages/plugin-vscode/`) that provides:

- **Autocomplete**: IntelliSense for Apsara components and design tokens
- **Hover information**: Component documentation and prop details
- **Snippets**: Quick component insertion

### Working with the VS Code Extension

1. **Development**:  
   Use VS Code Command Palette: **"Tasks: Run Task" → "plugin-vscode: start-dev"**  
   This starts the extension in watch mode and opens the Extension Development Host.

2. **Building**:
   ```bash
   pnpm build  # Build for production
   ```

3. **Packaging**:
   ```bash
   pnpm package  # Create .vsix file for distribution
   ```
   
## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass and code builds
5. Format your code
6. Submit a pull request with a clear description

### Pull Request Guidelines

- Provide a clear description of what your PR does
- Include screenshots for UI changes
- Link to any relevant issues
- Ensure all tests pass
- Follow the code style guidelines

## Commit Convention

Use conventional commits for better release notes:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example:
```bash
git commit -m "feat: add new Button variant"
git commit -m "fix: resolve tooltip positioning issue"
git commit -m "docs: update component API documentation"
```

## Release Process

Apsara follows an automated release process using GitHub Actions and semantic versioning.

### Release Types

1. **Production Releases** (`v1.2.3`):
   - Released from the `main` branch
   - Published to NPM with `latest` tag
   - Triggered by pushing tags matching `v[0-9]+.[0-9]+.[0-9]+`

2. **Release Candidates** (`v1.2.3-rc.1`):
   - Released from the `main` or `release/*` branch
   - Published to NPM with `next` tag
   - Triggered by pushing tags matching `v[0-9]+.[0-9]+.[0-9]+-rc.[0-9]+`

### Creating a Release

#### For Maintainers

1. **Prepare the release**:
   ```bash
   # Ensure you're on the correct branch
   git checkout main  # for production release
   # OR
   git checkout develop  # for release candidate
   
   # Pull latest changes
   git pull origin main  # or develop
   ```

2. **Create and push a tag**:
   ```bash
   # For production release
   git tag v1.2.3
   git push origin v1.2.3
   
   # For release candidate
   git tag v1.2.3-rc.1
   git push origin v1.2.3-rc.1
   ```

3. **GitHub Actions will automatically**:
   - Build the library
   - Run tests (if configured)
   - Bump the package version
   - Publish to NPM
   - Create a GitHub release with auto-generated notes

### Release Workflow Details

The release process includes these automated steps:

1. **Checkout** the appropriate branch (`main` or `release/*`)
2. **Setup** Node.js 22.x and pnpm 9.3.0
3. **Install** dependencies
4. **Build** the library using `pnpm ci:build`
5. **Bump version** in package.json based on the git tag
6. **Publish** to NPM using `release-it`
7. **Generate** GitHub release notes

### NPM Publishing

The library is published as `@raystack/apsara` with the following structure:

```bash
# Install the library
npm install @raystack/apsara
# or
pnpm add @raystack/apsara
```

## Getting Help

If you encounter issues:

1. Check if there are similar issues in the [GitHub Issues](https://github.com/raystack/apsara/issues)
2. Look at the [documentation site](https://apsara.raystack.org)
3. Review the [Development Guide](./DEVELOPMENT.md)
4. Create a new issue if the problem persists

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct. Be respectful, inclusive, and collaborative in all interactions.

---

For technical setup and local development instructions, see the [Development Guide](./DEVELOPMENT.md).
