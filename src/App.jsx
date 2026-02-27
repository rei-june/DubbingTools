import { Container } from '@mantine/core';
import { ReaperExport } from './pages/ReaperExport';

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

function AppContent() {
  return (
    <MantineProvider>
      <Container size="sm" py="xl">
        <ReaperExport />
      </Container>
    </MantineProvider>
  );
}

export default function App() {
  return <AppContent />;
}
