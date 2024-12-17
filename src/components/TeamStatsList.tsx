import React from 'react';
import Image from 'next/image';
import { Jogador } from '@/types/jogador';
import { Time } from '@/types/time';
import { StatConfig } from '@/utils/statMappings';
import NoStats from './ui/NoStats';
import { getCategoryFromKey } from './TimeRankingGroup';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { StatsFormatter } from '@/utils/statsFormater';

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
        if (!timeId) return null;
        try {
            const teamPlayers = players.filter(player => player.timeId === timeId);
            const category = getCategoryFromKey(statMapping.key);
            let total = 0;
            let divisor = 0;

            // Tratamento especial para fumbles
            if (statMapping.key === 'fumble_de_passador') {
                teamPlayers.forEach(player => {
                    total += player.estatisticas.passe.fumble_de_passador;
                });
                return total > 0 ? total : null;
            }

            // Tratamento especial para média de punts
            if (statMapping.key === 'jardas_punt_media') {
                teamPlayers.forEach(player => {
                    total += player.estatisticas.punter.jardas_de_punt;
                    divisor += player.estatisticas.punter.punts;
                });
                return divisor > 0 ? total / divisor : null;
            }
            // Para estatísticas calculadas (médias e percentuais)
            if (statMapping.isCalculated) {
                switch (statMapping.key) {
                    case 'passes_percentual':
                        teamPlayers.forEach(player => {
                            total += player.estatisticas.passe.passes_completos;
                            divisor += player.estatisticas.passe.passes_tentados;
                        });
                        return divisor > 0 ? (total / divisor) * 100 : null;

                    case 'jardas_media':
                        teamPlayers.forEach(player => {
                            total += player.estatisticas.passe.jardas_de_passe;
                            divisor += player.estatisticas.passe.passes_tentados;
                        });
                        return divisor > 0 ? total / divisor : null;

                    case 'jardas_corridas_media':
                        teamPlayers.forEach(player => {
                            total += player.estatisticas.corrida.jardas_corridas;
                            divisor += player.estatisticas.corrida.corridas;
                        });
                        return divisor > 0 ? total / divisor : null;

                    case 'jardas_recebidas_media':
                        teamPlayers.forEach(player => {
                            total += player.estatisticas.recepcao.jardas_recebidas;
                            divisor += player.estatisticas.recepcao.alvo;
                        });
                        return divisor > 0 ? total / divisor : null;

                    case 'jardas_retornadas_media':
                        teamPlayers.forEach(player => {
                            total += player.estatisticas.retorno.jardas_retornadas;
                            divisor += player.estatisticas.retorno.retornos;
                        });
                        return divisor > 0 ? total / divisor : null;

                    case 'field_goals':
                        teamPlayers.forEach(player => {
                            total += player.estatisticas.kicker.fg_bons;
                            divisor += player.estatisticas.kicker.tentativas_de_fg;
                        });
                        return divisor > 0 ? (total / divisor) * 100 : null;

                    case 'extra_points':
                        teamPlayers.forEach(player => {
                            total += player.estatisticas.kicker.xp_bons;
                            divisor += player.estatisticas.kicker.tentativas_de_xp;
                        });
                        return divisor > 0 ? (total / divisor) * 100 : null;
                }
            }

            // Para estatísticas normais
            teamPlayers.forEach(player => { // @ts-ignore
                const value = player.estatisticas[category]?.[statMapping.key];
                if (typeof value === 'number') {
                    total += value;
                }
            });

            return total || null;
        } catch (error) {
            console.error(`Error calculating stat:`, error);
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

    const rankedTeams = times
        .map(time => ({
            time,
            value: calculateTeamStat(time.id || 0)
        }))
        .filter((team): team is RankedTeam => 
            team.value !== null && 
            typeof team.value === 'number' && 
            !isNaN(team.value) && 
            team.value > 0  // Adicionamos esta condição
        )
        .sort((a, b) => {
            if (a.value === null || b.value === null) return 0;
            if (b.value === a.value) {
                // @ts-ignore
                return a.time.nome.localeCompare(b.time.nome);
            }
            return b.value - a.value;
        });



    const TeamListItem: React.FC<{ team: RankedTeam; index: number }> = ({ team, index }) => {
        const isFirstPlace = index === 0;

        return (
            <div
                className={`flex items-center justify-between p-4 mb-2 rounded-lg 
                ${isFirstPlace ? 'text-white' : 'bg-white'}`}
                style={{
                    backgroundColor: isFirstPlace ? team.time.cor || undefined : undefined
                }}
            >
                <Link
                    href={"/ranking/times"}
                    className='fixed top-8 left-5 rounded-full text-xs text-white p-2 w-8 h-8 flex justify-center items-center bg-gray-200/20 z-50'>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{index + 1}</span>
                    <Image // @ts-ignore
                        src={`/assets/times/logos/${normalizeForFilePath(team.time.nome)}.png`}
                        width={40}
                        height={40}
                        alt={`Logo do ${team.time.nome}`}
                        className=""
                    />
                    <span className="font-bold text-sm">{team.time.nome}</span>
                </div>
                <Image
                    src={`/assets/times/capacetes/${team.time.capacete}`}
                    alt='capacete do time'
                    width={60}
                    height={60}
                    quality={100}
                    priority />
                <span className="font-bold text-xl">
                    {StatsFormatter.format(team.value, statMapping)}
                </span>
            </div>
        );
    };

    if (!rankedTeams.length) {
        return (
            <div className="bg-[#ECECEC] py-8">
                <h1 className="text-4xl font-bold mb-8 text-center">{statMapping.category}</h1>
                <div className="max-w-2xl mx-auto px-4">
                    <NoStats />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#ECECEC] py-8">
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