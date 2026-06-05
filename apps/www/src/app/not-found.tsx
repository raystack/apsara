import { Flex, Headline, Separator } from '@raystack/apsara';

export default function NotFound() {
  return (
    <Flex
      align='center'
      justify='center'
      gap={9}
      style={{ width: '100%', height: '100vh' }}
    >
      <Headline size='t3' weight='medium' style={{ width: 'auto' }}>
        404
      </Headline>
      <Separator orientation='vertical' style={{ height: '48px' }} />
      <Headline size='t1' weight='regular' style={{ width: 'auto' }}>
        This page could not be found.
      </Headline>
    </Flex>
  );
}
