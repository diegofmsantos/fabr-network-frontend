import { Jogador } from '@/types/jogador';
import { StatConfig } from '@/utils/statMappings';
import { TeamInfo } from './useTeamInfo';
import { calculateStatValue, formatStatValue, meetsMinimumRequirements } from '@/utils/statMappings';

export interface ProcessedPlayer {
  player: Jogador;
  average: number;
  teamInfo: TeamInfo;
  value: string | number;
}

export const usePlayerProcessing = (statMapping: StatConfig, getTeamInfo: (timeId: number) => TeamInfo) => {
  const getStatValue = (player: Jogador): number => {
    const value = calculateStatValue(player, statMapping);
    if (value === null) return 0;
    return Number(value);
  };

  const processPlayers = (players: Jogador[]): ProcessedPlayer[] => {
    return players
      .filter(player => {
        const value = calculateStatValue(player, statMapping);
        return value !== null && 
          value > 0 &&
          meetsMinimumRequirements(player, statMapping.category);
      })
      .map(player => {
        const statValue = getStatValue(player);
        return {
          player,
          average: statValue, // Usamos o valor direto da estatística para classificação
          teamInfo: getTeamInfo(player.timeId),
          value: formatStatValue(calculateStatValue(player, statMapping), statMapping)
        };
      })
      .sort((a, b) => b.average - a.average);
  };

  return { processPlayers };
};