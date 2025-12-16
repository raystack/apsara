# @raystack/tools-config

Shared dev tool configurations for Raystack frontend projects.

## Installation

```bash
pnpm add -D @raystack/tools-config
```

## Configs

### Biome

```json
// biome.json
{
  "extends": ["@raystack/tools-config/biome"]
}
```

### TSConfig

Base config:
```json
// tsconfig.json
{
  "extends": "@raystack/tools-config/tsconfig/base"
}
```

React config (extends base):
```json
// tsconfig.json
{
  "extends": "@raystack/tools-config/tsconfig/react"
}
```

## License

Apsara is [Apache 2.0](LICENSE) licensed.
