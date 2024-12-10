"use client"

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';
import { CategoryKey, getTierTitle, getTierForValue } from '@/utils/categoryThresholds';
import { getStatMapping } from '@/utils/statMappings';
import { StatSelect } from '@/components/StatSelect';
import StatsTier from '@/components/StatsTier';
import { useStats } from '@/hooks/useStats';
import { useTeamInfo } from '@/hooks/useTeamInfo';
import { usePlayerProcessing, ProcessedPlayer } from '@/hooks/usePlayerProcessing';

const StatsPage: React.FC = () => {
  const searchParams = useSearchParams();
  const statParam = searchParams.get('stat') || '';
  const { players, times, loading } = useStats();
  const getTeamInfo = useTeamInfo(times);
  const statMapping = getStatMapping(statParam);
  const { processPlayers } = usePlayerProcessing(statMapping, getTeamInfo);

  if (loading) return <Loading />;

  const groupPlayersByTier = (processedPlayers: ProcessedPlayer[]) => {
    return processedPlayers.reduce<Record<string, ProcessedPlayer[]>>(
      (acc, player) => {
        const tier = getTierForValue(player.average, statMapping.category as CategoryKey);
        const tierKey = `tier${tier}`;
        acc[tierKey] = acc[tierKey] || [];
        acc[tierKey].push(player);
        return acc;
      },
      { tier1: [], tier2: [], tier3: [] }
    );
  };

  const mapPlayersToProps = (
    players: ProcessedPlayer[],
    startIndex: number
  ) => {
    return players.map((item, index) => ({
      player: item.player,
      teamInfo: item.teamInfo,
      value: item.value,
      index: index + startIndex
    }));
  };

  const renderTierSection = (
    tier: number,
    players: ProcessedPlayer[],
    startIndex: number,
    backgroundColor?: string
  ) => (
    <StatsTier
      title={getTierTitle(statMapping.category as CategoryKey, tier)}
      players={mapPlayersToProps(players, startIndex)}
      backgroundColor={backgroundColor}
    />
  );

  const processedPlayers = processPlayers(players);
  const tierPlayers = groupPlayersByTier(processedPlayers);

  return (
    <div className="bg-[#ECECEC] min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto">
        <StatSelect currentStat={statParam} />

        {renderTierSection(1, tierPlayers.tier1, 0)}
        {renderTierSection(2, tierPlayers.tier2, tierPlayers.tier1.length, 'bg-gray-700')}
        {renderTierSection(
          3,
          tierPlayers.tier3,
          tierPlayers.tier1.length + tierPlayers.tier2.length,
          'bg-gray-500'
        )}
      </div>
    </div>
  );
};

export default StatsPage;