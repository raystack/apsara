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

## Development Workflow
- Always check existing patterns before implementing new features
- Follow the established testing patterns (currently using Jest, transitioning to Vitest)
- Maintain consistency with existing code style and conventions
- Use TypeScript for type safety

## Testing
- Write comprehensive tests for utilities and components
- Follow existing test patterns and structures
- Use appropriate testing utilities and mocking strategies
- Ensure tests are maintainable and readable