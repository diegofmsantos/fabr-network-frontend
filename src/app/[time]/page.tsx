"use client";

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { BFA } from '../../data/bfa';
import { Brasileirao } from '../../data/brasileirao';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { ButtonTime } from '@/components/ui/buttonTime';
import { useEffect, useState } from 'react';
import { ButtonSetor } from '@/components/ui/buttonSetor';
import { Jogador } from '@/components/Jogador';
import { Time } from '@/components/Time';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const time = Array.isArray(params.time) ? params.time[0] : params.time;
    const timeBFA = BFA.find(t => t.nome.toLowerCase() === decodeURIComponent(time).toLowerCase());
    const timeDataBrasileirao = Brasileirao.find(t => t.nome.toLowerCase() === decodeURIComponent(time).toLowerCase());
    const currentTeam = timeBFA || timeDataBrasileirao;

    if (!currentTeam) {
        return <div>Time não encontrado</div>;
    }

    const capacetePath = currentTeam.brasileirao
        ? `/assets/brasileirao/capacetes-brasileirao/${currentTeam.capacete}`
        : `/assets/bfa/capacetes-bfa/${currentTeam.capacete}`;

    const [selectedButton, setSelectedButton] = useState(searchParams.get("show") || "time");
    const [selectedSetor, setSelectedSetor] = useState("ATAQUE");

    useEffect(() => {
        setSelectedButton(searchParams.get("show") || "time");
    }, [searchParams]);

    const handleShowTime = () => {
        router.replace(`?show=time`);
        setSelectedButton("time");
    };

    const handleShowJogadores = () => {
        router.replace(`?show=jogadores`);
        setSelectedButton("jogadores");
    };

    return (
        <div>
            <div className='w-full fixed'>
                <div className='p-4 w-full h-[400px] flex flex-col justify-center items-center rounded-b-xl' style={{ backgroundColor: currentTeam.cor }}>
                    <Link
                        href={'/'}
                        className='absolute top-10 left-5 rounded-xl text-xs text-white py-1 px-2 bg-black/20'>
                        {currentTeam.sigla}
                        <FontAwesomeIcon icon={faAngleDown} className='ml-1' />
                    </Link>
                    <div className='flex flex-col justify-center items-center mt-20'>
                        <div className='text-[48px] text-white text-center px-2 font-extrabold italic leading-[35px] tracking-[-3px]'>{currentTeam.nome.toLocaleUpperCase()}</div>
                        <div className='w-48 h-48 rotate-[15deg]'>
                            <Image
                                src={capacetePath}
                                alt={`${currentTeam.nome} capacete`}
                                width={180}
                                height={180}
                                quality={100}
                            />
                        </div>
                    </div>
                    <div className='flex justify-between gap-8'>
                        <ButtonTime label='TIME' onClick={handleShowTime} isSelected={selectedButton === "time"} />
                        <ButtonTime label='JOGADORES' onClick={handleShowJogadores} isSelected={selectedButton === "jogadores"} />
                    </div>
                </div>
            </div>

            {selectedButton === "jogadores" && (
                <div className="pt-[400px] xl:max-w-[1100px] xl:min-w-[1100px] xl:m-auto xl:mb-8">
                    <div className="fixed">
                        <section className="flex py-5 px-3 bg-white justify-between items-center">
                            <ButtonSetor
                                label="ATAQUE"
                                borderColor={currentTeam.cor}
                                isSelected={selectedSetor === "ATAQUE"}
                                onClick={() => setSelectedSetor("ATAQUE")}
                            />
                            <ButtonSetor
                                label="DEFESA"
                                borderColor={currentTeam.cor}
                                isSelected={selectedSetor === "DEFESA"}
                                onClick={() => setSelectedSetor("DEFESA")}
                            />
                            <ButtonSetor
                                label="SPECIAL"
                                borderColor={currentTeam.cor}
                                isSelected={selectedSetor === "SPECIAL"}
                                onClick={() => setSelectedSetor("SPECIAL")}
                            />
                        </section>

                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div
                                className="w-screen py-1 px-4 flex justify-between items-center text-xs text-white md:text-[14px] md:h-7 xl:h-10 xl:text-lg xl:max-w-[1100px] xl:min-w-[1100px] xl:m-auto"
                                style={{ backgroundColor: currentTeam.cor }}
                            >
                                <div className="w-5">#</div>
                                <div className="w-[175px]">Nome</div>
                                <div className="w-12 flex justify-center items-center">Posição</div>
                                <div className="w-12 flex justify-center items-center">Idade</div>
                                <div className="w-12 flex justify-center items-center">Altura</div>
                                <div className="w-12 flex justify-center items-center">Peso</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[104px] xl:mt-[123px] xl:border">
                        <Jogador currentTeam={currentTeam} selectedSetor={selectedSetor} />
                    </div>
                </div>
            )}

            {selectedButton === "time" && (
                <div className='pt-[405px]'>
                    <Time currentTeam={currentTeam} />
                </div>
            )}
        </div>
    );
}
