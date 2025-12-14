import { useState } from 'react';
import {
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useScheduleQuery } from '../../hooks/useScheduleQuery';
import { GameNotificationComponent } from './GameNotificationComponent';
import { NoGamesComponent } from './NoGamesComponent';

export const ScheduleAndResultsComponent = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: schedule, isLoading, isError } = useScheduleQuery(date);
  const hasGames = !isLoading && schedule && schedule.length > 0;

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h2" color="primary">
        Schedule and Results
      </Typography>
      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      {isLoading && <CircularProgress />}
      {isError && (
        <Typography color="error">Error fetching schedule.</Typography>
      )}

      <Grid container spacing={2} justifyContent="center">
        {hasGames ? (
          schedule.map((game, index) => (
            <GameNotificationComponent key={index} gameNotification={game} />
          ))
        ) : (
          <NoGamesComponent />
        )}
      </Grid>
    </Stack>
  );
};
