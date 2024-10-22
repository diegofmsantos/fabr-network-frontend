"use client"

import { useState } from "react"
import { Button } from "./ui/button"

export const Header = () => {

    const [clicked, setClicked] = useState(false)

    const handleBtnClicked = () => {

    }

    return (
        <header className="w-full h-32 bg-[#17181C] flex flex-col justify-center items-center gap-4">
            <div className="text-white font-bold text-2xl">FABR - Network</div>
            <div className="flex justify-center items-center gap-4">
                <div className="border-r-2 border-white/70 pr-4">
                    <Button label="Liga BFA" onClick={handleBtnClicked} />
                </div>
                <Button label="Brasileirão" />
            </div>
        </header>
    )
}