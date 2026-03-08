import { HashRouter, Routes, Route } from 'react-router-dom';
import { ReaperExport } from './pages/ReaperExport';
import { CharacterTracker } from './pages/CharacterTracker';
import { NotFound } from './pages/NotFound';
import { Footer } from './components/Footer';

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

function AppContent() {
  return (
    <MantineProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<ReaperExport />} />
          <Route path="/episode-tracker" element={<CharacterTracker />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </HashRouter>
    </MantineProvider>
  );
}

export default function App() {
  return <AppContent />;
}
