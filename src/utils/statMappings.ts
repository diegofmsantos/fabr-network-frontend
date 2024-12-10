import { Jogador } from '@/types/jogador';

// Interfaces e Tipos
export interface StatConfig {
  key: string;
  title: string;
  category: string;
  isCalculated?: boolean;
}

// Definição dos tipos para cada categoria de estatística
type PasseStats = Jogador['estatisticas']['passe'];
type CorridaStats = Jogador['estatisticas']['corrida'];
type RecepcaoStats = Jogador['estatisticas']['recepcao'];
type RetornoStats = Jogador['estatisticas']['retorno'];
type DefesaStats = Jogador['estatisticas']['defesa'];
type KickerStats = Jogador['estatisticas']['kicker'];
type PunterStats = Jogador['estatisticas']['punter'];

// Interface para o calculador de estatísticas
interface StatCalculator {
  check: (stats: any) => boolean;
  calculate: (stats: any) => number;
}

// Função para verificar requisitos mínimos por categoria
const checkCategoryMinimum = (category: string, stats: any): boolean => {
  switch (category) {
    case 'passe':
      return (stats as PasseStats).passes_tentados >= 30.6;
    case 'corrida':
      return (stats as CorridaStats).corridas >= 7.6;
    case 'recepcao':
      return (stats as RecepcaoStats).alvo >= 5.6;
    case 'retorno':
      return (stats as RetornoStats).retornos >= 2.1;
    case 'defesa': {
      const defStats = stats as DefesaStats;
      const total = 
        defStats.tackles_totais +
        defStats.tackles_for_loss +
        defStats.sacks_forcado +
        defStats.fumble_forcado +
        defStats.interceptacao_forcada +
        defStats.passe_desviado +
        defStats.safety +
        defStats.td_defensivo;
      return total >= 3.6;
    }
    case 'kicker':
      return (stats as KickerStats).tentativas_de_fg >= 1.3;
    case 'punter':
      return (stats as PunterStats).punts >= 3.75;
    default:
      return true;
  }
};


const calculators: Record<string, StatCalculator> = {
    passes_percentual: {
        check: (stats: PasseStats) => stats.passes_tentados >= 30.6,
        calculate: (stats: PasseStats) => (stats.passes_completos / stats.passes_tentados) * 100
    },
    jardas_media: {
        check: (stats: PasseStats) => {
          // Primeiro verificamos se tem passes tentados suficientes
          return stats.passes_tentados >= 30.6;
        },
        calculate: (stats: PasseStats) => {
          // Retorna apenas a média de jardas por passe
          const media = stats.jardas_de_passe / stats.passes_tentados;
          return media;
        }
      },
    jardas_corridas_media: {
        check: (stats: CorridaStats) => stats.corridas >= 7.6,
        calculate: (stats: CorridaStats) => stats.jardas_corridas / stats.corridas
    },
    jardas_recebidas_media: {
        check: (stats: RecepcaoStats) => stats.alvo >= 5.6,
        calculate: (stats: RecepcaoStats) => stats.jardas_recebidas / stats.alvo
    },
    jardas_retornadas_media: {
        check: (stats: RetornoStats) => stats.retornos >= 2.1,
        calculate: (stats: RetornoStats) => stats.jardas_retornadas / stats.retornos
    },
    extra_points: {
        check: (stats: KickerStats) => stats.tentativas_de_xp >= 1.3,
        calculate: (stats: KickerStats) => (stats.xp_bons / stats.tentativas_de_xp) * 100
    },
    field_goals: {
        check: (stats: KickerStats) => stats.tentativas_de_fg >= 1.3,
        calculate: (stats: KickerStats) => (stats.fg_bons / stats.tentativas_de_fg) * 100
    },
    jardas_punt_media: {
        check: (stats: PunterStats) => stats.punts >= 3.75,
        calculate: (stats: PunterStats) => stats.jardas_de_punt / stats.punts
    },
    defesa_total: {
        check: (stats: DefesaStats) => true,
        calculate: (stats: DefesaStats) => {
            return stats.tackles_totais +
                stats.tackles_for_loss +
                stats.sacks_forcado +
                stats.fumble_forcado +
                stats.interceptacao_forcada +
                stats.passe_desviado +
                stats.safety +
                stats.td_defensivo;
        }
    }
};

export const calculateStatValue = (player: Jogador, mapping: StatConfig): number | null => {
    try {
      const category = mapping.category as keyof typeof player.estatisticas;
      const stats = player.estatisticas[category];
  
      if (!stats || !checkCategoryMinimum(category, stats)) {
        return null;
      }
  
      if (mapping.isCalculated) {
        const calculator = calculators[mapping.key];
        if (!calculator || !calculator.check(stats)) {
          return null;
        }
        return calculator.calculate(stats);
      }
  
      const value = stats[mapping.key as keyof typeof stats];
      return typeof value === 'number' ? value : null;
  
    } catch (error) {
      console.error('Error calculating stat value:', error);
      return null;
    }
  };

  export const formatStatValue = (value: number | null, stat: StatConfig): string => {
    if (value === null) return 'N/A';
  
    if (stat.isCalculated) {
      if (
        stat.key.includes('percentual') || 
        stat.key === 'extra_points' || 
        stat.key === 'field_goals'
      ) {
        return `${Math.round(value)}%`;
      }
      return value.toFixed(1);
    }
  
    return Math.round(value).toString();
  };
  
  export const compareStatValues = (a: number | null, b: number | null): number => {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return b - a;
  };


// Exportamos os mapeamentos
export const statMappings: { [key: string]: StatConfig } = {
    // PASSE
    'passe-jardas': {
        key: 'jardas_de_passe',
        title: 'Jardas',
        category: 'passe'
    },
    'passe-passes': {
        key: 'passes_percentual',
        title: 'Passes Completos (%)',
        category: 'passe',
        isCalculated: true
    },
    'passe-jardasavg': {
        key: 'jardas_media',
        title: 'Jardas(AVG)',
        category: 'passe',
        isCalculated: true
    },
    'passe-touchdowns': {
        key: 'td_passados',
        title: 'Touchdowns',
        category: 'passe'
    },
    'passe-passes-comp': {
        key: 'passes_completos',
        title: 'Passes Completos',
        category: 'passe'
    },
    'passe-passes-tent': {
        key: 'passes_tentados',
        title: 'Passes Tentados',
        category: 'passe'
    },
    'passe-interceptacoes': {
        key: 'interceptacoes_sofridas',
        title: 'Interceptações',
        category: 'passe'
    },
    'passe-sacks': {
        key: 'sacks_sofridos',
        title: 'Sacks',
        category: 'passe'
    },
    'passe-fumbles-': {
        key: 'fumble_de_passador',
        title: 'Fumbles',
        category: 'passe'
    },

    // CORRIDA
    'corrida-jardas': {
        key: 'jardas_corridas',
        title: 'Jardas',
        category: 'corrida'
    },
    'corrida-corridas': {
        key: 'corridas',
        title: 'Corridas',
        category: 'corrida'
    },
    'corrida-jardasavg': {
        key: 'jardas_corridas_media',
        title: 'Jardas(AVG)',
        category: 'corrida',
        isCalculated: true
    },
    'corrida-touchdowns': {
        key: 'tds_corridos',
        title: 'Touchdowns',
        category: 'corrida'
    },
    'corrida-fumbles': {
        key: 'fumble_de_corredor',
        title: 'Fumbles',
        category: 'corrida'
    },

    // RECEPÇÃO
    'recepcao-jardas': {
        key: 'jardas_recebidas',
        title: 'Jardas',
        category: 'recepcao'
    },
    'recepcao-recepcoes': {
        key: 'recepcoes',
        title: 'Recepções',
        category: 'recepcao'
    },
    'recepcao-touchdowns': {
        key: 'tds_recebidos',
        title: 'Touchdowns',
        category: 'recepcao'
    },
    'recepcao-jardasavg': {
        key: 'jardas_recebidas_media',
        title: 'Jardas(AVG)',
        category: 'recepcao',
        isCalculated: true
    },
    'recepcao-alvos': {
        key: 'alvo',
        title: 'Alvos',
        category: 'recepcao'
    },
    'recepcao-fumbles': {
        key: 'fumble_de_recebedor',
        title: 'Fumbles',
        category: 'recepcao'
    },

    // RETORNO
    'retorno-jardas': {
        key: 'jardas_retornadas',
        title: 'Jardas',
        category: 'retorno'
    },
    'retorno-retornos': {
        key: 'retornos',
        title: 'Retornos',
        category: 'retorno'
    },
    'retorno-touchdowns': {
        key: 'td_retornados',
        title: 'Touchdowns',
        category: 'retorno'
    },
    'retorno-jardasavg': {
        key: 'jardas_retornadas_media',
        title: 'Jardas(AVG)',
        category: 'retorno',
        isCalculated: true
    },
    'retorno-fumbles': {
        key: 'fumble_retornador',
        title: 'Fumbles',
        category: 'retorno'
    },

    // DEFESA
    'defesa-sacks': {
        key: 'sacks_forcado',
        title: 'Sacks',
        category: 'defesa'
    },
    'defesa-interceptacoes': {
        key: 'interceptacao_forcada',
        title: 'Interceptações',
        category: 'defesa'
    },
    'defesa-fumbles-forc': {
        key: 'fumble_forcado',
        title: 'Fumbles Forçados',
        category: 'defesa'
    },
    'defesa-touchdowns': {
        key: 'td_defensivo',
        title: 'Touchdowns',
        category: 'defesa'
    },
    'defesa-tacklesloss': {
        key: 'tackles_for_loss',
        title: 'Tackles (Loss)',
        category: 'defesa'
    },
    'defesa-tackles-totais': {
        key: 'tackles_totais',
        title: 'Tackles Totais',
        category: 'defesa'
    },
    'defesa-passes-desv': {
        key: 'passe_desviado',
        title: 'Passes Desviados',
        category: 'defesa'
    },
    'defesa-safeties': {
        key: 'safety',
        title: 'Safeties',
        category: 'defesa'
    },

    // CHUTE
    'chute-fg': {
        key: 'field_goals',
        title: 'FG(%)',
        category: 'kicker',
        isCalculated: true
    },
    'chute-xp': {
        key: 'extra_points',
        title: 'Extra Points(%)',
        category: 'kicker',
        isCalculated: true
    },
    'chute-xp-bom': {
        key: 'xp_bons',
        title: 'XP Bons',
        category: 'kicker'
    },
    'chute-xp-tentados': {
        key: 'tentativas_de_xp',
        title: 'XP Tentados',
        category: 'kicker'
    },
    'chute-fg-bom': {
        key: 'fg_bons',
        title: 'FG Bons',
        category: 'kicker'
    },
    'chute-fg-tentados': {
        key: 'tentativas_de_fg',
        title: 'FG Tentados',
        category: 'kicker'
    },
    'chute-mais-longo': {
        key: 'fg_mais_longo',
        title: 'FG Mais Longo',
        category: 'kicker'
    },
    'chute-fg-0-10': {
        key: 'fg_0_10',
        title: 'FG (0-10)',
        category: 'kicker'
    },
    'chute-fg11-20': {
        key: 'fg_11_20',
        title: 'FG (11-20)',
        category: 'kicker'
    },
    'chute-fg21-30': {
        key: 'fg_21_30',
        title: 'FG (21-30)',
        category: 'kicker'
    },
    'chute-fg31-40': {
        key: 'fg_31_40',
        title: 'FG (31-40)',
        category: 'kicker'
    },
    'chute-fg41-50': {
        key: 'fg_41_50',
        title: 'FG (41-50)',
        category: 'kicker'
    },

    // PUNT
    'punt-jardasavg': {
        key: 'jardas_punt_media',
        title: 'Jardas (AVG)',
        category: 'punter',
        isCalculated: true
    },
    'punt-punts': {
        key: 'punts',
        title: 'Punts',
        category: 'punter'
    },
    'punt-jardas': {
        key: 'jardas_de_punt',
        title: 'Jardas',
        category: 'punter'
    }
};

// Função para obter o mapeamento
export const getStatMapping = (statParam: string | null): StatConfig => {
    if (!statParam) {
        return {
            key: 'not_found',
            title: 'Estatística não encontrada',
            category: 'none'
        };
    }

    const urlParam = statParam.toLowerCase();
    console.log('Buscando estatística:', urlParam); // Debug

    // Tentar encontrar o mapeamento direto
    const directMapping = statMappings[urlParam];
    if (directMapping) {
        return directMapping;
    }

    // Se não encontrar, procurar por correspondência parcial
    const allMappings = Object.entries(statMappings);
    const foundMapping = allMappings.find(([key, config]) => {
        const normalizedKey = key.toLowerCase();
        const normalizedParam = urlParam.toLowerCase();
        return normalizedKey === normalizedParam ||
            normalizedKey.replace('-', '') === normalizedParam.replace('-', '');
    });

    if (foundMapping) {
        return foundMapping[1];
    }

    return {
        key: 'not_found',
        title: 'Estatística não encontrada',
        category: 'none'
    };
};

export const meetsMinimumRequirements = (player: Jogador, category: string): boolean => {
    switch (category) {
        case 'passe':
            return player.estatisticas.passe.passes_tentados >= 30.6; // valor do Tier 3
        case 'corrida':
            return player.estatisticas.corrida.corridas >= 7.6; // valor do Tier 3
        case 'recepcao':
            return player.estatisticas.recepcao.alvo >= 5.6; // valor do Tier 3
        case 'retorno':
            return player.estatisticas.retorno.retornos >= 2.1; // valor do Tier 3
        case 'defesa': {
            const defStats = player.estatisticas.defesa;
            const total = defStats.tackles_totais + defStats.tackles_for_loss +
                defStats.sacks_forcado + defStats.fumble_forcado +
                defStats.interceptacao_forcada + defStats.passe_desviado +
                defStats.safety + defStats.td_defensivo;
            return total >= 3.6; // valor do Tier 3
        }
        case 'kicker':
            return player.estatisticas.kicker.tentativas_de_fg >= 1.3; // valor do Tier 3
        case 'punter':
            return player.estatisticas.punter.punts >= 3.75; // valor do Tier 3
        default:
            return true;
    }
};