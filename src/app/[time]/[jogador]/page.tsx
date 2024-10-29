"use client";

import { useParams, useRouter } from 'next/navigation'
import { BFA } from '../../../data/bfa'
import { Brasileirao } from '../../../data/brasileirao'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { Player } from '../../../types/player'
import { Team } from '../../../types/team'

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
    const router = useRouter()
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
                <div className='text-white font-bold text-xs mb-4'>{currentTeam?.nome}</div>
                <div className='flex justify-center items-end'>
                    <div className='flex flex-col items-start'>
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
            <div className='p-4 flex flex-col gap-8'>
                <div>
                    <div className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                        style={{ backgroundColor: currentTeam?.cor }}>BIO</div>
                    <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                        <div className="border-b border-black/40 flex justify-start gap-28">
                            <div>
                                <div className="text-sm">PESO</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.peso}</div>
                            </div>
                            <div>
                                <div className="text-sm">ALTURA</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.altura}</div>
                            </div>
                        </div>
                        <div className="border-b border-black/40 flex justify-start gap-28">
                            <div>
                                <div className="text-sm">IDADE</div>
                                <div className="text-lg font-extrabold italic mb-1">{currentPlayer.idade}</div>
                            </div>
                            <div>
                                <div className="text-sm">CIDADE</div>
                                <div className="text-lg font-extrabold italic mb-1">{currentPlayer?.cidade}</div>
                            </div>
                        </div>
                        <div className='flex justify-start gap-20'>
                            <div>
                                <div className="text-sm">EXPERIÊNCIA</div>
                                <div className="text-xl font-extrabold italic">{currentPlayer?.experiencia} ANOS</div>
                            </div>
                            <div>
                                <div className="text-sm">TIME FORMADOR</div>
                                <div className='flex gap-2 items-center'>
                                    <div className="text-lg font-extrabold italic">{currentTeam?.nome}</div>
                                    <Image src={logopath} width={30} height={30} quality={100} alt='logo' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="border py-2 px-3 font-extrabold text-white text-xs w-32 flex justify-center items-center rounded-md mb-3"
                        style={{ backgroundColor: currentTeam?.cor }}>ESTATÍSTICAS</div>
                    <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                        <div className="border-b border-black/40 flex justify-start gap-28">
                            <div>
                                <div className="text-sm">PESO</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.peso}</div>
                            </div>
                            <div>
                                <div className="text-sm">ALTURA</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.altura}</div>
                            </div>
                        </div>
                        <div className="border-b border-black/40 flex justify-start gap-28">
                            <div>
                                <div className="text-sm">IDADE</div>
                                <div className="text-lg font-extrabold italic mb-1">{currentPlayer.idade}</div>
                            </div>
                            <div>
                                <div className="text-sm">CIDADE</div>
                                <div className="text-lg font-extrabold italic mb-1">{currentPlayer?.cidade}</div>
                            </div>
                        </div>
                        <div className='flex justify-start gap-20'>
                            <div>
                                <div className="text-sm">EXPERIÊNCIA</div>
                                <div className="text-xl font-extrabold italic">{currentPlayer?.experiencia} ANOS</div>
                            </div>
                            <div>
                                <div className="text-sm">TIME FORMADOR</div>
                                <div className='flex gap-2 items-center'>
                                    <div className="text-lg font-extrabold italic">{currentTeam?.nome}</div>
                                    <Image src={logopath} width={30} height={30} quality={100} alt='logo' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="border py-2 px-3 font-extrabold text-white text-xs w-32 flex justify-center items-center rounded-md mb-3"
                        style={{ backgroundColor: currentTeam?.cor }}>ESTATÍSTICAS</div>
                    <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                        <div className="border-b border-black/40 flex justify-start gap-28">
                            <div>
                                <div className="text-sm">PESO</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.peso}</div>
                            </div>
                            <div>
                                <div className="text-sm">ALTURA</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.altura}</div>
                            </div>
                        </div>
                        <div className="border-b border-black/40 flex justify-start gap-28">
                            <div>
                                <div className="text-sm">IDADE</div>
                                <div className="text-lg font-extrabold italic mb-1">{currentPlayer.idade}</div>
                            </div>
                            <div>
                                <div className="text-sm">CIDADE</div>
                                <div className="text-lg font-extrabold italic mb-1">{currentPlayer?.cidade}</div>
                            </div>
                        </div>
                        <div className='flex justify-start gap-20'>
                            <div>
                                <div className="text-sm">EXPERIÊNCIA</div>
                                <div className="text-xl font-extrabold italic">{currentPlayer?.experiencia} ANOS</div>
                            </div>
                            <div>
                                <div className="text-sm">TIME FORMADOR</div>
                                <div className='flex gap-2 items-center'>
                                    <div className="text-lg font-extrabold italic">{currentTeam?.nome}</div>
                                    <Image src={logopath} width={30} height={30} quality={100} alt='logo' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
