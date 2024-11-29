"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Jogador } from "@/types/jogador";
import { useEffect, useState, useMemo } from "react";
import { getTimes } from "@/api/api";
import { Time } from "../types/time";
import { RankingCard } from "./RankingCard";

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

const calculatePercentage = (numerator: number, denominator: number): string =>
  denominator > 0 ? ((numerator / denominator) * 100).toFixed(0) : "0";

const calculateAverage = (total: number, count: number): string =>
  count > 0 ? (total / count).toFixed(1) : "0.0";

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
    switch (true) {
      case key in (players[0]?.estatisticas?.passe || {}):
        return "passe";
      case key in (players[0]?.estatisticas?.corrida || {}):
        return "corrida";
      case key in (players[0]?.estatisticas?.recepcao || {}):
        return "recepcao";
      case key in (players[0]?.estatisticas?.retorno || {}):
        return "retorno";
      case key in (players[0]?.estatisticas?.defesa || {}):
        return "defesa";
      case key in (players[0]?.estatisticas?.kicker || {}):
        return "kicker";
      case key in (players[0]?.estatisticas?.punter || {}):
        return "punter";
      default:
        return "passe"; // fallback para estatísticas calculadas
    }
  };

  const getStatValue = (player: Jogador, key: StatKey, category: keyof Jogador["estatisticas"]): number | string => {
    const stats = player.estatisticas?.[category];

    // Handle calculated stats
    switch (key) {
      case "passes_percentual":
        return calculatePercentage(
          // @ts-ignore
          stats?.passes_completos || 0,
          // @ts-ignore
          stats?.passes_tentados || 0
        );
      case "jardas_media":
        return calculateAverage(
          // @ts-ignore
          stats?.jardas_de_passe || 0,
          // @ts-ignore
          stats?.passes_tentados || 0
        );
      case "jardas_corridas_media":
        return calculatePercentage(
          // @ts-ignore
          stats?.jardas_corridas || 0,
          // @ts-ignore
          stats?.corridas || 0
        );
      case "jardas_recebidas_media":
        return calculatePercentage(
          // @ts-ignore
          stats?.jardas_recebidas || 0,
          // @ts-ignore
          stats?.alvo || 0
        );
      case "jardas_retornadas_media":
        return calculatePercentage(
          // @ts-ignore
          stats?.jardas_retornadas || 0,
          // @ts-ignore
          stats?.retornos || 0
        );
      case "extra_points":
        return calculatePercentage(
          // @ts-ignore
          stats?.xp_bons || 0,
          // @ts-ignore
          stats?.tentativas_de_xp || 0
        );
      case "field_goals":
        return calculatePercentage(
          // @ts-ignore
          stats?.fg_bons || 0,
          // @ts-ignore
          stats?.tentativas_de_fg || 0
        );
      case "jardas_punt_media":
        return calculateAverage(
          // @ts-ignore
          stats?.jardas_de_punt || 0,
          // @ts-ignore
          stats?.punts || 0
        );
      default:
        return (stats as any)?.[key] || 0;
    }
  };

  return (
    <div className="mt-10 mb-8 pt-4 overflow-x-hidden overflow-y-hidden">
      <h2 className="text-4xl font-extrabold mb-4 italic">{title}</h2>
      <Slider {...SLIDER_SETTINGS}>
        {stats.map((stat, index) => {
          const category = getStatCategory(stat.key);
          const topPlayers = players
            .filter((player) => {
              const value = getStatValue(player, stat.key, category);
              return value && value !== 0;
            })
            .sort((a, b) => {
              const aValue = Number(getStatValue(a, stat.key, category));
              const bValue = Number(getStatValue(b, stat.key, category));
              return bValue - aValue;
            })
            .slice(0, 5);

          return (
            <div key={index}>
              <RankingCard
                title={stat.title}
                players={topPlayers.map((player, playerIndex) => {
                  const teamInfo = getTeamInfo(player.timeId);
                  const value = getStatValue(player, stat.key, category);

                  return {
                    name: player.nome,
                    team: teamInfo.nome,
                    value: typeof value === "string" && !value.includes("%")
                      ? `${value}%`
                      : value,
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