"use client"

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTemporadaStore } from '@/stores/temporadaStore'
import type { Temporada } from '@/types'

export default function TabelaLayout({ children }: { children: React.ReactNode }) {
    const params = useParams()
    const setTemporada = useTemporadaStore((s) => s.setTemporada)

    useEffect(() => {
        const t = params?.temporada as string | undefined
        if (t === '2025' || t === '2026') {
            setTemporada(t as Temporada)
        }
    }, [params?.temporada, setTemporada])

    return <>{children}</>
}