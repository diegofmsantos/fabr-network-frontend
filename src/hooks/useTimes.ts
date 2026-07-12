import { useQuery } from '@tanstack/react-query'
import { TimesService } from '@/services/times.service'
import { queryKeys } from './queryKeys'
import { Time } from '@/types'
import { useTemporadaStore } from '@/stores/temporadaStore'

export function useTimes(temporada: string = '2026', divisao?: string) {
  const divisaoStore = useTemporadaStore((s) => s.divisao)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
  const divisaoAtiva = divisao ?? (hasHydrated ? divisaoStore : 'D1')

  return useQuery<Time[]>({ 
    queryKey: [...queryKeys.times.list(temporada), divisaoAtiva],
    queryFn: () => TimesService.getTimes(temporada, divisaoAtiva),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useTime(id: number) {
  return useQuery({
    queryKey: queryKeys.times.detail(id),
    queryFn: () => TimesService.getTime(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useTimeJogadores(timeId: number, temporada?: string) {
  return useQuery({
    queryKey: queryKeys.times.jogadores(timeId, temporada),
    queryFn: () => TimesService.getTimeJogadores(timeId, temporada),
    enabled: !!timeId,
    staleTime: 1000 * 60 * 3,
  })
}

