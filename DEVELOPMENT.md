# Development Guide

Welcome to the Apsara development guide! This document will help you get started with the local development environment and understand the technical aspects of the project.

For contribution guidelines, please see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Building](#building)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 22 or higher)
- **pnpm** (version 9.3.0 or higher)
- **Git**

You can check your versions with:
```bash
node --version  # Should be 22.x or higher
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

4. **Build**:
   ```bash
   # Build both library and documentation site
   pnpm build

   # Or build just the library
   pnpm build:apsara
   ```

## Development Tools & IDE Setup

### IDE Configuration

The project uses Biome for linting and formatting with preconfigured VS Code settings. Ensure you have the Biome plugin installed for consistent code formatting.

## Project Structure

Apsara uses a monorepo structure managed by pnpm workspaces and Turbo:

```
apsara/
├── apps/
│   ├── www/                    # Documentation website (Fumadocs)
├── packages/
│   ├── eslint-config-custom/   # Shared ESLint configuration
│   ├── plugin-vscode/          # VS Code extension for Apsara
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
  - `accordion/`, `avatar/`, `badge/`, `button/`, etc.: React components (at root level)
  - `v1/`: Legacy structure for backward compatibility
    - `v1/components/`: Legacy component structure
    - `v1/hooks/`: Custom React hooks
    - `v1/icons/`: Icon components
  - `style.css`: Main stylesheet
  - `dist/`: Built output

- **`apps/www/`**: Documentation website built with Next.js and Fumadocs
  - `src/content/docs/`: Contains all the `.mdx` documentation files
  - `src/components/`: Shared documentation components
  - `public/`: Static assets for the documentation site

- **`packages/plugin-vscode/`**: VS Code extension for Apsara
  - Provides autocomplete and IntelliSense for Apsara components
  - Includes design tokens and component snippets
  - Built with TypeScript and VS Code Language Server Protocol

### Package Exports

The Apsara library provides multiple export paths for flexibility:

#### Import Paths
```javascript
// Components
import { Button, Flex } from '@raystack/apsara'

// Specific feature imports
import { ChevronDownIcon } from '@raystack/apsara/icons'
import { useLocalStorage } from '@raystack/apsara/hooks'

// Styles
import '@raystack/apsara/style.css'
```

#### Available Exports
- **Components**: `@raystack/apsara`
- **Icons**: `@raystack/apsara/icons`
- **Hooks**: `@raystack/apsara/hooks`
- **Styles**: `@raystack/apsara/style.css`

**Note**: The package also exports a `/v1` path for backward compatibility. It's recommended not to use this path as it will be removed in future releases.

## Available Scripts

### Root Level Scripts

```bash
# Start both library dev server and docs site
pnpm start

# Build all packages
pnpm build

# Build only the Apsara library
pnpm build:apsara

# Start library development server
pnpm dev

# Lint the Apsara library
pnpm lint

# Clean build artifacts (library-specific)
cd packages/raystack && pnpm clean

# Format code with Biome
pnpm format
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
pnpm build:icons
```

## Testing

Apsara uses Vitest with React Testing Library for testing:

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

- Test files should be placed in `__tests__` folders and named with the `.test.tsx` suffix
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
pnpm build:apsara
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
   # Ensure you're using Node.js 22+
   node --version
   
   # If using nvm:
   nvm use 22
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
   pnpm build:apsara
   ```

5. **Test Failures**:
   ```bash
   # Some tests may be failing in the current codebase
   # Focus on not introducing new test failures
   # Run tests to understand the current state:
   pnpm test:apsara
   ```

### Getting Help

If you encounter technical issues during development:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines
3. Check the [GitHub Issues](https://github.com/raystack/apsara/issues) for similar problems
4. Look at the [documentation site](https://apsara.raystack.org)

---

For contribution guidelines, pull request process, and release information, see [CONTRIBUTING.md](./CONTRIBUTING.md).
