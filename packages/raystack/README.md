# Apsara 🧚‍♀️

[![npm version](https://img.shields.io/npm/v/@raystack/apsara?logo=npm&color=cb3837)](https://www.npmjs.com/package/@raystack/apsara)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg?logo=apache)](LICENSE)
[![Biome](https://img.shields.io/badge/Biome-60a5fa?logo=biome&logoColor=white)](https://biomejs.dev/)
[![pkg.pr.new](https://pkg.pr.new/badge/raystack/apsara)](https://pkg.pr.new/~/raystack/apsara)

Apsara is an open-source React component library for building accessible, data-heavy interfaces. It is built on [Base UI](https://base-ui.com/) primitives and written in TypeScript.

## Install

```sh
npm install @raystack/apsara
# or
pnpm add @raystack/apsara
```

Requires React 19.

## Usage

```jsx
// Import the styles once, at the root of your app.
import "@raystack/apsara/style.css";

import { Button, Flex } from "@raystack/apsara";

export default function App() {
  return (
    <Flex>
      <Button variant="solid">Hello from Apsara 🧚‍♀️</Button>
    </Flex>
  );
}
```

Icons and hooks ship as separate entry points:

```jsx
import { ChevronDownIcon } from "@raystack/apsara/icons";
import { useCopyToClipboard } from "@raystack/apsara/hooks";
```

## What's inside

Over 70 components, styled with plain CSS and `data-*` attributes so you can theme them with CSS variables. A few highlights:

- **Layout** — Flex, Grid, Container, Sidebar, ScrollArea
- **Navigation** — Tabs, Breadcrumb, Command, Menu, Navbar, Toolbar
- **Data** — Table, DataView, Avatar, Badge, Chip, Meter
- **Forms** — Input, Select, Combobox, Checkbox, Radio, Switch, Slider, Calendar, ColorPicker
- **Feedback** — Toast, Tooltip, Callout, Spinner, Indicator
- **Overlay** — Dialog, Popover, Drawer, ContextMenu

See the [documentation site](https://apsara.raystack.org) for the full list, live examples, and API references.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow and [DEVELOPMENT.md](./DEVELOPMENT.md) for local setup.

```sh
pnpm install       # install dependencies
pnpm start         # run the library and docs site
pnpm test:apsara   # run tests
```

## License

Apsara is [Apache 2.0](LICENSE) licensed.
