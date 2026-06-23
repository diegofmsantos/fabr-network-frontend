import { useQuery } from '@tanstack/react-query'
import { SuperligaService } from '@/services/superliga.service'
import { useTemporadaStore } from '@/stores/temporadaStore'

export function useRodadas(temporada: string, conferencia?: string) {
  const divisao = useTemporadaStore((s) => s.divisao)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
  const divisaoAtiva = hasHydrated ? divisao : 'D1'

  return useQuery({
    queryKey: ['rodadas', temporada, conferencia, divisaoAtiva],
    queryFn: () => SuperligaService.getRodadas(temporada, conferencia, divisaoAtiva),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}