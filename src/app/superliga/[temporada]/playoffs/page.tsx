'use client'

import { useParams } from 'next/navigation'
import { usePlayoffBracket } from '@/hooks/useSuperliga'
import { Loading } from '@/components/ui/Loading'
import { Trophy, Calendar, MapPin, Users } from 'lucide-react'

interface Time {
  id: number
  nome: string
  sigla: string
  logo: string
}

interface Conferencia {
  id: number
  nome: string
  tipo: string
  icone: string
}

interface PlayoffJogo {
  id: number
  campeonatoId: number
  conferenciaId?: number
  fase: string
  rodada: number
  nome: string
  timeClassificado1Id?: number
  timeClassificado2Id?: number
  timeVencedorId?: number
  dataJogo?: string
  status: string
  placarTime1?: number
  placarTime2?: number
  observacoes?: string
  timeClassificado1?: Time
  timeClassificado2?: Time
  timeVencedor?: Time
  conferencia?: Conferencia
  local?: string
}

export default function PlayoffsPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const { data: bracketData, isLoading } = usePlayoffBracket(temporada)

  if (isLoading) return <Loading />

  // Verificar se bracketData é um array
  const bracket: PlayoffJogo[] = Array.isArray(bracketData) ? bracketData : []

  // Agrupar jogos por conferência e fase
  const jogosPorConferencia = bracket.reduce((acc: Record<string, PlayoffJogo[]>, jogo: PlayoffJogo) => {
    const conf = jogo.conferencia?.tipo || 'NACIONAL'
    if (!acc[conf]) acc[conf] = []
    acc[conf].push(jogo)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C24] via-[#2A1810] to-[#1C1C24] text-white">
      {/* Header */}
      <div className="bg-black/40 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">PLAYOFFS SUPERLIGA {temporada}</h1>
          <p className="text-center text-gray-300">Chaveamento eliminatório</p>
        </div>
      </div>

      {/* Conteúdo dos Playoffs */}
      <div className="container mx-auto px-4 py-8 space-y-12">
        {Object.keys(jogosPorConferencia).length > 0 ? (
          Object.entries(jogosPorConferencia).map(([conferencia, jogos]: [string, PlayoffJogo[]]) => (
            <div key={conferencia} className="space-y-6">
              {/* Header da Conferência */}
              <div className={`rounded-lg p-6 ${getConferenciaStyle(conferencia)}`}>
                <h2 className="text-2xl font-bold text-center text-white">
                  {getConferenciaNome(conferencia)}
                </h2>
              </div>

              {/* Jogos da Conferência */}
              <div className="grid gap-6">
                {renderJogosPorFase(jogos)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Playoffs não iniciados</h3>
            <p className="text-gray-400 mb-6">
              Os playoffs serão gerados quando a temporada regular for concluída.
            </p>
            <p className="text-gray-500 text-sm">
              Temporada: {temporada}
            </p>
          </div>
        )}
      </div>

      {/* Informações dos Playoffs */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-black/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Como funcionam os Playoffs</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white">Wild Card</h4>
              <p className="text-sm text-gray-400">Times classificados se enfrentam</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white">Semifinal</h4>
              <p className="text-sm text-gray-400">Melhores times + vencedores Wild Card</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white">Final</h4>
              <p className="text-sm text-gray-400">Campeão de cada conferência</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white">Nacional</h4>
              <p className="text-sm text-gray-400">Campeões se enfrentam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderJogosPorFase(jogos: PlayoffJogo[]) {
  const fases = ['WILD_CARD', 'SEMIFINAL_CONFERENCIA', 'FINAL_CONFERENCIA', 'SEMIFINAL_NACIONAL', 'FINAL_NACIONAL']

  return fases.map((fase: string) => {
    const jogosDaFase = jogos.filter((j: PlayoffJogo) => j.fase === fase)
    if (jogosDaFase.length === 0) return null

    return (
      <div key={fase} className="space-y-4">
        <h3 className="text-xl font-semibold text-center text-white">
          {getFaseLabel(fase)}
        </h3>
        <div className="grid gap-4">
          {jogosDaFase.map((jogo: PlayoffJogo) => (
            <div key={jogo.id} className="bg-black/30 rounded-lg p-6">
              <div className="flex items-center justify-between">
                {/* Time 1 */}
                <div className="flex items-center gap-3 flex-1">
                  {jogo.timeClassificado1 ? (
                    <>
                      <img
                        src={jogo.timeClassificado1.logo}
                        alt={jogo.timeClassificado1.nome}
                        className="w-12 h-12"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-team-logo.png'
                        }}
                      />
                      <div>
                        <div className="font-semibold">{jogo.timeClassificado1.nome}</div>
                        <div className="text-sm text-gray-400">{jogo.timeClassificado1.sigla}</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500">Aguardando classificação</div>
                  )}
                </div>

                {/* Placar/Status */}
                <div className="text-center mx-6">
                  {jogo.status === 'FINALIZADO' ? (
                    <div className="text-2xl font-bold">
                      {jogo.placarTime1 || 0} - {jogo.placarTime2 || 0}
                    </div>
                  ) : (
                    <div className="text-yellow-400 font-semibold">{getStatusLabel(jogo.status)}</div>
                  )}
                  {jogo.dataJogo && (
                    <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>

                {/* Time 2 */}
                <div className="flex items-center gap-3 flex-1 justify-end">
                  {jogo.timeClassificado2 ? (
                    <>
                      <div className="text-right">
                        <div className="font-semibold">{jogo.timeClassificado2.nome}</div>
                        <div className="text-sm text-gray-400">{jogo.timeClassificado2.sigla}</div>
                      </div>
                      <img
                        src={jogo.timeClassificado2.logo}
                        alt={jogo.timeClassificado2.nome}
                        className="w-12 h-12"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-team-logo.png'
                        }}
                      />
                    </>
                  ) : (
                    <div className="text-gray-500">Aguardando classificação</div>
                  )}
                </div>
              </div>

              {/* Informações adicionais */}
              {jogo.local && (
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {jogo.local}
                </div>
              )}

              {jogo.observacoes && (
                <div className="mt-2 text-sm text-gray-400">
                  {jogo.observacoes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }).filter(Boolean)
}

function getConferenciaStyle(conferencia: string) {
  const styles = {
    'SUDESTE': 'bg-gradient-to-r from-red-600 to-red-700',
    'SUL': 'bg-gradient-to-r from-blue-600 to-blue-700',
    'NORDESTE': 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    'CENTRO_NORTE': 'bg-gradient-to-r from-green-600 to-green-700',
    'NACIONAL': 'bg-gradient-to-r from-purple-600 to-purple-700'
  }
  return styles[conferencia as keyof typeof styles] || 'bg-gray-600'
}

function getConferenciaNome(conferencia: string) {
  const nomes = {
    'SUDESTE': 'CONFERÊNCIA SUDESTE',
    'SUL': 'CONFERÊNCIA SUL',
    'NORDESTE': 'CONFERÊNCIA NORDESTE',
    'CENTRO_NORTE': 'CONFERÊNCIA CENTRO-NORTE',
    'NACIONAL': 'FASE NACIONAL'
  }
  return nomes[conferencia as keyof typeof nomes] || conferencia
}

function getFaseLabel(fase: string) {
  const labels = {
    'WILD_CARD': 'Wild Card',
    'SEMIFINAL_CONFERENCIA': 'Semifinal',
    'FINAL_CONFERENCIA': 'Final da Conferência',
    'SEMIFINAL_NACIONAL': 'Semifinal Nacional',
    'FINAL_NACIONAL': 'Grande Final'
  }
  return labels[fase as keyof typeof labels] || fase
}

function getStatusLabel(status: string) {
  const labels = {
    'AGUARDANDO': 'Aguardando',
    'AGENDADO': 'Agendado',
    'AO_VIVO': 'Ao Vivo',
    'FINALIZADO': 'Finalizado'
  }
  return labels[status as keyof typeof labels] || status
}