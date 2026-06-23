"use client"

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTemporadaStore, LIGAS_DISPONIVEIS } from '@/stores/temporadaStore'

export default function TabelaLayout({ children }: { children: React.ReactNode }) {
    const params = useParams()
    const setLiga = useTemporadaStore((s) => s.setLiga)

    useEffect(() => {
        const temporada = params?.temporada as string | undefined
        const divisaoParam = params?.divisao as string | undefined

        if (!temporada || !divisaoParam) return

        const divisao = divisaoParam.toUpperCase() as 'D1' | 'D2'

        // Só atualiza o store se for uma combinação válida
        const valida = LIGAS_DISPONIVEIS.some(
            l => l.temporada === temporada && l.divisao === divisao
        )

        if (valida) {
            setLiga({ divisao, temporada: temporada as '2025' | '2026', label: `${divisao} — ${temporada}` })
        }
    }, [params?.temporada, params?.divisao, setLiga])

    return <>{children}</>
}