import { Grid } from '@mui/material';

import { useGetAffiliates } from '../../hooks/useGetAffiliates';
import { TeamComponent } from './TeamComponent';
import { GameStatusComponent } from './GameStatusComponent';
import type { GameNotification } from '../../types';

export interface GameNotificationComponentProps {
  gameNotification: GameNotification;
}

export const GameNotificationComponent = ({
  gameNotification,
}: GameNotificationComponentProps) => {
  const { data: affiliates = new Map() } = useGetAffiliates();
  const oppoenentParent = affiliates.get(gameNotification.opponent.id) ?? 'UNK';
  const oppName = `${gameNotification.opponent.name}(${oppoenentParent})`;
  return (
    <Grid
      container
      size={{ xs: 12, md: 11, lg: 10 }}
      spacing={2}
      sx={{ border: '1px solid #999' }}
      padding={1}
    >
      <Grid size={{ xs: 12, md: 4 }}>
        <TeamComponent {...gameNotification.marlinsAffiliate} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TeamComponent {...gameNotification.opponent} name={oppName} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <GameStatusComponent {...gameNotification.gameStatus} />
      </Grid>
    </Grid>
  );
};
