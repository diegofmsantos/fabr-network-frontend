import { useQuery } from '@tanstack/react-query'
import { SuperligaService } from '@/services/superliga.service'
import { useTemporadaStore } from '@/stores/temporadaStore'

export const superligaQueryKeys = {
  all: ['superliga'] as const,

  temporada: (temporada: string) => [...superligaQueryKeys.all, temporada] as const,
  status: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'status'] as const,
  conferencias: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'conferencias'] as const,
  times: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'times'] as const,
  jogos: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'jogos'] as const,
  classificacao: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'classificacao'] as const,
  bracket: (temporada: string) => [...superligaQueryKeys.temporada(temporada), 'bracket'] as const,
}


export function useSuperliga(temporada: string) {
  return useQuery({
    queryKey: superligaQueryKeys.temporada(temporada),
    queryFn: () => SuperligaService.getSuperliga(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 10,
    retry: 3,
    refetchOnWindowFocus: false,
  })
}

export function useStatusSuperliga(temporada: string) {
  return useQuery({
    queryKey: superligaQueryKeys.status(temporada),
    queryFn: () => SuperligaService.getStatus(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useConferencias(temporada: string) {
  return useQuery({
    queryKey: superligaQueryKeys.conferencias(temporada),
    queryFn: () => SuperligaService.getConferencias(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useTimesPorConferencia(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.times(temporada), 'por-conferencia'],
    queryFn: () => SuperligaService.getTimesPorConferencia(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 15,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useJogosSuperliga(temporada: string, filters?: {
  conferencia?: string
  fase?: string
  rodada?: number
  status?: string
}) {
  const divisao = useTemporadaStore((s) => s.divisao)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
  const divisaoAtiva = hasHydrated ? divisao : 'D1'

  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(temporada), divisaoAtiva, filters],
    queryFn: () => SuperligaService.getJogos(temporada, { ...filters, divisao: divisaoAtiva }),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useProximosJogos(temporada: string, limite: number = 5) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(temporada), 'proximos', limite],
    queryFn: () => SuperligaService.getProximosJogos(temporada, limite),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 3,
    retry: 2,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  })
}

export function useUltimosResultados(temporada: string, limite: number = 5) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(temporada), 'resultados', limite],
    queryFn: () => SuperligaService.getUltimosResultados(temporada, limite),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useJogosPorRodada(temporada: string, rodada: number) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(temporada), 'rodada', rodada],
    queryFn: () => SuperligaService.getJogosPorRodada(temporada, rodada),
    enabled: !!temporada && !!rodada,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}


export function useClassificacaoGeral(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), 'geral'],
    queryFn: () => SuperligaService.getClassificacaoGeral(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useClassificacaoConferencia(temporada: string, conferencia: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), 'conferencia', conferencia],
    queryFn: () => SuperligaService.getClassificacaoConferencia(temporada, conferencia),
    enabled: !!temporada && !!conferencia,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useClassificacaoRegional(temporada: string, regional: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), 'regional', regional],
    queryFn: () => SuperligaService.getClassificacaoRegional(temporada, regional),
    enabled: !!temporada && !!regional,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useRankingGeral(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), 'ranking'],
    queryFn: () => SuperligaService.getRankingGeral(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 15,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useWildCardRanking(temporada: string, conferencia: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), 'wildcard', conferencia],
    queryFn: () => SuperligaService.getWildCardRanking(temporada, conferencia),
    enabled: !!temporada && !!conferencia,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function usePlayoffBracket(temporada: string) {
  return useQuery({
    queryKey: superligaQueryKeys.bracket(temporada),
    queryFn: () => SuperligaService.getBracket(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function usePlayoffsConferencia(temporada: string, conferencia: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.bracket(temporada), 'conferencia', conferencia],
    queryFn: () => SuperligaService.getPlayoffsConferencia(temporada, conferencia),
    enabled: !!temporada && !!conferencia,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useFaseNacional(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.bracket(temporada), 'nacional'],
    queryFn: () => SuperligaService.getFaseNacional(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}


export function useEstatisticasSuperliga(temporada: string) {
  return useQuery({
    queryKey: [...superligaQueryKeys.temporada(temporada), 'estatisticas'],
    queryFn: () => SuperligaService.getEstatisticas(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 15,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useHistoricoSuperliga(temporadas: string[]) {
  return useQuery({
    queryKey: [...superligaQueryKeys.all, 'historico', temporadas],
    queryFn: () => SuperligaService.getHistorico(temporadas),
    enabled: temporadas.length > 0,
    staleTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useSuperligaCompleta(temporada: string) {
  const superliga = useSuperliga(temporada)
  const status = useStatusSuperliga(temporada)
  const conferencias = useConferencias(temporada)
  const proximosJogos = useProximosJogos(temporada, 3)
  const ultimosResultados = useUltimosResultados(temporada, 3)

  return {
    superliga: superliga.data,
    status: status.data,
    conferencias: conferencias.data,
    proximosJogos: proximosJogos.data,
    ultimosResultados: ultimosResultados.data,
    isLoading: superliga.isLoading || status.isLoading || conferencias.isLoading,
    error: superliga.error || status.error || conferencias.error,
    refetch: () => {
      superliga.refetch()
      status.refetch()
      conferencias.refetch()
      proximosJogos.refetch()
      ultimosResultados.refetch()
    }
  }
}

export function usePlayoffCompleto(temporada: string) {
  const bracket = usePlayoffBracket(temporada)
  const faseNacional = useFaseNacional(temporada)
  const status = useStatusSuperliga(temporada)

  return {
    bracket: bracket.data,
    faseNacional: faseNacional.data,
    status: status.data,
    isLoading: bracket.isLoading || faseNacional.isLoading || status.isLoading,
    error: bracket.error || faseNacional.error || status.error,
    refetch: () => {
      bracket.refetch()
      faseNacional.refetch()
      status.refetch()
    }
  }
}

export function useClassificacaoCompleta(temporada: string) {
  const geral = useClassificacaoGeral(temporada)
  const ranking = useRankingGeral(temporada)
  const conferencias = useConferencias(temporada)

  return {
    geral: geral.data,
    ranking: ranking.data,
    conferencias: conferencias.data,
    isLoading: geral.isLoading || ranking.isLoading || conferencias.isLoading,
    error: geral.error || ranking.error || conferencias.error,
    refetch: () => {
      geral.refetch()
      ranking.refetch()
      conferencias.refetch()
    }
  }
}

export function useConferenciaDetalhes(temporada: string, conferencia: string) {
  const classificacao = useClassificacaoConferencia(temporada, conferencia)
  const wildcard = useWildCardRanking(temporada, conferencia)
  const playoffs = usePlayoffsConferencia(temporada, conferencia)

  return {
    classificacao: classificacao.data,
    wildcard: wildcard.data,
    playoffs: playoffs.data,
    isLoading: classificacao.isLoading || wildcard.isLoading || playoffs.isLoading,
    error: classificacao.error || wildcard.error || playoffs.error,
    refetch: () => {
      classificacao.refetch()
      wildcard.refetch()
      playoffs.refetch()
    }
  }
}

export function useTemporadas() {
  return useQuery({
    queryKey: [...superligaQueryKeys.all, 'temporadas'],
    queryFn: () => SuperligaService.listarTemporadas(),
    staleTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useTemporadaAtual() {
  return useQuery({
    queryKey: [...superligaQueryKeys.all, 'atual'],
    queryFn: () => SuperligaService.getTemporadaAtual(),
    staleTime: 1000 * 60 * 30,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useBuscarJogos(temporada: string, filtros: {
  conferencia?: string
  fase?: string
  rodada?: number
  status?: string
}) {
  return useQuery({
    queryKey: [...superligaQueryKeys.jogos(temporada), 'busca', filtros],
    queryFn: () => SuperligaService.getJogos(temporada, filtros),
    enabled: !!temporada && Object.keys(filtros).length > 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useSuperligaPorFase(temporada: string, fase: string) {
  const jogos = useJogosSuperliga(temporada, { fase })
  const status = useStatusSuperliga(temporada)

  return {
    jogos: jogos.data,
    status: status.data,
    isLoading: jogos.isLoading || status.isLoading,
    error: jogos.error || status.error,
    refetch: () => {
      jogos.refetch()
      status.refetch()
    }
  }
}

export function useClassificacaoSuperliga(temporada: string) {
  const divisao = useTemporadaStore((s) => s.divisao)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
  const divisaoAtiva = hasHydrated ? divisao : 'D1'

  return useQuery({
    queryKey: [...superligaQueryKeys.classificacao(temporada), divisaoAtiva],
    queryFn: () => SuperligaService.getClassificacao(temporada, divisaoAtiva),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

