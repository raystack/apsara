import { execFileSync } from 'node:child_process';

export const RELEASES_URL = 'https://github.com/raystack/apsara/releases';

// Releases before v1.0.0 are the Radix-based library.
const FIRST_TAG = 'v1.0.0';
const TYPES = new Set(['feat', 'fix', 'refactor']);
const SUBJECT =
  /^(\w+)(?:\(([^)]*)\))?!?:\s*(?:\[([^\]]*)\]\s*)?(.+?)\s*\(#(\d+)\)$/;
const COMPONENT_DIR = /^packages\/(?:react|raystack)\/components\/([^/]+)\//;

export interface ChangelogEntry {
  type: string;
  summary: string;
  pr: number;
}

export interface ChangelogRelease {
  /** `null` for commits after the latest tag. */
  tag: string | null;
  entries: ChangelogEntry[];
}

/**
 * Reads a squash-merged subject, `<type>: [<scopes>] <summary> (#<pr>)` or
 * `<type>(<scopes>): <summary> (#<pr>)`. A subject without scopes belongs to a
 * component only when the commit changes one component directory.
 */
export function parseCommit(subject: string, files: string[]) {
  const match = SUBJECT.exec(subject);
  if (!match) return undefined;
  const [, type, parenScopes, bracketScopes, summary, pr] = match;
  if (!TYPES.has(type)) return undefined;
  let scopes = (bracketScopes ?? parenScopes ?? '')
    .split(',')
    .map(scope => scope.trim().toLowerCase())
    .filter(Boolean);
  if (scopes.length === 0) {
    const dirs = new Set(
      files.flatMap(file => COMPONENT_DIR.exec(file)?.[1] ?? [])
    );
    if (dirs.size === 1) scopes = [...dirs];
  }
  if (scopes.length === 0) return undefined;
  return { type, scopes, summary, pr: Number(pr) };
}

function git(args: string[]) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 64 * 1024 * 1024
  });
}

function versionOf(tag: string) {
  return tag.slice(1).split('.').map(Number);
}

function compareTags(a: string, b: string) {
  const [x, y] = [versionOf(a), versionOf(b)];
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

function readRange(range: string) {
  return git(['log', '--no-merges', '--format=%x1e%s', '--name-only', range])
    .split('\x1e')
    .slice(1)
    .map(chunk => {
      const [subject, ...files] = chunk.trim().split('\n');
      return parseCommit(subject, files.filter(Boolean));
    })
    .filter(commit => commit !== undefined);
}

/** Maps each scope to its releases, newest first. */
function readChangelog() {
  const tags = git(['tag', '--merged', 'HEAD', '--list', 'v*'])
    .split('\n')
    .filter(tag => /^v\d+\.\d+\.\d+$/.test(tag))
    .filter(tag => compareTags(tag, FIRST_TAG) >= 0)
    .sort(compareTags)
    .reverse();
  if (!tags.includes(FIRST_TAG)) return undefined;

  const ranges: [string | null, string][] = [[null, `${tags[0]}..HEAD`]];
  tags.slice(0, -1).forEach((tag, index) => {
    ranges.push([tag, `${tags[index + 1]}..${tag}`]);
  });

  const byScope = new Map<string, ChangelogRelease[]>();
  for (const [tag, range] of ranges) {
    for (const { scopes, ...entry } of readRange(range)) {
      for (const scope of scopes) {
        const releases = byScope.get(scope) ?? [];
        let release = releases.at(-1);
        if (release?.tag !== tag) {
          release = { tag, entries: [] };
          releases.push(release);
        }
        release.entries.push(entry);
        byScope.set(scope, releases);
      }
    }
  }
  return byScope;
}

let cache: Map<string, ChangelogRelease[]> | null | undefined;

/**
 * Returns the releases that changed a component, newest first, or `null` when
 * the build has no git history or tags.
 */
export function getChangelog(scope: string): ChangelogRelease[] | null {
  if (cache === undefined) {
    try {
      cache = readChangelog() ?? null;
    } catch {
      cache = null;
    }
    if (cache === null)
      console.warn('Changelog: no git history or tags, so pages show none.');
  }
  return cache === null ? null : (cache.get(scope) ?? []);
}
