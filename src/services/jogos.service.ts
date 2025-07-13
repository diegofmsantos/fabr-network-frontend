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
}

interface CreateJogoData {
  campeonatoId: number
  timeCasaId: number
  timeVisitanteId: number
  dataJogo: string
  local?: string
  rodada: number
  fase: string
  conferencia?: string
  regional?: string
  temporada?: string
  observacoes?: string
}

interface UpdateJogoData {
  dataJogo?: string
  local?: string
  observacoes?: string
  status?: string
}

interface AtualizarResultadoData {
  placarCasa: number
  placarVisitante: number
  status?: string
  observacoes?: string
}

export class JogosService extends BaseService {
  
  
  static async getJogos(filters?: JogosFilters): Promise<Jogo[]> {
    const service = new JogosService()
    
    if (filters?.temporada) {
      const params = new URLSearchParams()
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
  
  static async criarJogo(dados: CreateJogoData): Promise<Jogo> {
    const service = new JogosService()
    return service.post<Jogo>('/admin/jogos', dados)
  }

  static async atualizarJogo(id: number, dados: UpdateJogoData): Promise<Jogo> {
    const service = new JogosService()
    return service.put<Jogo>(`/admin/jogos/${id}`, dados)
  }

  static async deletarJogo(id: number): Promise<void> {
    const service = new JogosService()
    return service.delete(`/admin/jogos/${id}`)
  }

  static async atualizarResultado(
    id: number, 
    dados: AtualizarResultadoData
  ): Promise<{ message: string; jogo: Jogo }> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}/resultado`, dados)
  }

  static async finalizarJogo(id: number): Promise<Jogo> {
    const service = new JogosService()
    return service.put<Jogo>(`/admin/jogos/${id}/finalizar`, {})
  }

  static async adiarJogo(id: number, novaData?: string): Promise<Jogo> {
    const service = new JogosService()
    return service.put<Jogo>(`/admin/jogos/${id}/adiar`, { novaData })
  }

  static async iniciarJogo(id: number): Promise<Jogo> {
    const service = new JogosService()
    return service.put<Jogo>(`/admin/jogos/${id}/iniciar`, {})
  }
  
  static async getEstatisticasJogo(id: number): Promise<any[]> {
    const service = new JogosService()
    return service.get(`/admin/jogos/${id}/estatisticas`)
  }

  static async importarEstatisticas(
    jogoId: number, 
    arquivo: File, 
    dataJogo: string
  ): Promise<any> {
    const service = new JogosService()
    return service.upload('/admin/atualizar-estatisticas', arquivo, {
      id_jogo: jogoId.toString(),
      data_jogo: dataJogo
    })
  }
  
  static async getEstatisticasGerais(filters?: JogosFilters): Promise<{
    totalJogos: number
    jogosFinalizados: number
    jogosAgendados: number
    jogosAoVivo: number
    jogosAdiados: number
    proximosJogos: Jogo[]
    ultimosResultados: Jogo[]
  }> {
    const service = new JogosService()
    return service.get('/admin/jogos/estatisticas', filters)
  }

  static async buscarJogos(query: string, filters?: JogosFilters): Promise<Jogo[]> {
    const service = new JogosService()
    return service.get('/admin/jogos/buscar', { ...filters, query })
  }
}