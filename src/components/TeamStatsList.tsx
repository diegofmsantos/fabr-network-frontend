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
        try {
            const teamPlayers = players.filter(player => player.timeId === timeId);
            const category = getCategoryFromKey(statMapping.key);
            let total = 0;

            teamPlayers.forEach(player => { // @ts-ignore
                const value = player.estatisticas[category]?.[statMapping.key];
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
            time, // @ts-ignore
            value: calculateTeamStat(time.id)
        }))
        .filter((team): team is RankedTeam => team.value !== null)
        .sort((a, b) => {
            if (a.value === null || b.value === null) return 0;
            return b.value - a.value;
        });

    const TeamListItem: React.FC<{ team: RankedTeam; index: number }> = ({ team, index }) => {
        const isFirstPlace = index === 0;

        return (
            <div 
                className={`flex items-center justify-between p-4 mb-2 rounded-lg ${
                    isFirstPlace ? 'text-white' : 'bg-white'
                }`}
                style={{ 
                    backgroundColor: isFirstPlace ? team.time.cor || undefined : undefined 
                }}
            >
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">{index + 1}</span>
                    <Image // @ts-ignore
                        src={`/assets/times/logos/${normalizeForFilePath(team.time.nome)}.png`}
                        width={40}
                        height={40}
                        alt={`Logo do ${team.time.nome}`}
                        className="w-auto h-auto"
                    />
                    <span className="font-bold">{team.time.nome}</span>
                </div>
                <span className="font-bold text-xl">
                    {team.value !== null ? team.value.toLocaleString('pt-BR') : 'N/A'}
                </span>
            </div>
        );
    };

    if (!rankedTeams.length) {
        return (
            <div className="bg-[#ECECEC] py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">{statMapping.title}</h1>
                <div className="max-w-2xl mx-auto px-4">
                    <NoStats />
                </div>
            </div>
        );
    }

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