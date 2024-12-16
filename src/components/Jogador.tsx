"use client"

import { Time } from "@/types/time"
import { Jogador as JogadorType } from "@/types/jogador"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getJogadores } from "@/api/api"
import { JogadorSkeleton } from "./ui/JogadorSkeleton"

type Props = {
    currentTeam: Time
    selectedSetor: string
}

export const Jogador = ({ currentTeam, selectedSetor }: Props) => {
    const [jogadoresFiltrados, setJogadoresFiltrados] = useState<JogadorType[]>([])
    const [loading, setLoading] = useState(true)

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

                // Filtra apenas os jogadores do time atual e do setor selecionado
                const jogadoresDoTime = jogadores.filter((jogador: JogadorType) => {
                    return (
                        jogador.timeId === currentTeam.id &&
                        jogador.setor?.toUpperCase() === selectedSetor.toUpperCase()
                    )
                })

                setJogadoresFiltrados(jogadoresDoTime)
            } catch (error) {
                console.error("Erro ao buscar jogadores:", error)
            } finally {
                setLoading(false)
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
            <div>
                <JogadorSkeleton />
                <JogadorSkeleton />
                <JogadorSkeleton />
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-3 p-4 z-50">
            {jogadoresFiltrados.map((jogador: JogadorType) => {
                const camisaPath = `/assets/times/camisas/${currentTeam.nome?.toLowerCase().replace(/\s/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}/${jogador.camisa}`;
                const experienciaAnos = calcularExperiencia(jogador.experiencia)

                return (
                    <Link
                        href={`/${currentTeam.nome}/${jogador.id}`}
                        key={jogador.id}
                        className="flex h-24 justify-between items-center p-2 rounded-md border text-sm bg-white min-[425px]:p-4
                            md:text-base md:h-28 xl:text-lg xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto transition duration-300"
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
                        <div className="flex-1 md:flex md:justify-center">
                            <Image
                                src={camisaPath}
                                width={100}
                                height={100}
                                alt="Camisa"
                                quality={100}
                                className="w-16 h-20 md:w-20 md:h-24"
                            />
                        </div>
                        <div className="flex flex-col gap-3 md:flex-1 ">
                            <div className="flex items-center gap-2">
                                <div className="text-xl font-extrabold italic">{jogador.nome}</div>
                                <div className="text-xl font-extrabold">({jogador.posicao})</div>
                            </div>
                            <div className="flex justify-between gap-6 md:justify-start">
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