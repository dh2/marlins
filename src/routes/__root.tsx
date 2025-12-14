import { Outlet, createRootRoute } from '@tanstack/react-router';

import { Paper } from '@mui/material';

export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => <Paper>404 Not Found</Paper>,
});
