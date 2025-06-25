"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useClassificacaoConferencia, useJogosSuperliga, usePlayoffsConferencia } from '@/hooks/useSuperliga'
import { Loading } from '@/components/ui/Loading'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { ImageService } from '@/utils/services/ImageService'
import { ArrowLeft, Trophy, Users, Calendar, Award, Clock } from 'lucide-react'
import { useCampeonatos } from '@/hooks/useCampeonatos'

interface ConferenciaConfig {
  [key: string]: {
    nome: string
    icone: string
    cor: string
    corGradient: string
    totalTimes: number
    regionais: {
      nome: string
      codigo: string
      times: number
    }[]
    descricao: string
  }
}

export default function ConferenciaPage() {
  const params = useParams()
  const router = useRouter()
  const temporada = params.temporada as string || '2025'
  const conferenciaParam = params.conferencia as string
  const conferenciaTipo = conferenciaParam?.toUpperCase()

  const [activeTab, setActiveTab] = useState<'classificacao' | 'jogos' | 'playoffs'>('classificacao')

  const conferenciasConfig: ConferenciaConfig = {
    SUDESTE: {
      nome: 'Conferência Sudeste',
      icone: '🏭',
      cor: 'orange-500',
      corGradient: 'from-orange-500 to-red-500',
      totalTimes: 12,
      regionais: [
        { nome: 'Regional Serramar', codigo: 'SERRAMAR', times: 4 },
        { nome: 'Regional Canastra', codigo: 'CANASTRA', times: 4 },
        { nome: 'Regional Cantareira', codigo: 'CANTAREIRA', times: 4 }
      ],
      descricao: 'A maior conferência da Superliga, com 12 times distribuídos em 3 regionais do Sudeste brasileiro.'
    },
    SUL: {
      nome: 'Conferência Sul',
      icone: '🧊',
      cor: 'blue-500',
      corGradient: 'from-blue-500 to-cyan-500',
      totalTimes: 8,
      regionais: [
        { nome: 'Regional Araucária', codigo: 'ARAUCARIA', times: 4 },
        { nome: 'Regional Pampa', codigo: 'PAMPA', times: 4 }
      ],
      descricao: 'Conferência formada por times tradicionais do Sul do Brasil, conhecida pela competitividade.'
    },
    NORDESTE: {
      nome: 'Conferência Nordeste',
      icone: '🌵',
      cor: 'yellow-500',
      corGradient: 'from-yellow-500 to-amber-500',
      totalTimes: 6,
      regionais: [
        { nome: 'Regional Atlântico', codigo: 'ATLANTICO', times: 6 }
      ],
      descricao: 'Times do Nordeste brasileiro unidos em uma única conferência com grande rivalidade regional.'
    },
    CENTRO_NORTE: {
      nome: 'Conferência Centro-Norte',
      icone: '🌲',
      cor: 'green-500',
      corGradient: 'from-green-500 to-emerald-500',
      totalTimes: 6,
      regionais: [
        { nome: 'Regional Cerrado', codigo: 'CERRADO', times: 3 },
        { nome: 'Regional Amazônia', codigo: 'AMAZONIA', times: 3 }
      ],
      descricao: 'Conferência que representa o coração do Brasil, com times do Centro-Oeste e Norte.'
    }
  }

  const conferenciaConfig = conferenciasConfig[conferenciaTipo]

  const { data: campeonatos = [] } = useCampeonatos({
    temporada,
    tipo: 'SUPERLIGA'
  })

  const superliga = campeonatos.find(c => c.isSuperliga) || campeonatos[0]
  const superligaId = superliga?.id

  const {
    data: classificacao,
    isLoading: loadingClassificacao
  } = useClassificacaoConferencia(superligaId || 0, conferenciaParam)

  const {
    data: jogos = [],
    isLoading: loadingJogos
  } = useJogosSuperliga(superligaId || 0, { conferencia: conferenciaTipo })

  const {
    data: playoffs = [],
    isLoading: loadingPlayoffs
  } = usePlayoffsConferencia(superligaId || 0, conferenciaParam)

  const loading = loadingClassificacao || loadingJogos || loadingPlayoffs

  if (!conferenciaConfig) {
    return (
      <NoDataFound
        message="Conferência não encontrada"
        description="A conferência solicitada não existe ou não foi configurada corretamente."
      />
    )
  }

  if (loading) {
    return <Loading />
  }

  const estatisticas = {
    totalJogos: jogos.length,
    jogosFinalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
    jogosPendentes: jogos.filter(j => j.status === 'AGENDADO').length,
    timesClassificados: playoffs.filter(p => p.status === 'CLASSIFICADO').length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a]">
      <div className={`relative bg-gradient-to-r ${conferenciaConfig.corGradient} pt-20 pb-16`}>
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-white/80 mb-6">
            <Link
              href={`/superliga/${temporada}`}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Superliga {temporada}
            </Link>
            <span>/</span>
            <span className="text-white">{conferenciaConfig.nome}</span>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-6xl">{conferenciaConfig.icone}</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                  {conferenciaConfig.nome}
                </h1>
                <div className="text-xl text-white/90">
                  {temporada} • {conferenciaConfig.totalTimes} times
                </div>
              </div>
            </div>

            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
              {conferenciaConfig.descricao}
            </p>

            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{conferenciaConfig.regionais.length}</div>
                <div className="text-white/80">Regionais</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{estatisticas.totalJogos}</div>
                <div className="text-white/80">Jogos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{estatisticas.jogosFinalizados}</div>
                <div className="text-white/80">Finalizados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{estatisticas.jogosPendentes}</div>
                <div className="text-white/80">Pendentes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1C1C24] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'classificacao', label: 'Classificação', icon: Trophy },
              { id: 'jogos', label: 'Jogos', icon: Calendar },
              { id: 'playoffs', label: 'Playoffs', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? `border-${conferenciaConfig.cor} text-${conferenciaConfig.cor}`
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'classificacao' && (
          <div className="space-y-8">
            {/* Regionais */}
            {conferenciaConfig.regionais.map((regional) => (
              <div key={regional.codigo} className="bg-[#1C1C24] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-4 h-4 bg-${conferenciaConfig.cor} rounded-full`}></div>
                  <h2 className="text-2xl font-bold text-white">{regional.nome}</h2>
                  <span className="text-gray-400">({regional.times} times)</span>
                </div>

                {classificacao?.regionais
                  ?.filter(r => r.nome === regional.nome)
                  ?.map((regionalData) => (
                    <div key={regionalData.nome} className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Pos</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">Pts</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">V</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">D</th>
                            <th className="text-center py-3 px-4 text-gray-400 font-medium">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {regionalData.times?.map((item, index) => (
                            <tr
                              key={item.time.id}
                              className={`border-b border-gray-800 hover:bg-[#272731] transition-colors ${index === 0 ? 'bg-green-500/10' :
                                index === 1 ? 'bg-blue-500/10' : ''
                                }`}
                            >
                              <td className="py-4 px-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-green-500 text-white' :
                                  index === 1 ? 'bg-blue-500 text-white' :
                                    'bg-gray-600 text-gray-300'
                                  }`}>
                                  {item.posicao}
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <Image
                                    src={ImageService.getTeamLogo(item.time.logo)}
                                    alt={item.time.nome}
                                    width={32}
                                    height={32}
                                    className="rounded"
                                  />
                                  <div>
                                    <div className="font-semibold text-white">{item.time.nome}</div>
                                    <div className="text-sm text-gray-400">{item.time.sigla}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className={`font-bold ${index === 0 ? 'text-green-400' : 'text-white'
                                  }`}>
                                  {item.pontos}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center text-green-400">{item.vitorias}</td>
                              <td className="py-4 px-4 text-center text-red-400">{item.derrotas}</td>
                              <td className="py-4 px-4 text-center">
                                <span className={item.saldoPontos >= 0 ? 'text-green-400' : 'text-red-400'}>
                                  {item.saldoPontos > 0 ? '+' : ''}{item.saldoPontos}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}

                {(!classificacao?.regionais ||
                  !classificacao.regionais.find(r => r.nome === regional.nome)) && (
                    <div className="text-center text-gray-400 py-8">
                      Classificação não disponível para este regional
                    </div>
                  )}
              </div>
            ))}

            <div className="bg-[#1C1C24] rounded-xl p-6">
              <h3 className="font-bold text-white mb-4">Legenda de Classificação</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#272731] p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">{estatisticas.totalJogos}</div>
                  <div className="text-gray-400">Total de Jogos</div>
                </div>
                <div className="bg-[#272731] p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-400">{estatisticas.jogosFinalizados}</div>
                  <div className="text-gray-400">Finalizados</div>
                </div>
                <div className="bg-[#272731] p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-400">{estatisticas.jogosPendentes}</div>
                  <div className="text-gray-400">Agendados</div>
                </div>
                <div className="bg-[#272731] p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.round((estatisticas.jogosFinalizados / estatisticas.totalJogos) * 100)}%
                  </div>
                  <div className="text-gray-400">Concluído</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {jogos.length > 0 ? (
                <div className="grid gap-4">
                  {jogos
                    .sort((a, b) => new Date(b.dataJogo).getTime() - new Date(a.dataJogo).getTime())
                    .map((jogo) => (
                      <div key={jogo.id} className="bg-[#1C1C24] rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                              <Image
                                src={ImageService.getTeamLogo(jogo.timeCasa.logo)}
                                alt={jogo.timeCasa.nome}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <div className="text-right">
                                <div className="font-semibold text-white">{jogo.timeCasa.nome}</div>
                                <div className="text-sm text-gray-400">{jogo.timeCasa.sigla}</div>
                              </div>
                            </div>

                            <div className="text-center px-6">
                              {jogo.status === 'FINALIZADO' ? (
                                <div className="bg-[#272731] px-4 py-2 rounded-lg">
                                  <div className="text-2xl font-bold text-white">
                                    {jogo.placarCasa} × {jogo.placarVisitante}
                                  </div>
                                  <div className="text-xs text-gray-400">Final</div>
                                </div>
                              ) : jogo.status === 'AO_VIVO' ? (
                                <div className="bg-red-500 px-4 py-2 rounded-lg">
                                  <div className="text-white font-bold">AO VIVO</div>
                                  <div className="text-xs text-red-100">
                                    {jogo.placarCasa || 0} × {jogo.placarVisitante || 0}
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-blue-500 px-4 py-2 rounded-lg">
                                  <div className="text-white font-bold">
                                    <Clock size={16} className="inline mr-1" />
                                    {new Date(jogo.dataJogo).toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                  <div className="text-xs text-blue-100">Agendado</div>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-semibold text-white">{jogo.timeVisitante.nome}</div>
                                <div className="text-sm text-gray-400">{jogo.timeVisitante.sigla}</div>
                              </div>
                              <Image
                                src={ImageService.getTeamLogo(jogo.timeVisitante.logo)}
                                alt={jogo.timeVisitante.nome}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {jogo.fase} • Rodada {jogo.rodada}
                            </div>
                            {jogo.local && (
                              <div className="text-xs text-gray-500">{jogo.local}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-[#1C1C24] rounded-xl p-12 text-center">
                  <Calendar className="mx-auto text-gray-600 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum jogo encontrado</h3>
                  <p className="text-gray-500">
                    Os jogos desta conferência ainda não foram agendados.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'playoffs' && (
          <div className="space-y-8">
            <div className="bg-[#1C1C24] rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Sistema de Playoffs - {conferenciaConfig.nome}
              </h2>

              <div className="bg-[#272731] rounded-lg p-6 mb-6">
                <h3 className="font-bold text-white mb-4">Como Funciona:</h3>
                <div className="space-y-3 text-gray-300">
                  {conferenciaTipo === 'SUDESTE' && (
                    <>
                      <p>• <strong>Classificação Direta:</strong> 1º e 2º melhores primeiros colocados dos regionais</p>
                      <p>• <strong>Wild Card:</strong> 3º melhor 1º colocado × 3º melhor 2º colocado | 1º melhor 2º × 2º melhor 2º</p>
                      <p>• <strong>Semifinal:</strong> Classificados diretos × Vencedores dos Wild Cards</p>
                    </>
                  )}
                  {conferenciaTipo === 'SUL' && (
                    <>
                      <p>• <strong>Classificação Direta:</strong> 1º colocado de cada regional</p>
                      <p>• <strong>Wild Card:</strong> 2º colocado Araucária × 3º colocado Pampa | 2º colocado Pampa × 3º colocado Araucária</p>
                      <p>• <strong>Semifinal:</strong> Classificados diretos × Vencedores dos Wild Cards</p>
                    </>
                  )}
                  {conferenciaTipo === 'NORDESTE' && (
                    <>
                      <p>• <strong>Classificação Direta:</strong> 1º e 2º colocados do Regional Atlântico</p>
                      <p>• <strong>Wild Card:</strong> 3º × 6º colocado | 4º × 5º colocado</p>
                      <p>• <strong>Semifinal:</strong> Classificados diretos × Vencedores dos Wild Cards</p>
                    </>
                  )}
                  {conferenciaTipo === 'CENTRO_NORTE' && (
                    <>
                      <p>• <strong>Semifinal Direta:</strong> 1º colocado Amazônia × 2º colocado Cerrado</p>
                      <p>• <strong>Semifinal Direta:</strong> 1º colocado Cerrado × 2º colocado Amazônia</p>
                      <p>• <strong>Final:</strong> Vencedor Semifinal 1 × Vencedor Semifinal 2</p>
                    </>
                  )}
                </div>
              </div>

              {playoffs.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Chaveamento Atual</h3>
                  <div className="bg-[#272731] rounded-lg p-6 text-center">
                    <div className="text-gray-400">
                      Chaveamento dos playoffs será exibido quando os jogos forem gerados.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#272731] rounded-lg p-8 text-center">
                  <Trophy className="mx-auto text-gray-600 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Playoffs não iniciados</h3>
                  <p className="text-gray-500">
                    Os playoffs desta conferência ainda não foram gerados.
                    Aguarde o término da temporada regular.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-[#1C1C24] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Times Classificados</h3>

              {estatisticas.timesClassificados > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center text-gray-400 py-8 col-span-full">
                    Lista de classificados será exibida quando disponível
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Users className="mx-auto mb-4" size={48} />
                  <p>Nenhum time classificado ainda.</p>
                  <p className="text-sm">A classificação será definida ao final da temporada regular.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}