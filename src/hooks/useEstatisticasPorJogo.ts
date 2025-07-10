import { useQuery } from '@tanstack/react-query'
import { EstatisticasService } from '@/services/estatisticas.service'

export function useEstatisticasPorJogo(jogadorId: number, temporada: string) {
  return useQuery({
    queryKey: ['estatisticas-por-jogo', jogadorId, temporada],
    queryFn: () => EstatisticasService.getEstatisticasPorJogo(jogadorId, temporada),
    enabled: !!jogadorId && !!temporada,
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}