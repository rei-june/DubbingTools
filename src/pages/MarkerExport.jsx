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
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconUpload } from '@tabler/icons-react';
import JSZip from 'jszip';
import { processCSV } from '../utils/csvProcessor';

export function MarkerExport() {
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

      // Get base filename without extension
      const baseName = file.name.replace(/\.csv$/i, '');

      // Add stats file with base filename
      const statsHeader = `Episode,Marker Count,Cumulative Count,Percentage Done (${total})`;
      const statsLines = [statsHeader];
      for (const [ep, stat] of stats.entries()) {
        statsLines.push(
          `${ep},${stat.markerCount},${stat.cumulative},${stat.percentage}`
        );
      }
      zip.file(`${baseName}-stats.csv`, statsLines.join('\n') + '\n');

      // Add marker CSV files for each episode
      for (const [ep, data] of episodes.entries()) {
        const paddedEp = ep.padStart(2, '0');
        const header = '#,Name,Start';
        const content = [header].concat(data.markers).join('\n') + '\n';
        zip.file(`${paddedEp}-markers.csv`, content);
      }

      const zipBuffer = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBuffer);
      const a = document.createElement('a');
      a.href = url;

      // Generate zip filename from CSV name and actor filter
      const zipFileName = `${baseName}_${actorName.replace(/\s+/g, '_')}_markers.zip`;
      a.download = zipFileName;

      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus({
        type: 'success',
        message: `✓ Generated ${episodes.size} marker CSV files and stats! Download started.`,
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
      <Paper p="lg" radius="md" withBorder>
        <Stack gap="lg">
          <div>
            <Text size="lg" fw={700} mb="xs">
              Marker CSV Generator
            </Text>
            <Text size="sm" c="dimmed">
              This tool generates marker CSV files for each episode that your
              character(s) appear in, along with a stats file showing marker
              counts and cumulative progress.
              <br />
              <br />
              The output includes:
              <ul>
                <li>
                  Individual marker CSV files for each episode (format:
                  ##-markers.csv)
                </li>
                <li>
                  A stats file showing marker count, cumulative count, and
                  percentage done per episode
                </li>
              </ul>
              <p>
                The marker files use the format: #,Name,Start and can be
                imported into Reaper or other DAWs that support CSV marker
                import.
              </p>
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
                description="Upload the script for the show you're doing. This is the script tab of the project."
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
    </Container>
  );
}
