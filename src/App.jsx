import { HashRouter, Routes, Route } from 'react-router-dom';
import { ReaperExport } from './pages/ReaperExport';
import { MarkerExport } from './pages/MarkerExport';
import { CharacterTracker } from './pages/CharacterTracker';
import { EpisodeAppearances } from './pages/EpisodeAppearances';
import { NotFound } from './pages/NotFound';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';

import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

function AppContent() {
  return (
    <MantineProvider>
      <HashRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<MarkerExport />} />
          <Route path="/episode-tracker" element={<CharacterTracker />} />
          <Route path="/episode-appearances" element={<EpisodeAppearances />} />
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
