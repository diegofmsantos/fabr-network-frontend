// src/hooks/useSuperliga.ts
import { useQuery } from '@tanstack/react-query'
import { SuperligaService } from '@/services/superliga.service'
import { queryKeys } from './queryKeys'

// ==================== ESTRUTURA E VALIDAÇÃO ====================

export function useValidarEstruturaSuperliga(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'validar'],
    queryFn: () => SuperligaService.validarEstruturaSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 2,
  })
}

export function useStatusSuperliga(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'status'],
    queryFn: () => SuperligaService.getStatusSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 1, // 1 minuto (status muda frequentemente)
    retry: 2,
  })
}

// ==================== CLASSIFICAÇÃO ====================

export function useClassificacaoConferencia(campeonatoId: number, conferencia: string) {
  return useQuery({
    queryKey: [...queryKeys.classificacao.all, 'superliga', campeonatoId, conferencia],
    queryFn: () => SuperligaService.getClassificacaoConferencia(campeonatoId, conferencia),
    enabled: !!campeonatoId && !!conferencia,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  })
}

export function useClassificacaoGeral(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.classificacao.all, 'superliga', campeonatoId, 'geral'],
    queryFn: () => SuperligaService.getClassificacaoGeral(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  })
}

// ==================== PLAYOFFS ====================

export function useBracketPlayoffs(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'bracket'],
    queryFn: () => SuperligaService.getBracketPlayoffs(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 3, // 3 minutos
    retry: 2,
  })
}

export function usePlayoffsConferencia(campeonatoId: number, conferencia: string) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'playoffs', conferencia],
    queryFn: () => SuperligaService.getPlayoffsConferencia(campeonatoId, conferencia),
    enabled: !!campeonatoId && !!conferencia,
    staleTime: 1000 * 60 * 3, // 3 minutos
    retry: 2,
  })
}

export function useFaseNacional(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'fase-nacional'],
    queryFn: () => SuperligaService.getFaseNacional(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 2,
  })
}

// ==================== JOGOS ====================

export function useJogosSuperliga(
  campeonatoId: number, 
  filters?: {
    conferencia?: string
    fase?: string
    rodada?: number
    status?: string
  }
) {
  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'superliga', campeonatoId, filters],
    queryFn: () => SuperligaService.getJogosSuperliga(campeonatoId, filters),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 2,
  })
}

export function useProximosJogosSuperliga(campeonatoId: number, limite?: number) {
  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'superliga', campeonatoId, 'proximos', limite],
    queryFn: () => SuperligaService.getProximosJogosSuperliga(campeonatoId, limite),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 1, // 1 minuto (próximos jogos mudam rapidamente)
    retry: 2,
  })
}

export function useUltimosResultadosSuperliga(campeonatoId: number, limite?: number) {
  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'superliga', campeonatoId, 'resultados', limite],
    queryFn: () => SuperligaService.getUltimosResultadosSuperliga(campeonatoId, limite),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 3, // 3 minutos
    retry: 2,
  })
}

// ==================== ESTATÍSTICAS ====================

export function useEstatisticasSuperliga(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'estatisticas'],
    queryFn: () => SuperligaService.getEstatisticasSuperliga(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  })
}

export function useRankingGeral(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'ranking'],
    queryFn: () => SuperligaService.getRankingGeral(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  })
}

// ==================== HISTÓRICO ====================

export function useHistoricoSuperliga(temporadas: string[]) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', 'historico', temporadas],
    queryFn: () => SuperligaService.getHistoricoSuperliga(temporadas),
    enabled: temporadas.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hora (histórico não muda)
    retry: 2,
  })
}

// ==================== TIMES E CONFERÊNCIAS ====================

export function useTimesPorConferencia(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.times.all, 'superliga', campeonatoId, 'por-conferencia'],
    queryFn: () => SuperligaService.getTimesPorConferencia(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
  })
}

export function useConferencias(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'conferencias'],
    queryFn: () => SuperligaService.getConferencias(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
  })
}

// ==================== SIMULAÇÃO E PREVISÕES ====================

export function useSimularPlayoffs(campeonatoId: number, enabled: boolean = false) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'simular'],
    queryFn: () => SuperligaService.simularPlayoffs(campeonatoId),
    enabled: !!campeonatoId && enabled,
    staleTime: 0, // Sempre busca nova simulação
    retry: 1,
  })
}

export function usePrevisoes(campeonatoId: number) {
  return useQuery({
    queryKey: [...queryKeys.admin.all, 'superliga', campeonatoId, 'previsoes'],
    queryFn: () => SuperligaService.getPrevisoes(campeonatoId),
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: 2,
  })
}