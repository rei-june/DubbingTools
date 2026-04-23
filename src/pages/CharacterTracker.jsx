import { useState } from 'react';
import {
  Container,
  Paper,
  FileInput,
  Button,
  Stack,
  Alert,
  Text,
  Table,
  ScrollArea,
  Group,
} from '@mantine/core';
import { IconAlertCircle, IconUpload, IconDownload } from '@tabler/icons-react';
import {
  processEpisodeTracker,
  generateEpisodeTrackerCSV,
} from '../utils/episodeTracker';

export function CharacterTracker() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [tableData, setTableData] = useState(null);

  const handleClear = () => {
    setFile(null);
    setTableData(null);
    setStatus({ type: null, message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus({ type: 'error', message: 'Please select a CSV file' });
      return;
    }

    setStatus({ type: null, message: '' });

    try {
      const csvContent = await file.text();
      const { sortedEpisodes, characterData } =
        processEpisodeTracker(csvContent);

      setTableData({ sortedEpisodes, characterData });
      setStatus({
        type: 'success',
        message: `Found ${characterData.length} characters across ${sortedEpisodes.length} episodes`,
      });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `Error: ${err.message}` });
    }
  };

  const handleDownloadCSV = () => {
    if (!tableData) return;

    const csvContent = generateEpisodeTrackerCSV(
      tableData.sortedEpisodes,
      tableData.characterData
    );
    // Prepend BOM to help Excel detect UTF-8 and specify charset
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Generate output filename from input filename — use .tsv to reflect tab-separated content
    const originalName = file.name.replace(/\.csv$/i, '');
    a.download = `${originalName} - Episode Tracker.tsv`;

    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Container
      strategy="block"
      size={880}
      py="xl"
    >
      <Paper p="lg" radius="md" withBorder>
        <Stack gap="lg">
          <div>
            <Text size="lg" fw={700} mb="xs">
              Episode Tracker
            </Text>
            <Text size="sm" c="dimmed">
              Upload a script as a CSV file.
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
                disabled={!!tableData}
                description="Upload the script CSV file"
              />

              {status.message && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color={status.type === 'error' ? 'red' : 'green'}
                >
                  {status.message}
                </Alert>
              )}

              <Button type="submit" disabled={!file || !!tableData}>
                Generate Table
              </Button>

              {tableData && (
                <Button color="yellow" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </Stack>
          </form>
        </Stack>
      </Paper>

      {tableData && (
        <Paper p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="flex-end">
              <Button
                leftSection={<IconDownload size={16} />}
                onClick={handleDownloadCSV}
              >
                Download as CSV
              </Button>
            </Group>

            <ScrollArea type="auto">
              <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
                style={{ minWidth: 'max-content' }}
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Episodes:</Table.Th>
                    {tableData.characterData.map((cd) => (
                      <Table.Th key={cd.character}>{cd.character}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {tableData.sortedEpisodes.map((ep, rowIndex) => (
                    <Table.Tr key={ep}>
                      <Table.Td style={{ fontWeight: 500 }}>Episode {ep} (#1.{ep})</Table.Td>
                      {tableData.characterData.map((cd) => {
                        // For each character column, show their Nth episode in the Nth row
                        if (rowIndex < cd.episodes.length) {
                          const charEp = cd.episodes[rowIndex];
                          return (
                            <Table.Td key={cd.character}>
                              Episode {charEp} (#1.{charEp})
                            </Table.Td>
                          );
                        } else {
                          return <Table.Td key={cd.character}></Table.Td>;
                        }
                      })}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Stack>
        </Paper>
      )}
    </Container>
  );
}
