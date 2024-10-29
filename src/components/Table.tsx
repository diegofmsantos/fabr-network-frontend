"use client"

import { BFA } from "@/data/bfa"
import { Brasileirao } from "@/data/brasileirao"
import Image from "next/image"
import Link from "next/link"
import { Tab } from "./Tab"
import { useState } from "react"

export const Table = () => {

    const [selectedButton, setSelectedButton] = useState<'bfa' | 'brasileirao'>('bfa')

    return (
        <div>
            <header className="w-full h-20 rounded-xl bg-[#DBDBDF] flex justify-start items-center px-2 fixed z-50">
                <Image src={`/assets/logo-fabr-color.png`} width={90} height={90} alt="logo-fabr" />
            </header>

            {selectedButton === 'bfa' &&
                <div>
                    <h1 className="text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px]">
                        ESCOLHA SEU TIME
                    </h1>
                    <div className="grid grid-cols-4 gap-4 p-3 bg-[#ECECEC] mb-16">
                        {BFA.map(item => (
                            <Link
                                href={`/${item.nome}`}
                                className="relative border border-gray-300 rounded-lg overflow-hidden group"
                                key={item.nome}
                            >
                                {/* Camada de cor com opacidade apenas no hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity"
                                    style={{ backgroundColor: item.cor }}
                                ></div>

                                {/* Conteúdo principal */}
                                <div className="relative text-center font-extrabold italic z-10 min-[320px]:text-[22px] min-[400px]:text-[31px] md:text-[45px]">
                                    <div>{item.sigla}</div>
                                    <div className="flex flex-col -mt-6 justify-center items-center gap-2 min-h-28 p-2">
                                        <Image src={`/assets/bfa/capacetes-bfa/${item.capacete}`} alt="Logo" width={90} height={90} quality={100} />
                                        <Image src={`/assets/bfa/logos-bfa/${item.logo}`} alt="Logo" width={35} height={35} quality={100} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            }




            {selectedButton === 'brasileirao' &&
                <div className="h-screen bg-[#ECECEC]">
                    <h1 className="text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px]">
                        ESCOLHA SEU TIME
                    </h1>
                    <div className="grid grid-cols-4 gap-4 p-3 bg-[#ECECEC] mb-16">
                        {Brasileirao.map(item => (
                            <Link
                                href={`/${item.nome}`}
                                className="relative border border-gray-300 rounded-lg overflow-hidden group"
                                key={item.nome}
                            >
                                {/* Camada de cor com opacidade apenas no hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity"
                                    style={{ backgroundColor: item.cor }}
                                ></div>

                                {/* Conteúdo principal */}
                                <div className="relative text-center font-extrabold italic z-10 min-[320px]:text-[22px] min-[400px]:text-[31px] md:text-[45px]">
                                    <div>{item.sigla}</div>
                                    <div className="flex flex-col -mt-6 justify-center items-center gap-2 min-h-28 p-2">
                                        <Image src={`/assets/brasileirao/capacetes-brasileirao/${item.capacete}`} alt="Logo" width={90} height={90} quality={100} />
                                        <Image src={`/assets/brasileirao/logos-brasileirao/${item.logo}`} alt="Logo" width={35} height={35} quality={100} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            }
            <Tab selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
        </div>
    )
}
