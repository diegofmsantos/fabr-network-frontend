"use client"

import { Time } from "@/types/time"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ListaProps {
    times: Time[]
}

export const Lista = ({ times }: ListaProps) => {
    const [lastClicked, setLastClicked] = useState<string | null>(null)

    const itemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    }

    useEffect(() => {
        // Recupera o último elemento clicado do localStorage quando o componente monta
        const stored = localStorage.getItem('lastClickedTeam')
        if (stored) {
            setLastClicked(stored)
        }
    }, [])

    const handleClick = (teamName: string) => {
        // Atualiza o localStorage e o estado quando um time é clicado
        localStorage.setItem('lastClickedTeam', teamName)
        setLastClicked(teamName)
    }

    if (!times || times.length === 0) return <div className="text-center text-gray-500">Nenhum time encontrado.</div>

    return (
        <motion.div
            className="grid grid-cols-3 gap-4 px-3 pt-56 pb-20 container bg-[#ECECEC] relative 
            min-[400px]:grid-cols-4 md:grid-cols-5 md:pt-48 md:gap-5 lg:px-20 xl:mx-auto lg:grid-cols-6 xl:grid-cols-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
            {times
                .sort((a, b) => (a.sigla ?? "").localeCompare(b.sigla ?? ""))
                .map((item) => (
                    <motion.div
                        key={item.nome}
                        variants={itemVariants}
                        className="relative border border-gray-300 rounded-lg overflow-hidden group"
                    >
                        <Link
                            href={`/${item.nome}`}
                            className="relative z-20"
                            onClick={() => item.nome && handleClick(item.nome)}
                        >
                            <div
                                className={`absolute inset-0 transition-opacity ${lastClicked === item.nome
                                    ? 'opacity-50'
                                    : 'opacity-0 group-hover:opacity-50'
                                    }`}
                                style={{ backgroundColor: item.cor ?? "#000" }}
                            ></div>
                            <div className="relative text-center font-extrabold italic z-10 min-[320px]:text-[28px] min-[400px]:text-[31px] md:text-[45px]">
                                <div className="tracking-[-3px]">{item.sigla ?? "N/A"}</div>
                                <div className="flex flex-col -mt-4 justify-center items-center gap-2 min-h-28 p-2 min-[400px]:-mt-5">
                                    <Image
                                        src={`/assets/times/capacetes/${item.capacete}`}
                                        alt="Capacete"
                                        width={90}
                                        height={90}
                                        quality={100}
                                        priority
                                        className="w-24 h-14 rotate-12 md:h-16 md:mt-2"
                                        style={{ imageRendering: 'crisp-edges', WebkitFontSmoothing: 'antialiased', objectFit: 'contain' }}
                                    />

                                    <Image
                                        src={`/assets/times/logos/${item.logo}`}
                                        alt="Logo"
                                        width={35}
                                        height={35}
                                        quality={100}
                                        priority
                                        className="md:w-14"
                                        style={{ imageRendering: 'crisp-edges', WebkitFontSmoothing: 'antialiased' }}
                                    />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
        </motion.div>
    )
}