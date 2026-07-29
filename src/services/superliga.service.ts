import { BaseService } from './base.service'

export class SuperligaService extends BaseService {

  static async getSuperliga(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}`)
  }

  static async getStatus(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/status`)
  }

  static async getEstatisticas(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/estatisticas`)
  }

  static async getConferencias(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/conferencias`)
  }

  static async getTimesPorConferencia(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/times-por-conferencia`)
  }

  static async getTimes(temporada: string, conferencia?: string, regional?: string) {
    const service = new SuperligaService()
    const params = new URLSearchParams()
    if (conferencia) params.append('conferencia', conferencia)
    if (regional) params.append('regional', regional)

    const url = `/superliga/${temporada}/times${params.toString() ? `?${params.toString()}` : ''}`
    return service.get(url)
  }

  static async getJogos(temporada: string, filters?: {
    conferencia?: string
    fase?: string
    rodada?: number
    status?: string
    limit?: number
    divisao?: string
  }) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/jogos`, filters)
  }

  static async getProximosJogos(temporada: string, limite?: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/proximos-jogos`, { limite })
  }

  static async getUltimosResultados(temporada: string, limite?: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/ultimos-resultados`, { limite })
  }

  static async getJogosPorRodada(temporada: string, rodada: number) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/jogos/rodada/${rodada}`)
  }

  static async getClassificacaoGeral(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/classificacao-geral`)
  }

  static async getClassificacaoConferencia(temporada: string, conferencia: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/classificacao-conferencia/${conferencia}`)
  }

  static async getClassificacaoRegional(temporada: string, regional: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/classificacao-regional/${regional}`)
  }

  static async getRankingGeral(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/ranking-geral`)
  }

  static async getWildCardRanking(temporada: string, conferencia: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/wild-card-ranking/${conferencia}`)
  }

  static async getBracket(temporada: string, divisao: string = 'D1'): Promise<any[]> {
    const service = new SuperligaService()
    try {
      const jogosPlayoffs = await service.get<any>(`/superliga/${temporada}/jogos`, {
        fase: 'WILD CARD,SEMIFINAL DE CONFERÊNCIA,FINAL DE CONFERÊNCIA,SEMIFINAL NACIONAL,FINAL NACIONAL',
        divisao
      })
      if (jogosPlayoffs && Array.isArray(jogosPlayoffs)) return jogosPlayoffs
      if (jogosPlayoffs?.jogos && Array.isArray(jogosPlayoffs.jogos)) return jogosPlayoffs.jogos
      return []
    } catch (error) {
      console.error('❌ Erro ao buscar bracket:', error)
      return []
    }
  }

  static async getPlayoffsConferencia(temporada: string, conferencia: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/playoffs/${conferencia}`)
  }

  static async getFaseNacional(temporada: string) {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/fase-nacional`)
  }

  static async getHistorico(temporadas: string[]) {
    const service = new SuperligaService()
    return service.get('/superliga/historico', {
      temporadas: temporadas.join(',')
    })
  }

  static async listarTemporadas() {
    const service = new SuperligaService()
    return service.get('/superliga/temporadas')
  }

  static async getTemporadaAtual() {
    const service = new SuperligaService()
    return service.get('/superliga/atual')
  }

  static async getClassificacao(temporada: string, divisao: string = 'D1') {
    const service = new SuperligaService()
    return service.get(`/superliga/${temporada}/classificacao`, { divisao })
  }

  static async getRodadas(temporada: string, conferencia?: string, divisao: string = 'D1') {
    const service = new SuperligaService()
    const params: any = { divisao }
    if (conferencia) params.conferencia = conferencia
    return service.get(`/superliga/rodadas`, { temporada, ...params })
  }

  static async getJogoDetalhes(jogoId: number): Promise<any> {
    const service = new SuperligaService()
    return service.get<any>(`/superliga/jogo/${jogoId}`)
  }

  static async getJogosPeriodo(inicio: string, fim: string): Promise<{ jogos: any[]; total: number }> {
    const service = new SuperligaService()
    return service.get(`/superliga/jogos-periodo`, { inicio, fim })
  }

}