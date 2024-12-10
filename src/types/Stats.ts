export interface StatsBase {
    passe: PasseStats;
    corrida: CorridaStats;
    recepcao: RecepcaoStats;
    retorno: RetornoStats;
    defesa: DefesaStats;
    kicker: KickerStats;
    punter: PunterStats;
  }
  
  export interface PasseStats {
    passes_completos: number;
    passes_tentados: number;
    jardas_de_passe: number;
    td_passados: number;
    interceptacoes_sofridas: number;
    sacks_sofridos: number;
    fumble_de_passador: number;
  }
  
  export interface CorridaStats {
    corridas: number;
    jardas_corridas: number;
    tds_corridos: number;
    fumble_de_corredor: number;
  }
  
  export interface RecepcaoStats {
    recepcoes: number;
    alvo: number;
    jardas_recebidas: number;
    tds_recebidos: number;
    fumble_de_recebedor: number;
  }
  
  export interface RetornoStats {
    retornos: number;
    jardas_retornadas: number;
    td_retornados: number;
    fumble_retornador: number;
  }
  
  export interface DefesaStats {
    tackles_totais: number;
    tackles_for_loss: number;
    sacks_forcado: number;
    fumble_forcado: number;
    interceptacao_forcada: number;
    passe_desviado: number;
    safety: number;
    td_defensivo: number;
  }
  
  export interface KickerStats {
    xp_bons: number;
    tentativas_de_xp: number;
    fg_bons: number;
    tentativas_de_fg: number;
    fg_mais_longo: number;
    fg_0_10: string;
    fg_11_20: string;
    fg_21_30: string;
    fg_31_40: string;
    fg_41_50: string;
  }
  
  export interface PunterStats {
    punts: number;
    jardas_de_punt: number;
  }