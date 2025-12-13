import type { GameNotification } from '../../types';
import { TeamComponent } from './TeamComponent';
import { GameStatusComponent } from './GameStatusComponent';
import { Grid } from '@mui/material';

export interface GameNotificationComponentProps {
    gameNotification: GameNotification;
}

export const GameNotificationComponent = ({ gameNotification }: GameNotificationComponentProps) => {
  return (
    <Grid container spacing={2}>
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