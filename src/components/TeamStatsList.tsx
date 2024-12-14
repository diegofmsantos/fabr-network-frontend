import React from 'react';
import Image from 'next/image';
import { Jogador } from '@/types/jogador';
import { Time } from '@/types/time';
import { StatConfig } from '@/utils/statMappings';
import NoStats from './ui/NoStats';
import { getCategoryFromKey } from './TimeRankingGroup';

interface TeamStatsListProps {
    players: Jogador[];
    times: Time[];
    statMapping: StatConfig;
}

interface RankedTeam {
    time: Time;
    value: number | null;
}

export const TeamStatsList: React.FC<TeamStatsListProps> = ({ players, times, statMapping }) => {
    const calculateTeamStat = (timeId: number): number | null => {
        const teamPlayers = players.filter(player => player.timeId === timeId);
        const category = getCategoryFromKey(statMapping.key);
        let total = 0;

        try {
            teamPlayers.forEach(player => {
                const value = player.estatisticas[category][statMapping.key];
                if (typeof value === 'number') {
                    total += value;
                }
            });

            return total || null;
        } catch (error) {
            console.error(`Error calculating stat for team ${timeId}:`, error);
            return null;
        }
    };

    const normalizeForFilePath = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9-]/g, "");
    };

    const rankedTeams: RankedTeam[] = times
        .map(time => ({
            time,
            value: calculateTeamStat(time.id)
        }))
        .filter(item => item.value !== null)
        .sort((a, b) => (b.value || 0) - (a.value || 0));

    if (!rankedTeams.length) {
        return (
            <div className="py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">{statMapping.title}</h1>
                <NoStats />
            </div>
        );
    }

    const TeamListItem: React.FC<{ team: RankedTeam; index: number }> = ({ team, index }) => (
        <div 
            className={`flex items-center justify-between p-4 mb-2 rounded-lg ${
                index === 0 ? `text-white` : 'bg-white'
            }`}
            style={{ 
                backgroundColor: index === 0 ? team.time.cor : undefined 
            }}
        >
            <div className="flex items-center gap-4">
                <span className="text-xl font-bold">{index + 1}</span>
                <Image
                    src={`/assets/times/logos/${normalizeForFilePath(team.time.nome)}.png`}
                    width={40}
                    height={40}
                    alt={`Logo do ${team.time.nome}`}
                    className="w-auto h-auto"
                />
                <span className="font-bold">{team.time.nome}</span>
            </div>
            <span className="font-bold text-xl">
                {typeof team.value === 'number' 
                    ? team.value.toLocaleString('pt-BR') 
                    : 'N/A'}
            </span>
        </div>
    );

    return (
        <div className="bg-[#ECECEC] py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">{statMapping.title}</h1>
            <div className="max-w-2xl mx-auto px-4">
                {rankedTeams.map((team, index) => (
                    <TeamListItem 
                        key={team.time.id} 
                        team={team} 
                        index={index} 
                    />
                ))}
            </div>
        </div>
    );
};