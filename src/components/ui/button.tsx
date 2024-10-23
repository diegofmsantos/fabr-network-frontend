"use client"

import { ReactNode } from "react"

type Props = {
    label: string
    isSelected?: boolean
    onClick?: () => void
    children?: ReactNode
}

export const Button = ({ label, isSelected, onClick, children }: Props) => {
    return (
        <button
            onClick={onClick}
            className={`w-28 h-20 flex flex-col justify-center items-center gap-1 rounded-lg text-sm font-bold 
                ${isSelected ? 'bg-[#96E301] text-gray-600' : 'bg-white text-black'}`}
        >
            {children}
            {label}
        </button>
    )
}
