import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamCardProps {
    id: number;
    name: string;
    value: string;
    teamColor?: string;
    isFirst?: boolean;
}

interface TeamRankingCardProps {
    title: string;
    category: string;
    teams: TeamCardProps[];
}

export const TeamRankingCard: React.FC<TeamRankingCardProps> = ({ title, category, teams }) => {
    const normalizeForFilePath = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9-]/g, "");
    };

    return (
        <div className="ranking-card-container px-3">
            <h3 className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">{title}</h3>
            <ul className="flex flex-col text-white h-full">
                {teams.map((team, index) => {
                    const teamLogoPath = `/assets/times/logos/${normalizeForFilePath(team.name)}.png`;
                    const capacetePath = `/assets/times/capacetes/capacete-${normalizeForFilePath(team.name)}.png`;

                    return (
                        <li
                            key={index}
                            className={`flex items-center justify-center p-2  px-4 border-b border-b-[#D9D9D9] rounded-md 
                                ${team.isFirst ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"}`}
                            style={{
                                backgroundColor: team.isFirst ? team.teamColor : undefined,
                            }}
                        >
                            <Link
                                href={`/${normalizeForFilePath(team.name)}`}
                                className="w-full"
                            >
                                {team.isFirst ? (
                                    <div className="flex justify-around items-center w-full text-white">
                                        <div className="flex flex-col justify-between">
                                            <p className="text-[25px] font-bold">{index + 1}</p>
                                            <div className='flex flex-col gap-2'>
                                                <h4 className="font-extrabold italic text-xl">{team.name}</h4>
                                                <span className="font-extrabold italic text-4xl">{!isNaN(Number(team.value))
                                                    ? Number(team.value).toLocaleString('pt-BR')
                                                    : team.value}</span>
                                            </div>
                                        </div>
                                        <div className="w-[150px] h-[150px] flex justify-center items-center">
                                            <Image
                                                src={capacetePath}
                                                alt={`Capacete do ${team.name}`}
                                                width={150}
                                                height={150}
                                                priority
                                                quality={100}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-auto flex justify-between items-center gap-2 px-2">
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-[14px]">{index + 1}</span>
                                            <Image
                                                src={teamLogoPath}
                                                width={40}
                                                height={40}
                                                alt={`Logo do time ${team.name}`}
                                            />
                                            <div className="text-xs">{team.name}</div>
                                        </div>
                                        <span className="font-bold text-lg">{!isNaN(Number(team.value))
                                            ? Number(team.value).toLocaleString('pt-BR')
                                            : team.value}</span>
                                    </div>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <Link
                href={`/ranking/times/stats?stat=${normalizeForFilePath(category)}-${normalizeForFilePath(title)}`}
                className="block text-center border border-gray-400 bg-white text-[17px] text-black font-bold py-1 mt-4 rounded-md hover:bg-[#C1C2C3]"
            >
                Ver Mais
            </Link>
        </div>
    );
};