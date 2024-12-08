// src/utils/statsUtils.ts

import { Jogador } from '@/types/jogador';

export interface StatConfig {
    key: string;
    title: string;
    category: string;
    isCalculated?: boolean;
}

// Exportamos os mapeamentos
export const statMappings: { [key: string]: StatConfig } = {
    // PASSE
    'jardas': {
        key: 'jardas_de_passe',
        title: 'Jardas Passadas',
        category: 'passe'
    },
    'passes': {
        key: 'passes_percentual',
        title: 'Passes Completos (%)',
        category: 'passe',
        isCalculated: true
    },
    'jardas-avg-passe': {
        key: 'jardas_media',
        title: 'Jardas (AVG)',
        category: 'passe',
        isCalculated: true
    },
    'touchdowns-passe': {
        key: 'td_passados',
        title: 'Touchdowns',
        category: 'passe'
    },
    'passes-completos': {
        key: 'passes_completos',
        title: 'Passes Completos',
        category: 'passe'
    },
    'passes-tentados': {
        key: 'passes_tentados',
        title: 'Passes Tentados',
        category: 'passe'
    },
    'interceptacoes': {
        key: 'interceptacoes_sofridas',
        title: 'Interceptações',
        category: 'passe'
    },
    'sacks': {
        key: 'sacks_sofridos',
        title: 'Sacks',
        category: 'passe'
    },
    'fumbles-passador': {
        key: 'fumble_de_passador',
        title: 'Fumbles',
        category: 'passe'
    },

    // CORRIDA
    'jardas-corridas': {
        key: 'jardas_corridas',
        title: 'Jardas Corridas',
        category: 'corrida'
    },
    'corridas': {
        key: 'corridas',
        title: 'Corridas',
        category: 'corrida'
    },
    'jardas-avg-corrida': {
        key: 'jardas_corridas_media',
        title: 'Jardas (AVG)',
        category: 'corrida',
        isCalculated: true
    },
    'touchdowns-corrida': {
        key: 'tds_corridos',
        title: 'Touchdowns',
        category: 'corrida'
    },
    'fumbles-corredor': {
        key: 'fumble_de_corredor',
        title: 'Fumbles',
        category: 'corrida'
    },

    // RECEPÇÃO
    'jardas-recebidas': {
        key: 'jardas_recebidas',
        title: 'Jardas Recebidas',
        category: 'recepcao'
    },
    'recepcoes': {
        key: 'recepcoes',
        title: 'Recepções',
        category: 'recepcao'
    },
    'touchdowns-recepcao': {
        key: 'tds_recebidos',
        title: 'Touchdowns',
        category: 'recepcao'
    },
    'jardas-avg-recepcao': {
        key: 'jardas_recebidas_media',
        title: 'Jardas (AVG)',
        category: 'recepcao',
        isCalculated: true
    },
    'alvos': {
        key: 'alvo',
        title: 'Alvos',
        category: 'recepcao'
    },
    'fumbles-recebedor': {
        key: 'fumble_de_recebedor',
        title: 'Fumbles',
        category: 'recepcao'
    },

    // RETORNO
    'jardas-retornadas': {
        key: 'jardas_retornadas',
        title: 'Jardas Retornadas',
        category: 'retorno'
    },
    'retornos': {
        key: 'retornos',
        title: 'Retornos',
        category: 'retorno'
    },
    'touchdowns-retorno': {
        key: 'td_retornados',
        title: 'Touchdowns',
        category: 'retorno'
    },
    'jardas-avg-retorno': {
        key: 'jardas_retornadas_media',
        title: 'Jardas (AVG)',
        category: 'retorno',
        isCalculated: true
    },
    'fumbles-retornador': {
        key: 'fumble_retornador',
        title: 'Fumbles',
        category: 'retorno'
    },

    // DEFESA
    'sacks-forcado': {
        key: 'sacks_forcado',
        title: 'Sacks',
        category: 'defesa'
    },
    'interceptacoes-forcada': {
        key: 'interceptacao_forcada',
        title: 'Interceptações',
        category: 'defesa'
    },
    'fumbles-forcado': {
        key: 'fumble_forcado',
        title: 'Fumbles Forçados',
        category: 'defesa'
    },
    'touchdowns-defesa': {
        key: 'td_defensivo',
        title: 'Touchdowns',
        category: 'defesa'
    },
    'tackles-loss': {
        key: 'tackles_for_loss',
        title: 'Tackles (Loss)',
        category: 'defesa'
    },
    'tackles-totais': {
        key: 'tackles_totais',
        title: 'Tackles Totais',
        category: 'defesa'
    },
    'passes-desviados': {
        key: 'passe_desviado',
        title: 'Passes Desviados',
        category: 'defesa'
    },
    'safety': {
        key: 'safety',
        title: 'Safety',
        category: 'defesa'
    },

    // CHUTE
    'extra-points': {
        key: 'extra_points',
        title: 'Extra Points (%)',
        category: 'kicker',
        isCalculated: true
    },
    'xp-bons': {
        key: 'xp_bons',
        title: 'XP Bons',
        category: 'kicker'
    },
    'xp-tentativas': {
        key: 'tentativas_de_xp',
        title: 'XP Tentados',
        category: 'kicker'
    },
    'fg-bons': {
        key: 'fg_bons',
        title: 'FG Bons',
        category: 'kicker'
    },
    'fg-tentativas': {
        key: 'tentativas_de_fg',
        title: 'FG Tentados',
        category: 'kicker'
    },
    'fg-mais-longo': {
        key: 'fg_mais_longo',
        title: 'FG Mais Longo',
        category: 'kicker'
    },
    'fg-0-10': {
        key: 'fg_0_10',
        title: 'FG (0-10)',
        category: 'kicker'
    },
    'fg-11-20': {
        key: 'fg_11_20',
        title: 'FG (11-20)',
        category: 'kicker'
    },
    'fg-21-30': {
        key: 'fg_21_30',
        title: 'FG (21-30)',
        category: 'kicker'
    },
    'fg-31-40': {
        key: 'fg_31_40',
        title: 'FG (31-40)',
        category: 'kicker'
    },
    'fg-41-50': {
        key: 'fg_41_50',
        title: 'FG (41-50)',
        category: 'kicker'
    },

    // PUNT
    'jardas-punt-media': {
        key: 'jardas_punt_media',
        title: 'Jardas (AVG)',
        category: 'punter',
        isCalculated: true
    },
    'punts': {
        key: 'punts',
        title: 'Punts',
        category: 'punter'
    },
    'jardas-punt': {
        key: 'jardas_de_punt',
        title: 'Jardas',
        category: 'punter'
    }
};

// Função para obter o mapeamento
export const getStatMapping = (statParam: string | null): StatConfig => {
    const urlParam = statParam?.toLowerCase() ?? '';
    return statMappings[urlParam] || {
        key: 'not_found',
        title: 'Estatística não encontrada',
        category: 'none'
    };
};

// Função para calcular valor da estatística
export const calculateStatValue = (player: Jogador, mapping: StatConfig): number | null => {
    try {
        const category = mapping.category as keyof typeof player.estatisticas;
        const stats = player.estatisticas[category];

        if (!stats) return null;

        if (mapping.isCalculated) {
            switch (mapping.key) {
                // PASSE
                case 'passes_percentual': {
                    const passes = stats as typeof player.estatisticas.passe;
                    return passes.passes_tentados > 0
                        ? (passes.passes_completos / passes.passes_tentados) * 100
                        : null;
                }
                case 'jardas_media': {
                    const passes = stats as typeof player.estatisticas.passe;
                    return passes.passes_completos > 0
                        ? passes.jardas_de_passe / passes.passes_completos
                        : null;
                }

                // CORRIDA
                case 'jardas_corridas_media': {
                    const corrida = stats as typeof player.estatisticas.corrida;
                    return corrida.corridas > 0
                        ? corrida.jardas_corridas / corrida.corridas
                        : null;
                }

                // RECEPÇÃO
                case 'jardas_recebidas_media': {
                    const recepcao = stats as typeof player.estatisticas.recepcao;
                    return recepcao.recepcoes > 0
                        ? recepcao.jardas_recebidas / recepcao.recepcoes
                        : null;
                }

                // RETORNO
                case 'jardas_retornadas_media': {
                    const retorno = stats as typeof player.estatisticas.retorno;
                    return retorno.retornos > 0
                        ? retorno.jardas_retornadas / retorno.retornos
                        : null;
                }

                // CHUTE
                case 'extra_points': {
                    const kicker = stats as typeof player.estatisticas.kicker;
                    return kicker.tentativas_de_xp > 0
                        ? (kicker.xp_bons / kicker.tentativas_de_xp) * 100
                        : null;
                }
                case 'field_goals': {
                    const kicker = stats as typeof player.estatisticas.kicker;
                    return kicker.tentativas_de_fg > 0
                        ? (kicker.fg_bons / kicker.tentativas_de_fg) * 100
                        : null;
                }

                // PUNT
                case 'jardas_punt_media': {
                    const punter = stats as typeof player.estatisticas.punter;
                    return punter.punts > 0
                        ? punter.jardas_de_punt / punter.punts
                        : null;
                }

                default:
                    return null;
            }
        }

        // Para FGs por distância que são strings no formato "X/Y"
        if (mapping.key.startsWith('fg_') && mapping.key !== 'fg_bons' && mapping.key !== 'fg_mais_longo') {
            const kicker = stats as typeof player.estatisticas.kicker;
            const fgString = kicker[mapping.key as keyof typeof kicker] as string;
            if (!fgString) return null;
            const [made, attempted] = fgString.split('/').map(Number);
            return attempted > 0 ? (made / attempted) * 100 : null;
        }

        // Para valores diretos
        const value = stats[mapping.key as keyof typeof stats];
        return typeof value === 'number' ? value : null;

    } catch (error) {
        console.error('Error calculating stat value:', error);
        return null;
    }
};

// Função para formatar valores
export const formatStatValue = (value: number | null, stat: StatConfig): string => {
    if (value === null) return 'N/A';

    if (stat.isCalculated) {
        if (stat.key.includes('percentual')) {
            return `${value.toFixed(1)}%`;
        }
        return value.toFixed(1);
    }

    return Math.round(value).toString();
};

// Função para comparar valores para ordenação
export const compareStatValues = (a: number | null, b: number | null): number => {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return b - a;
};