"use client"
import { JogosService } from '../services/jogos.service';
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'

export function useJogoDetalhes(jogoId: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(jogoId),
    queryFn: () => JogosService.getJogo(jogoId),
    enabled: !!jogoId && jogoId > 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}