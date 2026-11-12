import { execFileSync } from 'node:child_process';
import type { Link, List, Paragraph, Root, RootContent } from 'mdast';

const RELEASES_URL = 'https://github.com/raystack/apsara/releases';
const PULL_URL = 'https://github.com/raystack/apsara/pull';

// Releases before v1.0.0 are the Radix-based library.
const FIRST_TAG = 'v1.0.0';
const TYPES = new Set(['feat', 'fix', 'refactor']);
const SUBJECT =
  /^(\w+)(!?)(?:\(([^)]*)\))?:\s*(?:\[([^\]]*)\]\s*)?(.+?)\s*\(#(\d+)\)$/;
const BREAKING_FOOTER = /^BREAKING[ -]CHANGE:/m;
// Separates commits and the subject from the body in the `git log` output.
const COMMIT_END = '\x1e';
const BODY_START = '\x1f';

interface ChangelogEntry {
  type: string;
  breaking: boolean;
  scopes: string[];
  summary: string;
  pr: number;
}

interface ChangelogRelease {
  tag: string;
  entries: ChangelogEntry[];
}

/**
 * Reads a squash-merged commit, `<type>: [<scopes>] <summary> (#<pr>)` or
 * `<type>(<scopes>): <summary> (#<pr>)`. A `!` after the type or a
 * `BREAKING CHANGE:` footer marks it as breaking.
 */
function parseCommit(commit: string): ChangelogEntry | undefined {
  const [subject, body = ''] = commit.trim().split(BODY_START);
  const match = SUBJECT.exec(subject);
  if (!match || !TYPES.has(match[1])) return undefined;
  const [, type, bang, parenScopes, bracketScopes, summary, pr] = match;
  const scopes = (bracketScopes ?? parenScopes ?? '')
    .split(',')
    .map(scope => scope.trim())
    .filter(Boolean);
  const breaking = Boolean(bang) || BREAKING_FOOTER.test(body);
  return { type, breaking, scopes, summary, pr: Number(pr) };
}

function git(args: string[]) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 64 * 1024 * 1024
  });
}

/**
 * Returns the feat, fix and refactor pull requests of each release after
 * v1.0.0, newest first, or `null` when the build has no git history or tags.
 */
function getChangelog(): ChangelogRelease[] | null {
  try {
    const tags = git(['tag', '--merged', 'HEAD', '--sort=-v:refname'])
      .split('\n')
      .filter(tag => /^v\d+\.\d+\.\d+$/.test(tag));
    const first = tags.indexOf(FIRST_TAG);
    if (first === -1) return null;
    const ranges: [string, string][] = [];
    for (let index = 0; index < first; index += 1)
      ranges.push([tags[index], `${tags[index + 1]}..${tags[index]}`]);
    return ranges
      .map(([tag, range]) => ({
        tag,
        entries: git([
          'log',
          '--no-merges',
          `--format=%s${BODY_START}%b${COMMIT_END}`,
          range
        ])
          .split(COMMIT_END)
          .flatMap(commit => parseCommit(commit) ?? [])
      }))
      .filter(release => release.entries.length > 0);
  } catch {
    return null;
  }
}

function link(url: string, value: string): Link {
  return { type: 'link', url, children: [{ type: 'text', value }] };
}

function entryItem(entry: ChangelogEntry): Paragraph {
  const scopes = entry.scopes.length > 0 ? `[${entry.scopes.join(', ')}] ` : '';
  return {
    type: 'paragraph',
    children: [
      {
        type: 'text',
        value: `${entry.type}${entry.breaking ? '!' : ''}: ${scopes}${entry.summary} (`
      },
      link(`${PULL_URL}/${entry.pr}`, `#${entry.pr}`),
      { type: 'text', value: ')' }
    ]
  };
}

function changelogNodes(): RootContent[] {
  const releases = getChangelog();
  if (!releases)
    return [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'See ' },
          link(RELEASES_URL, 'GitHub Releases'),
          { type: 'text', value: '.' }
        ]
      }
    ];

  return releases.flatMap((release): RootContent[] => {
    const list: List = {
      type: 'list',
      ordered: false,
      spread: false,
      children: release.entries.map(entry => ({
        type: 'listItem',
        spread: false,
        children: [entryItem(entry)]
      }))
    };
    // The table of contents links each heading, so the heading holds no link.
    const heading: RootContent = {
      type: 'heading',
      depth: 2,
      children: [{ type: 'text', value: release.tag }]
    };
    return [
      heading,
      {
        type: 'paragraph',
        children: [
          link(`${RELEASES_URL}/tag/${release.tag}`, 'Release on GitHub')
        ]
      },
      list
    ];
  });
}

/**
 * Replaces `<Changelog />` with a heading and a list of pull requests for each
 * release. The plugin writes Markdown, so the headings reach the table of
 * contents, search and the page's Markdown output.
 */
export function remarkChangelog() {
  return (tree: Root) => {
    const index = tree.children.findIndex(
      node => node.type === 'mdxJsxFlowElement' && node.name === 'Changelog'
    );
    if (index !== -1) tree.children.splice(index, 1, ...changelogNodes());
  };
}
