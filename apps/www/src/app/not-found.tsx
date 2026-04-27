import { Flex, Separator, Text } from '@raystack/apsara';

export default function NotFound() {
  return (
    <Flex
      align='center'
      justify='center'
      gap='large'
      width='full'
      style={{ height: '100vh' }}
    >
      <Text size={10} weight='bold'>
        404
      </Text>
      <Separator orientation='vertical' style={{ height: '48px' }} />
      <Text size={7}>This page could not be found.</Text>
    </Flex>
  );
}
