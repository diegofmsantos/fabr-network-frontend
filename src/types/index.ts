export type CategoryKey = 'passe' | 'corrida' | 'recepcao' | 'retorno' | 'defesa' | 'kicker' | 'punter'

export interface Conferencia {
  id: number
  nome: string
  tipo: string
  icone: string
  campeonatoId: number
  ordem: number
  totalTimes: number
}

export interface Regional {
  id: number
  nome: string
  tipo: string
  conferenciaId: number
  ordem: number
  timesPorRegional: number
}

export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

// ==================== TIME ====================

export interface Titulo {
  nacionais?: string
  conferencias?: string
  estaduais?: string
}

export interface Time extends BaseEntity {
  nome: string
  sigla: string
  temporada: string
  cor: string
  cidade: string
  bandeira_estado: string
  fundacao: string
  logo: string
  capacete: string
  instagram: string
  instagram2: string
  estadio: string
  presidente: string
  head_coach: string
  instagram_coach: string
  coord_ofen: string
  coord_defen: string
  titulos: Titulo[]

  jogadores?: JogadorTime[]

  _count?: {
    jogadores: number
    campeonatos: number
    vitorias: number
    derrotas: number
  }
}

export type TimeOptional = {
  id?: number
  nome?: string
  temporada?: string
  sigla?: string
  cor?: string
  cidade?: string
  bandeira_estado?: string
  fundacao?: string
  logo?: string
  capacete?: string
  instagram?: string
  instagram2?: string
  estadio?: string
  presidente?: string
  head_coach?: string
  instagram_coach?: string
  coord_ofen?: string
  coord_defen?: string
  titulos?: Titulo[]
  jogadores?: Jogador[]
}

export interface TeamCardProps {
  id: number
  name: string
  value: string
  teamColor?: string
  isFirst?: boolean
}

export interface TeamStatCardProps {
  title: string
  category: string
  teams: TeamCardProps[]
}

export interface TeamStatCardsGridProps {
  stats: TeamStatCardProps[]
  category: string
}

export interface TeamInfo {
  nome: string
  cor: string
}

export interface Transferencia {
  id: number
  jogadorNome: string
  timeOrigemId?: number
  timeOrigemNome?: string
  timeOrigemSigla?: string
  timeDestinoId: number
  timeDestinoNome?: string
  timeDestinoSigla?: string
  novaPosicao?: string | null
  novoSetor?: string | null
  novoNumero?: number | null
  novaCamisa?: string | null
  data: string
}

export interface TimeMercadoCardProps {
  timeNome: string
  jogadoresEntrando: Transferencia[]
  jogadoresSaindo: Transferencia[]
}

// ==================== JOGADOR ====================

export interface Estatisticas {
  passe: {
    passes_completos: number
    passes_tentados: number
    jardas_de_passe: number
    td_passados: number
    interceptacoes_sofridas: number
    sacks_sofridos: number
    fumble_de_passador: number
  }
  corrida: {
    corridas: number
    jardas_corridas: number
    tds_corridos: number
    fumble_de_corredor: number
  }
  recepcao: {
    recepcoes: number
    alvo: number
    jardas_recebidas: number
    tds_recebidos: number
  }
  retorno: {
    retornos: number
    jardas_retornadas: number
    td_retornados: number
  }
  defesa: {
    tackles_totais: number
    tackles_for_loss: number
    sacks_forcado: number
    fumble_forcado: number
    interceptacao_forcada: number
    passe_desviado: number
    safety: number
    td_defensivo: number
  }
  kicker: {
    xp_bons: number
    tentativas_de_xp: number
    fg_bons: number
    tentativas_de_fg: number
    fg_mais_longo: number
  }
  punter: {
    punts: number
    jardas_de_punt: number
  }
}

export interface StatGroup {
  title: string
  groupLabel: string
  stats: Array<{
    title: string
    urlParam: string
  }>
}

export type EstatisticasOptional = {
  passe?: {
    passes_completos?: number
    passes_tentados?: number
    jardas_de_passe?: number
    td_passados?: number
    interceptacoes_sofridas?: number
    sacks_sofridos?: number
    fumble_de_passador?: number
  }
  corrida?: {
    corridas?: number
    jardas_corridas?: number
    tds_corridos?: number
    fumble_de_corredor?: number
  }
  recepcao?: {
    recepcoes?: number
    alvo?: number
    jardas_recebidas?: number
    tds_recebidos?: number
  }
  retorno?: {
    retornos?: number
    jardas_retornadas?: number
    td_retornados?: number
  }
  defesa?: {
    tackles_totais?: number
    tackles_for_loss?: number
    sacks_forcado?: number
    fumble_forcado?: number
    interceptacao_forcada?: number
    passe_desviado?: number
    safety?: number
    td_defensivo?: number
  }
  kicker?: {
    xp_bons?: number
    tentativas_de_xp?: number
    fg_bons?: number
    tentativas_de_fg?: number
    fg_mais_longo?: number
  }
  punter?: {
    punts?: number
    jardas_de_punt?: number
  }
}

export interface Classificacao {
  estrelas: number
  criterio_valor: number
}

export interface ClassificacaoPorCategoria {
  passe?: Classificacao
  corrida?: Classificacao
  recepcao?: Classificacao
  retorno?: Classificacao
  defesa?: Classificacao
  kicker?: Classificacao
  punter?: Classificacao
}

export interface Jogador extends BaseEntity {
  nome: string
  posicao: string
  setor: 'Ataque' | 'Defesa' | 'Special'
  experiencia: number
  idade: number
  altura: number
  peso: number
  instagram: string
  instagram2: string
  cidade: string
  nacionalidade: string
  timeFormador: string

  times?: JogadorTime[]

  timeId?: number
  numero?: number
  camisa?: string
  estatisticas?: Estatisticas
  classificacoes?: ClassificacaoPorCategoria
}

export type JogadorOptional = {
  id?: number
  nome?: string
  time?: string
  timeId?: number
  timeFormador?: string
  posicao?: string
  setor?: "Ataque" | "Defesa" | "Special"
  experiencia?: number
  numero?: number
  idade?: number
  altura?: number
  peso?: number
  instagram?: string
  instagram2?: string
  cidade?: string
  nacionalidade?: string
  camisa?: string
  estatisticas?: EstatisticasOptional
}

export type JogadorType = Jogador

export interface JogadorTime extends BaseEntity {
  jogadorId: number
  timeId: number
  temporada: string
  numero: number
  camisa: string
  estatisticas: Estatisticas

  jogador?: Jogador
  time?: Time
}

// ==================== MATÉRIAS/NOTÍCIAS ====================

export interface Materia extends BaseEntity {
  titulo: string
  subtitulo: string
  imagem: string
  legenda: string | null
  texto: string
  autor: string
  autorImage: string
  createdAt: string
  updatedAt: string
}

export type Noticia = Materia

export interface Jogo extends BaseEntity {
  campeonatoId: number
  grupoId?: number
  timeVisitanteId: number
  timeCasaId: number
  dataJogo: string
  local?: string
  rodada: number
  fase: string
  status: 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
  placarCasa?: number
  placarVisitante?: number
  observacoes?: string
  estatisticasProcessadas: boolean

  videoUrl?: string
  playByPlay?: string

  campeonato?: {
    id: number
    nome: string
    temporada: string
  }
  timeCasa: Time
  timeVisitante: Time
  estatisticas?: EstatisticaJogo[]
}

export interface EstatisticaJogo extends BaseEntity {
  jogoId: number
  jogadorId: number
  timeId: number
  estatisticas: Estatisticas

  jogo?: Jogo
  jogador: {
    id: number
    nome: string
    posicao: string
    numero?: number
    camisa?: string
  }
  time?: Time
}

export type StatKey =
  | keyof Estatisticas['passe']
  | keyof Estatisticas['corrida']
  | keyof Estatisticas['recepcao']
  | keyof Estatisticas['retorno']
  | keyof Estatisticas['defesa']
  | keyof Estatisticas['kicker']
  | keyof Estatisticas['punter']
  | 'passes_percentual'
  | 'jardas_media'
  | 'jardas_corridas_media'
  | 'jardas_recebidas_media'
  | 'jardas_retornadas_media'
  | 'extra_points'
  | 'field_goals'
  | 'jardas_punt_media'

export interface PasseStats {
  passes_completos: number
  passes_tentados: number
  jardas_de_passe: number
  td_passados: number
  interceptacoes_sofridas: number
  sacks_sofridos: number
  fumble_de_passador: number
}

export interface CorridaStats {
  corridas: number
  jardas_corridas: number
  tds_corridos: number
  fumble_de_corredor: number
}

export interface RecepcaoStats {
  recepcoes: number
  alvo: number
  jardas_recebidas: number
  tds_recebidos: number
}

export interface RetornoStats {
  retornos: number
  jardas_retornadas: number
  td_retornados: number
}

export interface DefesaStats {
  tackles_totais: number
  tackles_for_loss: number
  sacks_forcado: number
  fumble_forcado: number
  interceptacao_forcada: number
  passe_desviado: number
  safety: number
  td_defensivo: number
}

export interface KickerStats {
  xp_bons: number
  tentativas_de_xp: number
  fg_bons: number
  tentativas_de_fg: number
  fg_mais_longo: number
}

export interface PunterStats {
  punts: number
  jardas_de_punt: number
}

export interface StatsBase {
  passe: PasseStats
  corrida: CorridaStats
  recepcao: RecepcaoStats
  retorno: RetornoStats
  defesa: DefesaStats
  kicker: KickerStats
  punter: PunterStats
}

export interface CalculatedStats {
  jardas_media: number | null
  jardas_corridas_media: number | null
  jardas_recebidas_media: number | null
  jardas_retornadas_media: number | null
  jardas_punt_media: number | null
  passes_percentual: number | null
  field_goals: string | null
  extra_points: string | null
}

export type StatType = 'PASSE' | 'CORRIDA' | 'RECEPCAO' | 'RETORNO' | 'DEFESA' | 'KICKER' | 'PUNTER'

export interface StatConfig {
  key: string
  title: string
  category: string
  isCalculated?: boolean
}

export interface StatResult {
  value: number | null
  tier: number
}

export interface ProcessedPlayer {
  player: Jogador
  average: number
  baseStat: number
  teamInfo: any
  value: string | number
}

export interface ProcessedStatCard {
  title: string
  category: string
  players: Array<{
    id: number
    name: string
    team: string
    value: string
    camisa: string
    teamColor?: string
    teamLogo?: string
    isFirst?: boolean
  }>
}


export interface TeamStats {
  timeId: number
  passe: {
    jardas_de_passe: number
    passes_completos: number
    passes_tentados: number
    td_passados: number
    interceptacoes_sofridas: number
    sacks_sofridos: number
    fumble_de_passador: number
  }
  corrida: {
    jardas_corridas: number
    corridas: number
    tds_corridos: number
    fumble_de_corredor: number
  }
  recepcao: {
    jardas_recebidas: number
    recepcoes: number
    tds_recebidos: number
    alvo: number
  }
  retorno: {
    jardas_retornadas: number
    retornos: number
    td_retornados: number
  }
  defesa: {
    tackles_totais: number
    tackles_for_loss: number
    sacks_forcado: number
    fumble_forcado: number
    interceptacao_forcada: number
    passe_desviado: number
    safety: number
    td_defensivo: number
  }
  kicker: {
    xp_bons: number
    tentativas_de_xp: number
    fg_bons: number
    tentativas_de_fg: number
    fg_mais_longo: number
  }
  punter: {
    punts: number
    jardas_de_punt: number
  }
}

export type StatCategory = 'passe' | 'corrida' | 'recepcao' | 'retorno' | 'defesa' | 'kicker' | 'punter'

export interface TeamComparisonStats {
  passe: {
    jardas_de_passe: number
    passes_completos: number
    passes_tentados: number
    td_passados: number
    interceptacoes_sofridas: number
    sacks_sofridos: number
    fumble_de_passador: number
  }
  corrida: {
    jardas_corridas: number
    corridas: number
    tds_corridos: number
    fumble_de_corredor: number
  }
  recepcao: {
    jardas_recebidas: number
    recepcoes: number
    alvo: number
    tds_recebidos: number
  }
  retorno: {
    jardas_retornadas: number
    retornos: number
    td_retornados: number
  }
  defesa: {
    tackles_totais: number
    tackles_for_loss: number
    sacks_forcado: number
    fumble_forcado: number
    interceptacao_forcada: number
    passe_desviado: number
    safety: number
    td_defensivo: number
  }
  kicker: {
    fg_bons: number
    tentativas_de_fg: number
    fg_mais_longo: number
    xp_bons: number
    tentativas_de_xp: number
  }
  punter: {
    jardas_de_punt: number
    punts: number
  }
}

export interface TeamComparisonPlayer {
  id: number
  nome: string
  camisa: string
  numero: number
  posicao: string
  estatisticas: {
    passe?: Record<string, number>
    corrida?: Record<string, number>
    recepcao?: Record<string, number>
    retorno?: Record<string, number>
    defesa?: Record<string, number>
    kicker?: Record<string, number>
    punter?: Record<string, number>
  }
}

export interface TeamComparisonHighlights {
  ataque: {
    passador: TeamComparisonPlayer | null
    corredor: TeamComparisonPlayer | null
    recebedor: TeamComparisonPlayer | null
    retornador: TeamComparisonPlayer | null
  }
  defesa: {
    tackler: TeamComparisonPlayer | null
    rusher: TeamComparisonPlayer | null
    interceptador: TeamComparisonPlayer | null
    desviador: TeamComparisonPlayer | null
  }
  specialTeams: {
    kicker: TeamComparisonPlayer | null
    punter: TeamComparisonPlayer | null
  }
}

export interface TeamComparisonTeam {
  id: number
  nome: string
  sigla: string
  cor: string
  cidade: string
  bandeira_estado: string
  fundacao: string
  logo: string
  capacete: string
  estadio: string
  presidente: string
  head_coach: string
  coord_ofen: string
  coord_defen: string
  temporada: string
  estatisticas: TeamComparisonStats
  destaques: TeamComparisonHighlights
}

export interface TeamComparisonData {
  teams: {
    time1: TeamComparisonTeam
    time2: TeamComparisonTeam
  }
  metaData: {
    temporada: string
    geradoEm: string
    totalJogos: {
      time1: number
      time2: number
    }
  }
}

export interface ChartDataPoint {
  name: string
  [key: string]: string | number
}

export interface ComparisonCardData {
  title: string
  stat1: string
  stat2: string
  color1: string
  color2: string
  isFirstBetter?: boolean
  isSecondBetter?: boolean
  isEqual?: boolean
}

export interface PlayerComparisonData {
  title: string
  player1: TeamComparisonPlayer | null
  player2: TeamComparisonPlayer | null
  team1: TeamComparisonTeam
  team2: TeamComparisonTeam
  statKey: string
  statCategory: StatCategory
}