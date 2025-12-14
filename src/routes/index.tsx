import { Stack } from '@mui/material';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <Stack sx={{ background: '#1d191a' }} spacing={0} alignItems="center">
      <Link to="/dashboard">
        <img
          src="marlins-logo.png"
          alt="Miami Marlins Logo"
          title="View Schedule Dashboard"
          aria-label="View Schedule Dashboard"
          style={{ height: '99lvh', border: 'none' }}
        />
      </Link>
    </Stack>
  );
}
