import { Jogador, Time } from '@/types'
import { BaseService } from './base.service'

export class TimesService extends BaseService {

  static async getTimes(temporada: string, divisao?: string): Promise<Time[]> {
    const service = new TimesService()
    const params: any = { temporada }
    if (divisao) params.divisao = divisao
    return service.get<Time[]>('/times', params)
  }

  static async getTime(id: number): Promise<Time> {
    const service = new TimesService()
    return service.get<Time>(`/times/${id}`)
  }

  static async getTimeJogadores(timeId: number, temporada?: string): Promise<Jogador[]> {
    const service = new TimesService()
    const params = temporada ? { temporada } : {}
    return service.get<Jogador[]>(`/times/${timeId}/jogadores`, params)
  }
}