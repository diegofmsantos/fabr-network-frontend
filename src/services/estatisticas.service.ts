import { BaseService } from './base.service'

export class EstatisticasService extends BaseService {
  static async getEstatisticasPorJogo(jogadorId: number, temporada: string): Promise<any[]> {
    const service = new EstatisticasService()
    return service.get<any[]>(`/estatisticas/jogador/${jogadorId}/por-jogo`, { temporada })
  }

  static async getEstatisticasConsolidadas(jogadorId: number, temporada: string): Promise<any> {
    const service = new EstatisticasService()
    return service.get<any>(`/estatisticas/jogador/${jogadorId}/consolidadas`, { temporada })
  }
}