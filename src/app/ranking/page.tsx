"use client";

import { getJogadores } from "@/api/api";
import RankingGroup, { StatKey } from "@/components/RankingGroup";
import { useEffect, useState } from "react";
import { Jogador } from "@/types/jogador";
import { Loading } from "@/components/ui/Loading";

export default function Page() {
    const [players, setPlayers] = useState<Jogador[]>([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const playersData = await getJogadores();
                console.log(playersData)
                setPlayers(playersData);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        };
        fetchPlayers();
    }, []);

    if (!players.length) {
        return <Loading />
    }

    return (
        <div className="pl-4 py-12">
            <RankingGroup
                title="Passe"
                stats={[
                    { key: "jardas_de_passe", title: "Jardas Totais" },
                    { key: "passes_percentual", title: "PASSES(%)" },
                    { key: "jardas_media", title: "Jardas(AVG)" },
                    { key: "td_passados", title: "Touchdowns" },
                    { key: "passes_completos", title: "Passes Completos" },
                    { key: "passes_tentados", title: "Passes Tentados" },
                    { key: "interceptacoes_sofridas", title: "Interceptações" },
                    { key: "sacks_sofridos", title: "Sacks" },
                    { key: "fumble_de_passador", title: "Fumbles " }

                ]} players={players}
            />

            <RankingGroup
                title="Corrida"
                stats={[
                    { key: "jardas_corridas", title: "Jardas Totais" },
                    { key: "corridas", title: "Corridas" },
                    { key: "jardas_corridas_media", title: "Jardas(AVG)" },
                    { key: "tds_corridos", title: "Touchdowns" },
                    { key: "fumble_de_corredor", title: "Fumbles" }
                ]}
                players={players}
            />

            <RankingGroup
                title="Recepção"
                stats={[
                    { key: "jardas_recebidas", title: "Jardas Totais" },
                    { key: "recepcoes", title: "Recepções" },
                    { key: "tds_recebidos", title: "Touchdowns" },
                    { key: "jardas_recebidas_media", title: "Jardas(AVG)" },
                    { key: "alvo", title: "Alvos" },
                    { key: "fumble_de_recebedor", title: "Fumbles" },
                ]} players={players}
            />
            <RankingGroup
                title="Retorno"
                stats={[
                    { key: "jardas_retornadas", title: "Jardas" },
                    { key: "retornos", title: "Retornos" },
                    { key: "td_retornados", title: "Touchdowns" },
                    { key: "jardas_retornadas_media", title: "Jardas(AVG)" },
                    { key: "fumble_retornador", title: "Fumbles" },
                ]} players={players}
            />

            <RankingGroup
                title="Defesa"
                stats={[
                    { key: "sacks_forcado", title: "Sacks" },
                    { key: "interceptacao_forcada", title: "Interceptações" },
                    { key: "fumble_forcado", title: "Fumbles" },
                    { key: "td_defensivo", title: "Touchdowns" },
                    { key: "tackles_for_loss", title: "Tackels for Loss" },
                    { key: "passe_desviado", title: "Passes Desviados" },
                    { key: "tackles_for_loss", title: "Tackels Totais" },
                    { key: "safety", title: "Safities" },
                ]} players={players}
            />

            <RankingGroup
                title="Kicker"
                stats={[
                    { key: "xp_bons", title: "XP Bons" },
                    { key: "tentativas_de_xp", title: "Tentativas XP" },
                    { key: "extra_points", title: "Extra-Points(%)" },
                    { key: "fg_bons", title: "FG Bons" },
                    { key: "tentativas_de_fg", title: "Tentativas FG" },
                    { key: "field_goals", title: "Field-Goals(%)" },
                    { key: "fg_mais_longo", title: "Mais Longo" },
                    { key: "fg_0_10", title: "FG (0-10 JDS)" },
                    { key: "fg_11_20", title: "FG (11-20 JDS)" },
                    { key: "fg_21_30", title: "FG (21-30 JDS)" },
                    { key: "fg_31_40", title: "FG (31-40 JDS)" },
                    { key: "fg_41_50", title: "FG (41-50 JDS)" }
                ]} players={players}
            />

            <RankingGroup
                title="Punter"
                stats={[
                    { key: "punts", title: "Punts" },
                    { key: "jardas_de_punt", title: "Jardas Totais" },
                    { key: "jardas_punt_media", title: "Jardas(AVG)" }
                ]}
                players={players}
            />
        </div>
    );
}
