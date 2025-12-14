import { useState } from 'react'
import { GameNotificationComponent } from './GameNotificationComponent'
import { Typography, TextField, Stack, CircularProgress, Grid } from '@mui/material'
import { useScheduleQuery } from '../../hooks/useScheduleQuery'

export const ScheduleAndResultsComponent = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const { data: schedule, isLoading, isError } = useScheduleQuery(date)

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="h2" color="primary">Schedule and Results</Typography>
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
      {schedule && (
        <Grid container spacing={2} justifyContent="center">
          {schedule.map((game, index) => (
            <GameNotificationComponent key={index} gameNotification={game} />
          ))}
        </Grid>
      )}
    </Stack>
  )
}
