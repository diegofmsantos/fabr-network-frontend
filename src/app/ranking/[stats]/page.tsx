// app/ranking/stats/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Jogador } from '@/types/jogador';
import { Time } from '@/types/time';
import { getJogadores, getTimes } from '@/api/api';
import { Loading } from '@/components/ui/Loading';
import {
  getStatMapping,
  calculateStatValue,
  formatStatValue,
  compareStatValues
} from '@/utils/statMappings';

export default function StatsPage() {
  const searchParams = useSearchParams();
  const statParam = searchParams.get('stat');
  console.log(statParam)
  
  const [players, setPlayers] = useState<Jogador[]>([]);
  const [times, setTimes] = useState<Time[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, timesData] = await Promise.all([
          getJogadores(),
          getTimes()
        ]);
        setPlayers(playersData);
        setTimes(timesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const normalizeForFilePath = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '');
  };

  const getTeamInfo = (timeId: number) => {
    const team = times.find((t) => t.id === timeId);
    return {
      nome: team?.nome || 'time-desconhecido',
      cor: team?.cor || '#CCCCCC',
    };
  };

  const getShirtPath = (team: string, camisa: string): string => {
    const normalizedTeam = normalizeForFilePath(team);
    return team && team !== "time-desconhecido" && camisa
      ? `/assets/times/camisas/${normalizedTeam}/${camisa}`
      : "/assets/times/camisas/camisa-default.png";
  };

  if (loading) {
    return <Loading />;
  }

  const statMapping = getStatMapping(statParam);
  
  const filteredAndSortedPlayers = players
    .filter(player => {
      const value = calculateStatValue(player, statMapping);
      return value !== null && value > 0;
    })
    .sort((a, b) => {
      const aValue = calculateStatValue(a, statMapping);
      const bValue = calculateStatValue(b, statMapping);
      return compareStatValues(aValue, bValue);
    });

  return (
    <div className="bg-[#ECECEC] min-h-screen py-24 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="ranking-card-container px-3">
          <h3 className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
            {statMapping.title}
          </h3>
          <ul className="flex flex-col text-white h-full">
            {filteredAndSortedPlayers.map((player, index) => {
              const teamInfo = getTeamInfo(player.timeId);
              const teamLogoPath = `/assets/times/logos/${normalizeForFilePath(teamInfo.nome)}.png`;
              const value = formatStatValue(calculateStatValue(player, statMapping), statMapping);

              return (
                <li
                  key={player.id}
                  className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md ${
                    index === 0 ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"
                  }`}
                  style={{
                    backgroundColor: index === 0 ? teamInfo.cor : undefined,
                  }}
                >
                  {index === 0 ? (
                    <div className="flex justify-between items-center w-full text-white">
                      <div className="flex flex-col justify-center">
                        <p className="text-[15px] font-bold">{index + 1}</p>
                        <h4 className="font-bold flex flex-col leading-tight">
                          <span className="text-[12px]">{player.nome.split(" ")[0]}</span>
                          <span className="text-2xl">{player.nome.split(" ").slice(1).join(" ")}</span>
                        </h4>
                        <div className="flex items-center gap-1 min-w-32">
                          <Image
                            src={teamLogoPath}
                            width={40}
                            height={40}
                            alt={`Logo do time ${teamInfo.nome}`}
                            className="w-auto h-auto"
                          />
                          <p className="text-[10px]">{teamInfo.nome}</p>
                        </div>
                        <span className="font-bold text-[40px]">{value}</span>
                      </div>
                      <Image
                        src={getShirtPath(teamInfo.nome, player.camisa)}
                        width={100}
                        height={100}
                        alt={`Camisa`}
                        className="w-auto h-auto"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-full h-auto flex justify-between items-center gap-2">
                      <div className="flex items-center">
                        <span className="font-bold flex items-center gap-2">
                          <div>{index + 1}</div>
                          <Image
                            src={teamLogoPath}
                            width={40}
                            height={40}
                            alt={`Logo do time ${teamInfo.nome}`}
                            className="w-auto h-auto"
                          />
                        </span>
                        <div className="flex flex-col">
                          <div className="font-bold text-[14px]">{player.nome}</div>
                          <div className="font-light text-[14px]">{teamInfo.nome}</div>
                        </div>
                      </div>
                      <span className="font-bold text-lg">{value}</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}