import { usePlayoffBracket } from '@/hooks/useSuperliga'

// Tipos para as páginas
interface PlayoffJogo {
  id: number
  time1: string
  time2: string
  descricao: string
  placar1?: number
  placar2?: number
  status: string
  dataJogo?: string
  vencedor?: { nome: string }
}

interface ConferenciaPlayoff {
  key: string
  nome: string
  cor: string
  jogos: PlayoffJogo[]
}

interface SemifinalNacional {
  nome: string
  time1: string
  time2: string
  placar1?: number
  placar2?: number
  status: string
  dataJogo?: string
  vencedor?: { nome: string }
}

interface FinalNacional {
  time1: string
  time2: string
  placar1?: number
  placar2?: number
  status: string
  dataJogo?: string
  vencedor?: { nome: string }
  local?: string
}

export function usePlayoffData(temporada: string) {
  const { data: rawBracket, isLoading, error } = usePlayoffBracket(temporada)

  const getConferenciaColor = (conferencia: any) => {
    if (!conferencia) return 'bg-gray-500'

    const conferenciaStr = typeof conferencia === 'string'
      ? conferencia
      : conferencia.tipo || conferencia.nome || String(conferencia)

    switch (conferenciaStr?.toUpperCase()) {
      case 'SUDESTE': return 'bg-red-600'
      case 'SUL': return 'bg-cyan-500'
      case 'NORDESTE': return 'bg-orange-500'
      case 'CENTRO_NORTE':
      case 'CENTRO-NORTE': return 'bg-green-600'
      default: return 'bg-gray-500'
    }
  }

  // Converter dados brutos para formato das páginas
  const convertedData = rawBracket ? {
    // ✅ WILD CARD
    wildCard: (() => {
      if (!rawBracket || !Array.isArray(rawBracket)) return []

      const wildCardJogos = rawBracket.filter((jogo: any) =>
        jogo.fase === 'WILD_CARD' || jogo.fase === 'WildCard'
      )

      const conferenciasMap = new Map()

      wildCardJogos.forEach((jogo: any) => {
        const conf = jogo.conferencia || 'INDEFINIDA'
        if (!conferenciasMap.has(conf)) {
          conferenciasMap.set(conf, {
            key: conf,
            nome: `CONFERÊNCIA ${conf}`,
            cor: getConferenciaColor(conf),
            jogos: []
          })
        }

        conferenciasMap.get(conf).jogos.push({
          id: jogo.id,
          time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'A definir',
          time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'A definir',
          descricao: jogo.nome || `${jogo.timeClassificado1?.nome || 'Time 1'} × ${jogo.timeClassificado2?.nome || 'Time 2'}`,
          placar1: jogo.placarTime1 || jogo.placarCasa,
          placar2: jogo.placarTime2 || jogo.placarVisitante,
          status: jogo.status,
          dataJogo: jogo.dataJogo,
          vencedor: jogo.timeVencedor
        })
      })

      return Array.from(conferenciasMap.values())
    })(),

    // ✅ SEMIFINAL DE CONFERÊNCIA
    semifinalConferencia: (() => {
      if (!rawBracket || !Array.isArray(rawBracket)) return []

      const semifinalJogos = rawBracket.filter((jogo: any) =>
        jogo.fase === 'SEMIFINAL_CONFERENCIA' || jogo.fase === 'SemifinalConferencia'
      )

      const conferenciasMap = new Map()

      semifinalJogos.forEach((jogo: any) => {
        const conf = jogo.conferencia || 'INDEFINIDA'
        if (!conferenciasMap.has(conf)) {
          conferenciasMap.set(conf, {
            key: conf,
            nome: `CONFERÊNCIA ${conf}`,
            cor: getConferenciaColor(conf),
            jogos: []
          })
        }

        conferenciasMap.get(conf).jogos.push({
          id: jogo.id,
          time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'A definir',
          time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'A definir',
          descricao: jogo.nome || `${jogo.timeClassificado1?.nome || 'Time 1'} × ${jogo.timeClassificado2?.nome || 'Time 2'}`,
          placar1: jogo.placarTime1 || jogo.placarCasa,
          placar2: jogo.placarTime2 || jogo.placarVisitante,
          status: jogo.status,
          dataJogo: jogo.dataJogo,
          vencedor: jogo.timeVencedor
        })
      })

      return Array.from(conferenciasMap.values())
    })(),

    // ✅ FINAL DE CONFERÊNCIA
    finalConferencia: (() => {
      if (!rawBracket || !Array.isArray(rawBracket)) return []

      const finalJogos = rawBracket.filter((jogo: any) =>
        jogo.fase === 'FINAL_CONFERENCIA' || jogo.fase === 'FinalConferencia'
      )

      return finalJogos.map((jogo: any) => ({
        nome: `CONFERÊNCIA ${jogo.conferencia || 'INDEFINIDA'}`,
        cor: getConferenciaColor(jogo.conferencia),
        jogo: {
          id: jogo.id,
          time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'Semifinal 1',
          time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'Semifinal 2',
          descricao: jogo.nome || `${jogo.timeClassificado1?.nome || 'Semifinal1'} × ${jogo.timeClassificado2?.nome || 'Semifinal2'}`,
          placar1: jogo.placarTime1 || jogo.placarCasa,
          placar2: jogo.placarTime2 || jogo.placarVisitante,
          status: jogo.status,
          dataJogo: jogo.dataJogo,
          vencedor: jogo.timeVencedor
        }
      }))
    })(),

    // ✅ SEMIFINAL NACIONAL
    semifinalNacional: (() => {
      if (!rawBracket || !Array.isArray(rawBracket)) return []

      const semifinalNacionalJogos = rawBracket.filter((jogo: any) =>
        jogo.fase === 'SEMIFINAL_NACIONAL' || jogo.fase === 'SemifinalNacional'
      )

      return semifinalNacionalJogos.map((jogo: any, index: number) => ({
        nome: jogo.nome || `SEMIFINAL ${index + 1}`,
        time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || `Campeão Conferência ${index === 0 ? '1' : '3'}`,
        time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || `Campeão Conferência ${index === 0 ? '2' : '4'}`,
        placar1: jogo.placarTime1 || jogo.placarCasa,
        placar2: jogo.placarTime2 || jogo.placarVisitante,
        status: jogo.status,
        dataJogo: jogo.dataJogo,
        vencedor: jogo.timeVencedor
      }))
    })(),

    // ✅ FINAL NACIONAL
    finalNacional: (() => {
      if (!rawBracket || !Array.isArray(rawBracket)) return null

      const finalJogo = rawBracket.find((jogo: any) =>
        jogo.fase === 'FINAL_NACIONAL' || jogo.fase === 'FinalNacional'
      )

      if (!finalJogo) return null

      return {
        time1: finalJogo.timeClassificado1?.nome || finalJogo.timeCasa?.nome || 'Vencedor Semifinal 1',
        time2: finalJogo.timeClassificado2?.nome || finalJogo.timeVisitante?.nome || 'Vencedor Semifinal 2',
        placar1: finalJogo.placarTime1 || finalJogo.placarCasa,
        placar2: finalJogo.placarTime2 || finalJogo.placarVisitante,
        status: finalJogo.status,
        dataJogo: finalJogo.dataJogo,
        vencedor: finalJogo.timeVencedor,
        local: finalJogo.local || 'Arena Nacional'
      }
    })()

  } : null

  return {
    isLoading,
    error,
    // Dados convertidos para cada página
    wildCard: convertedData?.wildCard || [],
    semifinalConferencia: convertedData?.semifinalConferencia || [],
    finalConferencia: convertedData?.finalConferencia || [],
    semifinalNacional: convertedData?.semifinalNacional || [],
    finalNacional: convertedData?.finalNacional || null,

    // Dados brutos para debug
    rawData: rawBracket
  }
}

// ✅ HOOKS ESPECÍFICOS PARA CADA PÁGINA
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
  return { data: finalConferencia, isLoading, error }
}

export function useSemifinalNacionalData(temporada: string) {
  const { semifinalNacional, isLoading, error } = usePlayoffData(temporada)
  return { data: semifinalNacional, isLoading, error }
}

export function useFinalNacionalData(temporada: string) {
  const { finalNacional, isLoading, error } = usePlayoffData(temporada)
  return { data: finalNacional, isLoading, error }
}