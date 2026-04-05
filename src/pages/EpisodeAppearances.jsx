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
  processCharacterAppearances,
  generateCharacterAppearancesCSV,
} from '../utils/characterAppearances';

export function EpisodeAppearances() {
  const [scriptFile, setScriptFile] = useState(null);
  const [castFile, setCastFile] = useState(null);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [tableData, setTableData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scriptFile) {
      setStatus({ type: 'error', message: 'Please select a script CSV file' });
      return;
    }

    if (!castFile) {
      setStatus({ type: 'error', message: 'Please select a cast CSV file' });
      return;
    }

    setStatus({ type: null, message: '' });

    try {
      const scriptContent = await scriptFile.text();
      const castContent = await castFile.text();
      const data = processCharacterAppearances(scriptContent, castContent);

      setTableData(data);
      setStatus({
        type: 'success',
        message: `Found ${data.length} characters`,
      });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: `Error: ${err.message}` });
    }
  };

  const handleDownloadCSV = () => {
    if (!tableData) return;

    const csvContent = generateCharacterAppearancesCSV(tableData);
    const blob = new Blob([csvContent], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character-appearances.tsv';

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
              Episode Appearances
            </Text>
            <Text size="sm" c="dimmed">
              Upload a script CSV (with EP and CHARACTER columns) and a cast CSV (with Character column for ordering).
            </Text>
          </div>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <FileInput
                label="Script CSV File"
                placeholder="Pick file"
                icon={<IconUpload size={14} />}
                accept=".csv"
                value={scriptFile}
                onChange={setScriptFile}
                required
                description="CSV with EP and CHARACTER columns"
              />

              <FileInput
                label="Cast CSV File"
                placeholder="Pick file"
                icon={<IconUpload size={14} />}
                accept=".csv"
                value={castFile}
                onChange={setCastFile}
                required
                description="CSV with Character column to determine output order"
              />

              {status.message && (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color={status.type === 'error' ? 'red' : 'green'}
                >
                  {status.message}
                </Alert>
              )}

              <Button type="submit" disabled={!scriptFile || !castFile}>
                Generate Table
              </Button>
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
                Download as TSV
              </Button>
            </Group>

            <ScrollArea type="auto">
              <Table
                striped
                highlightOnHover
                withTableBorder
                withColumnBorders
              >
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Character</Table.Th>
                    <Table.Th>Appearances</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {tableData.map((row) => (
                    <Table.Tr key={row.character}>
                      <Table.Td>{row.character}</Table.Td>
                      <Table.Td>{row.appearances}</Table.Td>
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
