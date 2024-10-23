"use client"

import { BFA } from "@/data/bfa"
import { Brasileirao } from "@/data/brasileirao"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "./ui/button"

export const Table = () => {

    const [selectedButton, setSelectedButton] = useState<'bfa' | 'brasileirao' | null>('bfa')

    const handleShowBfa = () => {
        setSelectedButton('bfa')
    }

    const handleShowBrasileirao = () => {
        setSelectedButton('brasileirao')
    }

    return (
        <div>
            <header className="w-full h-44 bg-[#17181C] flex flex-col justify-center items-center gap-4 border-b-2 border-[#96E301] fixed">
                <Image src={`/assets/logo-fabr-color.png`} width={150} height={150} alt="logo-fabr" />
                <div className="flex justify-center items-center gap-4 mb-2">
                    <div className="border-r-2 border-white/70 pr-4 ">
                        <Button
                            label="Liga BFA"
                            onClick={handleShowBfa}
                            isSelected={selectedButton === 'bfa'}
                        >
                            <Image
                                src={`${selectedButton === 'bfa' ? '/assets/logo-bfa-color.png' : '/assets/logo-bfa-preto.png'}`}
                                alt="Logo BFA"
                                width={50}
                                height={50}
                                quality={100} />
                        </Button>
                    </div>
                    <Button
                        label="Brasileirão"
                        onClick={handleShowBrasileirao}
                        isSelected={selectedButton === 'brasileirao'}
                    >
                        <Image
                            src={`${selectedButton === 'brasileirao' ? '/assets/logo-brasileirao-color.png' : '/assets/logo-brasileirao-preto.png'}`}
                            alt="Logo BFA"
                            width={50}
                            height={50}
                            quality={100} />
                    </Button>
                </div>
            </header>

            {selectedButton === 'bfa' &&
                <div className="grid grid-cols-3 gap-4 p-3 pt-48">
                    {BFA.map(item => (
                        <Link href={`/${item.nome}`} className="border border-gray-400 rounded-lg" key={item.nome}>
                            <div className="flex flex-col justify-center items-center gap-2 min-h-28 p-2">
                                <Image src={`/assets/bfa/logos-bfa/${item.logo}`} alt="Logo" width={50} height={50} quality={100} />
                                <div className="text-sm text-center font-bold">{item.nome}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            }

            {selectedButton === 'brasileirao' &&
                <div className="grid grid-cols-3 gap-4 p-3 pt-48">
                    {Brasileirao.map(item => (
                        <Link href={`/${item.nome}`} className="border border-gray-400 rounded-lg" key={item.nome}>
                        <div className="flex flex-col justify-center items-center gap-2 min-h-28 p-2">
                            <Image src={`/assets/brasileirao/logos-brasileirao/${item.logo}`} alt="Logo" width={50} height={50} quality={100} />
                            <div className="text-sm text-center font-bold">{item.nome}</div>
                        </div>
                    </Link>
                    ))}
                </div>
            }
        </div>
    )
}
