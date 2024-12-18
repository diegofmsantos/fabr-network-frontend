import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Jogador } from '@/types/jogador';
import { Time } from '@/types/time';
import { getTimes } from '@/api/api';
import { RankingCard } from './RankingCard';
import NoStats from './ui/NoStats';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type StatisticKey =
  | keyof Jogador['estatisticas']['passe']
  | keyof Jogador['estatisticas']['corrida']
  | keyof Jogador['estatisticas']['recepcao']
  | keyof Jogador['estatisticas']['retorno']
  | keyof Jogador['estatisticas']['defesa']
  | keyof Jogador['estatisticas']['kicker']
  | keyof Jogador['estatisticas']['punter'];

type CalculatedStatKey =
  | 'passes_percentual'
  | 'jardas_media'
  | 'jardas_corridas_media'
  | 'jardas_recebidas_media'
  | 'jardas_retornadas_media'
  | 'extra_points'
  | 'field_goals'
  | 'jardas_punt_media';

type StatKey = StatisticKey | CalculatedStatKey;

interface RankingGroupProps {
  title: string;
  stats: { key: StatKey; title: string }[];
  players: Jogador[];
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

export const RankingGroup: React.FC<RankingGroupProps> = ({ title, stats, players }) => {
  const [times, setTimes] = useState<Time[]>([]);

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

  // Função para obter a taxa de FG para ordenação
  const getFGRatio = (fgString: string): number => {
    if (!fgString || fgString === '') return 0;
    const [made, attempted] = fgString.split('/').map(Number);
    if (isNaN(made) || isNaN(attempted) || attempted === 0) return 0;
    return made / attempted;
  };

  const getStatCategory = (key: StatKey): keyof Jogador['estatisticas'] => {
    switch (key) {
      case 'passes_percentual':
      case 'passes_completos':
      case 'passes_tentados':
      case 'jardas_de_passe':
      case 'td_passados':
      case 'interceptacoes_sofridas':
      case 'sacks_sofridos':
      case 'fumble_de_passador':
      case 'jardas_media':
        return 'passe';
      case 'corridas':
      case 'jardas_corridas':
      case 'tds_corridos':
      case 'fumble_de_corredor':
      case 'jardas_corridas_media':
        return 'corrida';
      case 'recepcoes':
      case 'alvo':
      case 'jardas_recebidas':
      case 'tds_recebidos':
      case 'fumble_de_recebedor':
      case 'jardas_recebidas_media':
        return 'recepcao';
      case 'retornos':
      case 'jardas_retornadas':
      case 'td_retornados':
      case 'fumble_retornador':
      case 'jardas_retornadas_media':
        return 'retorno';
      case 'tackles_totais':
      case 'tackles_for_loss':
      case 'sacks_forcado':
      case 'fumble_forcado':
      case 'interceptacao_forcada':
      case 'passe_desviado':
      case 'safety':
      case 'td_defensivo':
        return 'defesa';
      case 'extra_points':
      case 'field_goals':
      case 'xp_bons':
      case 'tentativas_de_xp':
      case 'fg_bons':
      case 'tentativas_de_fg':
      case 'fg_mais_longo':
      case 'fg_11_20':
      case 'fg_21_30':
      case 'fg_31_40':
      case 'fg_41_50':
        return 'kicker';
      case 'jardas_punt_media':
      case 'punts':
      case 'jardas_de_punt':
        return 'punter';
      default:
        throw new Error(`Chave de estatística desconhecida: ${key}`);
    }
  };

  const calculateStat = (player: Jogador, key: StatKey): string | number | null => {
    try {
      // Tratamento especial para FGs por distância
      if (['fg_11_20', 'fg_21_30', 'fg_31_40', 'fg_41_50'].includes(key)) {
        const statValue = player.estatisticas.kicker[key as keyof typeof player.estatisticas.kicker];
        return typeof statValue === 'string' ? statValue : null;
      }

      switch (key) {
        case 'passes_percentual':
          return player.estatisticas.passe.passes_tentados > 0
            ? Math.round((player.estatisticas.passe.passes_completos / player.estatisticas.passe.passes_tentados) * 100)
            : null;
        case 'jardas_media':
          return player.estatisticas.passe.passes_completos > 0
            ? Number((player.estatisticas.passe.jardas_de_passe / player.estatisticas.passe.passes_tentados))
            : null;
        case 'jardas_corridas_media':
          return player.estatisticas.corrida.corridas > 0
            ? Number((player.estatisticas.corrida.jardas_corridas / player.estatisticas.corrida.corridas))
            : null;
        case 'jardas_recebidas_media':
          return player.estatisticas.recepcao.recepcoes > 0
            ? Number((player.estatisticas.recepcao.jardas_recebidas / player.estatisticas.recepcao.alvo))
            : null;
        case 'jardas_retornadas_media':
          return player.estatisticas.retorno.retornos > 0
            ? Number((player.estatisticas.retorno.jardas_retornadas / player.estatisticas.retorno.retornos))
            : null;
        case 'extra_points':
          return player.estatisticas.kicker.tentativas_de_xp > 0
            ? Math.round((player.estatisticas.kicker.xp_bons / player.estatisticas.kicker.tentativas_de_xp) * 100)
            : null;
        case 'field_goals':
          return player.estatisticas.kicker.tentativas_de_fg > 0
            ? Math.round((player.estatisticas.kicker.fg_bons / player.estatisticas.kicker.tentativas_de_fg) * 100)
            : null;
        case 'jardas_punt_media':
          return player.estatisticas.punter.punts > 0
            ? Number((player.estatisticas.punter.jardas_de_punt / player.estatisticas.punter.punts))
            : null;
        default:
          const category = getStatCategory(key);
          const stats = player.estatisticas[category];
          return stats[key as keyof typeof stats] as number;
      }
    } catch (error) {
      console.error(`Error calculating statistic ${key}:`, error);
      return null;
    }
  };

  const meetsMinimumRequirements = (player: Jogador, category: string): boolean => {
    try {
      switch (category) {
        case 'DEFESA':
          const defStats = player.estatisticas.defesa;
          const defTotal =
            defStats.tackles_totais +
            defStats.tackles_for_loss +
            defStats.sacks_forcado +
            defStats.fumble_forcado +
            defStats.interceptacao_forcada +
            defStats.passe_desviado +
            defStats.safety +
            defStats.td_defensivo;
          return defTotal >= 4.8;
        case 'PASSE':
          return player.estatisticas.passe.passes_tentados >= 40.9;
        case 'CHUTE':
          return player.estatisticas.kicker.tentativas_de_fg >= 1.8;
        case 'CORRIDA':
          return player.estatisticas.corrida.corridas >= 10.2;
        case 'RECEPÇÃO':
          return player.estatisticas.recepcao.alvo >= 7.5;
        case 'RETORNO':
          return player.estatisticas.retorno.retornos >= 2.9;
        case 'PUNT':
          return player.estatisticas.punter.punts >= 6.4;
        default:
          return true;
      }
    } catch (error) {
      console.error(`Error checking minimum requirements for ${category}:`, error);
      return false;
    }
  };

  const shouldIncludePlayer = (player: Jogador, key: StatKey, category: string): boolean => {
    try {
      if (!meetsMinimumRequirements(player, category)) {
        return false;
      }

      if (['fg_11_20', 'fg_21_30', 'fg_31_40', 'fg_41_50'].includes(key)) {
        const fgString = player.estatisticas.kicker[key as keyof typeof player.estatisticas.kicker];
        if (typeof fgString !== 'string' || fgString === '') return false;
        const [_, attempted] = fgString.split('/').map(Number);
        return !isNaN(attempted) && attempted > 0;
      }

      const value = calculateStat(player, key);
      if (value === null) return false;
      return Number(value) > 0;
    } catch (error) {
      console.error(`Error checking statistic ${key}:`, error);
      return false;
    }
  };

  const compareValues = (a: string | number | null, b: string | number | null): number => {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;

    // Comparação especial para strings de FG (X/Y)
    if (typeof a === 'string' && typeof b === 'string' && a.includes('/') && b.includes('/')) {
      const ratioA = getFGRatio(a);
      const ratioB = getFGRatio(b);
      return ratioB - ratioA;
    }

    // Comparação normal para números
    return Number(b) - Number(a);
  };

  const normalizeValue = (value: string | number | null, statKey: StatKey): string => {
    if (value === null) return 'N/A';

    // Manter formato original para FGs
    if (['fg_11_20', 'fg_21_30', 'fg_31_40', 'fg_41_50'].includes(statKey)) {
      return String(value);
    }

    if (typeof value === 'string') return value;

    const percentageStats = ['passes_percentual', 'extra_points', 'field_goals'];
    const averageStats = [
      'jardas_media',
      'jardas_corridas_media',
      'jardas_recebidas_media',
      'jardas_retornadas_media',
      'jardas_punt_media'
    ];

    if (percentageStats.includes(statKey)) {
      return `${Math.round(value)}%`;
    } else if (averageStats.includes(statKey)) {
      return value.toFixed(1);
    }

    return Math.round(value).toString();
  };

  const getTeamInfo = (timeId: number) => {
    const team = times.find((t) => t.id === timeId);
    return {
      nome: team?.nome || 'time-desconhecido',
      cor: team?.cor || '#CCCCCC',
    };
  };

  const normalizeForFilePath = (input: string): string =>
    input
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '');

  return (
    <div className="mb-8 pl-4 pt-8 overflow-x-hidden overflow-y-hidden mx-auto">
      <h2 className="text-4xl pl-2 font-extrabold italic mb-4 leading-[30px] tracking-[-2px]">{title}</h2>
      <Slider {...SLIDER_SETTINGS}>
        {stats.map((stat, index) => {
          const filteredPlayers = players
            .filter(player => shouldIncludePlayer(player, stat.key, title))
            .sort((a, b) => {
              const aValue = calculateStat(a, stat.key);
              const bValue = calculateStat(b, stat.key);
              return compareValues(aValue, bValue);
            })
            .slice(0, 5);

          if (filteredPlayers.length === 0) {
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
              <RankingCard
                title={stat.title}
                category={title}
                players={filteredPlayers.map((player, playerIndex) => {
                  const teamInfo = getTeamInfo(player.timeId);
                  const value = calculateStat(player, stat.key);

                  return {
                    id: player.id,
                    name: player.nome,
                    team: teamInfo.nome,
                    value: normalizeValue(value, stat.key),
                    camisa: player.camisa,
                    teamColor: playerIndex === 0 ? teamInfo.cor : undefined,
                    teamLogo: `/assets/times/logos/${normalizeForFilePath(teamInfo.nome)}.png`,
                    isFirst: playerIndex === 0,
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