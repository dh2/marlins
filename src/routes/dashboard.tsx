// dashboard.tsx
import { createFileRoute } from '@tanstack/react-router';
import { ScheduleAndResultsComponent } from '../components/dashboard/ScheduleAndResultsComponent';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  return <ScheduleAndResultsComponent />;
}
