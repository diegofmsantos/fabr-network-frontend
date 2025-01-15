"use client"

import React from 'react'
import { getJogadores } from "@/api/api"
import { useEffect, useState } from "react"
import { Jogador } from "@/types/jogador"
import { Loading } from "@/components/ui/Loading"
import { RankingLayout } from '@/components/Ranking/RankingLayout'
import { TeamRankingGroup } from '@/components/Ranking/TimeRankingGroup'

// Tipo para as estatísticas agregadas do time
interface TeamStats {
    timeId: number
    passe: {
        jardas_de_passe: number
        passes_completos: number
        passes_tentados: number
        td_passados: number
        interceptacoes_sofridas: number
        sacks_sofridos: number
        fumble_de_passador: number
    }
    corrida: {
        jardas_corridas: number
        corridas: number
        tds_corridos: number
        fumble_de_corredor: number
    }
    recepcao: {
        jardas_recebidas: number
        recepcoes: number
        tds_recebidos: number
        alvo: number
        fumble_de_recebedor: number
    }
    retorno: {
        jardas_retornadas: number
        retornos: number
        td_retornados: number
        fumble_retornador: number
    }
    defesa: {
        tackles_totais: number
        tackles_for_loss: number
        sacks_forcado: number
        fumble_forcado: number
        interceptacao_forcada: number
        passe_desviado: number
        safety: number
        td_defensivo: number
    }
    kicker: {
        xp_bons: number
        tentativas_de_xp: number
        fg_bons: number
        tentativas_de_fg: number
        fg_mais_longo: number
    }
    punter: {
        punts: number
        jardas_de_punt: number
    }
}

export default function TeamRankingPage() {
    const [players, setPlayers] = useState<Jogador[]>([])
    const [teamStats, setTeamStats] = useState<TeamStats[]>([])

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const playersData = await getJogadores()
                setPlayers(playersData)

                // Calcula as estatísticas agregadas por time
                const stats = calculateTeamStats(playersData)
                setTeamStats(stats);
            } catch (error) {
                console.error("Error fetching players:", error)
            }
        }
        fetchPlayers()
    }, [])

    // Função para calcular estatísticas agregadas por time
    const calculateTeamStats = (players: Jogador[]): TeamStats[] => {
        const teamStatsMap = new Map<number, TeamStats>()

        players.forEach(player => {
            let teamStats = teamStatsMap.get(player.timeId)

            if (!teamStats) {
                teamStats = {
                    timeId: player.timeId,
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
                        fumble_de_recebedor: 0,
                    },
                    retorno: {
                        jardas_retornadas: 0,
                        retornos: 0,
                        td_retornados: 0,
                        fumble_retornador: 0,
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
                };
                teamStatsMap.set(player.timeId, teamStats);
            }

            // Soma todas as estatísticas do jogador às estatísticas do time
            Object.keys(player.estatisticas).forEach(category => {
                const categoryStats = player.estatisticas[category as keyof typeof player.estatisticas]
                const teamCategoryStats = teamStats![category as keyof TeamStats] as any

                Object.keys(categoryStats).forEach(stat => {
                    // @ts-ignore
                    if (typeof categoryStats[stat] === 'number') { // @ts-ignore
                        teamCategoryStats[stat] += categoryStats[stat]
                    }
                })
            })
        })

        return Array.from(teamStatsMap.values());
    }

    if (!players.length || !teamStats.length) {
        return <Loading />;
    }

    return (
        <RankingLayout initialFilter="times">
            <div className="pb-12 bg-[#ECECEC]">
                <TeamRankingGroup
                    title="PASSE"
                    stats={[
                        { key: "jardas_de_passe", title: "JARDAS" },
                        { key: "passes_tentados", title: "PASSES TENT." },
                        { key: "td_passados", title: "TOUCHDOWNS" },
                        { key: "jardas_media", title: "JARDAS(AVG)" },
                        { key: "passes_completos", title: "PASSES COMP." },
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
                        { key: "fumble_de_recebedor", title: "FUMBLES" }
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
                        { key: "fumble_retornador", title: "FUMBLES" }
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
        </RankingLayout>
    )
}