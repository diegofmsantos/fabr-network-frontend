'use client'

import { useParams } from 'next/navigation'
import { useFaseNacional } from '@/hooks/useSuperliga'
import { Loading } from '@/components/ui/Loading'
import { Trophy, Crown, Calendar, MapPin, Users, Star, Award } from 'lucide-react'
import Link from 'next/link'

interface Time {
  id: number
  nome: string
  sigla: string
  logo: string
}

interface JogoFaseNacional {
  id: number
  campeonatoId: number
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
  local?: string
}

export default function FinalPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const { data: faseNacionalData, isLoading } = useFaseNacional(temporada)

  if (isLoading) return <Loading />

  // Verificar se faseNacionalData é um array
  const faseNacional: JogoFaseNacional[] = Array.isArray(faseNacionalData) ? faseNacionalData : []

  const semifinais = faseNacional.filter((jogo: JogoFaseNacional) => jogo.fase === 'SEMIFINAL_NACIONAL')
  const final = faseNacional.find((jogo: JogoFaseNacional) => jogo.fase === 'FINAL_NACIONAL')

  // Verificar se há campeão
  const campeao = final?.timeVencedor

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C24] via-[#2A1810] to-[#1C1C24] text-white">
      {/* Header Épico */}
      <div className="relative bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 py-16">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">FASE NACIONAL</h1>
          <p className="text-xl text-purple-200">Superliga {temporada}</p>
          <p className="text-purple-300 mt-2">A culminação do futebol americano brasileiro</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mostrar Campeão se houver */}
        {campeao && (
          <div className="mb-16 text-center">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 border-4 border-yellow-400">
              <Trophy className="w-20 h-20 text-yellow-100 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-4">
                🏆 CAMPEÃO DA SUPERLIGA {temporada} 🏆
              </h2>
              <div className="flex items-center justify-center gap-6">
                <img
                  src={campeao.logo}
                  alt={campeao.nome}
                  className="w-24 h-24"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-team-logo.png'
                  }}
                />
                <div>
                  <h3 className="text-3xl font-bold text-white">{campeao.nome}</h3>
                  <p className="text-yellow-100 text-xl">{campeao.sigla}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Semifinais Nacionais */}
        {semifinais.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">
              <Trophy className="w-8 h-8 inline mr-2" />
              Semifinais Nacionais
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {semifinais.map((semifinal: JogoFaseNacional, index: number) => (
                <div key={semifinal.id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-yellow-500/30">
                  <h3 className="text-xl font-bold text-center mb-6 text-yellow-400">
                    Semifinal {index + 1}
                  </h3>

                  <div className="space-y-6">
                    {/* Time 1 */}
                    <div className="flex items-center gap-4">
                      {semifinal.timeClassificado1 ? (
                        <>
                          <img
                            src={semifinal.timeClassificado1.logo}
                            alt={semifinal.timeClassificado1.nome}
                            className="w-16 h-16"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-team-logo.png'
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-bold text-lg">{semifinal.timeClassificado1.nome}</div>
                            <div className="text-gray-400">{semifinal.timeClassificado1.sigla}</div>
                          </div>
                          {semifinal.status === 'FINALIZADO' && (
                            <div className="text-3xl font-bold">
                              {semifinal.placarTime1 || 0}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-500 text-center w-full">Aguardando campeão da conferência</div>
                      )}
                    </div>

                    {/* VS */}
                    <div className="text-center text-2xl font-bold text-yellow-400">VS</div>

                    {/* Time 2 */}
                    <div className="flex items-center gap-4">
                      {semifinal.timeClassificado2 ? (
                        <>
                          <img
                            src={semifinal.timeClassificado2.logo}
                            alt={semifinal.timeClassificado2.nome}
                            className="w-16 h-16"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/default-team-logo.png'
                            }}
                          />
                          <div className="flex-1">
                            <div className="font-bold text-lg">{semifinal.timeClassificado2.nome}</div>
                            <div className="text-gray-400">{semifinal.timeClassificado2.sigla}</div>
                          </div>
                          {semifinal.status === 'FINALIZADO' && (
                            <div className="text-3xl font-bold">
                              {semifinal.placarTime2 || 0}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-500 text-center w-full">Aguardando campeão da conferência</div>
                      )}
                    </div>

                    {/* Status e Data */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center text-sm">
                        <span className={`px-3 py-1 rounded-full ${getStatusColor(semifinal.status)}`}>
                          {getStatusLabel(semifinal.status)}
                        </span>
                        {semifinal.dataJogo && (
                          <div className="flex items-center gap-1 text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {new Date(semifinal.dataJogo).toLocaleDateString('pt-BR')}
                          </div>
                        )}
                      </div>
                      {semifinal.local && (
                        <div className="flex items-center gap-1 text-gray-400 mt-2">
                          <MapPin className="w-4 h-4" />
                          {semifinal.local}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grande Final */}
        {final ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">
              <Crown className="w-10 h-10 inline mr-3 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                GRANDE FINAL NACIONAL
              </span>
            </h2>

            <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-8 border-2 border-yellow-500/50">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Time 1 */}
                <div className="text-center">
                  {final.timeClassificado1 ? (
                    <>
                      <img
                        src={final.timeClassificado1.logo}
                        alt={final.timeClassificado1.nome}
                        className="w-24 h-24 mx-auto mb-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-team-logo.png'
                        }}
                      />
                      <h3 className="font-bold text-xl mb-1">{final.timeClassificado1.nome}</h3>
                      <p className="text-gray-400">{final.timeClassificado1.sigla}</p>
                      {final.status === 'FINALIZADO' && (
                        <div className="text-4xl font-bold mt-4 text-yellow-400">
                          {final.placarTime1 || 0}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500">Aguardando semifinalista</div>
                  )}
                </div>

                {/* Centro - VS e Status */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-400 mb-4">VS</div>

                  {final.status === 'FINALIZADO' && final.timeVencedor && (
                    <div className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold mb-4">
                      🏆 CAMPEÃO DA SUPERLIGA {temporada}
                    </div>
                  )}

                  <div className={`inline-block px-4 py-2 rounded-full ${getStatusColor(final.status)}`}>
                    {getStatusLabel(final.status)}
                  </div>

                  {final.dataJogo && (
                    <div className="flex items-center justify-center gap-2 text-gray-400 mt-4">
                      <Calendar className="w-5 h-5" />
                      {new Date(final.dataJogo).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>

                {/* Time 2 */}
                <div className="text-center">
                  {final.timeClassificado2 ? (
                    <>
                      <img
                        src={final.timeClassificado2.logo}
                        alt={final.timeClassificado2.nome}
                        className="w-24 h-24 mx-auto mb-4"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-team-logo.png'
                        }}
                      />
                      <h3 className="font-bold text-xl mb-1">{final.timeClassificado2.nome}</h3>
                      <p className="text-gray-400">{final.timeClassificado2.sigla}</p>
                      {final.status === 'FINALIZADO' && (
                        <div className="text-4xl font-bold mt-4 text-yellow-400">
                          {final.placarTime2 || 0}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-gray-500">Aguardando semifinalista</div>
                  )}
                </div>
              </div>

              {final.local && (
                <div className="flex items-center justify-center gap-2 text-gray-400 mt-8 pt-6 border-t border-gray-700">
                  <MapPin className="w-5 h-5" />
                  {final.local}
                </div>
              )}

              {final.observacoes && (
                <div className="mt-4 text-center text-gray-400">
                  {final.observacoes}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Caso não haja final ainda
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-8 border border-gray-700">
              <Crown className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Grande Final Nacional</h2>
              <p className="text-gray-400 mb-4">
                A final será definida após o término das semifinais nacionais
              </p>
              <div className="text-gray-500 text-sm">
                Aguardando classificação dos finalistas
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas da Fase Nacional */}
        {(semifinais.length > 0 || final) && (
          <div className="mt-16 bg-black/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-center text-white mb-6">Estatísticas da Fase Nacional</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {semifinais.filter(s => s.status === 'FINALIZADO').length}
                </div>
                <div className="text-sm text-gray-400">Semifinais Realizadas</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-green-400">
                  {final?.status === 'FINALIZADO' ? '1' : '0'}
                </div>
                <div className="text-sm text-gray-400">Final Realizada</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {semifinais.reduce((total, s) => total + (s.placarTime1 || 0) + (s.placarTime2 || 0), 0) +
                    (final ? (final.placarTime1 || 0) + (final.placarTime2 || 0) : 0)}
                </div>
                <div className="text-sm text-gray-400">Pontos Marcados</div>
              </div>

              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {semifinais.length + (final ? 1 : 0)}
                </div>
                <div className="text-sm text-gray-400">Jogos Programados</div>
              </div>
            </div>
          </div>
        )}

        {/* Links de Navegação */}
        <div className="mt-16 text-center space-y-4">
          <Link
            href={`/superliga/${temporada}/playoffs`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors mr-4"
          >
            <Trophy className="w-5 h-5" />
            Ver Playoffs das Conferências
          </Link>

          <Link
            href={`/superliga/${temporada}/classificacao`}
            className="inline-flex items-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
          >
            <Users className="w-5 h-5" />
            Ver Classificação Completa
          </Link>
        </div>

        {/* Mensagem caso não haja dados */}
        {semifinais.length === 0 && !final && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Fase Nacional não iniciada</h3>
            <p className="text-gray-400 mb-6">
              A fase nacional será iniciada quando todos os playoffs das conferências forem concluídos.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>📅 Temporada: {temporada}</p>
              <p>🏆 Status: Aguardando término dos playoffs</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  const colors = {
    'AGUARDANDO': 'bg-yellow-600 text-white',
    'AGENDADO': 'bg-blue-600 text-white',
    'AO_VIVO': 'bg-red-600 text-white',
    'FINALIZADO': 'bg-green-600 text-white'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-600 text-white'
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