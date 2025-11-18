import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { SuperligaService } from '@/services/superliga.service'

function getConferenciaColor(tipo?: string) {
  switch (tipo?.toUpperCase()) {
    case 'SUDESTE': return 'bg-red-600'
    case 'SUL': return 'bg-cyan-500'
    case 'NORDESTE': return 'bg-orange-500'
    case 'CENTRO-NORTE': return 'bg-green-600'
    default: return 'bg-gray-600'
  }
}

function getConferenciaNome(conf: any) {
  if (typeof conf === 'string') return conf
  if (conf?.nome) return conf.nome
  if (conf?.tipo) return conf.tipo
  return 'Conferência'
}

function getConferenciaKey(conf: any, index: number) {
  if (typeof conf === 'string') return conf.toUpperCase().replace(/\s+/g, '_')
  if (conf?.tipo) return conf.tipo
  if (conf?.nome) return conf.nome
  return `conf_${index}`
}

// MOCK DA FINAL NACIONAL - Coritiba Crocodiles vs Recife Mariners
const MOCK_FINAL_NACIONAL = {
  id: 'mock-fn-1',
  nome: 'FINAL NACIONAL',
  time1: 'Coritiba Crocodiles',
  time2: 'Recife Mariners',
  placar1: null,
  placar2: null,
  status: 'AGENDADO',
  dataJogo: '2025-12-06T20:00:00.000Z',
  vencedor: null,
  local: 'Couto Pereira'
}

const MOCK_PLAYOFFS = {
  wildCard: [],
  semifinalConferencia: [],
  finalConferencia: [],
  semifinalNacional: [],
  finalNacional: null
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
    if (!rawBracket || !Array.isArray(rawBracket) || rawBracket.length === 0) {
      console.log('🎯 usePlayoffData: Nenhum jogo de playoff encontrado')
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
              cor: getConferenciaColor(conf),
              jogos: []
            })
          }

          conferenciasMap.get(confKey).jogos.push({
            id: jogo.id,
            time1: jogo.timeCasa?.nome || 'A definir',
            time2: jogo.timeVisitante?.nome || 'A definir',
            descricao: jogo.nome || `${jogo.timeCasa?.nome || 'Time 1'} × ${jogo.timeVisitante?.nome || 'Time 2'}`,
            placar1: jogo.placarCasa,
            placar2: jogo.placarVisitante,
            status: jogo.status,
            dataJogo: jogo.dataJogo,
            vencedor: jogo.timeVencedorId === jogo.timeCasaId ? jogo.timeCasa?.nome :
              jogo.timeVencedorId === jogo.timeVisitanteId ? jogo.timeVisitante?.nome : null,
            local: jogo.local || 'Estádio'
          })
        })

        return Array.from(conferenciasMap.values())
      })(),

      semifinalConferencia: (() => {
        const semifinalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'SEMIFINAL DE CONFERÊNCIA' || jogo.fase === 'SEMIFINAL CONFERENCIA'
        )

        console.log('🎯 Semifinais de conferência encontradas:', semifinalJogos.length)

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
            time1: jogo.timeCasa?.nome || 'A definir',
            time2: jogo.timeVisitante?.nome || 'A definir',
            descricao: jogo.nome || `${jogo.timeCasa?.nome || 'Time 1'} × ${jogo.timeVisitante?.nome || 'Time 2'}`,
            placar1: jogo.placarCasa,
            placar2: jogo.placarVisitante,
            status: jogo.status,
            dataJogo: jogo.dataJogo,
            vencedor: jogo.timeVencedorId === jogo.timeCasaId ? jogo.timeCasa?.nome :
              jogo.timeVencedorId === jogo.timeVisitanteId ? jogo.timeCasa?.nome : null,
            local: jogo.local || 'Estádio'
          })
        })

        return Array.from(conferenciasMap.values())
      })(),

      finalConferencia: (() => {
        const finalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'FINAL DE CONFERÊNCIA' || jogo.fase === 'FINAL CONFERENCIA'
        )

        console.log('🎯 Finais de conferência encontradas:', finalJogos.length)

        const conferenciasMap = new Map()

        finalJogos.forEach((jogo: any, index: number) => {
          const conf = jogo.conferencia
          const confKey = getConferenciaKey(conf, index)

          if (!conferenciasMap.has(confKey)) {
            conferenciasMap.set(confKey, {
              key: confKey,
              nome: getConferenciaNome(conf),
              cor: getConferenciaColor(conf),
              jogo: null
            })
          }

          conferenciasMap.get(confKey).jogo = {
            id: jogo.id,
            time1: jogo.timeCasa?.nome || 'A definir',
            time2: jogo.timeVisitante?.nome || 'A definir',
            descricao: jogo.nome || `Final ${getConferenciaNome(conf)}`,
            placar1: jogo.placarCasa,
            placar2: jogo.placarVisitante,
            status: jogo.status,
            dataJogo: jogo.dataJogo,
            vencedor: jogo.timeVencedorId === jogo.timeCasaId ? jogo.timeCasa?.nome :
              jogo.timeVencedorId === jogo.timeVisitanteId ? jogo.timeVisitante?.nome : null,
            local: jogo.local || 'Estádio'
          }
        })

        return Array.from(conferenciasMap.values())
      })(),

      semifinalNacional: (() => {
        const semifinalJogos = rawBracket.filter((jogo: any) =>
          jogo.fase === 'SEMIFINAL NACIONAL'
        )

        console.log('🎯 Semifinais nacionais encontradas:', semifinalJogos.length)

        const jogosComTimes = semifinalJogos.filter((jogo: any) =>
          jogo.timeCasa?.nome && jogo.timeVisitante?.nome
        )
        const jogosSemTimes = semifinalJogos.filter((jogo: any) =>
          !jogo.timeCasa?.nome || !jogo.timeVisitante?.nome
        )

        console.log('🎯 Semifinais COM times:', jogosComTimes.length)
        console.log('🎯 Semifinais SEM times (null):', jogosSemTimes.length)

        // REMOVIDO O MOCK DA SEMIFINAL NACIONAL
        // Agora retorna diretamente os dados do banco ou array vazio
        return semifinalJogos.map((jogo: any) => ({
          id: jogo.id,
          nome: jogo.nome || 'Semifinal Nacional',
          time1: jogo.timeCasa?.nome || 'A definir',
          time2: jogo.timeVisitante?.nome || 'A definir',
          placar1: jogo.placarCasa,
          placar2: jogo.placarVisitante,
          status: jogo.status,
          dataJogo: jogo.dataJogo,
          vencedor: jogo.timeVencedorId === jogo.timeCasaId ? jogo.timeCasa?.nome :
            jogo.timeVencedorId === jogo.timeVisitanteId ? jogo.timeVisitante?.nome : null,
          local: jogo.local || 'Arena Nacional'
        }))
      })(),

      finalNacional: (() => {
        const finalJogo = rawBracket.find((jogo: any) =>
          jogo.fase === 'FINAL NACIONAL'
        )

        // Se não encontrar a final no banco, usa o MOCK
        if (!finalJogo) {
          console.log('⚠️ Usando MOCK da Final Nacional (Coritiba Crocodiles vs Recife Mariners)')
          return MOCK_FINAL_NACIONAL
        }

        console.log('🎯 Final nacional encontrada no banco')

        // Se os times ainda não estão definidos, usa o MOCK
        if (!finalJogo.timeCasa?.nome || !finalJogo.timeVisitante?.nome) {
          console.log('⚠️ Usando MOCK da Final Nacional (times ainda não definidos)')
          return MOCK_FINAL_NACIONAL
        }

        return {
          id: finalJogo.id,
          nome: finalJogo.nome || 'FINAL NACIONAL',
          time1: finalJogo.timeCasa?.nome || 'A definir',
          time2: finalJogo.timeVisitante?.nome || 'A definir',
          placar1: finalJogo.placarCasa,
          placar2: finalJogo.placarVisitante,
          status: finalJogo.status,
          dataJogo: finalJogo.dataJogo,
          vencedor: finalJogo.timeVencedorId === finalJogo.timeCasaId ? finalJogo.timeCasa?.nome :
            finalJogo.timeVencedorId === finalJogo.timeVisitanteId ? finalJogo.timeVisitante?.nome : null,
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