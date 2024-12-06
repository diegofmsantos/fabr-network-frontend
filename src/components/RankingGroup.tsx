"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Jogador } from "@/types/jogador";
import { useEffect, useState } from "react";
import { getTimes } from "@/api/api";
import { Time } from "../types/time";
import { RankingCard } from "./RankingCard";
import NoStats from "./ui/NoStats";

export type StatisticKey =
  | keyof Jogador["estatisticas"]["passe"]
  | keyof Jogador["estatisticas"]["corrida"]
  | keyof Jogador["estatisticas"]["recepcao"]
  | keyof Jogador["estatisticas"]["retorno"]
  | keyof Jogador["estatisticas"]["defesa"]
  | keyof Jogador["estatisticas"]["kicker"]
  | keyof Jogador["estatisticas"]["punter"];

export type CalculatedStatKey =
  | "passes_percentual"
  | "jardas_media"
  | "jardas_corridas_media"
  | "jardas_recebidas_media"
  | "jardas_retornadas_media"
  | "extra_points"
  | "field_goals"
  | "jardas_punt_media";

export type StatKey = StatisticKey | CalculatedStatKey;

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

const normalizeForFilePath = (input: string): string =>
  input
    .toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "");

const RankingGroup = ({ title, stats, players }: RankingGroupProps) => {
  const [times, setTimes] = useState<Time[]>([]);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const timesData = await getTimes();
        setTimes(timesData);
      } catch (error) {
        console.error("Error fetching times:", error);
      }
    };
    fetchTimes();
  }, []);

  const getTeamInfo = (timeId: number) => {
    const team = times.find((t) => t.id === timeId);
    return {
      nome: team?.nome || "time-desconhecido",
      cor: team?.cor || "#CCCCCC",
    };
  };

  const getStatCategory = (key: StatKey): keyof Jogador["estatisticas"] => {
    switch (key) {
      // Estatísticas de passe
      case "passes_percentual":
      case "passes_completos":
      case "passes_tentados":
      case "jardas_de_passe":
      case "td_passados":
      case "interceptacoes_sofridas":
      case "sacks_sofridos":
      case "fumble_de_passador":
      case "jardas_media":
        return "passe";

      // Estatísticas de corrida
      case "corridas":
      case "jardas_corridas":
      case "tds_corridos":
      case "fumble_de_corredor":
      case "jardas_corridas_media":
        return "corrida";

      // Estatísticas de recepção
      case "recepcoes":
      case "alvo":
      case "jardas_recebidas":
      case "tds_recebidos":
      case "fumble_de_recebedor":
      case "jardas_recebidas_media":
        return "recepcao";

      // Estatísticas de retorno
      case "retornos":
      case "jardas_retornadas":
      case "td_retornados":
      case "fumble_retornador":
      case "jardas_retornadas_media":
        return "retorno";

      // Estatísticas de defesa
      case "tackles_totais":
      case "tackles_for_loss":
      case "sacks_forcado":
      case "fumble_forcado":
      case "interceptacao_forcada":
      case "passe_desviado":
      case "safety":
      case "td_defensivo":
        return "defesa";

      // Estatísticas de kicker
      case "extra_points":
      case "field_goals":
      case "xp_bons":
      case "tentativas_de_xp":
      case "fg_bons":
      case "tentativas_de_fg":
      case "fg_mais_longo":
      case "fg_0_10":
      case "fg_11_20":
      case "fg_21_30":
      case "fg_31_40":
      case "fg_41_50":
        return "kicker";

      // Estatísticas de punter
      case "jardas_punt_media":
      case "punts":
      case "jardas_de_punt":
        return "punter";

      default:
        throw new Error(`Chave de estatística desconhecida: ${key}`);
    }
  };

  const shouldIncludePlayer = (player: Jogador, key: StatKey): boolean => {
    const stats = player.estatisticas[getStatCategory(key)];

    if (!(key in stats)) {
      console.warn(`Estatística ${key} não encontrada para o jogador ${player.nome}`);
      return false;
    }
    // @ts-ignore
    const value = stats[key];
    if (typeof value !== 'number' || value <= 0) {
      return false;
    }

    return true;
  };

  const compareValues = (a: number, b: number) => b - a;

  return (
    <div className="mt-10 mb-8 pt-4 overflow-x-hidden overflow-y-hidden">
      <h2 className="text-4xl font-extrabold mb-4 italic">{title}</h2>
      <Slider {...SLIDER_SETTINGS}>
        {stats.map((stat, index) => {
          const category = getStatCategory(stat.key);
          const filteredPlayers = players
            .filter((player) => shouldIncludePlayer(player, stat.key))
            .sort((a, b) => { // @ts-ignore
              const aValue = a.estatisticas[category][stat.key]; // @ts-ignore
              const bValue = b.estatisticas[category][stat.key];
              return compareValues(Number(aValue), Number(bValue));
            })
            .slice(0, 5);

          console.log(
            `Stat: ${stat.key}, Filtered Players Count: ${filteredPlayers.length}`
          ); // Log controlado para entender o número de jogadores filtrados

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
                players={filteredPlayers.map((player, playerIndex) => {
                  const teamInfo = getTeamInfo(player.timeId); // @ts-ignore
                  const value = player.estatisticas[category][stat.key];

                  console.log(
                    `Player: ${player.nome}, Team: ${teamInfo.nome}, Value: ${value}`
                  ); // Log controlado para entender detalhes dos jogadores e suas estatísticas

                  return {
                    name: player.nome,
                    team: teamInfo.nome,
                    value,
                    camisa: player.camisa,
                    teamColor: playerIndex === 0 ? teamInfo.cor : undefined,
                    teamLogo: `/assets/times/logos/${normalizeForFilePath(
                      teamInfo.nome
                    )}.png`,
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

export default RankingGroup;
