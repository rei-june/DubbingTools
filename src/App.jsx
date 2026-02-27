import { useState } from 'react';
import {
  Container,
  Paper,
  TextInput,
  FileInput,
  Button,
  Group,
  Stack,
  Alert,
  Loader,
  Text,
  MantineProvider,
  Tabs,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconUpload } from '@tabler/icons-react';
import JSZip from 'jszip';
import { processCSV } from './utils/csvProcessor';
import { ReaperExport } from './pages/ReaperExport';

function AppContent() {
  const [file, setFile] = useState(null);
  const [actorName, setActorName] = useState('');
  const [characters, setCharacters] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus({ type: 'error', message: 'Please select a CSV file' });
      return;
    }

    if (!actorName.trim()) {
      setStatus({ type: 'error', message: 'Please enter an actor name' });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const csvContent = await file.text();
      const characterFilter = characters
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const episodes = processCSV(csvContent, actorName, characterFilter);

      if (episodes.size === 0) {
        setStatus({
          type: 'error',
          message: 'No data found matching the filters',
        });
        setLoading(false);
        return;
      }

      // Calculate stats
      let total = 0;
      for (const [, data] of episodes.entries()) {
        total += data.markers.length;
      }

      const stats = new Map();
      let cumulative = 0;
      for (const [ep, data] of episodes.entries()) {
        cumulative += data.markers.length;
        stats.set(ep, {
          markerCount: data.markers.length,
          cumulative,
          percentage: ((cumulative / total) * 100).toFixed(2),
        });
      }

      // Create ZIP file
      const zip = new JSZip();

      // Add stats file
      const statsHeader = `Episode,Marker Count,Cumulative Count,Percentage Done (${total})`;
      const statsLines = [statsHeader];
      for (const [ep, stat] of stats.entries()) {
        statsLines.push(
          `${ep},${stat.markerCount},${stat.cumulative},${stat.percentage}`
        );
      }
      zip.file('stats.csv', statsLines.join('\n') + '\n');

      // Add marker files for each episode
      for (const [ep, data] of episodes.entries()) {
        const header = '#,Name,Start';
        const content = [header].concat(data.markers).join('\n') + '\n';
        zip.file(`${ep}-markers.csv`, content);
      }

      const zipBuffer = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBuffer);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'markers.zip';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus({
        type: 'success',
        message: `✓ Generated ${episodes.size} episode files! Download started.`,
      });
      setFile(null);
      setActorName('');
      setCharacters('');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setActorName('');
    setCharacters('');
    setStatus({ type: null, message: '' });
  };

  return (
    <Container size="sm" py="xl">
      <Tabs defaultValue="markers">
        <Tabs.List>
          <Tabs.Tab value="markers">📝 Markers CSV</Tabs.Tab>
          <Tabs.Tab value="reaper">🎬 Reaper Projects</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="markers">
          <Paper p="lg" radius="md" withBorder>
            <Stack gap="lg">
              <div>
                <Text size="lg" fw={700} mb="xs">
                  📝 Episode Markers
                </Text>
                <Text size="sm" c="dimmed">
                  Generate marker files from your CSV
                </Text>
              </div>

              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <FileInput
                    label="CSV File"
                    placeholder="Pick file"
                    icon={<IconUpload size={14} />}
                    accept=".csv"
                    value={file}
                    onChange={setFile}
                    required
                    description="Upload your episode data CSV file"
                  />

                  <TextInput
                    label="Actor Name"
                    placeholder="e.g., Rei June"
                    value={actorName}
                    onChange={(e) => setActorName(e.currentTarget.value)}
                    required
                    description="Filter markers by this actor name"
                  />

                  <TextInput
                    label="Characters (Optional)"
                    placeholder="e.g., Character1, Character2"
                    value={characters}
                    onChange={(e) => setCharacters(e.currentTarget.value)}
                    description="Comma-separated list. Leave blank for all characters"
                  />

                  {status.message && (
                    <Alert
                      icon={
                        status.type === 'error' ? (
                          <IconAlertCircle size={16} />
                        ) : (
                          <IconCheck size={16} />
                        )
                      }
                      title={status.type === 'error' ? 'Error' : 'Success'}
                      color={status.type === 'error' ? 'red' : 'green'}
                    >
                      {status.message}
                    </Alert>
                  )}

                  <Group justify="flex-end" gap="sm">
                    <Button
                      variant="default"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      leftSection={loading ? <Loader size={16} /> : null}
                    >
                      {loading ? 'Processing...' : 'Generate & Download'}
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="reaper">
          <ReaperExport />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

export default function App() {
  return (
    <MantineProvider>
      <AppContent />
    </MantineProvider>
  );
}
