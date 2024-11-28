"use client";

import dynamic from "next/dynamic";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Jogador } from "@/types/jogador";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { getTimes } from "@/api/api";
import { Time } from "../types/time";
import { RankingCard } from "./RankingCard";

// Swiper components
const Swiper = dynamic(() => import("swiper/react").then((mod) => mod.Swiper), {
  ssr: false,
});
const SwiperSlide = dynamic(
  () => import("swiper/react").then((mod) => mod.SwiperSlide),
  { ssr: false }
);

export type PasseKeys = keyof Jogador["estatisticas"]["passe"];

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
      console.log("Times carregados:", timesData);
      setTimes(timesData);
    };
    fetchTimes();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-4xl font-bold mb-4">{title}</h2>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        direction="horizontal"
        modules={[Navigation, Pagination]}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {stats.map((stat, index) => {
          const topPlayers = players
            .filter(
              (player) =>
                player.estatisticas &&
                player.estatisticas.passe &&
                stat.key in player.estatisticas.passe
            )
            .sort((a, b) => {
              const aValue = a.estatisticas?.passe?.[stat.key as PasseKeys] ?? 0;
              const bValue = b.estatisticas?.passe?.[stat.key as PasseKeys] ?? 0;
              return bValue - aValue;
            })
            .slice(0, 5);

          return (
            <SwiperSlide key={index}>
              <RankingCard
                title={stat.title}
                players={topPlayers.map((player, playerIndex) => {
                  const team = times.find((time) => time.id === player.timeId);

                  // Mantenha os nomes de time diretos para camisas
                  const camisaPath = team?.nome
                    ? `/assets/times/camisas/${team.nome}/${player.camisa}`
                    : "/default-shirt.png";

                  // Corrige as logos para lidar com espaços e caracteres especiais
                  const teamNameForLogo = team?.nome
                    ? team.nome.replace(/\s+/g, "-").replace(/[^\w-]/g, "")
                    : "default";
                  const teamLogoPath = `/assets/times/logos/${teamNameForLogo}.png`;

                  console.log(`Jogador: ${player.nome}`);
                  console.log(`Time: ${team?.nome || "Desconhecido"}`);
                  console.log(`Caminho da camisa: ${camisaPath}`);
                  console.log(`Caminho do logo: ${teamLogoPath}`);

                  return {
                    name: player.nome,
                    team: team?.nome || "Time Desconhecido",
                    value: player.estatisticas?.passe?.[stat.key as PasseKeys] ?? 0,
                    camisa: camisaPath,
                    teamColor: playerIndex === 0 ? team?.cor || "#CCCCCC" : undefined,
                    teamLogo: teamLogoPath,
                    isFirst: playerIndex === 0,
                  };
                })}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default RankingGroup;
