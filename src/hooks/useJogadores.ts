import { useQuery } from '@tanstack/react-query'
import { JogadoresService } from '@/services/jogadores.service'
import { queryKeys } from './queryKeys'

export function useJogadores(temporada: string = '2025') {
  return useQuery({
    queryKey: queryKeys.jogadores.list(temporada),
    queryFn: () => JogadoresService.getJogadores(temporada),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useJogador(id: number) {
  return useQuery({
    queryKey: queryKeys.jogadores.detail(id),
    queryFn: () => JogadoresService.getJogador(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// ✅ INTERFACE PARA ESTATÍSTICAS JOGO A JOGO
export interface JogoJogador {
  id: number
  jogoId: number
  temporada: string
  estatisticas: any

  jogo: {
    id: number
    dataJogo: string
    status: string
    placarCasa?: number
    placarVisitante?: number
    rodada: number
    fase: string
    local?: string
    timeCasa: {
      id: number
      nome: string
      sigla: string
      cor: string
      logo: string
    }
    timeVisitante: {
      id: number
      nome: string
      sigla: string
      cor: string
      logo: string
    }
  }
}

export function useJogosJogador(jogadorId: number, temporada: string = '2025') {
  return useQuery({
    queryKey: ['jogos-jogador', jogadorId, temporada],
    queryFn: () => {
      console.log(`🔍 [HOOK] Chamando service para jogador ${jogadorId}, temporada ${temporada}`)
      // ✅ USAR O MÉTODO CORRETO DO SERVICE
      return JogadoresService.getEstatisticasJogo(jogadorId, temporada)
    },
    enabled: !!jogadorId && !!temporada && jogadorId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: (failureCount, error: any) => {
      // ✅ RETRY INTELIGENTE
      if (error?.response?.status === 404) {
        console.log('🔍 Jogador não tem estatísticas ainda, parando retry')
        return false
      }
      return failureCount < 2
    },
    meta: {
      errorMessage: 'Erro ao carregar estatísticas do jogador'
    }
  })
}