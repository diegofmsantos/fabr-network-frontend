import { BaseService } from './base.service'

export class RankingService extends BaseService {
  static async getRankingPorTemporada(categoria: string, temporada: string): Promise<any[]> {
    const service = new RankingService()
    return service.get<any[]>(`/ranking/${categoria}`, { temporada })
  }

  static async getRankingTimes(temporada: string): Promise<any[]> {
    const service = new RankingService()
    return service.get<any[]>('/ranking/times', { temporada })
  }
}