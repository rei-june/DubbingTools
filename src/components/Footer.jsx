import { Text, Container } from '@mantine/core';

export function Footer() {
  const lastUpdated = new Date('2026-03-08T06:20:54.735Z').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Container fluid px="xl" py="md">
      <Text size="sm" c="dimmed" ta="center">
        Last updated: {lastUpdated}
      </Text>
    </Container>
  );
}
