"use client";

import { useParams } from 'next/navigation'
import { BFA } from '../../data/bfa'
import { Brasileirao } from '../../data/brasileirao'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { ButtonTime } from '@/components/ui/buttonTime';

export default function Page() {

    const params = useParams()
    const time = Array.isArray(params.time) ? params.time[0] : params.time

    // Encontra o time em BFA
    const timeBFA = BFA.find(t => t.nome.toLowerCase() === decodeURIComponent(time).toLowerCase())

    // Encontra o time em Brasileirao
    const timeDataBrasileirao = Brasileirao.find(t => t.nome.toLowerCase() === decodeURIComponent(time).toLowerCase())

    // Usa os dados do time encontrado
    const currentTeam = timeBFA || timeDataBrasileirao

    // Se currentTeam for undefined, exibe "Time não encontrado"
    if (!currentTeam) {
        return <div>Time não encontrado</div>
    }

    const logoPath = currentTeam.brasileirao ? `/assets/brasileirao/logos-brasileirao/${currentTeam.logo}` : `/assets/bfa/logos-bfa/${currentTeam.logo}`
    const capacetePath = currentTeam.brasileirao ? `/assets/brasileirao/capacetes-brasileirao/${currentTeam.capacete}` : `/assets/bfa/capacetes-bfa/${currentTeam.capacete}`

    return (
        <div>
            <div className='fixed w-full'>
                <div className='p-4 w-full h-[450px] flex flex-col justify-center items-center rounded-b-xl' style={{ backgroundColor: currentTeam.cor }}>
                    <Link href={'/'} className='absolute top-10 left-5 rounded-lg text-xs text-white p-1 bg-black/20'>{currentTeam.sigla} <FontAwesomeIcon icon={faAngleDown} /></Link>
                    <div className='flex flex-col justify-center items-center mt-20'>
                        <div className='text-[48px] w-48 text-white text-center px-2 font-extrabold italic leading-[35px] tracking-[-3px]'>{currentTeam.nome.toLocaleUpperCase()}</div>
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
                        <ButtonTime label='TIME' />
                        <ButtonTime label='JOGADORES' />
                    </div>
                </div>
                <section className='flex bg-white justify-between items-center px-3 text-3xl h-20 font-extrabold italic leading-[35px] tracking-[-2px]'>
                    <div>ATAQUE</div>
                    <div>DEFESA</div>
                    <div>SPECIAL</div>
                </section>
                <div>
                    <div className='py-1 px-4 flex justify-between items-center text-xs text-white' style={{ backgroundColor: currentTeam.cor }}>
                        <div className='w-5'>#</div>
                        <div className='w-[175px]'>Nome</div>
                        <div className='w-12 flex justify-center items-center'>Posição</div>
                        <div className='w-12 flex justify-center items-center'>Idade</div>
                        <div className='w-12 flex justify-center items-center'>Altura</div>
                        <div className='w-12 flex justify-center items-center'>Peso</div>
                    </div>
                </div>
            </div>
            <div className='pt-[553px]'>
                {currentTeam.jogadores?.map(jogador => (
                    <Link href={`/${time}/${jogador.id}`} key={jogador.id} className='flex justify-between items-center px-3 py-1 border-b text-sm'>
                        <div className='w-5'>{jogador.numero}</div>
                        <div className='w-[160px] pl-2'>{jogador.nome}</div>
                        <div className='w-12 flex justify-center items-center'>{jogador.posicao}</div>
                        <div className='w-12 flex justify-center items-center'>{jogador.idade}</div>
                        <div className='w-12 flex justify-center items-center'>{jogador.altura}</div>
                        <div className='w-12 flex justify-center items-center'>{jogador.peso}</div>
                    </Link>
                ))}
            </div>

        </div>
    );
}
