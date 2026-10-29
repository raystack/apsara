import Link from 'fumadocs-core/link';
import { getChangelog, RELEASES_URL } from '@/lib/changelog';
import styles from '../mdx/mdx-components.module.css';

const PULL_URL = 'https://github.com/raystack/apsara/pull';

/** The pull requests of each release, from the git history. */
export function Changelog() {
  const releases = getChangelog();
  if (!releases)
    return (
      <p>
        See <Link href={RELEASES_URL}>GitHub Releases</Link>.
      </p>
    );

  return releases.map(release => (
    <section key={release.tag ?? 'unreleased'}>
      <h2 id={release.tag ?? 'unreleased'} className={styles['prose-h2']}>
        {release.tag ? (
          <Link href={`${RELEASES_URL}/tag/${release.tag}`}>{release.tag}</Link>
        ) : (
          'Unreleased'
        )}
      </h2>
      <ul>
        {release.entries.map(entry => (
          <li key={entry.pr}>
            {entry.type}:{' '}
            {entry.scopes.length > 0 && `[${entry.scopes.join(', ')}] `}
            {entry.summary} (
            <Link href={`${PULL_URL}/${entry.pr}`}>#{entry.pr}</Link>)
          </li>
        ))}
      </ul>
    </section>
  ));
}
