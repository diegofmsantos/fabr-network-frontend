"use client";

import { useParams } from 'next/navigation'
import { BFA } from '../../data/bfa'
import { Brasileirao } from '../../data/brasileirao'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';

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

    const logoPath = currentTeam.brasileirao ? `/assets/brasileirao/${currentTeam.logo}` : `/assets/bfa/${currentTeam.logo}`

    return (
        <div>
            <header className="w-full h-32 bg-[#17181C] flex flex-col justify-center items-center gap-4">
                <Image src={`/assets/logo-fabr-color.png`} width={100} height={100} alt="logo" />
                <div className="flex justify-center items-center gap-4 mb-2">
                    <button className='flex justify-center items-center gap-2 border p-2 bg-white w-20 h-6 font-bold text-xs rounded-lg'>
                        <FontAwesomeIcon icon={faAngleLeft} />
                        Times
                    </button>
                </div>
            </header>
            <div className='p-2 bg-blue-700 h-32 flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <div>
                        <Image
                            src={logoPath}
                            alt={`${currentTeam.nome} logo`}
                            width={50}
                            height={50} />
                    </div>
                    <h1 className='text-white font-bold text-2xl'>{currentTeam.nome}</h1>
                </div>
                <div className='flex gap-5 pl-8'>
                    <button className='flex justify-center items-center gap-2 border p-2 bg-white w-20 h-6 font-bold text-xs rounded-lg'>Bio</button>
                    <button className='flex justify-center items-center gap-2 border p-2 bg-white w-20 h-6 font-bold text-xs rounded-lg'>Roster</button>
                    <button className='flex justify-center items-center gap-2 border p-2 bg-white w-20 h-6 font-bold text-xs rounded-lg'>Stats</button>
                </div>
            </div>
            <div>
                <div className='py-1 px-4 mt-1 flex justify-between items-center text-xs bg-[#17181C] text-green-600'>
                    <div className='w-5'>#</div>
                    <div className='w-[175px]'>Nome</div>
                    <div className='w-12 flex justify-center items-center'>Posição</div>
                    <div className='w-12 flex justify-center items-center'>Idade</div>
                    <div className='w-12 flex justify-center items-center'>Altura</div>
                    <div className='w-12 flex justify-center items-center'>Peso</div>
                </div>
                <div>
                    {currentTeam.jogadores?.map(jogador => (
                        <Link href={`/${time}/${jogador.id}`} key={jogador.id} className='flex justify-between items-center px-3 py-1 border-b text-sm'>
                            <div className='w-5'>{jogador.numero}</div>
                            <div className='w-[150px] pl-2'>{jogador.nome}</div>
                            <div className='w-12 flex justify-center items-center'>{jogador.posicao}</div>
                            <div className='w-12 flex justify-center items-center'>{jogador.idade}</div>
                            <div className='w-12 flex justify-center items-center'>{jogador.altura}</div>
                            <div className='w-12 flex justify-center items-center'>{jogador.peso}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
