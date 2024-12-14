"use client"

import { useParams, useRouter } from "next/navigation"
import { Jogador } from "../../../types/jogador"
import { Time } from "../../../types/time"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { Stats } from "@/components/Stats"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
import { getJogadores, getTimes } from "@/api/api"
import { JogadorSkeleton } from "@/components/ui/JogadorSkeleton"
import { Loading } from "@/components/ui/Loading"

// Função para buscar o jogador por ID
const findJogador = (jogadores: Jogador[], jogadorId: number): Jogador | null => {
    return jogadores.find((jogador) => jogador.id === jogadorId) || null
};

export default function Page() {
    const params = useParams()
    const router = useRouter()
    const jogadorId = params.jogador
        ? Array.isArray(params.jogador)
            ? parseInt(params.jogador[0], 10)
            : parseInt(params.jogador, 10)
        : null

    if (jogadorId === null || isNaN(jogadorId)) {
        throw new Error("ID do jogador é inválido ou não foi fornecido.")
    }

    const [jogadorData, setJogadorData] = useState<{ jogador: Jogador; time: Time } | null>(null)
    const [loading, setLoading] = useState(true)

    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 200], [1, 0])
    const height = useTransform(scrollY, [0, 200], [340, 50])

    useEffect(() => {
        const fetchJogador = async () => {
            try {
                if (!jogadorId) {
                    throw new Error("ID do jogador não encontrado.")
                }

                const jogadores = await getJogadores()
                const jogadorEncontrado = findJogador(jogadores, jogadorId)

                if (jogadorEncontrado && jogadorEncontrado.timeId) {
                    // Buscar o time completo associado ao jogador
                    const times = await getTimes()
                    const timeEncontrado = times.find((time) => time.id === jogadorEncontrado.timeId)

                    if (timeEncontrado) {
                        setJogadorData({
                            jogador: jogadorEncontrado,
                            time: timeEncontrado,
                        })
                        // Atualizar o título da página com o nome do time e do jogador
                        document.title = `${jogadorEncontrado.nome} - ${timeEncontrado.nome}`
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar os jogadores:", error)
                setJogadorData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchJogador()
    }, [jogadorId])

    if (loading) { return <Loading /> }

    if (!jogadorData) {
        return (
            <div>
                <JogadorSkeleton />
                <p>Jogador não encontrado ou ocorreu um erro.</p>
            </div>
        )
    }

    const { jogador: currentJogador, time: currentTime } = jogadorData

    // Caminho para o logo do time e para a camisa do jogador
    const logopath = `/assets/times/logos/${currentTime.logo?.toLowerCase().replace(/\s/g, "-") || "default-logo.png"}`
    const camisasPath = `/assets/times/camisas/${currentTime.nome?.toLowerCase()
        .replace(/\s/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}/${jogadorData.jogador.camisa}`

    const calcularExperiencia = (anoInicio: number) => {
        const anoAtual = new Date().getFullYear()
        return anoAtual - anoInicio
    }

    const experienciaAnos = calcularExperiencia(currentJogador.experiencia)

    return (
        <AnimatePresence>
            <motion.div
                className="relative min-h-screen pb-16 bg-[#ECECEC]"
                key={jogadorId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <button
                    onClick={() => router.back()}
                    className="fixed top-[85px] left-5 rounded-full text-xs text-white p-2 w-8 h-8 flex justify-center items-center bg-black/20 z-[100]"
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <motion.div className='fixed top-0 w-full z-20' style={{ height }} >
                    <motion.div className='mt-20 px-6 w-full h-full flex flex-col justify-center items-center rounded-b-xl md:h-full'
                        style={{ backgroundColor: currentTime?.cor }} >
                        <motion.div style={{ opacity }} className="w-full max-w-[1200px]">
                            <div className='text-white text-center font-bold text-xs mb-4 '>{currentTime?.nome}</div>
                            <div className='flex justify-center items-end md:w-screen md:justify-around md:items-center max-w-[1200px]'>
                                <div className='flex flex-col items-start'>
                                    <div className='text-[32px] text-white px-2 font-extrabold italic leading-[35px] tracking-[-3px] md:text-[40px] lg:text-5xl'>
                                        {currentJogador.nome.toLocaleUpperCase()}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <div className='text-[34px] text-[#D9D9D9] text-center px-2 font-extrabold italic tracking-[-3px] md:text-4xl'>
                                            {currentJogador.posicao}
                                        </div>
                                        <div className="w-8">
                                            <Image
                                                src={`/assets/bandeiras/${currentJogador.nacionalidade}`}
                                                alt='logo-bandeira'
                                                width={40}
                                                height={40}
                                                quality={100}
                                                className="w-auto h-auto"
                                            />
                                        </div>
                                    </div>
                                    <div className='-mt-5'>
                                        <Image src={logopath} alt='logo' width={100} height={100} quality={100} priority />
                                    </div>
                                </div>
                                <div className='flex justify-center items-center min-w-48 min-h-48 md:min-w-40 md:min-h-40 lg:min-w-84 lg:min-h-84 xl:min-w-96 xl:min-h-84'>
                                    <Image
                                        src={camisasPath} alt={`${currentTime?.nome} camisa`} width={200} height={200} quality={100} priority
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className='p-4 flex flex-col gap-8 pt-[440px] md:pt-[450px] z-10 relative'
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-full bg-[#ECECEC] flex flex-col justify-center items-center">
                        <div className="bg-white px-3 py-1 rounded-2xl min-w-36 flex flex-col justify-center items-start">
                            <div className="text-xs">Temporada</div>
                            <select className="text-sm font-bold min-w-32">
                                <option value="2024" className="">2024</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>
                    <div className='xl:max-w-[1200px] -mt-4 xl:min-w-[1100px] xl:m-auto'>
                        <div className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                            style={{ backgroundColor: currentTime?.cor }}>BIO</div>
                        <div className="bg-white flex flex-col justify-center gap-4 p-4 rounded-lg">
                            <div className="border-b border-bg-[#D9D9D9] flex justify-between">
                                <div className='flex flex-col justify-center items-center'>
                                    <div className="text-sm md:text-lg">IDADE</div>
                                    <div className="text-[34px] font-extrabold italic mb-1">{currentJogador.idade}</div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className="text-sm md:text-lg">PESO</div>
                                    <div className="text-[34px] font-extrabold italic mb-1">{currentJogador.peso}</div>
                                </div>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className="text-sm md:text-lg">ALTURA</div>
                                    <div className="text-[34px] font-extrabold italic mb-1">{currentJogador.altura.toFixed(2).replace('.', ',')}</div>
                                </div>
                            </div>
                            <div className="border-b border-bg-[#D9D9D9] flex justify-start">
                                <div className='flex-1 justify-start'>
                                    <div className="text-sm md:text-lg">CIDADE NATAL</div>
                                    <div className="text-xl font-extrabold italic mb-1">{currentJogador?.cidade.toLocaleUpperCase()}</div>
                                </div>
                            </div>
                            <div className='border-b border-bg-[#D9D9D9] flex-1 justify-start'>
                                <div className="text-sm md:text-lg">TIME FORMADOR</div>
                                <div className='flex items-center'>
                                    <div className="text-xl font-extrabold italic">
                                        {currentJogador.timeFormador.toLocaleUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className='border-b border-bg-[#D9D9D9] flex justify-start'>
                                <div className='flex-1 justify-start'>
                                    <div className="text-sm md:text-lg">EXPERIÊNCIA</div>
                                    <div className="text-xl font-extrabold italic md:text-lg">{experienciaAnos} ANO{experienciaAnos > 1 ? 'S' : ''}</div>
                                </div>
                            </div>
                            <div className='flex justify-start'>
                                <div className='flex-1 justify-start'>
                                    <div className="text-sm md:text-lg">INSTAGRAM</div>
                                    <div className="text-lg font-extrabold italic underline text-blue-800">
                                        <Link href={`${currentJogador.instagram}`} target='blank'>{currentJogador.instagram2.toLocaleUpperCase()}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {currentJogador.estatisticas?.passe &&
                        (
                            currentJogador.estatisticas.passe.passes_completos > 0 ||
                            currentJogador.estatisticas.passe.jardas_de_passe > 0 ||
                            currentJogador.estatisticas.passe.td_passados > 0 ||
                            currentJogador.estatisticas.passe.interceptacoes_sofridas > 0 ||
                            currentJogador.estatisticas.passe.sacks_sofridos > 0 ||
                            currentJogador.estatisticas.passe.fumble_de_passador > 0
                        ) && (
                            <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (PASSE)
                                </div>
                                <div className="bg-white flex flex-col justify-start gap-4 p-4 rounded-lg lg:p-6">
                                    <Stats
                                        label1='PASSES(COMP/TENT)'
                                        label2={`${currentJogador.estatisticas.passe.passes_completos}/${currentJogador.estatisticas.passe.passes_tentados}`}
                                        label3='PASSES(%)'
                                        label4={(
                                            (currentJogador.estatisticas.passe.passes_completos / currentJogador.estatisticas.passe.passes_tentados) * 100
                                        ).toFixed(0).replace('.', ',') + '%'}
                                    />
                                    <Stats
                                        label1='JARDAS (TOTAIS)'
                                        label2={currentJogador.estatisticas.passe.jardas_de_passe.toLocaleString('pt-BR')}
                                        label3='JARDAS (AVG)'
                                        label4={(currentJogador.estatisticas.passe.jardas_de_passe / currentJogador.estatisticas.passe.passes_tentados)
                                            .toFixed(1)
                                            .replace('.', ',')}
                                    />
                                    <Stats
                                        label1='TOUCHDOWNS'
                                        label2={currentJogador.estatisticas.passe.td_passados}
                                        label3='INTERCEPTAÇÕES'
                                        label4={currentJogador.estatisticas.passe.interceptacoes_sofridas}
                                    />
                                    <Stats
                                        label1='SACKS'
                                        label2={currentJogador.estatisticas.passe.sacks_sofridos}
                                        label3='FUMBLES'
                                        label4={currentJogador.estatisticas.passe.fumble_de_passador}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )
                    }

                    {currentJogador.estatisticas?.corrida &&
                        (
                            currentJogador.estatisticas.corrida.corridas > 0 ||
                            currentJogador.estatisticas.corrida.jardas_corridas > 0 ||
                            currentJogador.estatisticas.corrida.tds_corridos > 0 ||
                            currentJogador.estatisticas.corrida.fumble_de_corredor > 0
                        ) && (
                            <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                                <div
                                    className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}
                                >
                                    STATS (CORRIDA)
                                </div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='CORRIDAS'
                                        label2={`${currentJogador.estatisticas.corrida.corridas}`}
                                        label3='JARDAS (TOTAIS)'
                                        label4={`${currentJogador.estatisticas.corrida.jardas_corridas}`}
                                    />
                                    <Stats
                                        label1='JARDAS (AVG)'
                                        label2={(currentJogador.estatisticas.corrida.jardas_corridas / currentJogador.estatisticas.corrida.corridas)
                                            .toFixed(1)
                                            .replace('.', ',')}
                                        label3='TOUCHDOWNS'
                                        label4={currentJogador.estatisticas.corrida.tds_corridos}
                                    />
                                    <Stats
                                        label1='FUMBLES'
                                        label2={currentJogador.estatisticas.corrida.fumble_de_corredor}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )
                    }

                    {currentJogador.estatisticas?.recepcao &&
                        (
                            currentJogador.estatisticas.recepcao.jardas_recebidas > 0 ||
                            currentJogador.estatisticas.recepcao.recepcoes > 0 ||
                            currentJogador.estatisticas.recepcao.alvo > 0 ||
                            currentJogador.estatisticas.recepcao.fumble_de_recebedor > 0
                        ) && (
                            <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (RECEPÇÃO)
                                </div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='RECEPÇÕES'
                                        label2={`${currentJogador.estatisticas.recepcao.recepcoes}/${currentJogador.estatisticas.recepcao.alvo}`}
                                        label3='JARDAS (TOTAIS)'
                                        label4={`${currentJogador.estatisticas.recepcao.jardas_recebidas}`}
                                    />
                                    <Stats
                                        label1='JARDAS (AVG)'
                                        label2={(currentJogador.estatisticas.recepcao.jardas_recebidas / currentJogador.estatisticas.recepcao.alvo)
                                            .toFixed(1)
                                            .replace('.', ',')}
                                        label3='TOUCHDOWNS'
                                        label4={currentJogador.estatisticas.recepcao.tds_recebidos}
                                    />
                                    <Stats
                                        label1='FUMBLES'
                                        label2={currentJogador.estatisticas.recepcao.fumble_de_recebedor}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}

                    {currentJogador.estatisticas?.retorno &&
                        (
                            currentJogador.estatisticas.retorno.retornos > 0 ||
                            currentJogador.estatisticas.retorno.jardas_retornadas > 0 ||
                            currentJogador.estatisticas.retorno.td_retornados > 0 ||
                            currentJogador.estatisticas.retorno.fumble_retornador > 0
                        ) && (
                            <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (RETORNO)
                                </div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='RETORNOS'
                                        label2={currentJogador.estatisticas.retorno.retornos}
                                        label3='JARDAS (TOTAIS)'
                                        label4={currentJogador.estatisticas.retorno.jardas_retornadas}
                                    />
                                    <Stats
                                        label1='JARDAS (AVG)'
                                        label2={currentJogador.estatisticas.retorno.retornos > 0
                                            ? (currentJogador.estatisticas.retorno.jardas_retornadas / currentJogador.estatisticas.retorno.retornos)
                                                .toFixed(1)
                                                .replace('.', ',')
                                            : '0'}
                                        label3='TOUCHDOWNS'
                                        label4={currentJogador.estatisticas.retorno.td_retornados}
                                    />
                                    <Stats
                                        label1='FUMBLES'
                                        label2={currentJogador.estatisticas.retorno.fumble_retornador}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}

                    {currentJogador.estatisticas?.defesa &&
                        (
                            currentJogador.estatisticas.defesa.tackles_totais > 0 ||
                            currentJogador.estatisticas.defesa.tackles_for_loss > 0 ||
                            currentJogador.estatisticas.defesa.sacks_forcado > 0 ||
                            currentJogador.estatisticas.defesa.fumble_forcado > 0 ||
                            currentJogador.estatisticas.defesa.interceptacao_forcada > 0 ||
                            currentJogador.estatisticas.defesa.passe_desviado > 0 ||
                            currentJogador.estatisticas.defesa.safety > 0 ||
                            currentJogador.estatisticas.defesa.td_defensivo > 0
                        ) &&
                        (
                            <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (DEFESA)</div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='TACKELS (TOTAIS)'
                                        label2={currentJogador.estatisticas.defesa.tackles_totais}
                                        label3='TACKLES (FOR LOSS)'
                                        label4={currentJogador.estatisticas.defesa.tackles_for_loss}
                                    />
                                    <Stats
                                        label1='SACKS'
                                        label2={currentJogador.estatisticas.defesa.sacks_forcado}
                                        label3='FUMBLES FORÇADOS'
                                        label4={currentJogador.estatisticas.defesa.fumble_forcado}
                                    />
                                    <Stats
                                        label1='INTERCEPTAÇÕES'
                                        label2={currentJogador.estatisticas.defesa.interceptacao_forcada}
                                        label3='PASSES DESVIADOS'
                                        label4={currentJogador.estatisticas.defesa.passe_desviado}
                                    />
                                    <Stats
                                        label1='SAFETY'
                                        label2={currentJogador.estatisticas.defesa.safety}
                                        label3='TOUCHDOWNS'
                                        label4={currentJogador.estatisticas.defesa.td_defensivo}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}

                    {currentJogador.estatisticas?.kicker &&
                        (
                            (currentJogador.estatisticas.kicker.xp_bons > 0 ||
                                currentJogador.estatisticas.kicker.tentativas_de_xp > 0 ||
                                currentJogador.estatisticas.kicker.fg_bons > 0 ||
                                currentJogador.estatisticas.kicker.tentativas_de_fg > 0 ||
                                currentJogador.estatisticas.kicker.fg_mais_longo > 0 ||
                                (currentJogador.estatisticas.kicker.fg_0_10 && currentJogador.estatisticas.kicker.fg_0_10 !== "") ||
                                (currentJogador.estatisticas.kicker.fg_11_20 && currentJogador.estatisticas.kicker.fg_11_20 !== "") ||
                                (currentJogador.estatisticas.kicker.fg_21_30 && currentJogador.estatisticas.kicker.fg_21_30 !== "") ||
                                (currentJogador.estatisticas.kicker.fg_31_40 && currentJogador.estatisticas.kicker.fg_31_40 !== "") ||
                                (currentJogador.estatisticas.kicker.fg_41_50 && currentJogador.estatisticas.kicker.fg_41_50 !== ""))
                        ) && (
                            <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (KICKER)
                                </div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='EXTRA-POINTS'
                                        label2={`${currentJogador.estatisticas.kicker.xp_bons}/${currentJogador.estatisticas.kicker.tentativas_de_xp}`}
                                        label3='EXTRA-POINTS (%)'
                                        label4={currentJogador.estatisticas.kicker.tentativas_de_xp > 0
                                            ? ((currentJogador.estatisticas.kicker.xp_bons / currentJogador.estatisticas.kicker.tentativas_de_xp) * 100)
                                                .toFixed(0)
                                                .replace('.', ',') + '%'
                                            : '0%'}
                                    />
                                    <Stats
                                        label1='FIELD GOALS'
                                        label2={`${currentJogador.estatisticas.kicker.fg_bons}/${currentJogador.estatisticas.kicker.tentativas_de_fg}`}
                                        label3='FIELD GOALS (%)'
                                        label4={currentJogador.estatisticas.kicker.tentativas_de_fg > 0
                                            ? ((currentJogador.estatisticas.kicker.fg_bons / currentJogador.estatisticas.kicker.tentativas_de_fg) * 100)
                                                .toFixed(0)
                                                .replace('.', ',') + '%'
                                            : '0%'}
                                    />
                                    <Stats
                                        label1='MAIS LONGO'
                                        label2={currentJogador.estatisticas.kicker.fg_mais_longo || "-"}
                                        label3='FG (0-10 JDS)'
                                        label4={currentJogador.estatisticas.kicker.fg_0_10 || "-"}
                                    />
                                    <Stats
                                        label1='FG (11-20 JDS)'
                                        label2={currentJogador.estatisticas.kicker.fg_11_20 || "-"}
                                        label3='FG (21-30 JDS)'
                                        label4={currentJogador.estatisticas.kicker.fg_21_30 || "-"}
                                    />
                                    <Stats
                                        label1='FG (31-40 JDS)'
                                        label2={currentJogador.estatisticas.kicker.fg_31_40 || "-"}
                                        label3='FG (41-50 JDS)'
                                        label4={currentJogador.estatisticas.kicker.fg_41_50 || "-"}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}


                    {currentJogador.estatisticas?.punter &&
                        (
                            currentJogador.estatisticas.punter.punts > 0 ||
                            currentJogador.estatisticas.punter.jardas_de_punt > 0
                        ) && (
                            <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                                <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                    style={{ backgroundColor: currentTime?.cor }}>STATS (PUNTER)</div>
                                <div className="bg-white flex flex-col gap-4 p-4 rounded-lg">
                                    <Stats
                                        label1='PUNTS'
                                        label2={currentJogador.estatisticas.punter.punts}
                                        label3='JARDAS (TOTAIS)'
                                        label4={currentJogador.estatisticas.punter.jardas_de_punt}
                                    />
                                    <Stats
                                        label1='JARDAS (AVG)'
                                        label2={currentJogador.estatisticas.punter.punts > 0
                                            ? (currentJogador.estatisticas.punter.jardas_de_punt / currentJogador.estatisticas.punter.punts).toFixed(1).replace('.', ',')
                                            : '0'}
                                        noBorder
                                    />
                                </div>
                            </div>
                        )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}