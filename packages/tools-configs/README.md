# @raystack/tools-configs

Shared dev tool configurations for Raystack frontend projects.

## Installation

```bash
pnpm add -D @raystack/tools-configs
```

## Configs

### Biome

```json
// biome.json
{
  "extends": ["@raystack/tools-configs/biome"]
}
```

### TSConfig

Base config:
```json
// tsconfig.json
{
  "extends": "@raystack/tools-configs/tsconfig/base"
}
```

React config (extends base):
```json
// tsconfig.json
{
  "extends": "@raystack/tools-configs/tsconfig/react"
}
```

## License

Apsara is [Apache 2.0](LICENSE) licensed.
