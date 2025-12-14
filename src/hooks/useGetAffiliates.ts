import { useQuery } from '@tanstack/react-query';
import type { AffiliatesResponse, TeamsResponse } from '../types';

const fetchTeams = async (): Promise<TeamsResponse> => {
  const response = await fetch(
    'https://statsapi.mlb.com/api/v1/teams?sportId=1',
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const fetchAffiliates = async (teamId: number): Promise<AffiliatesResponse> => {
  const response = await fetch(
    `https://statsapi.mlb.com/api/v1/teams/${teamId}/affiliates`,
  );
  if (!response.ok) {
    // It's possible a team has no affiliates, the API might 404.
    // For now, let's treat it as an error and see what happens.
    // A better approach might be to return an empty array of teams.
    console.warn(`Could not fetch affiliates for team ID ${teamId}`);
    return { copyright: '', teams: [] };
  }
  return response.json();
};

export const useGetAffiliates = () => {
  return useQuery({
    queryKey: ['affiliates'],
    staleTime: Infinity,
    queryFn: async () => {
      const mlbTeamsResponse = await fetchTeams();
      const mlbTeams = mlbTeamsResponse.teams;

      const affiliatePromises = mlbTeams.map((team) =>
        fetchAffiliates(team.id),
      );
      const affiliateResponses = await Promise.all(affiliatePromises);

      const affiliateMap = new Map<number, string>();

      affiliateResponses.forEach((response, index) => {
        const parentTeam = mlbTeams[index];
        response.teams.forEach((affiliate) => {
          affiliateMap.set(affiliate.id, parentTeam.abbreviation);
        });
      });

      return affiliateMap;
    },
  });
};
