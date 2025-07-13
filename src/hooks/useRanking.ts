import { useQuery } from '@tanstack/react-query'
import { RankingService } from '@/services/ranking.service'

export function useRankingDinamico(categoria: string, temporada: string = '2025') {
  return useQuery({
    queryKey: ['ranking', categoria, temporada],
    queryFn: () => RankingService.getRankingPorTemporada(categoria, temporada),
    staleTime: 1000 * 60 * 15,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useRankingTimes(temporada: string = '2025') {
  return useQuery({
    queryKey: ['ranking', 'times', temporada],
    queryFn: () => RankingService.getRankingTimes(temporada),
    staleTime: 1000 * 60 * 15, 
    retry: 2,
    refetchOnWindowFocus: false,
  })
}