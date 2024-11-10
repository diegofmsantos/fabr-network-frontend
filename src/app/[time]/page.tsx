"use client"

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Times } from '../../data/times'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { ButtonTime } from '@/components/ui/buttonTime'
import { useEffect, useState } from 'react'
import { ButtonSetor } from '@/components/ui/buttonSetor'
import { Jogador } from '@/components/Jogador'
import { Time } from '@/components/Time'

type Setor = "ATAQUE" | "DEFESA" | "SPECIAL"

export default function Page() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const time = Array.isArray(params.time) ? params.time[0] : params.time
    const currentTeam = Times.find(t => t.nome.toLowerCase() === decodeURIComponent(time).toLowerCase())

    if (!currentTeam) {
        return <div>Time não encontrado</div>
    }

    const capacetePath = `/assets/times/capacetes/${currentTeam.capacete}`

    const [selectedButton, setSelectedButton] = useState(searchParams.get("show") || "time")
    const [selectedSetor, setSelectedSetor] = useState<Setor>(searchParams.get("setor") as Setor || "ATAQUE")

    useEffect(() => {
        setSelectedButton(searchParams.get("show") || "time")
        setSelectedSetor((searchParams.get("setor") as Setor) || "ATAQUE")
    }, [searchParams]);

    const handleShowTime = () => {
        router.replace(`?show=time`)
        setSelectedButton("time")
    }

    const handleShowJogadores = () => {
        router.replace(`?show=jogadores&setor=${selectedSetor}`)
        setSelectedButton("jogadores")
    }

    const handleSetorChange = (setor: Setor) => {
        setSelectedSetor(setor)
        router.replace(`?show=jogadores&setor=${setor}`)
    }

    return (
        <div>
            <div className='w-full fixed'>
                <div className='p-4 w-full h-[410px] flex flex-col justify-center items-center rounded-b-xl' style={{ backgroundColor: currentTeam.cor }}>
                    <Link
                        href={'/'}
                        className='absolute top-10 left-5 rounded-xl text-xs text-white py-1 px-2 bg-black/20'>
                        {currentTeam.sigla}
                        <FontAwesomeIcon icon={faAngleDown} className='ml-1' />
                    </Link>
                    <div className='flex flex-col justify-center items-center mt-10'>
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
                    <div className='flex justify-between gap-8 -mt-3'>
                        <ButtonTime label='TIME' onClick={handleShowTime} isSelected={selectedButton === "time"} />
                        <ButtonTime label='JOGADORES' onClick={handleShowJogadores} isSelected={selectedButton === "jogadores"} />
                    </div>
                </div>
            </div>

            {selectedButton === "jogadores" && (
                <div className="pt-[410px] xl:max-w-[1100px] xl:min-w-[1100px] xl:m-auto xl:mb-8">
                    <div className="fixed ">
                        <section className="flex justify-between gap-5 py-5 px-4 bg-white">
                            <ButtonSetor
                                label="ATAQUE"
                                borderColor={currentTeam.cor}
                                isSelected={selectedSetor === "ATAQUE"}
                                onClick={() => handleSetorChange("ATAQUE")}
                            />
                            <ButtonSetor
                                label="DEFESA"
                                borderColor={currentTeam.cor}
                                isSelected={selectedSetor === "DEFESA"}
                                onClick={() => handleSetorChange("DEFESA")}
                            />
                            <ButtonSetor
                                label="SPECIAL"
                                borderColor={currentTeam.cor}
                                isSelected={selectedSetor === "SPECIAL"}
                                onClick={() => handleSetorChange("SPECIAL")}
                            />
                        </section>
                    </div>
                    <div className="mt-[60px] xl:mt-[123px] xl:border">
                        <Jogador currentTeam={currentTeam} selectedSetor={selectedSetor} />
                    </div>
                </div>
            )}

            {selectedButton === "time" && (
                <div className='pt-[410px]'>
                    <Time currentTeam={currentTeam} />
                </div>
            )}
        </div>
    )
}
