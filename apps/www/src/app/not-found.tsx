import { Flex, Headline, Separator } from '@raystack/apsara';

export default function NotFound() {
  return (
    <Flex
      align='center'
      justify='center'
      gap={9}
      width='full'
      style={{ height: '100vh' }}
    >
      <Headline size='t3' weight='medium'>
        404
      </Headline>
      <Separator orientation='vertical' style={{ height: '48px' }} />
      <Headline size='t1' weight='regular'>
        This page could not be found.
      </Headline>
    </Flex>
  );
}
