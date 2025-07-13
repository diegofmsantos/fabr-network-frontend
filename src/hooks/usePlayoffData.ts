import { usePlayoffBracket } from '@/hooks/useSuperliga'

export function usePlayoffData(temporada: string) {
  const { data: rawBracket, isLoading, error } = usePlayoffBracket(temporada)

  const getConferenciaColor = (conferencia: any) => {
    if (!conferencia) return 'bg-gray-500'

    let conferenciaStr = ''
    
    if (typeof conferencia === 'string') {
      conferenciaStr = conferencia
    } else if (typeof conferencia === 'object' && conferencia !== null) {
      conferenciaStr = conferencia.tipo || conferencia.nome || conferencia.sigla || String(conferencia)
    } else {
      conferenciaStr = String(conferencia)
    }

    switch (conferenciaStr?.toUpperCase()) {
      case 'SUDESTE': return 'bg-red-600'
      case 'SUL': return 'bg-cyan-500'
      case 'NORDESTE': return 'bg-orange-500'
      case 'CENTRO NORTE': return 'bg-green-600'
      default: return 'bg-gray-500'
    }
  }

  const getConferenciaNome = (conferencia: any): string => {
    if (!conferencia) return 'INDEFINIDA'
    
    if (typeof conferencia === 'string') {
      return `CONFERÊNCIA ${conferencia.toUpperCase()}`
    } else if (typeof conferencia === 'object' && conferencia !== null) {
      const tipo = conferencia.tipo || conferencia.nome || conferencia.sigla
      return `CONFERÊNCIA ${tipo ? tipo.toUpperCase() : 'INDEFINIDA'}`
    }
    
    return `CONFERÊNCIA ${String(conferencia).toUpperCase()}`
  }

  const getConferenciaKey = (conferencia: any, index: number): string => {
    if (!conferencia) return `conf-${index}`
    
    if (typeof conferencia === 'string') {
      return conferencia.toLowerCase().replace(/\s+/g, '-')
    } else if (typeof conferencia === 'object' && conferencia !== null) {
      const id = conferencia.id || conferencia.tipo || conferencia.nome || index
      return `conf-${id}`.toLowerCase().replace(/\s+/g, '-')
    }
    
    return `conf-${index}`
  }

  const convertedData = rawBracket ? {
    wildCard: (() => {
      if (!rawBracket || !Array.isArray(rawBracket)) return []

      const wildCardJogos = rawBracket.filter((jogo: any) =>
        jogo.fase === 'WILD CARD' || jogo.fase === 'WildCard'
      )

      const conferenciasMap = new Map()

      wildCardJogos.forEach((jogo: any, index: number) => {
        const conf = jogo.conferencia
        const confKey = getConferenciaKey(conf, index)
        
        if (!conferenciasMap.has(confKey)) {
          conferenciasMap.set(confKey, {
            key: confKey, // ✅ Chave única
            nome: getConferenciaNome(conf), 
            cor: getConferenciaColor(conf), 
            jogos: []
          })
        }

        conferenciasMap.get(confKey).jogos.push({
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

    semifinalConferencia: (() => {
      if (!rawBracket || !Array.isArray(rawBracket)) return []

      const semifinalJogos = rawBracket.filter((jogo: any) =>
        jogo.fase === 'SEMIFINAL CONFERENCIA' || jogo.fase === 'SemifinalConferencia'
      )

      const conferenciasMap = new Map()

      semifinalJogos.forEach((jogo: any, index: number) => {
        const conf = jogo.conferencia
        const confKey = getConferenciaKey(conf, index)
        
        if (!conferenciasMap.has(confKey)) {
          conferenciasMap.set(confKey, {
            key: confKey, 
            nome: getConferenciaNome(conf),
            cor: getConferenciaColor(conf), 
            jogos: []
          })
        }

        conferenciasMap.get(confKey).jogos.push({
          id: jogo.id,
          time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'A definir',
          time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'A definir',
          descricao: jogo.nome || `Semifinal ${conferenciasMap.get(confKey).jogos.length + 1}`,
          placar1: jogo.placarTime1 || jogo.placarCasa,
          placar2: jogo.placarTime2 || jogo.placarVisitante,
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
        jogo.fase === 'FINAL CONFERENCIA' || jogo.fase === 'FinalConferencia'
      )

      return finalJogos.map((jogo: any, index: number) => {
        const conf = jogo.conferencia
        const confKey = getConferenciaKey(conf, index)
        
        return {
          key: confKey,
          nome: getConferenciaNome(conf),
          cor: getConferenciaColor(conf),
          jogo: {
            id: jogo.id,
            time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'Vencedor Semifinal 1',
            time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'Vencedor Semifinal 2',
            descricao: jogo.nome || 'Final de Conferência',
            placar1: jogo.placarTime1 || jogo.placarCasa,
            placar2: jogo.placarTime2 || jogo.placarVisitante,
            status: jogo.status,
            dataJogo: jogo.dataJogo,
            vencedor: jogo.timeVencedor
          }
        }
      })
    })(),

    semifinalNacional: (() => {
      if (!rawBracket || !Array.isArray(rawBracket)) return []

      const semifinalJogos = rawBracket.filter((jogo: any) =>
        jogo.fase === 'SEMIFINAL NACIONAL' || jogo.fase === 'SemifinalNacional'
      )

      return semifinalJogos.map((jogo: any, index: number) => ({
        nome: jogo.nome || `Semifinal Nacional ${index + 1}`,
        time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || `Campeão Conferência ${index === 0 ? '1' : '3'}`,
        time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || `Campeão Conferência ${index === 0 ? '2' : '4'}`,
        placar1: jogo.placarTime1 || jogo.placarCasa,
        placar2: jogo.placarTime2 || jogo.placarVisitante,
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
    wildCard: convertedData?.wildCard || [],
    semifinalConferencia: convertedData?.semifinalConferencia || [],
    finalConferencia: convertedData?.finalConferencia || [],
    semifinalNacional: convertedData?.semifinalNacional || [],
    finalNacional: convertedData?.finalNacional || null,

    rawData: rawBracket
  }
}

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