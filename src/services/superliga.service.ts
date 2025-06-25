import { BaseService } from './base.service'

export interface SuperligaBracket {
  conferencias: {
    [key: string]: {
      fase: string
      jogos: any[]
      classificados: any[]
    }
  }
  faseNacional: {
    semifinais: any[]
    final: any
  }
}

export interface ConferenciaClassificacao {
  conferencia: string
  regionais: {
    nome: string
    times: {
      posicao: number
      time: any
      pontos: number
      vitorias: number
      derrotas: number
      saldoPontos: number
    }[]
  }[]
}

export class SuperligaService extends BaseService {
  
  static async validarEstruturaSuperliga(campeonatoId: number): Promise<{
    valida: boolean
    erros: string[]
    avisos: string[]
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/validar-estrutura`)
  }

  static async getStatusSuperliga(campeonatoId: number): Promise<{
    fase: 'CONFIGURACAO' | 'TEMPORADA_REGULAR' | 'PLAYOFFS' | 'FINALIZADO'
    proximoPasso: string
    podeAvancar: boolean
    motivos?: string[]
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/status`)
  }

  static async getClassificacaoConferencia(campeonatoId: number, conferencia: string): Promise<ConferenciaClassificacao> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/classificacao/${conferencia}`)
  }

  static async getClassificacaoGeral(campeonatoId: number): Promise<ConferenciaClassificacao[]> {
    const service = new SuperligaService()
    const conferencias = ['sudeste', 'sul', 'nordeste', 'centro-norte']
    
    const classificacoes = await Promise.all(
      conferencias.map(conf => 
        SuperligaService.getClassificacaoConferencia(campeonatoId, conf)
      )
    )
    
    return classificacoes
  }

  static async getBracketPlayoffs(campeonatoId: number): Promise<SuperligaBracket> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/bracket`)
  }

  static async getPlayoffsConferencia(campeonatoId: number, conferencia: string): Promise<any[]> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/playoffs/${conferencia}`)
  }

  static async getFaseNacional(campeonatoId: number): Promise<{
    semifinais: any[]
    final: any
    status: string
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/fase-nacional`)
  }

  static async getJogosSuperliga(campeonatoId: number, filters?: {
    conferencia?: string
    fase?: string
    rodada?: number
    status?: string
  }): Promise<any[]> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/jogos`, filters)
  }

  static async getProximosJogosSuperliga(campeonatoId: number, limite?: number): Promise<any[]> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/proximos-jogos`, { limite })
  }

  static async getUltimosResultadosSuperliga(campeonatoId: number, limite?: number): Promise<any[]> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/ultimos-resultados`, { limite })
  }

  static async getEstatisticasSuperliga(campeonatoId: number): Promise<{
    totalJogos: number
    jogosFinalizados: number
    jogosAgendados: number
    faseAtual: string
    progresso: number
    timesClassificados: number
    conferencias: {
      [key: string]: {
        jogos: number
        finalizados: number
        pendentes: number
      }
    }
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/estatisticas`)
  }

  static async getRankingGeral(campeonatoId: number): Promise<{
    porConferencia: {
      [key: string]: any[]
    }
    geral: any[]
    criterios: string[]
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/ranking`)
  }

  static async getHistoricoSuperliga(temporadas: string[]): Promise<{
    [temporada: string]: {
      campeao: any
      viceCampeao: any
      semifinalistas: any[]
      campeoesPorConferencia: {
        [conferencia: string]: any
      }
    }
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/historico`, { temporadas: temporadas.join(',') })
  }

  static async getTimesPorConferencia(campeonatoId: number): Promise<{
    [conferencia: string]: {
      regionais: {
        [regional: string]: any[]
      }
      total: number
    }
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/times-por-conferencia`)
  }

  static async getConferencias(campeonatoId: number): Promise<{
    id: number
    nome: string
    tipo: string
    icone: string
    totalTimes: number
    regionais: {
      id: number
      nome: string
      tipo: string
      timesPorRegional: number
    }[]
  }[]> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/conferencias`)
  }

  static async simularPlayoffs(campeonatoId: number): Promise<SuperligaBracket> {
    const service = new SuperligaService()
    return service.post(`/superliga/campeonatos/${campeonatoId}/simular-playoffs`)
  }

  static async getPrevisoes(campeonatoId: number): Promise<{
    favoritos: {
      [conferencia: string]: {
        time: any
        probabilidade: number
        motivo: string[]
      }
    }
    surpresas: any[]
    confrontosDestaque: any[]
  }> {
    const service = new SuperligaService()
    return service.get(`/superliga/campeonatos/${campeonatoId}/previsoes`)
  }
}