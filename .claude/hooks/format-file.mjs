import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

let input = '';
process.stdin.on('data', chunk => {
  input += chunk;
});
process.stdin.on('end', () => {
  const file = JSON.parse(input).tool_input?.file_path;
  const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const biome = join(root, 'node_modules', '.bin', 'biome');
  if (!file || !existsSync(biome)) return;
  spawnSync(biome, ['format', '--write', '--no-errors-on-unmatched', file], {
    cwd: root,
    stdio: 'ignore'
  });
});
