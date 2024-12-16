import { StatGroup } from '@/types/Stats';

export const statGroups: StatGroup[] = [
    {
        title: 'Passe',
        groupLabel: 'PASSE',
        stats: [
            { title: 'Jardas', urlParam: 'passe-jardas' },
            { title: 'Passes(%)', urlParam: 'passe-passes' },
            { title: 'Jardas(AVG)', urlParam: 'passe-jardasavg' },
            { title: 'Touchdowns', urlParam: 'passe-touchdowns' },
            { title: 'Passes Completos', urlParam: 'passe-passes-comp' },
            { title: 'Passes Tentados', urlParam: 'passe-passes-tent' },
            { title: 'Interceptações', urlParam: 'passe-interceptacoes' },
            { title: 'Sacks', urlParam: 'passe-sacks' },
            { title: 'Fumbles', urlParam: 'passe-fumbles' }
        ]
    },
    {
        title: 'CORRIDA',
        groupLabel: 'CORRIDA',
        stats: [
            { title: 'Jardas', urlParam: 'corrida-jardas' },
            { title: 'Corridas', urlParam: 'corrida-corridas' },
            { title: 'Jardas(AVG)', urlParam: 'corrida-jardasavg' },
            { title: 'Touchdowns', urlParam: 'corrida-touchdowns' },
            { title: 'Fumbles', urlParam: 'corrida-fumbles' }
        ]
    },
    {
        title: 'Recebendo',
        groupLabel: 'RECEPÇÃO',
        stats: [
            { title: 'Jardas', urlParam: 'recepcao-jardas' },
            { title: 'Recepções', urlParam: 'recepcao-recepcoes' },
            { title: 'Jardas(AVG)', urlParam: 'recepcao-jardasavg' },
            { title: 'Touchdowns', urlParam: 'recepcao-touchdowns' },
            { title: 'Alvos', urlParam: 'recepcao-alvos' },
            { title: 'Fumbles', urlParam: 'recepcao-fumbles' }
        ]
    },
    {
        title: 'Retornando',
        groupLabel: 'RETORNO',
        stats: [
            { title: 'Jardas', urlParam: 'retorno-jardas' },
            { title: 'Retornos', urlParam: 'retorno-retornos' },
            { title: 'Jardas(AVG)', urlParam: 'retorno-jardasavg' },
            { title: 'Touchdowns', urlParam: 'retorno-touchdowns' },
            { title: 'Fumbles', urlParam: 'retorno-fumbles' }
        ]
    },
    {
        title: 'Defendendo',
        groupLabel: 'DEFESA',
        stats: [
            { title: 'Sacks', urlParam: 'defesa-sacks' },
            { title: 'Interceptações', urlParam: 'defesa-interceptacoes' },
            { title: 'Fumbles Forçados', urlParam: 'defesa-fumbles-forc' },
            { title: 'Touchdowns', urlParam: 'defesa-touchdowns' },
            { title: 'Tackles (Loss)', urlParam: 'defesa-tacklesloss' },
            { title: 'Tackles Totais', urlParam: 'defesa-tackles-totais' },
            { title: 'Passes Desviados', urlParam: 'defesa-passes-desv' },
            { title: 'Safeties', urlParam: 'defesa-safeties' }
        ]
    },
    {
        title: 'Chutando',
        groupLabel: 'CHUTE',
        stats: [
            { title: 'FG(%)', urlParam: 'chute-fg' },
            { title: 'XP(%)', urlParam: 'chute-xp' },
            { title: 'FG Bons', urlParam: 'chute-fg-bom' },
            { title: 'FG Tentados', urlParam: 'chute-fg-tentados' },
            { title: 'XP Bons', urlParam: 'chute-xp-bom' },
            { title: 'XP Tentados', urlParam: 'chute-xp-tentados' },
            { title: 'Mais Longo', urlParam: 'chute-mais-longo' }
        ]
    },
    {
        title: 'Punt',
        groupLabel: 'PUNT',
        stats: [
            { title: 'Jardas', urlParam: 'punt-jardas' },
            { title: 'Jardas(AVG)', urlParam: 'punt-jardasavg' },
            { title: 'Punts', urlParam: 'punt-punts' }
        ]
    }
];

// Função auxiliar para verificar se uma estatística é calculada
export const isCalculatedStat = (urlParam: string): boolean => {
    return urlParam.includes('avg') || 
           urlParam.includes('percentual') || 
           urlParam === 'chute-fg' || 
           urlParam === 'chute-xp';
};