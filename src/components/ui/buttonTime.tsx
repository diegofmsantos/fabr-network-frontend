"use client"

import { ReactNode } from "react"

type Props = {
    label: string
    isSelected?: boolean
    onClick?: () => void
    children?: ReactNode
}

export const ButtonTime = ({ label, isSelected, onClick, children }: Props) => {
    return (
        <button
            onClick={onClick}
            className={`w-36 h-10 border flex flex-col justify-center items-center text-md font-bold rounded-md transition duration-500
                ${isSelected ? 'bg-white text-black' : 'bg-black/20 text-white'}`}
        >
            {children}
            {label}
        </button>
    )
}
