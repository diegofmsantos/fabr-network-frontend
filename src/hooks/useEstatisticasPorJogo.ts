import { useQuery } from '@tanstack/react-query'
import { EstatisticasService } from '@/services/estatisticas.service'
import { BaseService } from '@/services/base.service'

export function useEstatisticasPorJogo(jogadorId: number, temporada: string) {
  return useQuery({
    queryKey: ['estatisticas-por-jogo', jogadorId, temporada],
    queryFn: () => EstatisticasService.getEstatisticasPorJogo(jogadorId, temporada),
    enabled: !!jogadorId && !!temporada,
    staleTime: 1000 * 60 * 10, 
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

interface EstatisticaJogoComJogo {
  id: number
  jogoId: number
  jogadorId: number
  timeId: number
  estatisticas: any
  temporada?: string
  jogo: {
    id: number
    dataJogo: string
    local?: string
    status: string
    placarCasa?: number
    placarVisitante?: number
    timeCasa: {
      id: number
      nome: string
      sigla: string
      logo?: string
    }
    timeVisitante: {
      id: number
      nome: string
      sigla: string
      logo?: string
    }
  }
}

class EstatisticasJogadorService extends BaseService {
  static async getEstatisticasJogosJogador(jogadorId: number): Promise<EstatisticaJogoComJogo[]> {
    const service = new EstatisticasJogadorService()
    
    try {
      const estatisticas = await service.get<EstatisticaJogoComJogo[]>(
        `/admin/jogadores/${jogadorId}/estatisticas-jogos`
      )
      
      console.log(`📊 Estatísticas encontradas para jogador ${jogadorId}:`, estatisticas?.length || 0)
      
      return estatisticas || []
    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas do jogador:', error)
      
      try {
        console.log('🔄 Tentando busca alternativa...')
        
        const estatisticasAlternativas = await service.get<any[]>(
          `/admin/estatisticas/jogador/${jogadorId}`
        )
        
        return estatisticasAlternativas || []
      } catch (alternativeError) {
        console.error('❌ Busca alternativa também falhou:', alternativeError)
        return []
      }
    }
  }
}

export function useEstatisticasJogosJogador(jogadorId: number) {
  return useQuery({
    queryKey: ['estatisticas-jogos-jogador', jogadorId],
    queryFn: () => EstatisticasJogadorService.getEstatisticasJogosJogador(jogadorId),
    enabled: !!jogadorId && jogadorId > 0,
    staleTime: 1000 * 60 * 5, 
    retry: 1, 
    refetchOnWindowFocus: false,
    throwOnError: false, 
  })
}