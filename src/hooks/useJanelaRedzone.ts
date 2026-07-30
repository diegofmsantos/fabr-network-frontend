"use client"

import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SuperligaService } from '@/services/superliga.service'

const BRASIL_OFFSET_MS = 3 * 60 * 60 * 1000
const TRES_HORAS_MS = 3 * 60 * 60 * 1000
const UM_DIA_MS = 24 * 60 * 60 * 1000

/**
 * O backend grava `dataJogo` com os números do horário de Brasília direto,
 * rotulados como UTC (sem conversão real). Aqui replicamos essa mesma
 * convenção para "agora", assim os dois lados ficam no mesmo espaço numérico
 * e dá pra comparar com getTime() normalmente.
 */
function paraEpocaBrasil(data: Date) {
    return data.getTime() - BRASIL_OFFSET_MS
}

function calcularFimDeSemanaAlvo(agoraEpocaBrasil: number) {
    const agora = new Date(agoraEpocaBrasil)
    const diaSemana = agora.getUTCDay() // 0 = domingo ... 6 = sábado

    let diasAteSabado: number
    if (diaSemana === 6) diasAteSabado = 0
    else if (diaSemana === 0) diasAteSabado = -1
    else diasAteSabado = 6 - diaSemana

    const sabado = new Date(Date.UTC(
        agora.getUTCFullYear(),
        agora.getUTCMonth(),
        agora.getUTCDate() + diasAteSabado,
        0, 0, 0, 0
    ))

    const domingoFim = new Date(sabado.getTime() + UM_DIA_MS * 2 - 1)

    return { inicio: sabado, fim: domingoFim }
}

/**
 * Calcula se estamos dentro da janela "Redzone" do fim de semana atual:
 * do início do primeiro jogo de sábado até 3h após o último jogo do fim de semana.
 */
export function useJanelaRedzone() {
    const [agoraReal, setAgoraReal] = useState(() => Date.now())

    useEffect(() => {
        const interval = setInterval(() => setAgoraReal(Date.now()), 60_000)
        return () => clearInterval(interval)
    }, [])

    const agoraEpocaBrasil = paraEpocaBrasil(new Date(agoraReal))
    const { inicio, fim } = calcularFimDeSemanaAlvo(agoraEpocaBrasil)

    const { data } = useQuery({
        queryKey: ['jogos-periodo-redzone', inicio.toISOString(), fim.toISOString()],
        queryFn: () => SuperligaService.getJogosPeriodo(inicio.toISOString(), fim.toISOString()),
        staleTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 10,
    })

    const isLive = useMemo(() => {
        const jogos = data?.jogos || []
        if (jogos.length === 0) return false

        const datasTodas = jogos.map(j => new Date(j.dataJogo).getTime())
        const datasSabado = jogos
            .filter(j => new Date(j.dataJogo).getUTCDay() === 6)
            .map(j => new Date(j.dataJogo).getTime())

        const inicioJanela = datasSabado.length > 0 ? Math.min(...datasSabado) : Math.min(...datasTodas)
        const fimJanela = Math.max(...datasTodas) + TRES_HORAS_MS

        return agoraEpocaBrasil >= inicioJanela && agoraEpocaBrasil <= fimJanela
    }, [data, agoraEpocaBrasil])

    return { isLive }
}
