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
      case "jardas_media": // Associado a passe para cálculo de jardas médias
        return "passe";

      // Estatísticas de corrida
      case "corridas":
      case "jardas_corridas":
      case "tds_corridos":
      case "fumble_de_corredor":
      case "jardas_corridas_media": // Associado a corrida para cálculo de jardas médias
        return "corrida";

      // Estatísticas de recepção
      case "recepcoes":
      case "alvo":
      case "jardas_recebidas":
      case "tds_recebidos":
      case "fumble_de_recebedor":
      case "jardas_recebidas_media": // Associado a recepção para cálculo de jardas médias
        return "recepcao";

      // Estatísticas de retorno
      case "retornos":
      case "jardas_retornadas":
      case "td_retornados":
      case "fumble_retornador":
      case "jardas_retornadas_media": // Associado a retorno para cálculo de jardas médias
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

  const getStatValue = (
    player: Jogador,
    key: StatKey,
    category: keyof Jogador["estatisticas"]
  ): number | string => {
    const stats = player.estatisticas[category];
    if (!stats) return "0";

    switch (key) {
      case "passes_percentual": // @ts-ignore
        return stats.passes_tentados > 0 // @ts-ignore
          ? ((stats.passes_completos / stats.passes_tentados) * 100).toFixed(1)
          : "0";
      case "jardas_media": // @ts-ignore
        return stats.passes_tentados > 0 // @ts-ignore
          ? (stats.jardas_de_passe / stats.passes_tentados).toFixed(1)
          : "0.0";
      case "jardas_corridas_media":
      case "jardas_recebidas_media":
      case "jardas_retornadas_media":
      case "jardas_punt_media":
        const attempts = 
          key === "jardas_corridas_media" // @ts-ignore
            ? stats.corridas 
            : key === "jardas_recebidas_media" // @ts-ignore
              ? stats.alvo 
              : key === "jardas_retornadas_media" // @ts-ignore
                ? stats.retornos // @ts-ignore
                : stats.punts;

        const yards = 
          key === "jardas_corridas_media" // @ts-ignore
            ? stats.jardas_corridas 
            : key === "jardas_recebidas_media" // @ts-ignore
              ? stats.jardas_recebidas 
              : key === "jardas_retornadas_media" // @ts-ignore
                ? stats.jardas_retornadas // @ts-ignore
                : stats.jardas_de_punt;

        return attempts > 0 ? (yards / attempts).toFixed(1) : "0.0";
      case "extra_points": // @ts-ignore
        return stats.tentativas_de_xp > 0 // @ts-ignore
          ? ((stats.xp_bons / stats.tentativas_de_xp) * 100).toFixed(1)
          : "0";
      case "field_goals": // @ts-ignore
        return stats.tentativas_de_fg > 0 // @ts-ignore
          ? ((stats.fg_bons / stats.tentativas_de_fg) * 100).toFixed(1)
          : "0";
      default:
        return String((stats as any)[key] || "0");
    }
  };

  const compareValues = (a: string | number, b: string | number): number => {
    if (typeof a === "string" && typeof b === "string") {
      // Para estatísticas no formato "x/y"
      if (a.includes("/") && b.includes("/")) {
        const [madeA, attemptedA] = a.split("/").map(Number);
        const [madeB, attemptedB] = b.split("/").map(Number);

        // Calcula as porcentagens
        const percentA = attemptedA > 0 ? madeA / attemptedA : 0;
        const percentB = attemptedB > 0 ? madeB / attemptedB : 0;

        if (percentA === percentB) {
          // Se as porcentagens são iguais, prioriza quem tentou mais
          return attemptedB - attemptedA;
        }
        return percentB - percentA;
      }

      // Para outros valores numéricos em string
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      return numB - numA;
    }
    return Number(b) - Number(a);
  };

  return (
    <div className="mt-10 mb-8 pt-4 overflow-x-hidden overflow-y-hidden">
      <h2 className="text-4xl font-extrabold mb-4 italic">{title}</h2>
      <Slider {...SLIDER_SETTINGS}>
        {stats.map((stat, index) => {
          const category = getStatCategory(stat.key);
          const topPlayers = players
            .filter((player) => {
              const stats = player.estatisticas[category];
              // Verifica se a estatística não é "0" ou "0/0"
              const statValue = getStatValue(player, stat.key, category);
              if (typeof statValue === 'string' && statValue.includes('/')) {
                const [made, attempted] = statValue.split('/').map(Number);
                return made > 0 || attempted > 0;
              }
              return stats && Number(statValue) > 0;
            })
            .sort((a, b) => {
              const aValue = getStatValue(a, stat.key, category);
              const bValue = getStatValue(b, stat.key, category);
              return compareValues(aValue, bValue);
            })
            .slice(0, 5);

          if (topPlayers.length === 0) {
            return (
              <div key={index}>
                <div className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">{stat.title}</div>
                <NoStats />
              </div>
            );
          }

          return (
            <div key={index}>
              <RankingCard
                title={stat.title}
                players={topPlayers.map((player, playerIndex) => {
                  const teamInfo = getTeamInfo(player.timeId);
                  const value = getStatValue(player, stat.key, category);
                  const displayValue =
                    typeof value === "string" && !value.includes("%") &&
                      (stat.title.includes("(%)") ||
                        stat.title.includes("Points") ||
                        stat.title.includes("Goals"))
                      ? `${value}%`
                      : value;

                  return {
                    name: player.nome,
                    team: teamInfo.nome,
                    value: displayValue,
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
