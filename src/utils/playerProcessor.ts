import { Jogador } from '@/types/jogador';
import { StatConfig } from './statMappings';
import { TeamInfo } from '@/hooks/useTeamInfo';
import { ProcessedPlayer } from '@/types/processedPlayer';
import { CategoryKey } from './categoryThresholds';
import { StatsCalculator } from './statsCalculator';
import { BaseStatCalculator } from './baseStat';
import { StatsFormatter } from './statsFormater';

export function createProcessedPlayer(
  player: Jogador,
  statMapping: StatConfig,
  getTeamInfo: (timeId: number) => TeamInfo
): ProcessedPlayer | null {
  const stats = player.estatisticas[statMapping.category];
  if (!stats) return null;

  const statValue = StatsCalculator.calculate(stats, statMapping.key);
  if (statValue === null || statValue === 0) return null;

  const baseStat = BaseStatCalculator.calculate(stats, statMapping.category as CategoryKey);

  return {
    player,
    average: statValue,
    baseStat,
    teamInfo: getTeamInfo(player.timeId),
    value: StatsFormatter.format(statValue, statMapping)
  };
}

export function filterValidPlayer(player: ProcessedPlayer | null): player is ProcessedPlayer {
  return player !== null;
}

export function sortByAverage(a: ProcessedPlayer, b: ProcessedPlayer): number {
  return b.average - a.average;
}