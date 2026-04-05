import { Link, useLocation } from 'react-router-dom';
import { Group, Button } from '@mantine/core';

export function Navigation() {
  const location = useLocation();

  return (
    <Group justify="center" p="md" style={{ borderBottom: '1px solid #dee2e6' }}>
      <Button
        component={Link}
        to="/"
        variant={location.pathname === '/' ? 'filled' : 'subtle'}
      >
        Reaper Export
      </Button>
      <Button
        component={Link}
        to="/episode-tracker"
        variant={location.pathname === '/episode-tracker' ? 'filled' : 'subtle'}
      >
        Episode Tracker
      </Button>
      <Button
        component={Link}
        to="/episode-appearances"
        variant={location.pathname === '/episode-appearances' ? 'filled' : 'subtle'}
      >
        Episode Appearances
      </Button>
    </Group>
  );
}
