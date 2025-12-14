import { Grid } from '@mui/material';

export const NoGamesComponent = () => {
  return (
    <Grid size={12}>
      <img
        src="no-games.png"
        alt="Cartoon image of sad fan with games to watch"
        title="No Games Today"
        aria-label="No Games Today"
        style={{ height: '50lvh', border: 'none' }}
      />
    </Grid>
  );
};
