import { Flex, Text } from '@raystack/apsara';

export const metadata = {
  title: 'Examples'
};

/**
 * Bare examples landing page.
 *
 * `/examples` is a manual-QA harness for trying Apsara components in a
 * full-page context — the kind of thing the small doc demos can't show.
 * It is not linked from the public site.
 *
 * To add an example, drop a new route folder next to this file, e.g.
 * `app/examples/<name>/page.tsx`, and build whatever you need to test.
 * See README.md in this folder for the convention.
 */
export default function ExamplesPage() {
  return (
    <Flex
      direction='column'
      gap={4}
      align='center'
      justify='center'
      style={{ minHeight: '60vh', padding: 32 }}
    >
      <Text size='large'>Examples</Text>
      <Text variant='secondary'>
        A scratch area for manual QA. Add a route under{' '}
        <code>app/examples/&lt;name&gt;/page.tsx</code> to test a component.
      </Text>
    </Flex>
  );
}
