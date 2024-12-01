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
                setPlayers(playersData);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        };
        fetchPlayers();
    }, []);

    // Definir as estatísticas com o tipo correto StatKey
    const statsPasse: { title: string; key: StatKey }[] = [
        { title: "Jardas Totais", key: "jardas_de_passe" },
        { title: "Passes(%)", key: "passes_percentual" },
        { title: "Jardas(AVG)", key: "jardas_media" },
        { title: "Touchdowns", key: "td_passados" },
        { title: "Passes Completos", key: "passes_completos" },
        { title: "Passes Tentados", key: "passes_tentados" },
        { title: "Interceptações", key: "interceptacoes_sofridas" },
        { title: "Sacks", key: "sacks_sofridos" },
        { title: "Fumbles", key: "fumble_de_passador" }
    ];

    const statsCorrida: { title: string; key: StatKey }[] = [
        { title: "Jardas Totais", key: "jardas_corridas" },
        { title: "Corridas", key: "corridas" },
        { title: "Jardas(AVG)", key: "jardas_corridas_media" },
        { title: "Touchdowns", key: "tds_corridos" },
        { title: "Fumbles", key: "fumble_de_corredor" }
    ];

    const statsRecepcao: { title: string; key: StatKey }[] = [
        { title: "Jardas Totais", key: "jardas_recebidas" },
        { title: "Recepções", key: "recepcoes" },
        { title: "Touchdowns", key: "tds_recebidos" },
        { title: "Jardas AVG", key: "jardas_recebidas_media" },
        { title: "Alvos", key: "alvo" },
        { title: "Fumbles", key: "fumble_de_recebedor" }
    ];

    const statsRetorno: { title: string; key: StatKey }[] = [
        { title: "Jardas", key: "jardas_retornadas" },
        { title: "Retornos", key: "retornos" },
        { title: "Touchdowns", key: "td_retornados" },
        { title: "Jardas AVG", key: "jardas_retornadas_media" },
        { title: "Fumbles", key: "fumble_retornador" }
    ];

    const statsDefesa: { title: string; key: StatKey }[] = [
        { title: "Sacks", key: "sacks_forcado" },
        { title: "Interceptações", key: "interceptacao_forcada" },
        { title: "Fumbles", key: "fumble_forcado" },
        { title: "Touchdowns", key: "td_defensivo" },
        { title: "Tackels for Loss", key: "tackles_for_loss" },
        { title: "Passes Desviados", key: "passe_desviado" },
        { title: "Tackels Totais", key: "tackles_totais" },
        { title: "Safeties", key: "safety" }
    ];

    const statsKicker: { title: string; key: StatKey }[] = [
        { title: "XP Bons", key: "xp_bons" },
        { title: "Tentativas XP", key: "tentativas_de_xp" },
        { title: "Extra-Points(%)", key: "extra_points" },
        { title: "FG Bons", key: "fg_bons" },
        { title: "Tentativas FG", key: "tentativas_de_fg" },
        { title: "Field Goals(%)", key: "field_goals" },
        { title: "Mais Longo", key: "fg_mais_longo" },
        { title: "FG (0-10 JDS)", key: "fg_0_10" },
        { title: "FG (11-20 JDS)", key: "fg_11_20" },
        { title: "FG (21-30 JDS)", key: "fg_21_30" },
        { title: "FG (31-40 JDS)", key: "fg_31_40" },
        { title: "FG (41-50 JDS)", key: "fg_41_50" }
    ];

    const statsPunter: { title: string; key: StatKey }[] = [
        { title: "Punts", key: "punts" },
        { title: "Jardas Totais", key: "jardas_de_punt" },
        { title: "Jardas(AVG)", key: "jardas_punt_media" }
    ];

    if (!players.length) {
        return <Loading />
    }

    return (
        <div className="pl-4 py-12">
            <RankingGroup title="Passe" stats={statsPasse} players={players} />
            <RankingGroup title="Corrida" stats={statsCorrida} players={players} />
            <RankingGroup title="Recepção" stats={statsRecepcao} players={players} />
            <RankingGroup title="Retorno" stats={statsRetorno} players={players} />
            <RankingGroup title="Defesa" stats={statsDefesa} players={players} />
            <RankingGroup title="Kicker" stats={statsKicker} players={players} />
            <RankingGroup title="Punter" stats={statsPunter} players={players} />
        </div>
    );
}