import { execFileSync } from 'node:child_process';

export const RELEASES_URL = 'https://github.com/raystack/apsara/releases';

// Releases before v1.0.0 are the Radix-based library.
const FIRST_TAG = 'v1.0.0';
const TYPES = new Set(['feat', 'fix', 'refactor']);
const SUBJECT =
  /^(\w+)(?:\(([^)]*)\))?!?:\s*(?:\[([^\]]*)\]\s*)?(.+?)\s*\(#(\d+)\)$/;

export interface ChangelogEntry {
  type: string;
  scopes: string[];
  summary: string;
  pr: number;
}

export interface ChangelogRelease {
  /** `null` for the changes after the latest release. */
  tag: string | null;
  entries: ChangelogEntry[];
}

/**
 * Reads a squash-merged subject, `<type>: [<scopes>] <summary> (#<pr>)` or
 * `<type>(<scopes>): <summary> (#<pr>)`.
 */
function parseSubject(subject: string): ChangelogEntry | undefined {
  const match = SUBJECT.exec(subject);
  if (!match || !TYPES.has(match[1])) return undefined;
  const [, type, parenScopes, bracketScopes, summary, pr] = match;
  const scopes = (bracketScopes ?? parenScopes ?? '')
    .split(',')
    .map(scope => scope.trim())
    .filter(Boolean);
  return { type, scopes, summary, pr: Number(pr) };
}

function git(args: string[]) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  });
}

/**
 * Returns the feat, fix and refactor pull requests of each release after
 * v1.0.0, newest first, or `null` when the build has no git history or tags.
 */
export function getChangelog(): ChangelogRelease[] | null {
  try {
    const tags = git(['tag', '--merged', 'HEAD', '--sort=-v:refname'])
      .split('\n')
      .filter(tag => /^v\d+\.\d+\.\d+$/.test(tag));
    const first = tags.indexOf(FIRST_TAG);
    if (first === -1) return null;
    const ranges: [string | null, string][] = [[null, `${tags[0]}..HEAD`]];
    for (let index = 0; index < first; index += 1)
      ranges.push([tags[index], `${tags[index + 1]}..${tags[index]}`]);
    return ranges
      .map(([tag, range]) => ({
        tag,
        entries: git(['log', '--no-merges', '--format=%s', range])
          .split('\n')
          .flatMap(subject => parseSubject(subject) ?? [])
      }))
      .filter(release => release.entries.length > 0);
  } catch {
    return null;
  }
}
