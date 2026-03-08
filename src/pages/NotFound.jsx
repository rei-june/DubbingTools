import { Container, Paper, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Container fluid px="xl" py="xl">
      <Paper p="lg" radius="md" withBorder style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Stack gap="lg" align="center">
          <Text size="xl" fw={700}>
            404 - Page Not Found
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            The page you're looking for doesn't exist.
          </Text>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
