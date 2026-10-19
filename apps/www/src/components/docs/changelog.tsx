import { mdxComponents } from '@/components/mdx';
import { type ChangelogRelease, RELEASES_URL } from '@/lib/changelog';

const { h2: H2, h3: H3, a: A } = mdxComponents;

export default function Changelog({
  releases
}: {
  releases: ChangelogRelease[] | null;
}) {
  return (
    <>
      <H2 id='changelog'>Changelog</H2>
      {releases?.length === 0 && <p>No changes since v1.0.0.</p>}
      {releases?.map(release => (
        <section key={release.tag ?? 'unreleased'}>
          <H3>
            {release.tag ? (
              <A href={`${RELEASES_URL}/tag/${release.tag}`}>{release.tag}</A>
            ) : (
              'Unreleased'
            )}
          </H3>
          <ul>
            {release.entries.map(entry => (
              <li key={entry.pr}>
                {entry.type}: {entry.summary} (
                <A href={`https://github.com/raystack/apsara/pull/${entry.pr}`}>
                  #{entry.pr}
                </A>
                )
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        See <A href={RELEASES_URL}>GitHub Releases</A> for every release.
      </p>
    </>
  );
}
