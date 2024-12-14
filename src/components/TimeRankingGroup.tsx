import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Time } from '@/types/time';
import { getTimes } from '@/api/api';
import NoStats from './ui/NoStats';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { TeamRankingCard } from './TimeRankingCard';

interface TeamRankingGroupProps {
    title: string;
    stats: { key: string; title: string }[];
    teamStats: any[];
}

const SLIDER_SETTINGS = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1.2,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1.5,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1.2,
                slidesToScroll: 1,
            },
        },
    ],
};

export const TeamRankingGroup: React.FC<TeamRankingGroupProps> = ({ title, stats, teamStats }) => {
    const [times, setTimes] = useState<Time[]>([]);
    const [season, setSeason] = useState('2024');

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                const timesData = await getTimes();
                setTimes(timesData);
            } catch (error) {
                console.error('Error fetching times:', error);
            }
        };
        fetchTimes();
    }, []);

    const calculateTeamStat = (teamStat: any, key: string): number | null => {
        try {
            const category = getCategoryFromKey(key);
            switch (key) {
                case 'passes_percentual':
                    return teamStat[category].passes_tentados > 0
                        ? (teamStat[category].passes_completos / teamStat[category].passes_tentados) * 100
                        : null;
                case 'jardas_media':
                    return teamStat[category].passes_tentados > 0
                        ? teamStat[category].jardas_de_passe / teamStat[category].passes_tentados
                        : null;
                case 'jardas_corridas_media':
                    return teamStat[category].corridas > 0
                        ? teamStat[category].jardas_corridas / teamStat[category].corridas
                        : null;
                default:
                    return teamStat[category][key] || null;
            }
        } catch (error) {
            console.error(`Error calculating stat ${key}:`, error);
            return null;
        }
    };

    const normalizeValue = (value: number | null): string => {
        if (value === null) return 'N/A';
        return value.toFixed(0);
    };

    const getTeamInfo = (timeId: number) => {
        const team = times.find((t) => t.id === timeId);
        return {
            nome: team?.nome || 'Time Desconhecido',
            cor: team?.cor || '#CCCCCC',
        };
    };

    const getCategoryFromKey = (key: string): string => {
        // Mapeia a chave da estatística para a categoria correta
        if (key.includes('passe') || key.includes('passes')) return 'passe';
        if (key.includes('corrida')) return 'corrida';
        if (key.includes('recepcao')) return 'recepcao';
        if (key.includes('retorno')) return 'retorno';
        if (key.includes('defesa')) return 'defesa';
        if (key.includes('kicker')) return 'kicker';
        if (key.includes('punt')) return 'punter';
        return 'passe'; // default
    };

    return (
        <div className="mb-8 pl-4 overflow-x-hidden overflow-y-hidden mx-auto">
            
            <h2 className="text-4xl font-extrabold mb-4 italic">{title}</h2>
            <Slider {...SLIDER_SETTINGS}>
                {stats.map((stat, index) => {
                    const rankedTeams = teamStats
                        .map(teamStat => ({
                            teamId: teamStat.timeId,
                            value: calculateTeamStat(teamStat, stat.key)
                        }))
                        .filter(team => team.value !== null)
                        .sort((a, b) => (b.value || 0) - (a.value || 0))
                        .slice(0, 5);

                    if (rankedTeams.length === 0) {
                        return (
                            <div key={index}>
                                <div className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
                                    {stat.title}
                                </div>
                                <NoStats />
                            </div>
                        );
                    }

                    return (
                        <div key={index}>
                            <TeamRankingCard
                                title={stat.title}
                                category={title}
                                teams={rankedTeams.map((team, teamIndex) => {
                                    const teamInfo = getTeamInfo(team.teamId);
                                    return {
                                        id: team.teamId,
                                        name: teamInfo.nome,
                                        value: normalizeValue(team.value),
                                        teamColor: teamIndex === 0 ? teamInfo.cor : undefined,
                                        isFirst: teamIndex === 0,
                                    };
                                })}
                            />
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};