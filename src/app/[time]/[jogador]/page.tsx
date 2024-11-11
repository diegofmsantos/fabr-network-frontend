"use client"

import { useParams, useRouter } from 'next/navigation'
import { Times } from '../../../data/times'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { Player } from '../../../types/player'
import { Team } from '../../../types/team'
import Link from 'next/link'
import { Stats } from '@/components/Stats'
import { motion } from "framer-motion"

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

    // Busca o jogador na fonte de dados única 'Times'
    const jogadorData = findJogador(Times, jogadorId)

    // Se não encontrar o jogador, exibe mensagem de erro
    if (!jogadorData) {
        return <div>Jogador não encontrado</div>
    }

    const { jogador: currentPlayer, time: currentTeam } = jogadorData

    // Caminho para o logo do time e para a camisa do jogador 
    const logopath = `/assets/times/logos/${currentTeam.logo}`
    const camisasPath = `/assets/times/camisas/${currentTeam.nome}/${currentPlayer.camisa}`

    const calcularExperiencia = (anoInicio: number) => {
        const anoAtual = new Date().getFullYear()
        return anoAtual - anoInicio
    }

    const experienciaAnos = calcularExperiencia(currentPlayer.experiencia)

    return (
        <div>
            <div className='fixed px-6 w-full h-[375px] flex flex-col justify-center items-center rounded-b-xl md:h-[400px]' style={{ backgroundColor: currentTeam?.cor }}>
                <button
                    onClick={() => router.back()}
                    className='absolute top-10 left-5 rounded-full text-xs text-white p-2 w-8 h-8 flex justify-center items-center bg-black/20'>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <div className='text-white font-bold text-xs mb-4 md:pt-4'>{currentTeam?.nome}</div>
                <div className='flex justify-center items-end md:w-screen md:justify-around md:items-center max-w-[1200px]'>
                    <div className='flex flex-col items-start'>
                        <div className='text-[32px] text-white px-2 font-extrabold italic leading-[35px] tracking-[-3px] md:text-[40px] lg:text-5xl'>
                            {currentPlayer.nome.toLocaleUpperCase()}
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='text-[34px] text-[#D9D9D9] text-center px-2 font-extrabold italic tracking-[-3px] md:text-4xl'>
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
                    <div className='flex justify-center items-center min-w-48 min-h-48 md:min-w-72 md:min-h-72 lg:min-w-84 lg:min-h-84 xl:min-w-96 xl:min-h-84'>
                        <Image
                            src={camisasPath}
                            alt={`${currentTeam?.nome} camisa`}
                            width={250}
                            height={250}
                            quality={100}
                        />
                    </div>
                </div>
            </div>

            <motion.div
                className='p-4 flex flex-col gap-8 pt-[400px] md:pt-[430px]'
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
            >
                <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                    <div className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                        style={{ backgroundColor: currentTeam?.cor }}>BIO</div>
                    <div className="bg-[#D9D9D9]/50 flex flex-col justify-center gap-4 p-4 rounded-lg">
                        <div className="border-b border-black/40 flex justify-between">
                            <div className='flex flex-col justify-center items-center'>
                                <div className="text-sm md:text-lg">IDADE</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.idade}</div>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <div className="text-sm md:text-lg">PESO</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.peso}</div>
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <div className="text-sm md:text-lg">ALTURA</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.altura.toFixed(2).replace('.', ',')}</div>
                            </div>
                        </div>
                        <div className="border-b border-black/40 flex justify-start">
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">CIDADE NATAL</div>
                                <div className="text-xl font-extrabold italic mb-1">{currentPlayer?.cidade.toLocaleUpperCase()}</div>
                            </div>
                        </div>
                        <div className='border-b border-black/40 flex-1 justify-start'>
                            <div className="text-sm md:text-lg">TIME FORMADOR</div>
                            <div className='flex items-center'>
                                <div className="text-xl font-extrabold italic">{currentTeam?.nome.toLocaleUpperCase()}</div>
                            </div>
                        </div>
                        <div className='border-b border-black/40 flex justify-start'>
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">EXPERIÊNCIA</div>
                                <div className="text-xl font-extrabold italic md:text-lg">{experienciaAnos} ANOS</div>
                            </div>
                        </div>
                        <div className='flex justify-start'>
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">INSTAGRAM</div>
                                <div className="text-lg font-extrabold italic underline text-blue-800">
                                    <Link href={`${currentPlayer.instagram}`} target='blank'>{currentPlayer.instagram2.toLocaleUpperCase()}</Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {currentPlayer.estatisticas?.passe &&
                    (
                        currentPlayer.estatisticas.passe.passes_completos > 0 ||
                        currentPlayer.estatisticas.passe.jardas_de_passe > 0 ||
                        currentPlayer.estatisticas.passe.td_passados > 0 ||
                        currentPlayer.estatisticas.passe.interceptacoes_sofridas > 0 ||
                        currentPlayer.estatisticas.passe.sacks_sofridos > 0 ||
                        currentPlayer.estatisticas.passe.fumble_de_passador > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (PASSE)
                            </div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col justify-start gap-4 p-4 rounded-lg lg:p-6">
                                <Stats
                                    label1='PASSES(COMP/TENT)'
                                    label2={`${currentPlayer.estatisticas.passe.passes_completos}/${currentPlayer.estatisticas.passe.passes_tentados}`}
                                    label3='PASSES(%)'
                                    label4={(
                                        (currentPlayer.estatisticas.passe.passes_completos / currentPlayer.estatisticas.passe.passes_tentados) * 100
                                    ).toFixed(0).replace('.', ',') + '%'}
                                />
                                <Stats
                                    label1='JARDAS (TOTAIS)'
                                    label2={currentPlayer.estatisticas.passe.jardas_de_passe.toLocaleString('pt-BR')}
                                    label3='JARDAS (AVG)'
                                    label4={(currentPlayer.estatisticas.passe.jardas_de_passe / currentPlayer.estatisticas.passe.passes_tentados)
                                        .toFixed(1)
                                        .replace('.', ',')}
                                />
                                <Stats
                                    label1='TOUCHDOWNS'
                                    label2={currentPlayer.estatisticas.passe.td_passados}
                                    label3='INTERCEPTAÇÕES'
                                    label4={currentPlayer.estatisticas.passe.interceptacoes_sofridas}
                                />
                                <Stats
                                    label1='SACKS'
                                    label2={currentPlayer.estatisticas.passe.sacks_sofridos}
                                    label3='FUMBLES'
                                    label4={currentPlayer.estatisticas.passe.fumble_de_passador}
                                    noBorder
                                />
                            </div>
                        </div>
                    )
                }


                {currentPlayer.estatisticas?.corrida &&
                    (
                        currentPlayer.estatisticas.corrida.corridas > 0 ||
                        currentPlayer.estatisticas.corrida.jardas_corridas > 0 ||
                        currentPlayer.estatisticas.corrida.tds_corridos > 0 ||
                        currentPlayer.estatisticas.corrida.fumble_de_corredor > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div
                                className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}
                            >
                                STATS (CORRIDA)
                            </div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='CORRIDAS'
                                    label2={`${currentPlayer.estatisticas.corrida.corridas}`}
                                    label3='JARDAS (TOTAIS)'
                                    label4={`${currentPlayer.estatisticas.corrida.jardas_corridas}`}
                                />
                                <Stats
                                    label1='JARDAS (AVG)'
                                    label2={(currentPlayer.estatisticas.corrida.jardas_corridas / currentPlayer.estatisticas.corrida.corridas)
                                        .toFixed(1)
                                        .replace('.', ',')}
                                    label3='TOUCHDOWNS'
                                    label4={currentPlayer.estatisticas.corrida.tds_corridos}
                                />
                                <Stats
                                    label1='FUMBLES'
                                    label2={currentPlayer.estatisticas.corrida.fumble_de_corredor}
                                    noBorder
                                />
                            </div>
                        </div>
                    )
                }

                {currentPlayer.estatisticas?.recepcao &&
                    (
                        currentPlayer.estatisticas.recepcao.jardas_recebidas > 0 ||
                        currentPlayer.estatisticas.recepcao.recepcoes > 0 ||
                        currentPlayer.estatisticas.recepcao.alvo > 0 ||
                        currentPlayer.estatisticas.recepcao.fumble_de_recebedor > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (RECEPÇÃO)
                            </div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='RECEPÇÕES'
                                    label2={`${currentPlayer.estatisticas.recepcao.recepcoes}/${currentPlayer.estatisticas.recepcao.alvo}`}
                                    label3='JARDAS (TOTAIS)'
                                    label4={`${currentPlayer.estatisticas.recepcao.jardas_recebidas}`}
                                />
                                <Stats
                                    label1='JARDAS (AVG)'
                                    label2={(currentPlayer.estatisticas.recepcao.jardas_recebidas / currentPlayer.estatisticas.recepcao.alvo)
                                        .toFixed(1)
                                        .replace('.', ',')}
                                    label3='TOUCHDOWNS'
                                    label4={currentPlayer.estatisticas.recepcao.tds_recebidos}
                                />
                                <Stats
                                    label1='FUMBLES'
                                    label2={currentPlayer.estatisticas.recepcao.fumble_de_recebedor}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}

                {currentPlayer.estatisticas?.retorno &&
                    (
                        currentPlayer.estatisticas.retorno.retornos > 0 ||
                        currentPlayer.estatisticas.retorno.jardas_retornadas > 0 ||
                        currentPlayer.estatisticas.retorno.td_retornados > 0 ||
                        currentPlayer.estatisticas.retorno.fumble_retornador > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (RETORNO)
                            </div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='RETORNOS'
                                    label2={currentPlayer.estatisticas.retorno.retornos}
                                    label3='JARDAS (TOTAIS)'
                                    label4={currentPlayer.estatisticas.retorno.jardas_retornadas}
                                />
                                <Stats
                                    label1='JARDAS (AVG)'
                                    label2={currentPlayer.estatisticas.retorno.retornos > 0
                                        ? (currentPlayer.estatisticas.retorno.jardas_retornadas / currentPlayer.estatisticas.retorno.retornos)
                                            .toFixed(1)
                                            .replace('.', ',')
                                        : '0'}
                                    label3='TOUCHDOWNS'
                                    label4={currentPlayer.estatisticas.retorno.td_retornados}
                                />
                                <Stats
                                    label1='FUMBLES'
                                    label2={currentPlayer.estatisticas.retorno.fumble_retornador}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}

                {currentPlayer.estatisticas?.defesa &&
                    (
                        currentPlayer.estatisticas.defesa.tackles_totais > 0 ||
                        currentPlayer.estatisticas.defesa.tackles_for_loss > 0 ||
                        currentPlayer.estatisticas.defesa.sacks_forcado > 0 ||
                        currentPlayer.estatisticas.defesa.fumble_forcado > 0 ||
                        currentPlayer.estatisticas.defesa.interceptacao_forcada > 0 ||
                        currentPlayer.estatisticas.defesa.passe_desviado > 0 ||
                        currentPlayer.estatisticas.defesa.safety > 0 ||
                        currentPlayer.estatisticas.defesa.td_defensivo > 0
                    ) &&
                    (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (DEFESA)</div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='TACKELS (TOTAIS)'
                                    label2={currentPlayer.estatisticas.defesa.tackles_totais}
                                    label3='TACKLES (FOR LOSS)'
                                    label4={currentPlayer.estatisticas.defesa.tackles_for_loss}
                                />
                                <Stats
                                    label1='SACKS'
                                    label2={currentPlayer.estatisticas.defesa.sacks_forcado}
                                    label3='FUMBLES FORÇADOS'
                                    label4={currentPlayer.estatisticas.defesa.fumble_forcado}
                                />
                                <Stats
                                    label1='INTERCEPTAÇÕES'
                                    label2={currentPlayer.estatisticas.defesa.interceptacao_forcada}
                                    label3='PASSES DESVIADOS'
                                    label4={currentPlayer.estatisticas.defesa.passe_desviado}
                                />
                                <Stats
                                    label1='SAFETY'
                                    label2={currentPlayer.estatisticas.defesa.safety}
                                    label3='TOUCHDOWNS'
                                    label4={currentPlayer.estatisticas.defesa.td_defensivo}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}

                {currentPlayer.estatisticas?.kicker &&
                    (
                        currentPlayer.estatisticas.kicker.xp_bons > 0 ||
                        currentPlayer.estatisticas.kicker.tentativas_de_xp > 0 ||
                        currentPlayer.estatisticas.kicker.fg_bons > 0 ||
                        currentPlayer.estatisticas.kicker.tentativas_de_fg > 0 ||
                        currentPlayer.estatisticas.kicker.fg_mais_longo > 0 ||
                        currentPlayer.estatisticas.kicker.fg_0_10 !== "" ||
                        currentPlayer.estatisticas.kicker.fg_11_20 !== "" ||
                        currentPlayer.estatisticas.kicker.fg_21_30 !== "" ||
                        currentPlayer.estatisticas.kicker.fg_31_40 !== "" ||
                        currentPlayer.estatisticas.kicker.fg_41_50 !== ""
                    ) &&
                    (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (KICKER)</div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='EXTRA-POINTS'
                                    label2={`${currentPlayer.estatisticas.kicker.xp_bons}/${currentPlayer.estatisticas.kicker.tentativas_de_xp}`}
                                    label3='EXTRA-POINTS (%)'
                                    label4={currentPlayer.estatisticas.kicker.tentativas_de_xp > 0
                                        ? ((currentPlayer.estatisticas.kicker.xp_bons / currentPlayer.estatisticas.kicker.tentativas_de_xp) * 100)
                                            .toFixed(0)
                                            .replace('.', ',') + '%'
                                        : '0%'}
                                />
                                <Stats
                                    label1='FIELD GOALS'
                                    label2={`${currentPlayer.estatisticas.kicker.fg_bons}/${currentPlayer.estatisticas.kicker.tentativas_de_fg}`}
                                    label3='FIELD GOALS (%)'
                                    label4={currentPlayer.estatisticas.kicker.tentativas_de_fg > 0
                                        ? ((currentPlayer.estatisticas.kicker.fg_bons / currentPlayer.estatisticas.kicker.tentativas_de_fg) * 100)
                                            .toFixed(0)
                                            .replace('.', ',') + '%'
                                        : '0%'}
                                />
                                <Stats
                                    label1='MAIS LONGO'
                                    label2={currentPlayer.estatisticas.kicker.fg_mais_longo}
                                    label3='FG (0-10 JDS)'
                                    label4={currentPlayer.estatisticas.kicker.fg_0_10}
                                />
                                <Stats
                                    label1='FG (11-20 JDS)'
                                    label2={currentPlayer.estatisticas.kicker.fg_11_20}
                                    label3='FG (21-30 JDS)'
                                    label4={currentPlayer.estatisticas.kicker.fg_21_30}
                                />
                                <Stats
                                    label1='FG (31-40 JDS)'
                                    label2={currentPlayer.estatisticas.kicker.fg_31_40}
                                    label3='FG (41-50 JDS)'
                                    label4={currentPlayer.estatisticas.kicker.fg_41_50}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}

                {currentPlayer.estatisticas?.punter &&
                    (
                        currentPlayer.estatisticas.punter.punts > 0 ||
                        currentPlayer.estatisticas.punter.jardas_de_punt > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (PUNTER)</div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <Stats
                                    label1='PUNTS'
                                    label2={currentPlayer.estatisticas.punter.punts}
                                    label3='JARDAS (TOTAIS)'
                                    label4={currentPlayer.estatisticas.punter.jardas_de_punt}
                                />
                                <Stats
                                    label1='JARDAS (AVG)'
                                    label2={currentPlayer.estatisticas.punter.punts > 0
                                        ? (currentPlayer.estatisticas.punter.jardas_de_punt / currentPlayer.estatisticas.punter.punts).toFixed(1).replace('.', ',')
                                        : '0'}
                                    noBorder
                                />
                            </div>
                        </div>
                    )}
            </motion.div>
        </div>
    )
}
