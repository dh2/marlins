import type { GameNotification } from '../../types';
import { TeamComponent } from './TeamComponent';
import { GameStatusComponent } from './GameStatusComponent';
import { Grid } from '@mui/material';

export interface GameNotificationComponentProps {
    gameNotification: GameNotification;
}

export const GameNotificationComponent = ({ gameNotification }: GameNotificationComponentProps) => {
  return (
    <Grid container size={{xs: 12, md:11, lg: 10}} spacing={2} sx={{border: '1px solid #999'}} padding={1}>
      <Grid size={4}>
        <TeamComponent {...gameNotification.marlinsAffiliate} />
      </Grid>      
      <Grid size={4}>
        <TeamComponent {...gameNotification.opponent} />
      </Grid>
      <Grid size={4}>
        <GameStatusComponent {...gameNotification.gameStatus} />
      </Grid>
    </Grid>
  );
};