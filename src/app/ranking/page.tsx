"use client"

import { getJogadores } from "@/api/api"
import { useEffect, useState } from "react"
import { Jogador } from "@/types/jogador"
import { Loading } from "@/components/ui/Loading"
import { RankingLayout } from "@/components/Ranking/RankingLayout"
import { RankingGroup } from "@/components/Ranking/RankingGroup"

export default function Page() {
    const [players, setPlayers] = useState<Jogador[]>([])

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const playersData = await getJogadores()
                setPlayers(playersData)
            } catch (error) {
                console.error("Error fetching players:", error)
            }
        }
        fetchPlayers()
    }, [])

    if (!players.length) {
        return <Loading />
    }

    return (
        <RankingLayout initialFilter="jogadores">
            <div className="pb-12 bg-[#ECECEC]">
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
        </RankingLayout>
    )
}
