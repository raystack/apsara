# Apsara

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](LICENSE) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/) [![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev) [![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

Apsara 🧚‍♀️ is an open-source React UI component library built on Radix UI primitives and vanilla CSS. It provides enterprise-grade, accessible components designed for building complex data interfaces.

<p align="center"><img width=80% src="./apps/www/public/banner.png" /></p>

## Key Features

- **Accessible Components**: Built on Radix UI primitives ensuring ARIA compliance and keyboard navigation
- **Flexible Styling**: Uses vanilla CSS with HTML data-attributes for powerful theming and style customization
- **Enterprise Ready**: Designed for complex data-driven applications with components like:
  - Data Tables
  - Navigation Systems
  - Form Controls
  - Feedback Components
- **Type Safe**: Written in TypeScript with comprehensive type definitions
- **Modern Stack**: Support for React 18+ and modern development practices

## Installation

```sh
npm install @raystack/apsara
# or
pnpm add @raystack/apsara
```

## Usage

```jsx
// Add Style import in the root of the project.
import "@raystack/apsara/style.css";

// Import components
import { Button, Flex } from "@raystack/apsara/v1";

function App() {
  return (
    <Flex>
      <Button type="primary">I am using 🧚‍♀️ Apsara!</Button>
    </Flex>
  );
}
```

## Component Categories

### Layout

- `Box` - Basic layout container
- `Flex` - Flexbox container
- `Container` - Responsive wrapper
- `Sidebar` - Collapsible navigation panel

### Navigation

- `Breadcrumb` - Navigation breadcrumbs
- `Tabs` - Tabbed interface
- `Command` - Command palette interface

### Data Display

- `Table` - Data table component
- `Avatar` - User avatar display
- `Badge` - Status indicators
- `EmptyState` - Empty state messaging

### Forms

- `Select` - Dropdown selection
- `Radio` - Radio button groups
- `IconButton` - Icon-only buttons

### Feedback

- `Tooltip` - Contextual tooltips
- `Callout` - Informational callouts
- `Indicator` - Status indicators

### Overlay

- `Popover` - Contextual overlays
- `Sheet` - Slide-out panels
- `Dialog` - Modal dialogs

## Documentation

Visit our [documentation site](https://apsara.raystack.org) for:

- Interactive examples
- API references
- Theme customization
- Accessibility guidelines
- Migration guides

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```sh
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build library
pnpm build
```

## License

Apsara is [Apache 2.0](LICENSE) licensed.
