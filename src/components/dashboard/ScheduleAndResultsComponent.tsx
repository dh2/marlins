import { useState } from 'react'
import { GameNotificationComponent } from './GameNotificationComponent'
import { Typography, TextField, Stack, CircularProgress } from '@mui/material'
import { useScheduleQuery } from '../../hooks/useScheduleQuery'

export const ScheduleAndResultsComponent = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const { data: schedule, isLoading, isError } = useScheduleQuery(date)

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Schedule and Results</Typography>
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
        <Stack spacing={2}>
          {schedule.map((game, index) => (
            <GameNotificationComponent key={index} gameNotification={game} />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
