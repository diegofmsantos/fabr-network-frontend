"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'

// Mock hooks - substituir pelos reais
const useClassificacaoSuperliga = (temporada: string) => {
  return {
    data: null,
    isLoading: false
  }
}

interface ClassificacaoTime {
  posicao: number
  posicaoAnterior?: number
  timeId: number
  time: {
    id: number
    nome: string
    sigla: string
    cor: string
    logo: string
    cidade: string
  }
  regional: string
  conferencia: string
  jogos: number
  vitorias: number
  derrotas: number
  pontosPro: number
  pontosContra: number
  saldo: number
  aproveitamento: number
  ultimosJogos: ('V' | 'D')[]
  classificacao: 'DIRETO' | 'WILD_CARD' | 'ELIMINADO'
}

interface ConferenciaClassificacao {
  nome: string
  tipo: string
  icone: string
  cor: string
  regionais: {
    nome: string
    tipo: string
    times: ClassificacaoTime[]
  }[]
}

export default function ClassificacaoPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const [conferenciaAtiva, setConferenciaAtiva] = useState<string>('SUDESTE')
  const [visualizacao, setVisualizacao] = useState<'regional' | 'geral'>('regional')

  const { data: classificacao, isLoading } = useClassificacaoSuperliga(temporada)

  // Mock data enquanto não há integração
  const conferencias: ConferenciaClassificacao[] = [
    {
      nome: 'Sudeste',
      tipo: 'SUDESTE',
      icone: '🏭',
      cor: 'from-orange-500 to-red-500',
      regionais: [
        {
          nome: 'Serramar',
          tipo: 'SERRAMAR',
          times: [
            {
              posicao: 1,
              posicaoAnterior: 2,
              timeId: 1,
              time: {
                id: 1,
                nome: 'Vasco Almirantes',
                sigla: 'VAS',
                cor: '#000080',
                logo: '/logos/vasco.png',
                cidade: 'Rio de Janeiro'
              },
              regional: 'Serramar',
              conferencia: 'Sudeste',
              jogos: 4,
              vitorias: 3,
              derrotas: 1,
              pontosPro: 89,
              pontosContra: 67,
              saldo: 22,
              aproveitamento: 75,
              ultimosJogos: ['V', 'V', 'D', 'V'],
              classificacao: 'DIRETO'
            },
            {
              posicao: 2,
              posicaoAnterior: 1,
              timeId: 2,
              time: {
                id: 2,
                nome: 'Flamengo Imperadores',
                sigla: 'FLA',
                cor: '#FF0000',
                logo: '/logos/flamengo.png',
                cidade: 'Rio de Janeiro'
              },
              regional: 'Serramar',
              conferencia: 'Sudeste',
              jogos: 4,
              vitorias: 3,
              derrotas: 1,
              pontosPro: 95,
              pontosContra: 73,
              saldo: 22,
              aproveitamento: 75,
              ultimosJogos: ['V', 'D', 'V', 'V'],
              classificacao: 'WILD_CARD'
            }
          ]
        }
      ]
    }
  ]

  const getTendencia = (time: ClassificacaoTime) => {
    if (!time.posicaoAnterior) return <Minus className="w-4 h-4 text-gray-400" />
    if (time.posicao < time.posicaoAnterior) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (time.posicao > time.posicaoAnterior) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getClassificacaoColor = (classificacao: string) => {
    switch (classificacao) {
      case 'DIRETO':
        return 'bg-green-500/20 border border-green-500/30 text-green-400'
      case 'WILD_CARD':
        return 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
      case 'ELIMINADO':
        return 'bg-red-500/20 border border-red-500/30 text-red-400'
      default:
        return 'bg-gray-500/20 border border-gray-500/30 text-gray-400'
    }
  }

  const getClassificacaoLabel = (classificacao: string) => {
    switch (classificacao) {
      case 'DIRETO':
        return 'Classificado'
      case 'WILD_CARD':
        return 'Wild Card'
      case 'ELIMINADO':
        return 'Eliminado'
      default:
        return 'Em disputa'
    }
  }

  const renderUltimosJogos = (jogos: ('V' | 'D')[]) => {
    return (
      <div className="flex gap-1">
        {jogos.slice(-5).map((resultado, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${resultado === 'V'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
              }`}
          >
            {resultado}
          </div>
        ))}
      </div>
    )
  }

  const renderTabelaClassificacao = (times: ClassificacaoTime[]) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Pos</th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">J</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">V</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">D</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">PP</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">PC</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">SG</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">%</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">Últimos</th>
              <th className="text-center py-3 px-4 text-gray-400 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {times.map((time) => (
              <tr
                key={time.timeId}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{time.posicao}</span>
                    {getTendencia(time)}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <Link
                    href={`/${time.time.sigla.toLowerCase()}`}
                    className="flex items-center gap-3 hover:text-[#63E300] transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: time.time.cor }}
                    >
                      {time.time.sigla}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{time.time.nome}</div>
                      <div className="text-gray-400 text-sm">{time.time.cidade}</div>
                    </div>
                  </Link>
                </td>

                <td className="py-4 px-4 text-center text-white">{time.jogos}</td>
                <td className="py-4 px-4 text-center text-green-400 font-semibold">{time.vitorias}</td>
                <td className="py-4 px-4 text-center text-red-400 font-semibold">{time.derrotas}</td>
                <td className="py-4 px-4 text-center text-white">{time.pontosPro}</td>
                <td className="py-4 px-4 text-center text-white">{time.pontosContra}</td>
                <td className={`py-4 px-4 text-center font-semibold ${time.saldo > 0 ? 'text-green-400' : time.saldo < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                  {time.saldo > 0 ? '+' : ''}{time.saldo}
                </td>
                <td className="py-4 px-4 text-center text-white font-semibold">
                  {time.aproveitamento.toFixed(1)}%
                </td>
                <td className="py-4 px-4 text-center">
                  {renderUltimosJogos(time.ultimosJogos)}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getClassificacaoColor(time.classificacao)}`}>
                    {getClassificacaoLabel(time.classificacao)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (isLoading) {
    return <Loading />
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
                  📊 Classificação {temporada}
                </h1>
                <p className="text-gray-400">Acompanhe a posição de todos os times na Superliga</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setVisualizacao('regional')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${visualizacao === 'regional'
                    ? 'bg-[#63E300] text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                  Por Regional
                </button>
                <button
                  onClick={() => setVisualizacao('geral')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${visualizacao === 'geral'
                    ? 'bg-[#63E300] text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                >
                  Ranking Geral
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
                    : 'border-gray-700 bg-[#272731] text-gray-300 hover:border-gray-600'
                    }`}
                >
                  <span className="text-2xl">{conf.icone}</span>
                  <div className="text-left">
                    <div className="font-bold">{conf.nome}</div>
                    <div className="text-xs opacity-80">
                      {conf.regionais.length} regionais
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {conferenciaAtual && (
            <div className="space-y-8">
              {visualizacao === 'regional' ? (
                conferenciaAtual.regionais.map((regional) => (
                  <div key={regional.tipo} className="bg-[#272731] rounded-xl border border-gray-800 overflow-hidden">
                    <div className={`bg-gradient-to-r ${conferenciaAtual.cor} p-6`}>
                      <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-white" />
                        <div>
                          <h2 className="text-2xl font-bold text-white">Regional {regional.nome}</h2>
                          <p className="text-white/80">{regional.times.length} times</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {renderTabelaClassificacao(regional.times)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#272731] rounded-xl border border-gray-800 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                    <div className="flex items-center gap-3">
                      <Crown className="w-8 h-8 text-white" />
                      <div>
                        <h2 className="text-2xl font-bold text-white">Ranking Geral</h2>
                        <p className="text-white/80">Todos os times da conferência {conferenciaAtual.nome}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {renderTabelaClassificacao(
                      conferenciaAtual.regionais
                        .flatMap(r => r.times)
                        .sort((a, b) => a.posicao - b.posicao)
                    )}
                  </div>
                </div>
              )}

              <div className="bg-[#272731] rounded-xl border border-gray-800 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Legenda</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Status de Classificação</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getClassificacaoColor('DIRETO')}`}>
                          Classificado
                        </span>
                        <span className="text-gray-400 text-sm">Direto para semifinal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getClassificacaoColor('WILD_CARD')}`}>
                          Wild Card
                        </span>
                        <span className="text-gray-400 text-sm">Disputa vaga playoff</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Últimos Jogos</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-white">V</div>
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">D</div>
                      </div>
                      <span className="text-gray-400 text-sm">Vitória / Derrota</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Abreviações</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                      <div><strong>J</strong> - Jogos | <strong>V</strong> - Vitórias | <strong>D</strong> - Derrotas</div>
                      <div><strong>PP</strong> - Pontos Pró | <strong>PC</strong> - Pontos Contra | <strong>SG</strong> - Saldo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}