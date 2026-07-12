import { BaseService } from './base.service'
import { Jogo } from '@/hooks/useJogos'

interface JogosFilters {
  temporada?: string
  campeonatoId?: number
  status?: string
  fase?: string
  rodada?: number
  conferencia?: string
  regional?: string
  timeId?: number
  limite?: number
  divisao?: string
}

export class JogosService extends BaseService {


  static async getJogos(filters?: JogosFilters): Promise<Jogo[]> {
    const service = new JogosService()

    if (filters?.temporada) {
      const params = new URLSearchParams()
      if (filters.divisao) params.append('divisao', filters.divisao)
      if (filters.status) params.append('status', filters.status)
      if (filters.fase) params.append('fase', filters.fase)
      if (filters.rodada) params.append('rodada', filters.rodada.toString())
      if (filters.conferencia) params.append('conferencia', filters.conferencia)
      if (filters.regional) params.append('regional', filters.regional)
      if (filters.limite) params.append('limite', filters.limite.toString())

      const queryString = params.toString()
      const url = `/superliga/${filters.temporada}/jogos${queryString ? `?${queryString}` : ''}`

      return service.get<Jogo[]>(url)
    }

    if (filters?.campeonatoId) {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.fase) params.append('fase', filters.fase)
      if (filters.rodada) params.append('rodada', filters.rodada.toString())
      if (filters.timeId) params.append('timeId', filters.timeId.toString())
      if (filters.limite) params.append('limite', filters.limite.toString())

      const queryString = params.toString()
      const url = `/admin/campeonatos/${filters.campeonatoId}/jogos${queryString ? `?${queryString}` : ''}`

      return service.get<Jogo[]>(url)
    }

    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.fase) params.append('fase', filters.fase)
    if (filters?.rodada) params.append('rodada', filters.rodada.toString())
    if (filters?.timeId) params.append('timeId', filters.timeId.toString())
    if (filters?.limite) params.append('limite', filters.limite.toString())

    const queryString = params.toString()
    const url = `/admin/jogos${queryString ? `?${queryString}` : ''}`

    return service.get<Jogo[]>(url)
  }

  static async getJogo(id: number): Promise<Jogo> {
    const service = new JogosService()
    return service.get<Jogo>(`/admin/jogos/${id}`)
  }

  static async getJogosPorRodada(temporada: string, rodada: number): Promise<Jogo[]> {
    const service = new JogosService()
    return service.get<Jogo[]>(`/superliga/${temporada}/jogos/rodada/${rodada}`)
  }

  static async getProximosJogos(temporada: string, limite: number = 5): Promise<Jogo[]> {
    const service = new JogosService()
    return service.get<Jogo[]>(`/superliga/${temporada}/proximos-jogos`, { limite })
  }

  static async getUltimosResultados(temporada: string, limite: number = 5): Promise<Jogo[]> {
    const service = new JogosService()
    return service.get<Jogo[]>(`/superliga/${temporada}/ultimos-resultados`, { limite })
  }

}