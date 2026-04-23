import { Flex, Text } from '@raystack/apsara';
import styles from './not-found.module.css';

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
      <div className={styles.divider} />
      <Text size={7}>This page could not be found.</Text>
    </Flex>
  );
}
