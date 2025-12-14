import { Box, Stack, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';
import type { ActivePlayer } from '../../types';

export interface TeamComponentProps {
  name: string;
  id: number;
  isHome?: boolean;
  activePlayers: Array<ActivePlayer>;
  score?: number;
  isWinner?: boolean;
}

export const TeamComponent = ({
  name,
  isHome,
  activePlayers,
  score,
  isWinner,
}: TeamComponentProps) => {
  let homeStatus: string | null = null;
  if (isHome !== undefined) {
    homeStatus = isHome ? '@' : 'VS';
  }
  const scoreDisplay = score !== undefined ? ` ${score}` : '';
  let color: TypographyProps['color'] = 'inherit';

  if (isWinner !== undefined) {
    color = isWinner === true ? 'primary' : 'warning';
  }

  return (
    <Box>
      <Typography variant="h5" color={color}>{`${
        homeStatus ?? ''
      } ${name}${scoreDisplay}`}</Typography>
      <Stack direction="row" spacing={1}>
        {activePlayers.map((player) => (
          <Box key={player.playerName}>
            <Typography variant="body2" component="span">
              {player.label}:{' '}
            </Typography>
            <Typography variant="body2" component="span">
              {player.playerName}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
