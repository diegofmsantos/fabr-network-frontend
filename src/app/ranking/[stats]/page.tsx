"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Jogador } from "@/types/jogador";
import { getTimes, getJogadores } from "@/api/api";
import { Time } from "@/types/time";
import NoStats from "@/components/ui/NoStats";
import { Loading } from "@/components/ui/Loading";
import { getStatKeyPath } from "@/utils/statMap";

const getNestedStatValue = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
};

const FullRankingList = () => {
  const searchParams = useSearchParams();
  const urlStat = searchParams.get("stat") || '';
  const [players, setPlayers] = useState<Jogador[]>([]);
  const [times, setTimes] = useState<Time[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!urlStat) {
        console.log("Estatística não fornecida na URL.");
        setIsLoading(false);
        return;
      }

      const statKeyPath = getStatKeyPath(urlStat);
      if (!statKeyPath) {
        console.error(`Estatística não mapeada: ${urlStat}`);
        setError(`Estatística não mapeada: ${urlStat}`);
        setIsLoading(false);
        return;
      }


      try {
        const [timesData, jogadoresData] = await Promise.all([
          getTimes(),
          getJogadores(),
        ]);

        console.log("Dados dos times:", timesData);
        console.log("Dados dos jogadores:", jogadoresData);

        const filteredPlayers = jogadoresData
          .filter((jogador) => {
            const valor = getNestedStatValue(jogador.estatisticas, statKeyPath);
            return valor !== undefined && !isNaN(Number(valor)) && Number(valor) > 0;
          })
          .sort((a, b) => {
            const valorA = Number(getNestedStatValue(a.estatisticas, statKeyPath)) || 0;
            const valorB = Number(getNestedStatValue(b.estatisticas, statKeyPath)) || 0;
            return valorB - valorA;
          });

        console.log("Jogadores filtrados e ordenados:", filteredPlayers);

        setPlayers(filteredPlayers);
        setTimes(timesData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar os dados. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [urlStat]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center mt-4 text-red-600 p-4 bg-red-50 rounded-lg">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Tentar novamente
        </button>
      </div>
    );
  }

  if (players.length === 0) {
    return <NoStats />;
  }

  return (
    <div className="pt-20 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        {`Ranking - ${urlStat.replace(/_/g, " ")}`}
      </h1>
      <ul className="bg-white shadow-lg rounded-md p-6 space-y-4">
        {players.map((player, index) => {
          const time = times.find((t) => String(t.id) === String(player.timeFormador));
          const valor = getNestedStatValue(player.estatisticas, getStatKeyPath(urlStat)!) || "N/A";
          console.log(`Jogador: ${player.nome}, Valor da estatística: ${valor}`);

          return (
            <li
              key={player.id}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-bold text-xl min-w-[2rem]">{index + 1}.</span>
                <div>
                  <div className="font-bold text-lg">{player.nome}</div>
                  <div className="text-sm text-gray-600">{time?.nome || player.timeFormador}</div>
                </div>
              </div>
              <span className="font-bold text-2xl">{valor}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FullRankingList;
