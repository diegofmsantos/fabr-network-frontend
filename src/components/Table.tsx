"use client"

import { BFA } from "@/data/bfa"
import { Brasileirao } from "@/data/brasileirao"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "./Footer"
import { useState } from "react"

export const Table = () => {

    const [selectedButton, setSelectedButton] = useState<'bfa' | 'brasileirao'>('bfa')

    return (
        <div>
            <header className="w-full h-20 rounded-xl bg-[#DBDBDF] flex justify-start items-center gap-32 px-2 fixed">
                <Image src={`/assets/logo-fabr-color.png`} width={90} height={90} alt="logo-fabr" />
                <div className="font-semibold">Times</div>
            </header>

            {selectedButton === 'bfa' &&
                <div>
                    <h1 className="text-[51px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24">ESCOLHA SEU TIME</h1>
                    <div className="grid grid-cols-4 gap-4 p-3 bg-[#ECECEC] mb-16">
                        {BFA.map(item => (
                            <Link href={`/${item.nome}`} className="border border-gray-400 rounded-lg" key={item.nome}>
                                <div className="text-center text-[31px] font-extrabold italic">{item.sigla}</div>
                                <div className="flex flex-col -mt-7 justify-center items-center gap-2 min-h-28 p-2">
                                    <Image src={`/assets/bfa/capacetes-bfa/${item.capacete}`} alt="Logo" width={90} height={90} quality={100} />
                                    <Image src={`/assets/bfa/logos-bfa/${item.logo}`} alt="Logo" width={25} height={25} quality={100} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            }

            {selectedButton === 'brasileirao' &&
                <div>
                    <h1 className="text-[51px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24">ESCOLHA SEU TIME</h1>
                    <div className="grid grid-cols-4 gap-4 p-3 bg-[#ECECEC] mb-16">
                        {Brasileirao.map(item => (
                            <Link href={`/${item.nome}`} className="border border-gray-400 rounded-lg" key={item.nome}>
                                <div className="text-center text-[31px] font-extrabold italic">{item.sigla}</div>
                                <div className="flex flex-col -mt-7 justify-center items-center gap-2 min-h-28 p-2">
                                    <Image src={`/assets/brasileirao/capacetes-brasileirao/${item.capacete}`} alt="Logo" width={90} height={90} quality={100} />
                                    <Image src={`/assets/brasileirao/logos-brasileirao/${item.logo}`} alt="Logo" width={25} height={25} quality={100} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            }
            <Footer selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
        </div>
    )
}
