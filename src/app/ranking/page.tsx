"use client"

import { useState } from "react"
import { useTimes } from '@/hooks/useTimes'
import { useJogadores } from '@/hooks/useJogadores'
import { Loading } from "@/components/ui/Loading"
import { RankingLayout } from "@/components/Ranking/RankingLayout"
import { RankingGroup } from "@/components/Ranking/RankingGroup"
import { StatCardsGrid } from "@/components/Stats/StatCardsGrid"
import { StatCategoryButtons } from "@/components/ui/StatCategoryButtons"
import { getCategoryTitle, getStatsByCategory } from "@/utils/helpers/categoryHelpers"
import { calculateStat, compareValues, shouldIncludePlayer } from "@/utils/services/StatsServices"
import { Jogador, StatKey, Time } from "@/types"

export default function Page() {
    const [selectedCategory, setSelectedCategory] = useState("passe")

    // Usar hooks diretamente
    const { data: times = [], isLoading: timesLoading } = useTimes('2025')
    const { data: players = [], isLoading: jogadoresLoading } = useJogadores('2025')

    const loading = timesLoading || jogadoresLoading

    if (loading) {
        return <Loading />
    }

    const currentStats = getStatsByCategory(selectedCategory)
    const categoryTitle = getCategoryTitle(selectedCategory)

    const prepareStatsForCards = (
        players: Jogador[],
        times: Time[],
        currentStats: Array<{ key: StatKey; title: string }>,
        categoryTitle: string
    ) => {
        return currentStats.map(stat => {
            const filteredPlayers = players
                .filter(player => shouldIncludePlayer(player, stat.key, categoryTitle))
                .sort((a, b) => {
                    const aValue = calculateStat(a, stat.key);
                    const bValue = calculateStat(b, stat.key);
                    return compareValues(aValue, bValue);
                })
                .slice(0, 5);

            const formattedPlayers = filteredPlayers.map((player, index) => {
                const teamInfo = times.find(t => t.id === player.timeId) || {};
                const value = calculateStat(player, stat.key);

                return {
                    id: player.id,
                    name: player.nome,
                    team: (teamInfo as Time)?.nome || 'Time Desconhecido',
                    value: value !== null ? String(value) : 'N/A',
                    camisa: player.camisa,
                    teamColor: index === 0 ? (teamInfo as Time)?.cor : undefined,
                    teamLogo: `/assets/times/logos/${(teamInfo as Time)?.logo || 'default-logo.png'}`,
                    isFirst: index === 0
                };
            });

            return {
                title: stat.title,
                key: stat.key,
                players: formattedPlayers
            };
        });
    };

    return (
        <RankingLayout initialFilter="jogadores">
            <div className="pb-12 bg-[#ECECEC]">
                <div className="px-4 pt-8 lg:px-8 xl:px-12 xl:max-w-5xl max-w-7xl mx-auto xl:ml-20">
                    <StatCategoryButtons
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />
                </div>

                <div className="px-4 lg:px-8 xl:px-12 max-w-7xl mx-auto xl:ml-20">
                    <StatCardsGrid // @ts-ignore
                        stats={prepareStatsForCards(players, times, currentStats, categoryTitle)}
                        category={categoryTitle}
                    />
                </div>

                <div className="lg:hidden mb-20">
                    <RankingGroup
                        title="PASSE"
                        stats={[
                            { key: "jardas_de_passe", title: "JARDAS" },
                            { key: "passes_percentual", title: "PASSES(%)" },
                            { key: "td_passados", title: "TOUCHDOWNS" },
                            { key: "jardas_media", title: "JARDAS(AVG)" },
                            { key: "passes_completos", title: "PASSES COMP." },
                            { key: "passes_tentados", title: "PASSES TENT." },
                            { key: "interceptacoes_sofridas", title: "INTERCEPTAÇÕES" },
                            { key: "sacks_sofridos", title: "SACKS" },
                            { key: "fumble_de_passador", title: "FUMBLES " }
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="CORRIDA"
                        stats={[
                            { key: "jardas_corridas", title: "JARDAS" },
                            { key: "corridas", title: "CORRIDAS" },
                            { key: "tds_corridos", title: "TOUCHDOWNS" },
                            { key: "jardas_corridas_media", title: "JARDAS(AVG)" },
                            { key: "fumble_de_corredor", title: "FUMBLES" }
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="RECEPÇÃO"
                        stats={[
                            { key: "jardas_recebidas", title: "JARDAS" },
                            { key: "recepcoes", title: "RECEPÇÕES" },
                            { key: "tds_recebidos", title: "TOUCHDOWNS" },
                            { key: "jardas_recebidas_media", title: "JARDAS(AVG)" },
                            { key: "alvo", title: "ALVOS" },
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="RETORNO"
                        stats={[
                            { key: "jardas_retornadas_media", title: "JARDAS(AVG)" },
                            { key: "retornos", title: "RETORNOS" },
                            { key: "jardas_retornadas", title: "JARDAS" },
                            { key: "td_retornados", title: "TOUCHDOWNS" },
                        ]}
                        players={players}
                    />

                    <RankingGroup
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
                        players={players}
                    />

                    <RankingGroup
                        title="CHUTE"
                        stats={[
                            { key: "field_goals", title: "FG(%)" },
                            { key: "fg_bons", title: "FG BOM" },
                            { key: "fg_mais_longo", title: "MAIS LONGO" },
                            { key: "tentativas_de_fg", title: "FG TENTADOS" },
                            { key: "extra_points", title: "XP(%)" },
                            { key: "xp_bons", title: "XP BOM" },
                            { key: "tentativas_de_xp", title: "XP TENTADOS" },
                        ]}
                        players={players}
                    />

                    <RankingGroup
                        title="PUNT"
                        stats={[
                            { key: "jardas_punt_media", title: "JARDAS(AVG)" },
                            { key: "punts", title: "PUNTS" },
                            { key: "jardas_de_punt", title: "JARDAS" }
                        ]}
                        players={players}
                    />
                </div>
            </div>
        </RankingLayout>
    )
}