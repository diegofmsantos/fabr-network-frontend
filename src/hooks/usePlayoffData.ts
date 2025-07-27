import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { SuperligaService } from '@/services/superliga.service'

function getConferenciaColor(tipo?: string) {
  switch (tipo?.toUpperCase()) {
    case 'SUDESTE': return 'bg-red-600'
    case 'SUL': return 'bg-cyan-500' 
    case 'NORDESTE': return 'bg-orange-500'
    case 'CENTRO NORTE': return 'bg-green-600'
    default: return 'bg-gray-600'
  }
}

function getConferenciaNome(conf: any) {
  if (!conf) return 'Conferência'
  return conf.nome || conf.tipo || 'Conferência'
}

function getConferenciaKey(conf: any, index: number) {
  if (!conf) return `conf_${index}`
  return conf.tipo || conf.nome || `conf_${index}`
}

export function usePlayoffData(temporada: string) {
  const { 
    data: rawBracket, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['superliga', temporada, 'bracket'],
    queryFn: () => SuperligaService.getBracket(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 30, 
    retry: 3,
    refetchOnWindowFocus: true,
  })

  const convertedData = useMemo(() => {
    if (!rawBracket || !Array.isArray(rawBracket)) return null

    console.log('🎯 usePlayoffData: Processando', rawBracket.length, 'jogos de playoff')

    return {
      wildCard: (() => {
        if (!rawBracket || !Array.isArray(rawBracket)) return []

        const wildCardJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'WILD CARD' || jogo.fase === 'WildCard'
        )

        console.log('🎯 Wild Cards encontrados:', wildCardJogos.length)
        if (wildCardJogos.length > 0) {
          console.log('🎯 Primeiro Wild Card:', {
            id: wildCardJogos[0].id,
            placarTime1: wildCardJogos[0].placarTime1,
            placarTime2: wildCardJogos[0].placarTime2,
            status: wildCardJogos[0].status
          })
        }

        const conferenciasMap = new Map()

        wildCardJogos.forEach((jogo: any, index: number) => {
          const conf = jogo.conferencia
          const confKey = getConferenciaKey(conf, index)
          
          if (!conferenciasMap.has(confKey)) {
            conferenciasMap.set(confKey, {
              key: confKey,
              nome: getConferenciaNome(conf), 
              cor: getConferenciaColor(conf?.tipo || conf?.nome), 
              jogos: []
            })
          }

          conferenciasMap.get(confKey).jogos.push({
            id: jogo.id,
            time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'A definir',
            time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'A definir',
            descricao: jogo.nome || `${jogo.timeClassificado1?.nome || 'Time 1'} × ${jogo.timeClassificado2?.nome || 'Time 2'}`,
            placar1: jogo.placarTime1 !== null ? jogo.placarTime1 : jogo.placarCasa,
            placar2: jogo.placarTime2 !== null ? jogo.placarTime2 : jogo.placarVisitante,
            status: jogo.status,
            dataJogo: jogo.dataJogo,
            vencedor: jogo.timeVencedor
          })
        })

        return Array.from(conferenciasMap.values())
      })(),

      semifinalConferencia: (() => {
        if (!rawBracket || !Array.isArray(rawBracket)) return []

        const semifinalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'SEMIFINAL CONFERENCIA' || jogo.fase === 'SemifinalConferencia' ||
          jogo.fase === 'SEMIFINAL DE CONFERÊNCIA'
        )

        console.log('🎯 Semifinais Conferência:', semifinalJogos.length)

        const conferenciasMap = new Map()

        semifinalJogos.forEach((jogo: any, index: number) => {
          const conf = jogo.conferencia
          const confKey = getConferenciaKey(conf, index)
          
          if (!conferenciasMap.has(confKey)) {
            conferenciasMap.set(confKey, {
              key: confKey, 
              nome: getConferenciaNome(conf),
              cor: getConferenciaColor(conf?.tipo || conf?.nome), 
              jogos: []
            })
          }

          conferenciasMap.get(confKey).jogos.push({
            id: jogo.id,
            time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'A definir',
            time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'A definir',
            descricao: jogo.nome || `Semifinal ${conferenciasMap.get(confKey).jogos.length + 1}`,
            placar1: jogo.placarTime1 !== null ? jogo.placarTime1 : jogo.placarCasa,
            placar2: jogo.placarTime2 !== null ? jogo.placarTime2 : jogo.placarVisitante,
            status: jogo.status,
            dataJogo: jogo.dataJogo,
            vencedor: jogo.timeVencedor
          })
        })

        return Array.from(conferenciasMap.values())
      })(),

      finalConferencia: (() => {
        if (!rawBracket || !Array.isArray(rawBracket)) return []

        const finalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'FINAL CONFERENCIA' || jogo.fase === 'FinalConferencia' ||
          jogo.fase === 'FINAL DE CONFERÊNCIA'
        )

        console.log('🎯 Finais Conferência:', finalJogos.length)

        const conferenciasMap = new Map()

        finalJogos.forEach((jogo: any, index: number) => {
          const conf = jogo.conferencia
          const confKey = getConferenciaKey(conf, index)
          
          if (!conferenciasMap.has(confKey)) {
            conferenciasMap.set(confKey, {
              key: confKey,
              nome: getConferenciaNome(conf),
              cor: getConferenciaColor(conf?.tipo || conf?.nome),
              jogo: null
            })
          }

          conferenciasMap.get(confKey).jogo = {
            id: jogo.id,
            time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'A definir',
            time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'A definir',
            descricao: jogo.nome || 'Final de Conferência',
            // ✅ CORREÇÃO PRINCIPAL
            placar1: jogo.placarTime1 !== null ? jogo.placarTime1 : jogo.placarCasa,
            placar2: jogo.placarTime2 !== null ? jogo.placarTime2 : jogo.placarVisitante,
            status: jogo.status,
            dataJogo: jogo.dataJogo,
            vencedor: jogo.timeVencedor
          }
        })

        return Array.from(conferenciasMap.values())
      })(),

      semifinalNacional: (() => {
        if (!rawBracket || !Array.isArray(rawBracket)) return []

        const semifinalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'SEMIFINAL NACIONAL'
        )

        console.log('🎯 Semifinais Nacionais:', semifinalJogos.length)

        return semifinalJogos.map((jogo: any, index: number) => ({
          id: jogo.id,
          nome: jogo.nome || `Semifinal Nacional ${index + 1}`,
          time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || `Campeão Conferência ${index === 0 ? '1' : '3'}`,
          time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || `Campeão Conferência ${index === 0 ? '2' : '4'}`,
          // ✅ CORREÇÃO PRINCIPAL
          placar1: jogo.placarTime1 !== null ? jogo.placarTime1 : jogo.placarCasa,
          placar2: jogo.placarTime2 !== null ? jogo.placarTime2 : jogo.placarVisitante,
          status: jogo.status,
          dataJogo: jogo.dataJogo,
          vencedor: jogo.timeVencedor
        }))
      })(),

      finalNacional: (() => {
        if (!rawBracket || !Array.isArray(rawBracket)) return null

        const finalJogo = rawBracket.find((jogo: any) =>
          jogo.fase === 'FINAL NACIONAL' || jogo.fase === 'FinalNacional'
        )

        if (!finalJogo) return null

        console.log('🎯 Final Nacional:', {
          id: finalJogo.id,
          placarTime1: finalJogo.placarTime1,
          placarTime2: finalJogo.placarTime2,
          status: finalJogo.status
        })

        return {
          time1: finalJogo.timeClassificado1?.nome || finalJogo.timeCasa?.nome || 'Vencedor Semifinal 1',
          time2: finalJogo.timeClassificado2?.nome || finalJogo.timeVisitante?.nome || 'Vencedor Semifinal 2',
          // ✅ CORREÇÃO PRINCIPAL
          placar1: finalJogo.placarTime1 !== null ? finalJogo.placarTime1 : finalJogo.placarCasa,
          placar2: finalJogo.placarTime2 !== null ? finalJogo.placarTime2 : finalJogo.placarVisitante,
          status: finalJogo.status,
          dataJogo: finalJogo.dataJogo,
          vencedor: finalJogo.timeVencedor,
          local: finalJogo.local || 'Arena Nacional'
        }
      })()
    }
  }, [rawBracket])

  return {
    isLoading,
    error,
    wildCard: convertedData?.wildCard || [],
    semifinalConferencia: convertedData?.semifinalConferencia || [],
    finalConferencia: convertedData?.finalConferencia || [],
    semifinalNacional: convertedData?.semifinalNacional || [],
    finalNacional: convertedData?.finalNacional || null,
    rawData: rawBracket
  }
}

// ✅ Manter todas as funções existentes que as páginas usam
export function useWildCardData(temporada: string) {
  const { wildCard, isLoading, error } = usePlayoffData(temporada)
  return { data: wildCard, isLoading, error }
}

export function useSemifinalConferenciaData(temporada: string) {
  const { semifinalConferencia, isLoading, error } = usePlayoffData(temporada)
  return { data: semifinalConferencia, isLoading, error }
}

export function useFinalConferenciaData(temporada: string) {
  const { finalConferencia, isLoading, error } = usePlayoffData(temporada)
  
  const safeData = finalConferencia?.map(conf => ({
    ...conf,
    jogo: conf.jogo || {
      id: 0,
      time1: 'A definir',
      time2: 'A definir', 
      descricao: 'Aguardando definição',
      status: 'AGUARDANDO'
    }
  })) || []
  
  return { data: safeData, isLoading, error }
}

export function useSemifinalNacionalData(temporada: string) {
  const { semifinalNacional, isLoading, error } = usePlayoffData(temporada)
  return { data: semifinalNacional, isLoading, error }
}

export function useFinalNacionalData(temporada: string) {
  const { finalNacional, isLoading, error } = usePlayoffData(temporada)
  return { data: finalNacional, isLoading, error }
}