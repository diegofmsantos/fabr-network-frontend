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
            <header className="w-full h-44 bg-[#17181C] flex flex-col justify-center items-center gap-4 border-b-2 border-[#96E301]">
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
                <div>
                    {BFA.map(item => (
                        <Link href={`/${item.nome}`} className="flex items-center gap-8 px-2 py-1 pl-4 border-b" key={item.nome}>
                            <div className="flex items-center gap-2 min-w-52">
                                <Image src={`/assets/bfa/logos-bfa/${item.logo}`} alt="Logo" width={25} height={25} quality={100} />
                                <div className="text-sm">{item.nome}</div>
                            </div>
                            <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 opacity-50" />
                        </Link>
                    ))}
                </div>
            }

            {selectedButton === 'brasileirao' &&
                <div>
                    {Brasileirao.map(item => (
                        <Link href={`/${item.nome}`} className="flex items-center gap-8 px-2 py-1 pl-4 border-b" key={item.nome}>
                            <div className="flex items-center gap-2 min-w-52">
                                <Image src={`/assets/brasileirao/logos-brasileirao/${item.logo}`} alt="Logo" width={30} height={30} quality={100} />
                                <div className="text-sm">{item.nome}</div>
                            </div>
                            <FontAwesomeIcon icon={faAngleRight} className="w-3 h-3 opacity-50" />
                        </Link>
                    ))}
                </div>
            }
        </div>
    )
}
