// src/hooks/useJogoDetalhes.ts
"use client"
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { SuperligaService } from '@/services/superliga.service'

export function useJogoDetalhes(jogoId: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(jogoId),
    queryFn: () => SuperligaService.getJogoDetalhes(jogoId),
    enabled: !!jogoId && jogoId > 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}