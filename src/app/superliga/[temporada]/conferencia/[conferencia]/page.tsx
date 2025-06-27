"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Trophy,
  Target,
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  MapPin,
  Award,
  Crown,
  Zap,
  Play,
  Clock,
  CheckCircle
} from 'lucide-react'
import { Loading } from '@/components/ui/Loading'

interface TimeConferencia {
  id: number
  nome: string
  sigla: string
  cor: string
  logo: string
  cidade: string
  regional: string
  posicao: number
  posicaoAnterior?: number
  jogos: number
  vitorias: number
  derrotas: number
  pontosPro: number
  pontosContra: number
  saldo: number
  aproveitamento: number
  ultimosJogos: ('V' | 'D')[]
  classificacao: 'DIRETO' | 'WILD_CARD' | 'ELIMINADO' | 'EM_DISPUTA'
  proximoJogo?: {
    data: string
    adversario: string
    local: string
    tipo: 'CASA' | 'VISITANTE'
  }
}

interface RegionalConferencia {
  nome: string
  tipo: string
  times: TimeConferencia[]
  lider: TimeConferencia
  estatisticas: {
    mediaGols: number
    melhorAtaque: TimeConferencia
    melhorDefesa: TimeConferencia
  }
}

interface JogoConferencia {
  id: number
  data: string
  rodada: number
  timeCasa: TimeConferencia
  timeVisitante: TimeConferencia
  placarCasa?: number
  placarVisitante?: number
  status: 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO'
  local: string
  fase: 'TEMPORADA_REGULAR' | 'PLAYOFF'
}

interface ConferenciaData {
  nome: string
  tipo: string
  icone: string
  cor: string
  totalTimes: number
  regionais: RegionalConferencia[]
  classificacaoGeral: TimeConferencia[]
  estatisticas: {
    jogosRealizados: number
    totalJogos: number
    mediaGolsPorJogo: number
    maiorGoleada: {
      placar: string
      times: string
    }
    artilheiro: {
      nome: string
      time: string
      touchdowns: number
    }
  }
  proximosJogos: JogoConferencia[]
  ultimosResultados: JogoConferencia[]
  playoffsStatus?: {
    fase: 'NAO_INICIADO' | 'WILD_CARD' | 'SEMIFINAL' | 'FINAL' | 'FINALIZADO'
    campeao?: TimeConferencia
  }
}

export default function ConferenciaPage() {
  const params = useParams()
  const temporada = params.temporada as string
  const conferencia = params.conferencia as string
  
  const [visualizacao, setVisualizacao] = useState<'regional' | 'geral'>('regional')
  const [aba, setAba] = useState<'classificacao' | 'jogos' | 'estatisticas'>('classificacao')

  // Mock data - substituir por API real
  const conferenciaData: ConferenciaData = {
    nome: 'Sudeste',
    tipo: 'SUDESTE',
    icone: '🏭',
    cor: 'from-orange-500 to-red-500',
    totalTimes: 12,
    regionais: [
      {
        nome: 'Serramar',
        tipo: 'SERRAMAR',
        lider: {
          id: 1,
          nome: 'Vasco Almirantes',
          sigla: 'VAS',
          cor: '#000080',
          logo: '',
          cidade: 'Rio de Janeiro',
          regional: 'Serramar',
          posicao: 1,
          posicaoAnterior: 2,
          jogos: 4,
          vitorias: 3,
          derrotas: 1,
          pontosPro: 95,
          pontosContra: 67,
          saldo: 28,
          aproveitamento: 75,
          ultimosJogos: ['V', 'V', 'D', 'V'],
          classificacao: 'DIRETO',
          proximoJogo: {
            data: '2025-02-15T15:00:00',
            adversario: 'Flamengo Imperadores',
            local: 'Estádio Vasco',
            tipo: 'CASA'
          }
        },
        times: [
          {
            id: 1,
            nome: 'Vasco Almirantes',
            sigla: 'VAS',
            cor: '#000080',
            logo: '',
            cidade: 'Rio de Janeiro',
            regional: 'Serramar',
            posicao: 1,
            posicaoAnterior: 2,
            jogos: 4,
            vitorias: 3,
            derrotas: 1,
            pontosPro: 95,
            pontosContra: 67,
            saldo: 28,
            aproveitamento: 75,
            ultimosJogos: ['V', 'V', 'D', 'V'],
            classificacao: 'DIRETO'
          },
          {
            id: 2,
            nome: 'Flamengo Imperadores',
            sigla: 'FLA',
            cor: '#FF0000',
            logo: '',
            cidade: 'Rio de Janeiro',
            regional: 'Serramar',
            posicao: 2,
            posicaoAnterior: 1,
            jogos: 4,
            vitorias: 3,
            derrotas: 1,
            pontosPro: 89,
            pontosContra: 73,
            saldo: 16,
            aproveitamento: 75,
            ultimosJogos: ['V', 'D', 'V', 'V'],
            classificacao: 'WILD_CARD'
          }
        ],
        estatisticas: {
          mediaGols: 22.5,
          melhorAtaque: {
            id: 1,
            nome: 'Vasco Almirantes',
            sigla: 'VAS',
            cor: '#000080',
            logo: '',
            cidade: 'Rio de Janeiro',
            regional: 'Serramar',
            posicao: 1,
            jogos: 4,
            vitorias: 3,
            derrotas: 1,
            pontosPro: 95,
            pontosContra: 67,
            saldo: 28,
            aproveitamento: 75,
            ultimosJogos: ['V', 'V', 'D', 'V'],
            classificacao: 'DIRETO'
          },
          melhorDefesa: {
            id: 2,
            nome: 'Flamengo Imperadores',
            sigla: 'FLA',
            cor: '#FF0000',
            logo: '',
            cidade: 'Rio de Janeiro',
            regional: 'Serramar',
            posicao: 2,
            jogos: 4,
            vitorias: 3,
            derrotas: 1,
            pontosPro: 89,
            pontosContra: 73,
            saldo: 16,
            aproveitamento: 75,
            ultimosJogos: ['V', 'D', 'V', 'V'],
            classificacao: 'WILD_CARD'
          }
        }
      }
    ],
    classificacaoGeral: [],
    estatisticas: {
      jogosRealizados: 18,
      totalJogos: 24,
      mediaGolsPorJogo: 21.8,
      maiorGoleada: {
        placar: '42 × 7',
        times: 'Vasco Almirantes × Tritões FA'
      },
      artilheiro: {
        nome: 'João Silva',
        time: 'Vasco Almirantes',
        touchdowns: 12
      }
    },
    proximosJogos: [
      {
        id: 1,
        data: '2025-02-15T15:00:00',
        rodada: 5,
        timeCasa: {
          id: 1,
          nome: 'Vasco Almirantes',
          sigla: 'VAS',
          cor: '#000080',
          logo: '',
          cidade: 'Rio de Janeiro',
          regional: 'Serramar',
          posicao: 1,
          jogos: 4,
          vitorias: 3,
          derrotas: 1,
          pontosPro: 95,
          pontosContra: 67,
          saldo: 28,
          aproveitamento: 75,
          ultimosJogos: ['V', 'V', 'D', 'V'],
          classificacao: 'DIRETO'
        },
        timeVisitante: {
          id: 2,
          nome: 'Flamengo Imperadores',
          sigla: 'FLA',
          cor: '#FF0000',
          logo: '',
          cidade: 'Rio de Janeiro',
          regional: 'Serramar',
          posicao: 2,
          jogos: 4,
          vitorias: 3,
          derrotas: 1,
          pontosPro: 89,
          pontosContra: 73,
          saldo: 16,
          aproveitamento: 75,
          ultimosJogos: ['V', 'D', 'V', 'V'],
          classificacao: 'WILD_CARD'
        },
        status: 'AGENDADO',
        local: 'Estádio Vasco',
        fase: 'TEMPORADA_REGULAR'
      }
    ],
    ultimosResultados: [
      {
        id: 2,
        data: '2025-02-08T16:00:00',
        rodada: 4,
        timeCasa: {
          id: 1,
          nome: 'Vasco Almirantes',
          sigla: 'VAS',
          cor: '#000080',
          logo: '',
          cidade: 'Rio de Janeiro',
          regional: 'Serramar',
          posicao: 1,
          jogos: 4,
          vitorias: 3,
          derrotas: 1,
          pontosPro: 95,
          pontosContra: 67,
          saldo: 28,
          aproveitamento: 75,
          ultimosJogos: ['V', 'V', 'D', 'V'],
          classificacao: 'DIRETO'
        },
        timeVisitante: {
          id: 3,
          nome: 'Tritões FA',
          sigla: 'TRI',
          cor: '#008080',
          logo: '',
          cidade: 'Rio de Janeiro',
          regional: 'Serramar',
          posicao: 4,
          jogos: 4,
          vitorias: 1,
          derrotas: 3,
          pontosPro: 52,
          pontosContra: 89,
          saldo: -37,
          aproveitamento: 25,
          ultimosJogos: ['D', 'D', 'V', 'D'],
          classificacao: 'ELIMINADO'
        },
        placarCasa: 42,
        placarVisitante: 7,
        status: 'FINALIZADO',
        local: 'Estádio Vasco',
        fase: 'TEMPORADA_REGULAR'
      }
    ]
  }

  const getTendencia = (time: TimeConferencia) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO':
        return <Clock className="w-4 h-4 text-blue-400" />
      case 'AO_VIVO':
        return <Play className="w-4 h-4 text-red-400" />
      case 'FINALIZADO':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const renderUltimosJogos = (jogos: ('V' | 'D')[]) => {
    return (
      <div className="flex gap-1">
        {jogos.slice(-5).map((resultado, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              resultado === 'V' 
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

  const renderTabelaClassificacao = (times: TimeConferencia[]) => {
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
                key={time.id}
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
                    href={`/${time.sigla.toLowerCase()}`}
                    className="flex items-center gap-3 hover:text-[#63E300] transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: time.cor }}
                    >
                      {time.sigla}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{time.nome}</div>
                      <div className="text-gray-400 text-sm">{time.cidade}</div>
                    </div>
                  </Link>
                </td>
                
                <td className="py-4 px-4 text-center text-white">{time.jogos}</td>
                <td className="py-4 px-4 text-center text-green-400 font-semibold">{time.vitorias}</td>
                <td className="py-4 px-4 text-center text-red-400 font-semibold">{time.derrotas}</td>
                <td className="py-4 px-4 text-center text-white">{time.pontosPro}</td>
                <td className="py-4 px-4 text-center text-white">{time.pontosContra}</td>
                <td className={`py-4 px-4 text-center font-semibold ${
                  time.saldo > 0 ? 'text-green-400' : time.saldo < 0 ? 'text-red-400' : 'text-gray-400'
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
                    {time.classificacao === 'DIRETO' ? 'Classificado' :
                     time.classificacao === 'WILD_CARD' ? 'Wild Card' :
                     time.classificacao === 'ELIMINADO' ? 'Eliminado' : 'Em disputa'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const conferenciaConfig = {
    'sudeste': { nome: 'Sudeste', icone: '🏭', cor: 'from-orange-500 to-red-500' },
    'sul': { nome: 'Sul', icone: '🧊', cor: 'from-blue-500 to-cyan-500' },
    'nordeste': { nome: 'Nordeste', icone: '🌵', cor: 'from-yellow-500 to-amber-500' },
    'centro-norte': { nome: 'Centro-Norte', icone: '🌲', cor: 'from-green-500 to-emerald-500' }
  }[conferencia] || { nome: 'Conferência', icone: '🏆', cor: 'from-gray-500 to-gray-600' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a]">
      {/* Header */}
      <div className="bg-[#1a1a2e] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link
            href={`/superliga/${temporada}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Superliga
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${conferenciaConfig.cor}`}>
                <span className="text-3xl">{conferenciaConfig.icone}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Conferência {conferenciaConfig.nome}
                </h1>
                <p className="text-gray-400">{conferenciaData.totalTimes} times em {conferenciaData.regionais.length} regionais</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {conferenciaData.estatisticas.jogosRealizados}/{conferenciaData.estatisticas.totalJogos}
              </div>
              <div className="text-sm text-gray-400">jogos realizados</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Abas de Navegação */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-700">
            {[
              { id: 'classificacao', label: 'Classificação', icon: Trophy },
              { id: 'jogos', label: 'Jogos', icon: Calendar },
              { id: 'estatisticas', label: 'Estatísticas', icon: BarChart3 }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setAba(id as any)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                  aba === id
                    ? 'border-[#63E300] text-[#63E300]'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        {aba === 'classificacao' && (
          <div className="space-y-8">
            {/* Controles de Visualização */}
            <div className="flex gap-3">
              <button
                onClick={() => setVisualizacao('regional')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  visualizacao === 'regional'
                    ? 'bg-[#63E300] text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Por Regional
              </button>
              <button
                onClick={() => setVisualizacao('geral')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  visualizacao === 'geral'
                    ? 'bg-[#63E300] text-black'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Ranking Geral
              </button>
            </div>

            {/* Líderes dos Regionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {conferenciaData.regionais.map((regional) => (
                <div key={regional.tipo} className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-5 h-5 text-[#63E300]" />
                    <h3 className="text-lg font-bold text-white">Líder - {regional.nome}</h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: regional.lider.cor }}
                    >
                      {regional.lider.sigla}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{regional.lider.nome}</div>
                      <div className="text-gray-400 text-sm">{regional.lider.vitorias}V - {regional.lider.derrotas}D</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-gray-400">Saldo</span>
                    <span className={`font-semibold ${
                      regional.lider.saldo > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {regional.lider.saldo > 0 ? '+' : ''}{regional.lider.saldo}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Classificação */}
            {visualizacao === 'regional' ? (
              conferenciaData.regionais.map((regional) => (
                <div key={regional.tipo} className="bg-[#1a1a2e] rounded-xl border border-gray-800 overflow-hidden">
                  <div className={`bg-gradient-to-r ${conferenciaConfig.cor} p-6`}>
                    <h2 className="text-2xl font-bold text-white">Regional {regional.nome}</h2>
                    <p className="text-white/80">{regional.times.length} times</p>
                  </div>
                  <div className="p-6">
                    {renderTabelaClassificacao(regional.times)}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                  <h2 className="text-2xl font-bold text-white">Ranking Geral da Conferência</h2>
                  <p className="text-white/80">Todos os times ordenados por desempenho</p>
                </div>
                <div className="p-6">
                  {renderTabelaClassificacao(
                    conferenciaData.regionais
                      .flatMap(r => r.times)
                      .sort((a, b) => {
                        if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias
                        if (b.saldo !== a.saldo) return b.saldo - a.saldo
                        return b.pontosPro - a.pontosPro
                      })
                      .map((time, index) => ({ ...time, posicao: index + 1 }))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {aba === 'jogos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Próximos Jogos */}
            <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                Próximos Jogos
              </h2>
              
              <div className="space-y-4">
                {conferenciaData.proximosJogos.map((jogo) => (
                  <div key={jogo.id} className="p-4 bg-[#272731] rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(jogo.status)}
                        <span className="text-sm text-gray-400">Rodada {jogo.rodada}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(jogo.data).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: jogo.timeCasa.cor }}
                        >
                          {jogo.timeCasa.sigla}
                        </div>
                        <span className="text-white font-medium">{jogo.timeCasa.nome}</span>
                      </div>
                      
                      <div className="text-gray-500 font-bold">VS</div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{jogo.timeVisitante.nome}</span>
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: jogo.timeVisitante.cor }}
                        >
                          {jogo.timeVisitante.sigla}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {jogo.local}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Últimos Resultados */}
            <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                Últimos Resultados
              </h2>
              
              <div className="space-y-4">
                {conferenciaData.ultimosResultados.map((jogo) => (
                  <div key={jogo.id} className="p-4 bg-[#272731] rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Rodada {jogo.rodada}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(jogo.data).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: jogo.timeCasa.cor }}
                        >
                          {jogo.timeCasa.sigla}
                        </div>
                        <span className="text-white font-medium">{jogo.timeCasa.nome}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${
                          (jogo.placarCasa || 0) > (jogo.placarVisitante || 0) ? 'text-green-400' : 'text-white'
                        }`}>
                          {jogo.placarCasa}
                        </span>
                        <span className="text-gray-500">×</span>
                        <span className={`text-lg font-bold ${
                          (jogo.placarVisitante || 0) > (jogo.placarCasa || 0) ? 'text-green-400' : 'text-white'
                        }`}>
                          {jogo.placarVisitante}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{jogo.timeVisitante.nome}</span>
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: jogo.timeVisitante.cor }}
                        >
                          {jogo.timeVisitante.sigla}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {jogo.local}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {aba === 'estatisticas' && (
          <div className="space-y-8">
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {conferenciaData.estatisticas.mediaGolsPorJogo.toFixed(1)}
                </div>
                <div className="text-gray-400">Média de Pontos por Jogo</div>
              </div>
              
              <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {conferenciaData.estatisticas.maiorGoleada.placar}
                </div>
                <div className="text-gray-400">Maior Goleada</div>
                <div className="text-xs text-gray-500 mt-1">
                  {conferenciaData.estatisticas.maiorGoleada.times}
                </div>
              </div>
              
              <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6 text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">
                  {Math.round((conferenciaData.estatisticas.jogosRealizados / conferenciaData.estatisticas.totalJogos) * 100)}%
                </div>
                <div className="text-gray-400">Temporada Completa</div>
              </div>
              
              <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {conferenciaData.estatisticas.artilheiro.touchdowns}
                </div>
                <div className="text-gray-400">TDs do Artilheiro</div>
                <div className="text-xs text-gray-500 mt-1">
                  {conferenciaData.estatisticas.artilheiro.nome}
                </div>
              </div>
            </div>

            {/* Destaques por Regional */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {conferenciaData.regionais.map((regional) => (
                <div key={regional.tipo} className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Destaques - {regional.nome}</h3>
                  
                  <div className="space-y-4">
                    {/* Melhor Ataque */}
                    <div className="flex items-center justify-between p-4 bg-[#272731] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-green-400" />
                        <div>
                          <div className="text-white font-semibold">Melhor Ataque</div>
                          <div className="text-sm text-gray-400">{regional.estatisticas.melhorAtaque.nome}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-400">
                          {regional.estatisticas.melhorAtaque.pontosPro}
                        </div>
                        <div className="text-xs text-gray-400">pontos</div>
                      </div>
                    </div>

                    {/* Melhor Defesa */}
                    <div className="flex items-center justify-between p-4 bg-[#272731] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-400" />
                        <div>
                          <div className="text-white font-semibold">Melhor Defesa</div>
                          <div className="text-sm text-gray-400">{regional.estatisticas.melhorDefesa.nome}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-400">
                          {regional.estatisticas.melhorDefesa.pontosContra}
                        </div>
                        <div className="text-xs text-gray-400">pontos sofridos</div>
                      </div>
                    </div>

                    {/* Média de Gols */}
                    <div className="flex items-center justify-between p-4 bg-[#272731] rounded-lg">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-5 h-5 text-yellow-400" />
                        <div>
                          <div className="text-white font-semibold">Média do Regional</div>
                          <div className="text-sm text-gray-400">Pontos por jogo</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-400">
                          {regional.estatisticas.mediaGols}
                        </div>
                        <div className="text-xs text-gray-400">por jogo</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links de Navegação */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex justify-center gap-4">
            <Link
              href={`/superliga/${temporada}/classificacao`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Trophy className="w-5 h-5" />
              Ver Classificação Geral
            </Link>
            
            <Link
              href={`/superliga/${temporada}/playoffs`}
              className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-orange-700 transition-colors"
            >
              <Crown className="w-5 h-5" />
              Ver Playoffs
            </Link>

            <Link
              href={`/superliga/${temporada}/final`}
              className="inline-flex items-center gap-2 bg-[#63E300] text-black font-semibold py-3 px-6 rounded-xl hover:bg-[#50B800] transition-colors"
            >
              <Zap className="w-5 h-5" />
              Ver Fase Nacional
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}