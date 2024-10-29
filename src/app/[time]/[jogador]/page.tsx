"use client";

import { useParams, useRouter } from 'next/navigation'
import { BFA } from '../../../data/bfa'
import { Brasileirao } from '../../../data/brasileirao'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { Player } from '../../../types/player'
import { Team } from '../../../types/team'
import Link from 'next/link'

// Função para buscar o jogador por ID
const findJogador = (times: Team[], jogadorId: number): { jogador: Player, time: Team } | null => {
    for (let time of times) {
        if (time && Array.isArray(time.jogadores)) {
            const jogador = time.jogadores.find((j: Player) => j.id === jogadorId)
            if (jogador) {
                return { jogador, time }
            }
        }
    }
    return null
}

export default function JogadorPage() {
    const params = useParams()
    const router = useRouter(); // Hook para navegação
    const jogadorId = Array.isArray(params.jogador) ? parseInt(params.jogador[0], 10) : parseInt(params.jogador, 10)

    // Busca o jogador no BFA e no Brasileirao
    const jogadorBFA = findJogador(BFA, jogadorId)
    const jogadorBrasileirao = findJogador(Brasileirao, jogadorId)

    // Se encontrou o jogador no BFA ou Brasileirao, usa os dados
    const currentPlayer = jogadorBFA?.jogador || jogadorBrasileirao?.jogador
    const currentTeam = jogadorBFA?.time || jogadorBrasileirao?.time

    // Se não encontrar, exibe mensagem de erro
    if (!currentPlayer) {
        return <div>Jogador não encontrado</div>
    }

    const logopath = currentTeam?.brasileirao ? `/assets/brasileirao/logos-brasileirao/${currentTeam.logo}` : `/assets/bfa/logos-bfa/${currentTeam?.logo}`
    const camisasPath = currentTeam?.brasileirao ? `/assets/brasileirao/camisas-brasileirao/${currentPlayer.camisa}` : `/assets/bfa/camisas-bfa/${currentPlayer.camisa}`

    return (
        <div>
            <div className='px-6 w-full h-[375px] flex flex-col justify-center items-center rounded-b-xl' style={{ backgroundColor: currentTeam?.cor }}>
                <button
                    onClick={() => router.back()} // Volta para a página anterior
                    className='absolute top-10 left-5 rounded-full text-xs text-white p-2 w-8 h-8 flex justify-center items-center bg-black/20'>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <div className='flex justify-center items-end'>
                    <div className='flex flex-col justify-around items-start'>
                        <div className='text-[34px] text-white px-2 font-extrabold italic leading-[45px] tracking-[-3px]'>
                            {currentPlayer.nome}
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='text-[34px] text-white text-center px-2 font-extrabold italic tracking-[-3px]'>
                                {currentPlayer.posicao}
                            </div>
                            <div>
                                <Image src={'/assets/brasil.png'} alt='logo-bandeira' width={40} height={40} quality={100} />
                            </div>
                        </div>
                        <div className='-mt-5'>
                            <Image src={logopath} alt='logo' width={100} height={100} quality={70} />
                        </div>
                    </div>
                    <div className='w-60 h-60'>
                        <Image
                            src={camisasPath}
                            alt={`${currentTeam?.nome} camisa`}
                            width={230}
                            height={230}
                            quality={100}
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-around my-7'>
                <button
                    className='w-36 h-10 flex flex-col justify-center items-center text-md font-bold rounded-md text-white' style={{ backgroundColor: currentTeam?.cor }}
                >BIO
                </button>
                <button
                    className='w-36 h-10 flex flex-col justify-center items-center text-md font-bold rounded-md text-white' style={{ backgroundColor: currentTeam?.cor }}
                >ESTATÍSTICAS
                </button>
            </div>
            <div className="p-4">
                <h2 className="text-xl font-bold">Dados do Jogador</h2>
                <p>Posição: {currentPlayer.posicao}</p>
                <p>Idade: {currentPlayer.idade}</p>
                <p>Altura: {currentPlayer.altura}</p>
                <p>Peso: {currentPlayer.peso} kg</p>
                <p>Cidade: {currentPlayer.cidade}</p>
                <p>Nacionalidade: {currentPlayer.nacionalidade}</p>

                <h3 className="text-lg font-bold mt-4">Estatísticas</h3>
                {currentPlayer.estatisticas?.map((estatistica, index) => (
                    <div key={index}>
                        {Object.entries(estatistica).map(([key, value]) => (
                            <p key={key}>{`${key.replace('_', ' ')}: ${value}`}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
