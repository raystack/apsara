# Development Guide

Welcome to the Apsara development guide! This document will help you get started with local development and understand how to contribute to the project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building](#building)
- [Release Process](#release-process)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (version 9.3.0 or higher)
- **Git**

You can check your versions with:
```bash
node --version  # Should be 18.x or higher
pnpm --version  # Should be 9.3.0 or higher
git --version
```

### Installing pnpm

If you don't have pnpm installed, you can install it globally:

```bash
npm install -g pnpm@9.3.0
```

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/raystack/apsara.git
   cd apsara
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start development servers**:
   ```bash
   # Start both library development and documentation site
   pnpm start
   
   # Or start just the library development server
   pnpm dev
   ```

4. **Build the library**:
   ```bash
   pnpm run build:apsara
   ```

## Development Tools & IDE Setup

### Recommended VS Code Extensions

For the best development experience, install these VS Code extensions:

- **Biome** (`biomejs.biome`) - Code formatting and linting
- **TypeScript Importer** - Auto-import for TypeScript
- **Bracket Pair Colorizer** - Better code readability
- **GitLens** - Enhanced Git integration

### IDE Configuration

The project includes preconfigured settings for VS Code in `.vscode/settings.json`:

- **Biome** is configured as the default formatter
- **Format on save** is enabled
- **Auto-fix and organize imports** on save
- **ESLint is disabled** in favor of Biome

For other IDEs, ensure you have Biome plugin installed and configured for consistent code formatting.

### Biome Configuration

The project uses Biome for linting and formatting. Configuration is in `biome.json`. Biome provides:
- Fast formatting and linting
- TypeScript/JavaScript support
- CSS formatting
- JSON/Markdown formatting

## Project Structure

Apsara uses a monorepo structure managed by pnpm workspaces and Turbo:

```
apsara/
├── apps/
│   └── www/                    # Documentation website (Fumadocs)
├── packages/
│   ├── eslint-config-custom/   # Shared ESLint configuration
│   ├── raystack/              # Main Apsara component library
│   └── tsconfig/              # Shared TypeScript configurations
├── .github/
│   └── workflows/             # GitHub Actions for CI/CD
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── turbo.json                 # Turbo build configuration
└── package.json               # Root package.json
```

### Key Directories

- **`packages/raystack/`**: Contains the main Apsara component library
  - `components/`: Latest React components (root level)
  - `v1/components/`: All React components (legacy v1 structure)
  - `v1/hooks/`: Custom React hooks
  - `v1/icons/`: Icon components
  - `style.css`: Main stylesheet
  - `dist/`: Built output (generated)

- **`apps/www/`**: Documentation website built with Next.js and Fumadocs

## Available Scripts

### Root Level Scripts

```bash
# Start both library dev server and docs site
pnpm start

# Build all packages
pnpm build

# Build only the Apsara library
pnpm run build:apsara

# Start library development server
pnpm dev

# Lint the Apsara library
pnpm run lint

# Clean build artifacts (library-specific)
cd packages/raystack && pnpm clean

# Format code with Biome
pnpm run format
```

### Library-Specific Scripts (in packages/raystack/)

```bash
cd packages/raystack

# Build the library
pnpm build

# Start development server with watch mode
pnpm dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Lint TypeScript files
pnpm lint

# Clean build artifacts
pnpm clean

# Build icon components
pnpm run build:icons
```

## Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Start the development server**:
   ```bash
   pnpm dev
   ```

3. **Make your changes** in the appropriate component files under `packages/raystack/v1/components/`

4. **Test your changes**:
   ```bash
   # Run tests
   pnpm test
   
   # Build to ensure no build errors
   pnpm run build:apsara
   ```

5. **Format your code**:
   ```bash
   pnpm run format
   ```

6. **Commit your changes** following conventional commit format:
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

## Testing

Apsara uses Jest with React Testing Library for testing:

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (useful during development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run specific test file
pnpm test -- avatar.test.tsx
```

### Writing Tests

- Test files should be placed in `__tests__` folders or named with `.test.tsx` suffix
- Use React Testing Library for component testing
- Follow existing test patterns in the codebase
- Test files are located alongside component files

Example test structure:
```typescript
import { render, screen } from '../test-utils';
import { YourComponent } from './your-component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

## Building

### Development Build

```bash
pnpm dev
```

This starts Rollup in watch mode, rebuilding automatically when files change.

### Production Build

```bash
pnpm run build:apsara
```

This creates optimized builds in the `dist/` directory with:
- ESM modules (`dist/index.js`, `dist/v1/index.js`)
- CommonJS modules (`dist/index.cjs`, `dist/v1/index.cjs`)
- TypeScript declarations (`dist/index.d.ts`, `dist/v1/index.d.ts`)
- CSS files (`dist/style.css`, `dist/normalize.css`)

### Build Configuration

The build process uses:
- **Rollup** for bundling JavaScript/TypeScript
- **PostCSS** for CSS processing
- **TypeScript** for type checking and declaration generation

Configuration files:
- `rollup.config.mjs`: Rollup configuration
- `tsconfig.json`: TypeScript configuration
- `biome.json`: Biome configuration for formatting/linting

## Release Process

Apsara follows an automated release process using GitHub Actions and semantic versioning.

### Release Types

1. **Production Releases** (`v1.2.3`):
   - Released from the `main` branch
   - Published to NPM with `latest` tag
   - Triggered by pushing tags matching `v[0-9]+.[0-9]+.[0-9]+`

2. **Release Candidates** (`v1.2.3-rc.1`):
   - Released from the `develop` branch
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
   - Create a GitHub release with generated notes

### Release Workflow Details

The release process includes these automated steps:

1. **Checkout** the appropriate branch (`main` or `develop`)
2. **Setup** Node.js 18.x and pnpm 9.3.0
3. **Install** dependencies
4. **Build** the library using `pnpm run ci:build`
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

## Package Exports

The Apsara library provides multiple export paths for flexibility:

### Import Paths
```javascript
// Main entry (latest components)
import { Button, Flex } from '@raystack/apsara'

// Backward compatibility - v1 path (alias to main entry)
import { Button, Flex } from '@raystack/apsara/v1'

// Specific feature imports
import { ChevronDownIcon } from '@raystack/apsara/icons'
import { useLocalStorage } from '@raystack/apsara/hooks'

// Styles
import '@raystack/apsara/style.css'
```

### Available Exports
- **Main entry**: `@raystack/apsara` (latest components)
- **Components**: `@raystack/apsara/v1` (backward compatibility alias)
- **Icons**: `@raystack/apsara/icons`
- **Hooks**: `@raystack/apsara/hooks`
- **Styles**: `@raystack/apsara/style.css`

**Note**: The `/v1` import path is maintained for backward compatibility. All v1 components have been moved to the root level, and `/v1` now serves as an alias to prevent breaking changes.

## Troubleshooting

### Common Issues

1. **ESLint Configuration Errors**:
   ```bash
   # If you encounter ESLint parsing errors
   # The build process will still work, but linting may fail
   # This is a known configuration issue with the current setup
   ```

2. **Node.js Version Issues**:
   ```bash
   # Ensure you're using Node.js 18+
   node --version
   
   # If using nvm:
   nvm use 18
   ```

3. **pnpm Version Issues**:
   ```bash
   # Ensure you're using the correct pnpm version
   pnpm --version
   
   # Update pnpm if needed:
   npm install -g pnpm@9.3.0
   ```

4. **Build Failures**:
   ```bash
   # Clean and reinstall if builds fail
   pnpm clean
   rm -rf node_modules
   pnpm install
   pnpm run build:apsara
   ```

5. **Test Failures**:
   ```bash
   # Some tests may be failing in the current codebase
   # Focus on not introducing new test failures
   # Run tests to understand current state:
   pnpm test
   ```

### Getting Help

If you encounter issues:

1. Check if there are similar issues in the [GitHub Issues](https://github.com/raystack/apsara/issues)
2. Look at the [documentation site](https://apsara.raystack.org)
3. Review this development guide
4. Create a new issue if the problem persists

## Contributing

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Use Biome for code formatting: `pnpm run format`
- Write tests for new components and features

### Component Development

1. Create components in `packages/raystack/v1/components/`
2. Follow the existing component structure:
   ```
   component-name/
   ├── index.tsx          # Export file
   ├── component-name.tsx # Main component
   ├── component-name.module.css # Styles
   └── __tests__/         # Tests
       └── component-name.test.tsx
   ```

3. Export new components from `packages/raystack/v1/index.tsx`

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass and code builds
5. Format your code
6. Submit a pull request with a clear description

### Commit Convention

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

---

For more information, visit the [Apsara documentation site](https://apsara.raystack.org) or check the [main README](./README.md).