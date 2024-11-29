"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Jogador } from "@/types/jogador";
import { useEffect, useState } from "react";
import { getTimes } from "@/api/api";
import { Time } from "../types/time";
import { RankingCard } from "./RankingCard";

export type PasseKeys =
  | keyof Jogador["estatisticas"]["passe"]
  | "passes_percentual"
  | "jardas_media";


type RankingGroupProps = {
  title: string;
  stats: { key: PasseKeys; title: string }[];
  players: Jogador[];
};

const RankingGroup = ({ title, stats, players }: RankingGroupProps) => {
  const [times, setTimes] = useState<Time[]>([]);

  useEffect(() => {
    const fetchTimes = async () => {
      const timesData = await getTimes();
      setTimes(timesData);
    };
    fetchTimes();
  }, []);

  const normalizeForFilePath = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "");
  };

  const getTeamInfo = (timeId: number) => {
    const team = times.find((t) => t.id === timeId);
    return {
      nome: team?.nome || "time-desconhecido",
      cor: team?.cor || "#CCCCCC",
    };
  };

  const SliderSettings = {
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

  return (
    <div className="my-8 pt-4 overflow-x-hidden">
      <h2 className="text-4xl font-extrabold mb-4 italic">{title}</h2>
      <Slider {...SliderSettings}>
        {stats.map((stat, index) => {
          const topPlayers = players
            .map((player) => {
              const passesTentados = player.estatisticas?.passe?.passes_tentados || 0;
              const passesCompletos = player.estatisticas?.passe?.passes_completos || 0;
              const jardasTotais = player.estatisticas?.passe?.jardas_de_passe || 0;

              const passesPercentual = passesTentados > 0
                ? ((passesCompletos / passesTentados) * 100).toFixed(0)
                : "0";

              const jardasMedia = passesTentados > 0
                ? (jardasTotais / passesTentados).toFixed(1)
                : "0.0";

              return {
                ...player,
                passesPercentual,
                jardasMedia,
              };
            })
            .filter((player) => {
              if (stat.key === "passes_percentual") return player.passesPercentual;
              if (stat.key === "jardas_media") return player.jardasMedia;
              return stat.key in player.estatisticas?.passe;
            })
            .sort((a, b) => {
              const aValue =
                stat.key === "passes_percentual"
                  ? parseFloat(a.passesPercentual)
                  : stat.key === "jardas_media"
                    ? parseFloat(a.jardasMedia)
                    //@ts-ignore
                    : a.estatisticas?.passe?.[stat.key as PasseKeys] ?? 0;

              const bValue =
                stat.key === "passes_percentual"
                  ? parseFloat(b.passesPercentual)
                  : stat.key === "jardas_media"
                    ? parseFloat(b.jardasMedia)
                    //@ts-ignore
                    : b.estatisticas?.passe?.[stat.key as PasseKeys] ?? 0;

              return bValue - aValue;
            })
            .slice(0, 5);

          return (
            <div key={index}>
              <RankingCard
                title={stat.title}
                players={topPlayers.map((player, playerIndex) => {
                  const teamInfo = getTeamInfo(player.timeId);
                  const shirtPath =
                    teamInfo.nome !== "time-desconhecido"
                      ? `/assets/times/camisas/${normalizeForFilePath(
                        teamInfo.nome
                      )}/camisa-${normalizeForFilePath(teamInfo.nome)}-${player.numero}.png`
                      : "/assets/times/camisas/default-shirt.png";

                  return {
                    name: player.nome,
                    team: teamInfo.nome,
                    value:
                      stat.key === "passes_percentual"
                        ? player.passesPercentual + "%"
                        : stat.key === "jardas_media"
                          ? player.jardasMedia //@ts-ignore
                          : player.estatisticas?.passe?.[stat.key as PasseKeys] ?? 0,
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
