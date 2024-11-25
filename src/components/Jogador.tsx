"use client"

import { Time } from "@/types/time"
import { Jogador as JogadorType } from "@/types/jogador"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getJogadores } from "@/api/api"
import { div } from "framer-motion/client"

type Props = {
    currentTeam: Time
    selectedSetor: string
}

export const Jogador = ({ currentTeam, selectedSetor }: Props) => {
    const [jogadoresFiltrados, setJogadoresFiltrados] = useState<JogadorType[]>([])

    useEffect(() => {
        const fetchJogadores = async () => {
            try {
                // Certifique-se de que o time e o setor estão definidos
                if (!currentTeam || !selectedSetor) {
                    console.warn("Time ou setor não definidos corretamente.")
                    return
                }

                // Busca todos os jogadores da API
                const jogadores: JogadorType[] = await getJogadores()

                console.log("Jogadores retornados da API:", jogadores)
                console.log("Time atual recebido como prop:", currentTeam)
                console.log("Setor selecionado:", selectedSetor)

                // Filtra apenas os jogadores do time atual e do setor selecionado
                const jogadoresDoTime = jogadores.filter((jogador: JogadorType) => {
                    console.log(
                        `Comparando timeId do jogador (${jogador.nome}): ${jogador.timeId} com currentTeamId: ${currentTeam.id}`
                    )
                    return (
                        jogador.timeId === currentTeam.id &&
                        jogador.setor?.toUpperCase() === selectedSetor.toUpperCase()
                    )
                })

                console.log("Jogadores filtrados:", jogadoresDoTime)

                setJogadoresFiltrados(jogadoresDoTime)
            } catch (error) {
                console.error("Erro ao buscar jogadores:", error)
            }
        }

        // Só busca se houver time e setor selecionados
        if (currentTeam && selectedSetor) {
            fetchJogadores()
        }
    }, [currentTeam, selectedSetor])

    const calcularExperiencia = (anoInicio: number) => {
        const anoAtual = new Date().getFullYear()
        return anoAtual - anoInicio
    }

    if (jogadoresFiltrados.length === 0) {
        return (
            <div className="w-full flex flex-col gap-3 p-4 z-50">
                <p>Nenhum jogador encontrado para o time e setor selecionados.</p>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-3 p-4 z-50">
            {jogadoresFiltrados.map((jogador: JogadorType) => {
                const camisaPath = `/assets/times/camisas/${currentTeam.nome}/${jogador.camisa}`
                const experienciaAnos = calcularExperiencia(jogador.experiencia)

                return (
                    <Link
                        href={`/${currentTeam.nome}/${jogador.id}`}
                        key={jogador.id}
                        className="flex h-24 justify-between items-center p-4 rounded-md border text-sm 
                            md:text-base xl:text-lg xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto transition duration-300"
                        style={{
                            transition: "background-color 0.3s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = `${currentTeam.cor}50`)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#FFF")
                        }
                    >
                        <div className="flex-1">
                            <Image src={camisaPath} width={60} height={60} alt="Camisa" quality={100} className="w-auto h-auto" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="text-xl font-extrabold italic">{jogador.nome}</div>
                                <div className="text-xl font-extrabold">({jogador.posicao})</div>
                            </div>
                            <div className="flex justify-between gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="text-xs">IDADE</div>
                                    <div className="text-base font-bold">{jogador.idade}</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-xs">ALTURA</div>
                                    <div className="text-base font-bold">{jogador.altura.toFixed(2)}</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-xs">PESO</div>
                                    <div className="text-base font-bold">{jogador.peso}</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="text-xs">EXPERIÊNCIA</div>
                                    <div className="text-base font-bold">
                                        {experienciaAnos} ANO{experienciaAnos > 1 ? "S" : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
            <div>

            </div>
        </div>
    )
}

export const JogadorSkeleton = () => {
    return (
        <div className="w-full flex flex-col p-4 z-50">
            <div
                className="flex h-24 justify-between items-center p-5 rounded-md border text-sm gap-6
                                md:text-base xl:text-lg xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto transition duration-300">
                <div className="flex-1 bg-gray-300 w-36 h-20 rounded-md">
                    <div className="w-auto h-auto"></div>
                </div>
                <div className="flex flex-col gap-5">
                    <div className="flex justify-start items-center gap-2">
                        <div className="bg-gray-300 rounded-md h-6 min-w-48 animate-pulse"></div>
                        <div className="bg-gray-300 rounded-md h-6 w-16 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-300 rounded-md h-3 w-10 animate-pulse"></div>
                            <div className="bg-gray-300 rounded-md h-3 w-6 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-300 rounded-md h-3 w-12 animate-pulse"></div>
                            <div className="bg-gray-300 rounded-md h-3 w-6 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-300 rounded-md h-3 w-10 animate-pulse"></div>
                            <div className="bg-gray-300 rounded-md h-3 w-6 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-300 rounded-md h-3 w-16 animate-pulse"></div>
                            <div className="bg-gray-300 rounded-md h-3 w-12 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}