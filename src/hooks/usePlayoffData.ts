// SUBSTITUA o arquivo src/hooks/usePlayoffData.ts
// SOLUÇÃO: Usar dados mock quando não há jogos de playoff no banco

import { useQuery } from '@tanstack/react-query'
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

// ✅ DADOS MOCK PARA EXIBIR QUANDO NÃO HÁ JOGOS
const MOCK_PLAYOFFS = {
  wildCard: [
    {
      key: 'SUDESTE',
      nome: 'Conferência Sudeste',
      cor: 'bg-red-600',
      jogos: [
        {
          id: 0,
          time1: '3º Melhor 1º',
          time2: '3º Melhor 2º',
          descricao: 'Wild Card Sudeste 1',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO CLASSIFICACÃO',
          dataJogo: null,
          vencedor: null
        },
        {
          id: 0,
          time1: '1º Melhor 2º',
          time2: '2º Melhor 2º',
          descricao: 'Wild Card Sudeste 2',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO CLASSIFICACÃO',
          dataJogo: null,
          vencedor: null
        }
      ]
    },
    {
      key: 'SUL',
      nome: 'Conferência Sul',
      cor: 'bg-cyan-500',
      jogos: [
        {
          id: 0,
          time1: '2º Araucária',
          time2: '3º Pampa',
          descricao: 'Wild Card Sul 1',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO CLASSIFICACÃO',
          dataJogo: null,
          vencedor: null
        },
        {
          id: 0,
          time1: '2º Pampa',
          time2: '3º Araucária',
          descricao: 'Wild Card Sul 2',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO CLASSIFICACÃO',
          dataJogo: null,
          vencedor: null
        }
      ]
    },
    {
      key: 'NORDESTE',
      nome: 'Conferência Nordeste',
      cor: 'bg-orange-500',
      jogos: [
        {
          id: 0,
          time1: '4º Atlântico',
          time2: '5º Atlântico',
          descricao: 'Wild Card Nordeste',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO CLASSIFICACÃO',
          dataJogo: null,
          vencedor: null
        }
      ]
    },
    {
      key: 'CENTRO NORTE',
      nome: 'Conferência Centro-Norte',
      cor: 'bg-green-600',
      jogos: []
    }
  ],
  semifinalConferencia: [
    {
      key: 'SUDESTE',
      nome: 'Conferência Sudeste',
      cor: 'bg-red-600',
      jogos: [
        {
          id: 0,
          time1: '1º Melhor 1º',
          time2: 'Wild Card',
          descricao: 'Semifinal Sudeste 1',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO WILD CARD',
          dataJogo: null,
          vencedor: null
        },
        {
          id: 0,
          time1: '2º Melhor 1º',
          time2: 'Wild Card',
          descricao: 'Semifinal Sudeste 2',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO WILD CARD',
          dataJogo: null,
          vencedor: null
        }
      ]
    },
    {
      key: 'SUL',
      nome: 'Conferência Sul',
      cor: 'bg-cyan-500',
      jogos: [
        {
          id: 0,
          time1: '1º Araucária',
          time2: 'Wild Card',
          descricao: 'Semifinal Sul 1',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO WILD CARD',
          dataJogo: null,
          vencedor: null
        },
        {
          id: 0,
          time1: '1º Pampa',
          time2: 'Wild Card',
          descricao: 'Semifinal Sul 2',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO WILD CARD',
          dataJogo: null,
          vencedor: null
        }
      ]
    },
    {
      key: 'NORDESTE',
      nome: 'Conferência Nordeste',
      cor: 'bg-orange-500',
      jogos: [
        {
          id: 0,
          time1: '1º Atlântico',
          time2: '3º ou Wild Card',
          descricao: 'Semifinal Nordeste 1',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO WILD CARD',
          dataJogo: null,
          vencedor: null
        },
        {
          id: 0,
          time1: '2º Atlântico',
          time2: '3ª ou Wild Card',
          descricao: 'Semifinal Nordeste 2',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO WILD CARD',
          dataJogo: null,
          vencedor: null
        }
      ]
    },
    {
      key: 'CENTRO-NORTE',
      nome: 'Conferência Centro-Norte',
      cor: 'bg-green-600',
      jogos: [
        {
          id: 0,
          time1: '1º Cerrado',
          time2: '2º Cerrado',
          descricao: 'Semifinal Centro-Norte 1',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO WILD CARD',
          dataJogo: null,
          vencedor: null
        },
        {
          id: 0,
          time1: '1º Amazônia',
          time2: '2º Amazônia',
          descricao: 'Semifinal Centro-Norte 2',
          placar1: null,
          placar2: null,
          status: 'AGUARDANDO WILD CARD',
          dataJogo: null,
          vencedor: null
        }
      ]
    }
  ],
  finalConferencia: [
    {
      key: 'SUDESTE',
      nome: 'Conferência Sudeste',
      cor: 'bg-red-600',
      jogo: {
        id: 0,
        time1: 'Semifinal 1',
        time2: 'Semifinal 2',
        descricao: 'Final Sudeste',
        placar1: null,
        placar2: null,
        status: 'AGUARDANDO SEMIFINAL',
        dataJogo: null,
        vencedor: null
      }
    },
    {
      key: 'SUL',
      nome: 'Conferência Sul',
      cor: 'bg-cyan-500',
      jogo: {
        id: 0,
        time1: 'Semifinal 1',
        time2: 'Semifinal 2',
        descricao: 'Final Sul',
        placar1: null,
        placar2: null,
        status: 'AGUARDANDO SEMIFINAL',
        dataJogo: null,
        vencedor: null
      }
    },
    {
      key: 'NORDESTE',
      nome: 'Conferência Nordeste',
      cor: 'bg-orange-500',
      jogo: {
        id: 0,
        time1: 'Semifinal 1',
        time2: 'Semifinal 2',
        descricao: 'Final Nordeste',
        placar1: null,
        placar2: null,
        status: 'AGUARDANDO SEMIFINAL',
        dataJogo: null,
        vencedor: null
      }
    },
    {
      key: 'CENTRO NORTE',
      nome: 'Conferência Centro-Norte',
      cor: 'bg-green-600',
      jogo: {
        id: 0,
        time1: 'Semifinal 1',
        time2: 'Semifinal 2',
        descricao: 'Final Centro-Norte',
        placar1: null,
        placar2: null,
        status: 'AGUARDANDO SEMIFINAL',
        dataJogo: null,
        vencedor: null
      }
    }
  ],
  semifinalNacional: [
    {
      id: 0,
      nome: 'Semifinal Nacional 1',
      time1: 'Campeão Sudeste',
      time2: 'Campeão Sul',
      placar1: null,
      placar2: null,
      status: 'AGUARDANDO FINAL CONFERENCIA',
      dataJogo: null,
      vencedor: null
    },
    {
      id: 0,
      nome: 'Semifinal Nacional 2',
      time1: 'Campeão Nordeste',
      time2: 'Campeão Centro-Norte',
      placar1: null,
      placar2: null,
      status: 'AGUARDANDO FINAL CONFERENCIA',
      dataJogo: null,
      vencedor: null
    }
  ],
  finalNacional: {
    id: 0,
    nome: 'FINAL NACIONAL',
    time1: 'Campeão do Sudeste ou Sul',
    time2: 'Campeão do Nordeste ou Centro-Oeste',
    placar1: null,
    placar2: null,
    status: 'AGUARDANDO SEMIFINAL NACIONAL',
    dataJogo: null,
    vencedor: null,
    local: 'Arena Nacional'
  }
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
    // ✅ SE NÃO HÁ DADOS DO BACKEND, USAR MOCK
    if (!rawBracket || !Array.isArray(rawBracket) || rawBracket.length === 0) {
      console.log('🎯 usePlayoffData: Nenhum jogo de playoff encontrado, usando dados mock')
      return MOCK_PLAYOFFS
    }

    console.log('🎯 usePlayoffData: Processando', rawBracket.length, 'jogos de playoff do banco')

    return {
      wildCard: (() => {
        const wildCardJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'WILD CARD' || jogo.fase === 'WildCard'
        )

        console.log('🎯 Wild Cards encontrados:', wildCardJogos.length)

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
            descricao: jogo.nome || `${jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || 'Time 1'} × ${jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || 'Time 2'}`,
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
        const semifinalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'SEMIFINAL CONFERENCIA' || jogo.fase === 'SEMIFINAL DE CONFERÊNCIA'
        )

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
            descricao: jogo.nome || 'Semifinal de Conferência',
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
        const finalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'FINAL CONFERENCIA' || jogo.fase === 'FINAL DE CONFERÊNCIA'
        )

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
        const semifinalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'SEMIFINAL NACIONAL'
        )

        return semifinalJogos.map((jogo: any, index: number) => ({
          id: jogo.id,
          nome: jogo.nome || `Semifinal Nacional ${index + 1}`,
          time1: jogo.timeClassificado1?.nome || jogo.timeCasa?.nome || `Campeão Conferência ${index === 0 ? '1' : '3'}`,
          time2: jogo.timeClassificado2?.nome || jogo.timeVisitante?.nome || `Campeão Conferência ${index === 0 ? '2' : '4'}`,
          placar1: jogo.placarTime1 !== null ? jogo.placarTime1 : jogo.placarCasa,
          placar2: jogo.placarTime2 !== null ? jogo.placarTime2 : jogo.placarVisitante,
          status: jogo.status,
          dataJogo: jogo.dataJogo,
          vencedor: jogo.timeVencedor
        }))
      })(),

      finalNacional: (() => {
        const finalJogo = rawBracket.find((jogo: any) =>
          jogo.fase === 'FINAL NACIONAL'
        )

        if (!finalJogo) return MOCK_PLAYOFFS.finalNacional

        return {
          id: finalJogo.id,
          nome: finalJogo.nome || 'FINAL NACIONAL',
          time1: finalJogo.timeClassificado1?.nome || finalJogo.timeCasa?.nome || 'Finalista 1',
          time2: finalJogo.timeClassificado2?.nome || finalJogo.timeVisitante?.nome || 'Finalista 2',
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