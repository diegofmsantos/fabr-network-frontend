"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Calendar, MapPin, Play, Clock, CheckCircle, Crown, Target, Zap, Eye } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'

interface PlayoffJogo {
  id: number
  nome: string
  fase: 'WILD_CARD' | 'SEMIFINAL_CONFERENCIA' | 'FINAL_CONFERENCIA' | 'SEMIFINAL_NACIONAL' | 'FINAL_NACIONAL'
  time1?: {
    id: number
    nome: string
    sigla: string
    cor: string
    logo: string
    regional: string
    posicaoRegional: number
  }
  time2?: {
    id: number
    nome: string
    sigla: string
    cor: string
    logo: string
    regional: string
    posicaoRegional: number
  }
  vencedor?: {
    id: number
    nome: string
    sigla: string
    cor: string
  }
  dataJogo?: string
  local?: string
  status: 'AGUARDANDO' | 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO'
  placarTime1?: number
  placarTime2?: number
  conferencia: string
}

interface ConferenciaPlayoffs {
  nome: string
  tipo: string
  icone: string
  cor: string
  wildcards: PlayoffJogo[]
  semifinais: PlayoffJogo[]
  final: PlayoffJogo
  campeao?: {
    id: number
    nome: string
    sigla: string
    cor: string
  }
}

export default function PlayoffsPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const [conferenciaAtiva, setConferenciaAtiva] = useState<string>('SUDESTE')
  const [visualizacao, setVisualizacao] = useState<'chaveamento' | 'calendario'>('chaveamento')

  // Mock data
  const conferencias: ConferenciaPlayoffs[] = [
    {
      nome: 'Sudeste',
      tipo: 'SUDESTE',
      icone: '🏭',
      cor: 'from-orange-500 to-red-500',
      wildcards: [
        {
          id: 1,
          nome: 'Wild Card 1',
          fase: 'WILD_CARD',
          time1: {
            id: 1,
            nome: 'Galo FA',
            sigla: 'GAL',
            cor: '#000000',
            logo: '',
            regional: 'Canastra',
            posicaoRegional: 3
          },
          time2: {
            id: 2,
            nome: 'Guarulhos Rhynos',
            sigla: 'GRH',
            cor: '#800080',
            logo: '',
            regional: 'Cantareira',
            posicaoRegional: 3
          },
          vencedor: {
            id: 1,
            nome: 'Galo FA',
            sigla: 'GAL',
            cor: '#000000'
          },
          dataJogo: '2025-02-15T15:00:00',
          local: 'Estádio do Galo',
          status: 'FINALIZADO',
          placarTime1: 28,
          placarTime2: 21,
          conferencia: 'SUDESTE'
        }
      ],
      semifinais: [
        {
          id: 2,
          nome: 'Semifinal 1',
          fase: 'SEMIFINAL_CONFERENCIA',
          time1: {
            id: 3,
            nome: 'Vasco Almirantes',
            sigla: 'VAS',
            cor: '#000080',
            logo: '',
            regional: 'Serramar',
            posicaoRegional: 1
          },
          time2: {
            id: 1,
            nome: 'Galo FA',
            sigla: 'GAL',
            cor: '#000000',
            logo: '',
            regional: 'Canastra',
            posicaoRegional: 3
          },
          dataJogo: '2025-02-22T16:00:00',
          local: 'Estádio Vasco',
          status: 'AGENDADO',
          conferencia: 'SUDESTE'
        }
      ],
      final: {
        id: 3,
        nome: 'Final Sudeste',
        fase: 'FINAL_CONFERENCIA',
        dataJogo: '2025-03-01T17:00:00',
        local: 'Estádio Final Sudeste',
        status: 'AGUARDANDO',
        conferencia: 'SUDESTE'
      }
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGUARDANDO':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'AGENDADO':
        return <Calendar className="w-4 h-4 text-blue-400" />
      case 'AO_VIVO':
        return <Play className="w-4 h-4 text-red-400" />
      case 'FINALIZADO':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGUARDANDO':
        return 'text-gray-400 bg-gray-400/10'
      case 'AGENDADO':
        return 'text-blue-400 bg-blue-400/10'
      case 'AO_VIVO':
        return 'text-red-400 bg-red-400/10'
      case 'FINALIZADO':
        return 'text-green-400 bg-green-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  const renderTimeCard = (time: any, isVencedor: boolean = false) => {
    if (!time) {
      return (
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg">
          <span className="text-gray-500">A definir</span>
        </div>
      )
    }

    return (
      <div className={`p-4 rounded-lg border-2 transition-all ${isVencedor
        ? 'border-[#63E300] bg-[#63E300]/10'
        : 'border-gray-700 bg-[#1a1a2e] hover:border-gray-600'
        }`}>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: time.cor }}
          >
            {time.sigla}
          </div>
          <div className="flex-1">
            <div className={`font-semibold ${isVencedor ? 'text-[#63E300]' : 'text-white'}`}>
              {time.nome}
            </div>
            <div className="text-sm text-gray-400">
              {time.regional} - {time.posicaoRegional}º colocado
            </div>
          </div>
          {isVencedor && <Crown className="w-6 h-6 text-[#63E300]" />}
        </div>
      </div>
    )
  }

  const renderJogoCard = (jogo: PlayoffJogo, isFinal: boolean = false) => {
    return (
      <div className={`bg-[#272731] rounded-xl border p-6 ${isFinal ? 'border-[#63E300] shadow-lg' : 'border-gray-700'
        }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor(jogo.status)}`}>
              {isFinal ? <Crown className="w-6 h-6 text-[#63E300]" /> : getStatusIcon(jogo.status)}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isFinal ? 'text-[#63E300]' : 'text-white'}`}>
                {jogo.nome}
              </h3>
              <div className="text-sm text-gray-400">{jogo.status}</div>
            </div>
          </div>

          {jogo.dataJogo && (
            <div className="text-right">
              <div className="text-white font-semibold">
                {new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit'
                })}
              </div>
              <div className="text-sm text-gray-400">
                {new Date(jogo.dataJogo).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {renderTimeCard(jogo.time1, jogo.vencedor?.id === jogo.time1?.id)}
            </div>
            {jogo.status === 'FINALIZADO' && (
              <div className="mx-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {jogo.placarTime1 || 0}
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-gray-500 font-bold">VS</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              {renderTimeCard(jogo.time2, jogo.vencedor?.id === jogo.time2?.id)}
            </div>
            {jogo.status === 'FINALIZADO' && (
              <div className="mx-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {jogo.placarTime2 || 0}
                </div>
              </div>
            )}
          </div>
        </div>

        {jogo.local && (
          <div className="mt-4 flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{jogo.local}</span>
          </div>
        )}

        {jogo.vencedor && (
          <div className="mt-4 p-3 bg-[#63E300]/10 rounded-lg border border-[#63E300]/30">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#63E300]" />
              <span className="text-[#63E300] font-semibold">
                {isFinal ? 'Campeão da Conferência' : 'Classificado'}: {jogo.vencedor.nome}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const conferenciaAtual = conferencias.find(c => c.tipo === conferenciaAtiva)

  return (
    <div className='bg-[#ECECEC]'>
      <div className="min-h-screen bg-[#ECECEC] p-6 max-w-[1200px] mx-auto xl:ml-[510px]">
        <div className="bg-[#272731] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Link
              href={`/superliga/${temporada}`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Superliga
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  🏆 Playoffs {temporada}
                </h1>
                <p className="text-gray-400">Acompanhe o chaveamento dos playoffs de cada conferência</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setVisualizacao('chaveamento')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${visualizacao === 'chaveamento'
                    ? 'bg-[#63E300] text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                  Chaveamento
                </button>
                <button
                  onClick={() => setVisualizacao('calendario')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${visualizacao === 'calendario'
                    ? 'bg-[#63E300] text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                  Calendário
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              {conferencias.map((conf) => (
                <button
                  key={conf.tipo}
                  onClick={() => setConferenciaAtiva(conf.tipo)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl border transition-all ${conferenciaAtiva === conf.tipo
                    ? 'border-[#63E300] bg-[#63E300]'
                    : 'border-gray-700 bg-[#1a1a2e] text-gray-300 hover:border-gray-600'
                    }`}
                >
                  <span className="text-2xl">{conf.icone}</span>
                  <div className="text-left">
                    <div className="font-bold">{conf.nome}</div>
                    <div className="text-xs opacity-80">
                      {conf.wildcards.length + conf.semifinais.length + 1} jogos
                    </div>
                  </div>
                  {conf.campeao && (
                    <Crown className="w-5 h-5 text-[#63E300]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {conferenciaAtual && (
            <div className="space-y-8">
              {visualizacao === 'chaveamento' ? (
                <>
                  {conferenciaAtual.wildcards.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-extrabold italic tracking-[-2px] mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        Wild Card
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {conferenciaAtual.wildcards.map((jogo) => renderJogoCard(jogo))}
                      </div>
                    </div>
                  )}

                  {conferenciaAtual.semifinais.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-extrabold italic tracking-[-2px] mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6 text-blue-400" />
                        Semifinais
                      </h2>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {conferenciaAtual.semifinais.map((jogo) => renderJogoCard(jogo))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-2xl font-extrabold italic tracking-[-2px] mb-6 flex items-center gap-2">
                      <Crown className="w-6 h-6 text-[#63E300]" />
                      Final da Conferência
                    </h2>
                    <div className="max-w-2xl mx-auto">
                      {renderJogoCard(conferenciaAtual.final, true)}
                    </div>
                  </div>

                  {conferenciaAtual.campeao && (
                    <div className="text-center py-8">
                      <div className="bg-gradient-to-r from-[#63E300]/20 to-yellow-500/20 rounded-2xl border border-[#63E300]/50 p-8 max-w-lg mx-auto">
                        <Crown className="w-16 h-16 text-[#63E300] mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-[#63E300] mb-2">
                          CAMPEÃO DA CONFERÊNCIA
                        </h2>
                        <div className="text-xl font-bold text-white mb-2">
                          {conferenciaAtual.campeao.nome}
                        </div>
                        <div className="text-gray-300">
                          Classificado para a Semifinal Nacional
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-[#272731] rounded-xl border border-gray-800 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-blue-400" />
                    Calendário de Jogos
                  </h2>

                  <div className="space-y-4">
                    {[...conferenciaAtual.wildcards, ...conferenciaAtual.semifinais, conferenciaAtual.final]
                      .filter(jogo => jogo.dataJogo)
                      .sort((a, b) => new Date(a.dataJogo!).getTime() - new Date(b.dataJogo!).getTime())
                      .map((jogo) => (
                        <div key={jogo.id} className="flex items-center justify-between p-4 bg-[#272731] rounded-lg border border-gray-700">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-white font-bold">
                                {new Date(jogo.dataJogo!).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit'
                                })}
                              </div>
                              <div className="text-sm text-gray-400">
                                {new Date(jogo.dataJogo!).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {getStatusIcon(jogo.status)}
                              <div>
                                <div className="text-white font-semibold">{jogo.nome}</div>
                                <div className="text-sm text-gray-400">
                                  {jogo.time1?.nome || 'A definir'} × {jogo.time2?.nome || 'A definir'}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {jogo.status === 'FINALIZADO' && jogo.placarTime1 !== undefined && jogo.placarTime2 !== undefined ? (
                              <div className="text-white font-bold">
                                {jogo.placarTime1} × {jogo.placarTime2}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm">{jogo.local || 'Local a definir'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <Link
                  href={`/superliga/${temporada}/final`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#63E300] to-yellow-500 text-black font-bold py-4 px-8 rounded-xl hover:scale-105 transition-transform"
                >
                  <Crown className="w-6 h-6" />
                  Ver Fase Nacional
                  <Eye className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}