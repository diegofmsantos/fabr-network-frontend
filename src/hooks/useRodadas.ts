import { useQuery } from '@tanstack/react-query'
import { SuperligaService } from '@/services/superliga.service'

export function useRodadas(temporada: string, conferencia?: string) {
  return useQuery({
    queryKey: ['rodadas', temporada, conferencia],
    queryFn: () => SuperligaService.getRodadas(temporada, conferencia),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}