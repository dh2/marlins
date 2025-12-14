import { Box, Stack, Typography } from '@mui/material';
import { BasesIcon } from '../BasesIcon';
import type { CurrentStatus, Scenario } from '../../types';

export interface GameStatusComponentProps {
  location: string;
  scenario: Scenario;
  link?: string;
}

const isCurrentStatus = (scenario: Scenario): scenario is CurrentStatus => {
  return (
    typeof scenario === 'object' &&
    'inningNumber' in scenario &&
    'inningSide' in scenario &&
    'outs' in scenario
  );
};

export const GameStatusComponent = ({
  location,
  scenario,
}: GameStatusComponentProps) => {
  const renderScenario = () => {
    if (typeof scenario === 'string') {
      return <Typography variant="h6">{scenario}</Typography>;
    }
    if (scenario instanceof Date) {
      return (
        <Typography variant="h6">{scenario.toLocaleTimeString()}</Typography>
      );
    }
    if (isCurrentStatus(scenario)) {
      return (
        <Box>
          <Stack direction="row" gap={1}>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {scenario.inningSide} {scenario.inningNumber}{' '}
            </Typography>
            <Typography variant="body1">
              {`${scenario.outs} ${scenario.outs > 1 ? 'Outs' : 'Out'}`}{' '}
            </Typography>
            <BasesIcon {...(scenario.baseStatus ?? {})} />
          </Stack>
        </Box>
      );
    }
    return null;
  };

  return (
    <Stack>
      {renderScenario()}
      <Typography variant="body1">{location}</Typography>
    </Stack>
  );
};
