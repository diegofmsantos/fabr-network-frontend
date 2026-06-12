"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { useTimes } from '@/hooks/useTimes'
import { useJogadores } from '@/hooks/useJogadores'
import { Loading } from "@/components/ui/Loading"
import { RankingLayout } from '@/components/Ranking/RankingLayout'
import { TeamRankingGroup } from '@/components/Ranking/TimeRankingGroup'
import { TeamStatCardsGrid, prepareTeamStatsForCards } from '@/components/Stats/TeamStatCardsGrid'
import { StatCategoryButtons } from '@/components/ui/StatCategoryButtons'
import { getCategoryTitle, getStatsByCategory } from '@/utils/helpers/categoryHelpers'
import { Jogador, TeamStats } from '@/types'
import { useTemporada } from '@/hooks/queries'

const toNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

const calculateTeamStats = (players: Jogador[]): TeamStats[] => {
    const teamStatsMap = new Map<number, TeamStats>()
    const timeIds = [...new Set(players.map(player => player.timeId))];

    timeIds.forEach(id => {
        if (id !== undefined) {
            teamStatsMap.set(id, {
                timeId: id,
                passe: {
                    jardas_de_passe: 0,
                    passes_completos: 0,
                    passes_tentados: 0,
                    td_passados: 0,
                    interceptacoes_sofridas: 0,
                    sacks_sofridos: 0,
                    fumble_de_passador: 0,
                },
                corrida: {
                    jardas_corridas: 0,
                    corridas: 0,
                    tds_corridos: 0,
                    fumble_de_corredor: 0,
                },
                recepcao: {
                    jardas_recebidas: 0,
                    recepcoes: 0,
                    tds_recebidos: 0,
                    alvo: 0,
                },
                retorno: {
                    jardas_retornadas: 0,
                    retornos: 0,
                    td_retornados: 0,
                },
                defesa: {
                    tackles_totais: 0,
                    tackles_for_loss: 0,
                    sacks_forcado: 0,
                    fumble_forcado: 0,
                    interceptacao_forcada: 0,
                    passe_desviado: 0,
                    safety: 0,
                    td_defensivo: 0,
                },
                kicker: {
                    xp_bons: 0,
                    tentativas_de_xp: 0,
                    fg_bons: 0,
                    tentativas_de_fg: 0,
                    fg_mais_longo: 0,
                },
                punter: {
                    punts: 0,
                    jardas_de_punt: 0,
                }
            });
        }
    });

    players.forEach(player => {
        const teamStats = teamStatsMap.get(player.timeId ?? 0);

        if (!teamStats) {
            console.warn(`Time não encontrado para jogador ${player.nome} (ID: ${player.id}), timeId: ${player.timeId}`);
            return;
        }

        if (player.estatisticas?.passe) {
            teamStats.passe.passes_completos += toNumber(player.estatisticas.passe.passes_completos);
            teamStats.passe.passes_tentados += toNumber(player.estatisticas.passe.passes_tentados);
            teamStats.passe.jardas_de_passe += toNumber(player.estatisticas.passe.jardas_de_passe);
            teamStats.passe.td_passados += toNumber(player.estatisticas.passe.td_passados);
            teamStats.passe.interceptacoes_sofridas += toNumber(player.estatisticas.passe.interceptacoes_sofridas);
            teamStats.passe.sacks_sofridos += toNumber(player.estatisticas.passe.sacks_sofridos);
            teamStats.passe.fumble_de_passador += toNumber(player.estatisticas.passe.fumble_de_passador);
        }

        if (player.estatisticas?.corrida) {
            teamStats.corrida.corridas += toNumber(player.estatisticas.corrida.corridas);
            teamStats.corrida.jardas_corridas += toNumber(player.estatisticas.corrida.jardas_corridas);
            teamStats.corrida.tds_corridos += toNumber(player.estatisticas.corrida.tds_corridos);
            teamStats.corrida.fumble_de_corredor += toNumber(player.estatisticas.corrida.fumble_de_corredor);
        }

        if (player.estatisticas?.recepcao) {
            teamStats.recepcao.recepcoes += toNumber(player.estatisticas.recepcao.recepcoes);
            teamStats.recepcao.alvo += toNumber(player.estatisticas.recepcao.alvo);
            teamStats.recepcao.jardas_recebidas += toNumber(player.estatisticas.recepcao.jardas_recebidas);
            teamStats.recepcao.tds_recebidos += toNumber(player.estatisticas.recepcao.tds_recebidos);
        }

        if (player.estatisticas?.retorno) {
            teamStats.retorno.retornos += toNumber(player.estatisticas.retorno.retornos);
            teamStats.retorno.jardas_retornadas += toNumber(player.estatisticas.retorno.jardas_retornadas);
            teamStats.retorno.td_retornados += toNumber(player.estatisticas.retorno.td_retornados);
        }

        if (player.estatisticas?.defesa) {
            teamStats.defesa.tackles_totais += toNumber(player.estatisticas.defesa.tackles_totais);
            teamStats.defesa.tackles_for_loss += toNumber(player.estatisticas.defesa.tackles_for_loss);
            teamStats.defesa.sacks_forcado += toNumber(player.estatisticas.defesa.sacks_forcado);
            teamStats.defesa.fumble_forcado += toNumber(player.estatisticas.defesa.fumble_forcado);
            teamStats.defesa.interceptacao_forcada += toNumber(player.estatisticas.defesa.interceptacao_forcada);
            teamStats.defesa.passe_desviado += toNumber(player.estatisticas.defesa.passe_desviado);
            teamStats.defesa.safety += toNumber(player.estatisticas.defesa.safety);
            teamStats.defesa.td_defensivo += toNumber(player.estatisticas.defesa.td_defensivo);
        }

        if (player.estatisticas?.kicker) {
            teamStats.kicker.xp_bons += toNumber(player.estatisticas.kicker.xp_bons);
            teamStats.kicker.tentativas_de_xp += toNumber(player.estatisticas.kicker.tentativas_de_xp);
            teamStats.kicker.fg_bons += toNumber(player.estatisticas.kicker.fg_bons);
            teamStats.kicker.tentativas_de_fg += toNumber(player.estatisticas.kicker.tentativas_de_fg);

            const fgMaisLongo = toNumber(player.estatisticas.kicker.fg_mais_longo);
            if (fgMaisLongo > teamStats.kicker.fg_mais_longo) {
                teamStats.kicker.fg_mais_longo = fgMaisLongo;
            }
        }

        if (player.estatisticas?.punter) {
            teamStats.punter.punts += toNumber(player.estatisticas.punter.punts);
            teamStats.punter.jardas_de_punt += toNumber(player.estatisticas.punter.jardas_de_punt);
        }
    });

    return Array.from(teamStatsMap.values());
}

export default function TeamRankingPage() {
    const [selectedCategory, setSelectedCategory] = useState("passe")

    const temporada = useTemporada()
    const { data: times = [], isLoading: timesLoading } = useTimes(temporada)
    const { data: players = [], isLoading: playersLoading } = useJogadores(temporada)

    useEffect(() => {
        document.title = "FABR Network - Ranking de Times"
    }, [])

    const loading = timesLoading || playersLoading

    const teamStats = useMemo(() => {
        if (loading || players.length === 0) return []
        return calculateTeamStats(players)
    }, [players, loading])

    if (loading || teamStats.length === 0) {
        return <Loading />
    }

    const currentStats = getStatsByCategory(selectedCategory)
    const categoryTitle = getCategoryTitle(selectedCategory)
    const preparedTeamStats = prepareTeamStatsForCards(teamStats, times, currentStats, categoryTitle)

    return (
        <RankingLayout initialFilter="times">
            <div className="pb-12 bg-[#ECECEC]">
                <div className="px-6 max-w-7xl mx-auto xl:mt-10 xl:max-w-5xl xl:px-12 xl:ml-20">
                    <StatCategoryButtons
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                <div className="px-4 mx-auto max-w-7xl lg:px-8 lg:mb-12 xl:px-12">
                    <TeamStatCardsGrid
                        stats={preparedTeamStats}
                        category={categoryTitle}
                    />
                </div>

                <div className="lg:hidden">
                    <TeamRankingGroup
                        title="PASSE"
                        stats={[
                            { key: "jardas_de_passe", title: "JARDAS" },
                            { key: "passes_tentados", title: "PASSES TENT." },
                            { key: "td_passados", title: "TOUCHDOWNS" },
                            { key: "jardas_media", title: "JARDAS(AVG)" },
                            { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_sofridos", title: "SACKS" },
                            { key: "fumble_de_passador", title: "FUMBLES" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="CORRIDA"
                        stats={[
                            { key: "jardas_corridas", title: "JARDAS" },
                            { key: "corridas", title: "CORRIDAS" },
                            { key: "tds_corridos", title: "TOUCHDOWNS" },
                            { key: "jardas_corridas_media", title: "JARDAS(AVG)" },
                            { key: "fumble_de_corredor", title: "FUMBLES" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="RECEPÇÃO"
                        stats={[
                            { key: "jardas_recebidas", title: "JARDAS" },
                            { key: "recepcoes", title: "RECEPÇÕES" },
                            { key: "tds_recebidos", title: "TOUCHDOWNS" },
                            { key: "jardas_recebidas_media", title: "JARDAS(AVG)" },
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="RETORNO"
                        stats={[
                            { key: "jardas_retornadas", title: "JARDAS" },
                            { key: "retornos", title: "RETORNOS" },
                            { key: "td_retornados", title: "TOUCHDOWNS" },
                            { key: "jardas_retornadas_media", title: "JARDAS(AVG)" },
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="DEFESA"
                        stats={[
                            { key: "interceptacao_forcada", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_forcado", title: "SACKS" },
                            { key: "fumble_forcado", title: "FUMBLES FORÇ." },
                            { key: "td_defensivo", title: "TOUCHDOWNS" },
                            { key: "passe_desviado", title: "PASSES DESV." },
                            { key: "tackles_for_loss", title: "TACKLES(LOSS)" },
                            { key: "tackles_totais", title: "TACKLES TOTAIS" },
                            { key: "safety", title: "SAFETIES" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="CHUTE"
                        stats={[
                            { key: "field_goals", title: "FG(%)" },
                            { key: "fg_bons", title: "FG BOM" },
                            { key: "fg_mais_longo", title: "MAIS LONGO" },
                            { key: "tentativas_de_fg", title: "FG TENTADOS" },
                            { key: "extra_points", title: "XP(%)" },
                            { key: "xp_bons", title: "XP BOM" },
                            { key: "tentativas_de_xp", title: "XP TENTADOS" }
                        ]}
                        teamStats={teamStats}
                    />

                    <TeamRankingGroup
                        title="PUNT"
                        stats={[
                            { key: "jardas_de_punt", title: "JARDAS" },
                            { key: "punts", title: "PUNTS" },
                            { key: "jardas_punt_media", title: "JARDAS(AVG)" }
                        ]}
                        teamStats={teamStats}
                    />
                </div>
            </div>
        </RankingLayout>
    )
}