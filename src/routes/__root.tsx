import { Outlet, createRootRoute } from '@tanstack/react-router'

import { Paper } from '@mui/material'

import Header from '../components/Header'

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
  notFoundComponent: () => <Paper>404 Not Found</Paper>,
})
