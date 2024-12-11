import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Router } from 'next/router';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

interface PlayerStats {
  player: any;
  teamInfo: {
    nome: string;
    cor: string;
  };
  value: string | number;
  index: number;
}

interface StatsTierProps {
  title: string;
  players: PlayerStats[];
  backgroundColor?: string;
}

const StatsTier: React.FC<StatsTierProps> = ({ title, players, backgroundColor = 'bg-black' }) => {
  const router = useRouter()
  const normalizeForFilePath = (input: string): string =>
    input.toLowerCase()
      .replace(/\s+/g, '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '');

  const getShirtPath = (team: string, camisa: string): string => {
    const normalizedTeam = normalizeForFilePath(team);
    return team && team !== "time-desconhecido" && camisa
      ? `/assets/times/camisas/${normalizedTeam}/${camisa}`
      : "/assets/times/camisas/camisa-default.png";
  };

  if (players.length === 0) {
    return (
      <div className="mb-8">
        <div className={`inline-block text-sm font-bold mb-2 ${backgroundColor} text-white p-2 rounded-xl`}>
          {title}
        </div>
        <div className="bg-white p-4 rounded-md text-center text-gray-500">
          Nenhum jogador encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <button
        onClick={() => router.back()}
        className='fixed top-8 left-5 rounded-full text-xs text-white p-2 w-8 h-8 flex justify-center items-center bg-gray-200/20 z-50'>
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>
      <div className={`inline-block text-sm font-bold mb-2 ${backgroundColor} text-white p-2 rounded-xl`}>
        {title}
      </div>
      <ul className="flex flex-col text-white h-full">
        {players.map(({ player, teamInfo, value, index }) => {
          const teamLogoPath = `/assets/times/logos/${normalizeForFilePath(teamInfo.nome)}.png`;
          const globalIndex = index + 1;

          return (
            <li
              key={player.id}
              className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md ${index === 0 ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"
                }`}
              style={{
                backgroundColor: index === 0 ? teamInfo.cor : undefined,
              }}
            >
              <Link
                href={`/${normalizeForFilePath(teamInfo.nome)}/${player.id}`}
                className="w-full"
              >
                {index === 0 ? (
                  <div className="flex justify-between items-center w-full text-white">
                    <div className="flex flex-col justify-center">
                      <p className="text-[15px] font-bold">{globalIndex}</p>
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
                        <div>{globalIndex}</div>
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
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StatsTier;