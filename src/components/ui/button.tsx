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
            className={`w-28 h-6 flex justify-center items-center gap-1 rounded-3xl text-xs font-bold 
                ${isSelected ? 'bg-green-600 text-white' : 'bg-white text-black'}`}
        >
            {children}
            {label}
        </button>
    )
}
