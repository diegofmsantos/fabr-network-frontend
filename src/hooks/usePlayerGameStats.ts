import { useQuery } from '@tanstack/react-query'
import { JogadoresService } from '@/services/jogadores.service' // <-- Service existente

export const usePlayerGameStats = (jogadorId: number, temporada: string = '2025') => {
  return useQuery({
    queryKey: ['player-game-stats', jogadorId, temporada],
    queryFn: () => JogadoresService.getEstatisticasJogo(jogadorId, temporada), // <-- Método do service existente
    enabled: !!jogadorId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    refetchOnWindowFocus: false,
    throwOnError: false,
    select: (data) => data || [],
    meta: {
      errorBoundary: false
    }
  })
}