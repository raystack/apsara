# Agent Guidelines

This file contains important guidelines and preferences for AI agents working on this project. Following these guidelines will help maintain code quality, consistency, and project standards.

## 🎯 Project Overview

This is **Apsara Design System** - a React component library built with:
- **TypeScript** for type safety
- **CSS Modules** for styling
- **Vitest** for testing
- **pnpm** for package management
- **Biome** for code formatting and linting
- **Monorepo structure** with documentation site

## 🏗️ Project Structure

```
packages/raystack/           # Main component library
├── components/             # React components
├── hooks/                 # Custom hooks
├── icons/                 # Icon components
├── styles/               # Global styles
├── types/                # Type definitions
└── test-utils.tsx        # Testing utilities

apps/www/                  # Documentation site
├── src/content/docs/     # Component documentation
└── src/components/playground/ # Demo examples
```

## 🚨 Critical Rules

- **NO `any` TYPES** - Use specific types, `unknown`, or generics
- **NO direct npm/yarn** - Always use `pnpm`
- **NO ignored linting errors** - Fix all issues properly
- **NO outdated documentation** - Keep docs in sync with code
- **NO CSS-in-JS or inline styles** - Use CSS Modules only
- **NO Tailwind CSS** - Use CSS Modules for all styling

## 📦 Package Management

- **Always use `pnpm`** - Never use `npm` or `yarn`
- Installing dependencies: `pnpm add <package>` or `pnpm add -D <package>`
- Running scripts: `pnpm run <script>` or `pnpm <script>`

## 📝 TypeScript Best Practices

- **Never use `any` type** - This is a strict rule
- Use specific types, interfaces, or union types instead
- Prefer `unknown` over `any` when type is genuinely unknown
- Use generic types `<T>` for reusable components/functions
- Always provide explicit return types for functions

## 🎨 Styling & Design

- **Use CSS Modules exclusively** for component styling
- File naming: `component-name.module.css`
- Import: `import styles from './component-name.module.css'`
- Usage: `className={styles.className}`
- **Follow accessibility standards** (ARIA labels, keyboard navigation)
- **Ensure responsive design** works across different screen sizes
- **Use semantic HTML** elements appropriately

## 🧪 Testing Standards

- **Use Vitest** for all tests (migrated from Jest)
- Write comprehensive tests for utilities and components
- Use proper TypeScript types in tests (never use `any`)
- Import from `vitest` not `jest`
- Test file pattern: `__tests__/component.test.tsx`

## 📚 Documentation Requirements

When adding/updating components:
- **Component docs**: Update `apps/www/src/content/docs/components/`
- **Demo examples**: Update `apps/www/src/components/playground/`
- **Props documentation**: Keep API docs in sync with implementation

Required for:
- New components or hooks
- API/props changes
- New styling variants
- Behavior modifications

## 🚀 Development Workflow

1. **Analyze existing patterns** before implementing new features
2. **Run `pnpm format`** after making changes
3. **Write tests** using Vitest for new utilities/components
4. **Update documentation** when changing component APIs
5. **Start with minimal viable implementation** then enhance
6. **Test early and often** during development

## 🤝 Communication & Best Practices

- **Be transparent** about limitations or uncertainties
- **Ask for clarification** when requirements are ambiguous
- **Explain your reasoning** for architectural decisions
- **Provide detailed error messages** with context
- **Include relevant code snippets** when reporting issues

## ✅ Quality Checklist

Before completing any task:
- [ ] Code follows TypeScript best practices (no `any`)
- [ ] Styling uses CSS Modules correctly  
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Code is formatted with `pnpm format`
- [ ] Follows existing project patterns
- [ ] No linting errors remain
- [ ] Accessibility considerations addressed
- [ ] Error states and edge cases handled

## 📋 Task Completion

When finishing a task:
1. **Summarize what was implemented** - Key features and changes
2. **Note any limitations** - What wasn't implemented or edge cases
3. **Provide usage examples** - How to use the new functionality
4. **Suggest next steps** - Potential improvements or related tasks
5. **Confirm all requirements met** - Review against original request

---

Following these guidelines ensures high-quality, maintainable code that aligns with project standards and team expectations.