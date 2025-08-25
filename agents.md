# Agent Guidelines

This file contains important guidelines and preferences for agents working on this project.

## Package Management
- **Always use `pnpm`** for package management operations
- Never use `npm` or `yarn` commands
- When installing dependencies: `pnpm add <package>` or `pnpm add -D <package>`
- When running scripts: `pnpm run <script>` or `pnpm <script>`

## Styling Conventions
- **Use CSS Modules** for component styling
- File naming convention: `component-name.module.css`
- Import CSS modules as: `import styles from './component-name.module.css'`
- Apply styles using: `className={styles.className}`
- Follow existing CSS module patterns in the codebase

## Project Structure
- This is a monorepo using pnpm workspaces
- Main package is located in `packages/raystack/`
- Use relative imports and follow existing import patterns
- Respect the existing folder structure and naming conventions

## Code Quality & Linting
- **Always run linting after making changes** using Biome
- Run `pnpm format` to format and lint code automatically
- Fix all linting errors before committing code
- Biome handles both formatting and linting for this project
- Never ignore linting errors - fix them properly

## TypeScript Best Practices
- **Never use `any` for types in TypeScript**
- Use specific types, interfaces, or union types instead of `any`
- Prefer `unknown` over `any` when the type is truly unknown
- Use generic types `<T>` when creating reusable components/functions
- Always provide return types for functions
- Use strict TypeScript configuration - embrace type safety

## Development Workflow
- Always check existing patterns before implementing new features
- Run linting/formatting after every change: `pnpm format`
- Follow the established testing patterns (using Vitest)
- Maintain consistency with existing code style and conventions
- Use TypeScript with proper type definitions

## Documentation
- **Always update documentation** when adding new components or updating existing ones
- Update component docs in `apps/www/src/content/docs/components/` when:
  - Adding new components
  - Updating component props or API
  - Changing styling options or variants
  - Modifying component behavior
- Update demo examples in `apps/www/src/components/playground/` to showcase new features
- Keep documentation in sync with actual component implementation

## Testing
- Write comprehensive tests for utilities and components using Vitest
- Follow existing test patterns and structures
- Use appropriate testing utilities and mocking strategies
- Ensure tests are maintainable and readable