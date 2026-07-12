import { EstatisticaJogo, Jogador } from '@/types'
import { BaseService } from './base.service'

export class JogadoresService extends BaseService {
  static async getJogadores(temporada: string = '2025'): Promise<Jogador[]> {
    const service = new JogadoresService()
    return service.get<Jogador[]>(`/jogadores/jogadores`, { temporada })
  }

  static async getJogador(id: number): Promise<Jogador> {
    const service = new JogadoresService()
    return service.get<Jogador>(`/jogadores/jogador/${id}`)
  }

  static async getJogadorBySlug(timeSlug: string, jogadorSlug: string, temporada: string = '2025'): Promise<Jogador | null> {
    const service = new JogadoresService()
    return service.get<Jogador | null>(`/jogadores/buscar-por-slug`, {
      timeSlug,
      jogadorSlug,
      temporada
    })
  }
  static async getEstatisticasJogo(jogadorId: number, temporada: string = '2025'): Promise<EstatisticaJogo[]> {
    console.log(`🔍 [SERVICE] Chamando rota corrigida: /jogadores/${jogadorId}/estatisticas-jogo?temporada=${temporada}`)

    const service = new JogadoresService()
    return service.get<EstatisticaJogo[]>(`/jogadores/${jogadorId}/estatisticas-jogo`, { temporada })
  }
}