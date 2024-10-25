"use client"

import Image from "next/image"
import { Button } from "./ui/button"

type Props = {
    selectedButton: 'bfa' | 'brasileirao'
    setSelectedButton: (vaue: 'bfa' | 'brasileirao') => void
}

export const Footer = ({ selectedButton, setSelectedButton }: Props) => {

    const handleShowBfa = () => {
        setSelectedButton('bfa')
    }

    const handleShowBrasileirao = () => {
        setSelectedButton('brasileirao')
    }

    return (
        <footer className="bg-[#DBDBDF] h-16 flex justify-center w-full fixed bottom-0">
            <div className="w-full h-full flex justify-center items-center">
                <div className="flex-1 h-full bg-red-200">
                    <Button
                        label="Liga BFA"
                        onClick={handleShowBfa}
                        isSelected={selectedButton === 'bfa'}
                    >
                        <Image
                            src={`${selectedButton === 'bfa' ? '/assets/logo-bfa-color.png' : '/assets/logo-bfa-preto.png'}`}
                            alt="Logo BFA"
                            width={40}
                            height={40}
                            quality={100} />
                    </Button>
                </div>
                <div className="flex-1 h-full">
                    <Button
                        label="Brasileirão"
                        onClick={handleShowBrasileirao}
                        isSelected={selectedButton === 'brasileirao'}
                    >
                        <Image
                            src={`${selectedButton === 'brasileirao' ? '/assets/logo-brasileirao-color.png' : '/assets/logo-brasileirao-preto.png'}`}
                            alt="Logo BFA"
                            width={40}
                            height={40}
                            quality={100} />
                    </Button>
                </div>
            </div>
        </footer>
    )
}