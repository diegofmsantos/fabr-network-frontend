"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Trophy, 
  Crown, 
  Star,
  Calendar,
  MapPin,
  Users,
  Play,
  Clock,
  CheckCircle,
  Award,
  Target,
  Zap,
  Eye,
  Medal
} from 'lucide-react'
import { Loading } from '@/components/ui/Loading'

interface TimeNacional {
  id: number
  nome: string
  sigla: string
  cor: string
  logo: string
  conferencia: string
  conferenciaIcone: string
  regional: string
  titulos: number
}

interface JogoNacional {
  id: number
  nome: string
  tipo: 'SEMIFINAL' | 'FINAL'
  time1?: TimeNacional
  time2?: TimeNacional
  vencedor?: TimeNacional
  dataJogo?: string
  local?: string
  status: 'AGUARDANDO' | 'AGENDADO' | 'AO_VIVO' | 'FINALIZADO'
  placarTime1?: number
  placarTime2?: number
  estadio?: string
  publico?: number
  mvp?: {
    nome: string
    time: string
    posicao: string
  }
}

interface FaseNacionalData {
  temporada: string
  status: 'CONFIGURANDO' | 'SEMIFINAIS' | 'FINAL' | 'FINALIZADO'
  campeoesPorConferencia: Record<string, TimeNacional>
  semifinais: JogoNacional[]
  final?: JogoNacional
  campeaoNacional?: TimeNacional
  estatisticas: {
    totalJogos: number
    jogosFinalizados: number
    publicoTotal: number
    pontosTotal: number
  }
}

export default function FinalNacionalPage() {
  const params = useParams()
  const temporada = params.temporada as string
  
  const [jogoSelecionado, setJogoSelecionado] = useState<number | null>(null)

  // Mock data
  const faseNacional: FaseNacionalData = {
    temporada,
    status: 'FINAL',
    campeoesPorConferencia: {
      'SUDESTE': {
        id: 1,
        nome: 'Vasco Almirantes',
        sigla: 'VAS',
        cor: '#000080',
        logo: '',
        conferencia: 'Sudeste',
        conferenciaIcone: '🏭',
        regional: 'Serramar',
        titulos: 2
      },
      'SUL': {
        id: 2,
        nome: 'Coritiba Crocodiles',
        sigla: 'COR',
        cor: '#00FF00',
        logo: '',
        conferencia: 'Sul',
        conferenciaIcone: '🧊',
        regional: 'Araucária',
        titulos: 1
      },
      'NORDESTE': {
        id: 3,
        nome: 'Fortaleza Tritões',
        sigla: 'FOR',
        cor: '#FF0000',
        logo: '',
        conferencia: 'Nordeste',
        conferenciaIcone: '🌵',
        regional: 'Atlântico',
        titulos: 0
      },
      'CENTRO_NORTE': {
        id: 4,
        nome: 'Cuiabá Arsenal',
        sigla: 'CUI',
        cor: '#FFD700',
        logo: '',
        conferencia: 'Centro-Norte',
        conferenciaIcone: '🌲',
        regional: 'Cerrado',
        titulos: 0
      }
    },
    semifinais: [
      {
        id: 1,
        nome: 'Semifinal Nacional 1: Sul × Sudeste',
        tipo: 'SEMIFINAL',
        time1: {
          id: 2,
          nome: 'Coritiba Crocodiles',
          sigla: 'COR',
          cor: '#00FF00',
          logo: '',
          conferencia: 'Sul',
          conferenciaIcone: '🧊',
          regional: 'Araucária',
          titulos: 1
        },
        time2: {
          id: 1,
          nome: 'Vasco Almirantes',
          sigla: 'VAS',
          cor: '#000080',
          logo: '',
          conferencia: 'Sudeste',
          conferenciaIcone: '🏭',
          regional: 'Serramar',
          titulos: 2
        },
        vencedor: {
          id: 1,
          nome: 'Vasco Almirantes',
          sigla: 'VAS',
          cor: '#000080',
          logo: '',
          conferencia: 'Sudeste',
          conferenciaIcone: '🏭',
          regional: 'Serramar',
          titulos: 2
        },
        dataJogo: '2025-03-08T16:00:00',
        local: 'Arena Nacional',
        estadio: 'Arena Nacional - Brasília',
        publico: 45000,
        status: 'FINALIZADO',
        placarTime1: 21,
        placarTime2: 28,
        mvp: {
          nome: 'João Silva',
          time: 'Vasco Almirantes',
          posicao: 'QB'
        }
      },
      {
        id: 2,
        nome: 'Semifinal Nacional 2: Nordeste × Centro-Norte',
        tipo: 'SEMIFINAL',
        time1: {
          id: 3,
          nome: 'Fortaleza Tritões',
          sigla: 'FOR',
          cor: '#FF0000',
          logo: '',
          conferencia: 'Nordeste',
          conferenciaIcone: '🌵',
          regional: 'Atlântico',
          titulos: 0
        },
        time2: {
          id: 4,
          nome: 'Cuiabá Arsenal',
          sigla: 'CUI',
          cor: '#FFD700',
          logo: '',
          conferencia: 'Centro-Norte',
          conferenciaIcone: '🌲',
          regional: 'Cerrado',
          titulos: 0
        },
        vencedor: {
          id: 3,
          nome: 'Fortaleza Tritões',
          sigla: 'FOR',
          cor: '#FF0000',
          logo: '',
          conferencia: 'Nordeste',
          conferenciaIcone: '🌵',
          regional: 'Atlântico',
          titulos: 0
        },
        dataJogo: '2025-03-08T19:30:00',
        local: 'Arena Nacional',
        estadio: 'Arena Nacional - Brasília',
        publico: 47000,
        status: 'FINALIZADO',
        placarTime1: 35,
        placarTime2: 28,
        mvp: {
          nome: 'Carlos Santos',
          time: 'Fortaleza Tritões',
          posicao: 'RB'
        }
      }
    ],
    final: {
      id: 3,
      nome: 'Grande Final Nacional',
      tipo: 'FINAL',
      time1: {
        id: 1,
        nome: 'Vasco Almirantes',
        sigla: 'VAS',
        cor: '#000080',
        logo: '',
        conferencia: 'Sudeste',
        conferenciaIcone: '🏭',
        regional: 'Serramar',
        titulos: 2
      },
      time2: {
        id: 3,
        nome: 'Fortaleza Tritões',
        sigla: 'FOR',
        cor: '#FF0000',
        logo: '',
        conferencia: 'Nordeste',
        conferenciaIcone: '🌵',
        regional: 'Atlântico',
        titulos: 0
      },
      dataJogo: '2025-03-15T17:00:00',
      local: 'Maracanã',
      estadio: 'Estádio do Maracanã - Rio de Janeiro',
      publico: 78000,
      status: 'AGENDADO'
    },
    estatisticas: {
      totalJogos: 3,
      jogosFinalizados: 2,
      publicoTotal: 92000,
      pontosTotal: 140
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGUARDANDO':
        return <Clock className="w-5 h-5 text-gray-400" />
      case 'AGENDADO':
        return <Calendar className="w-5 h-5 text-blue-400" />
      case 'AO_VIVO':
        return <Play className="w-5 h-5 text-red-400" />
      case 'FINALIZADO':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
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

  const renderTimeCard = (time: TimeNacional, isVencedor: boolean = false, isFinal: boolean = false) => {
    return (
      <div className={`p-6 rounded-xl border-2 transition-all ${
        isVencedor 
          ? 'border-[#63E300] bg-[#63E300]/10 shadow-lg' 
          : 'border-gray-700 bg-[#1a1a2e] hover:border-gray-600'
      }`}>
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: time.cor }}
          >
            {time.sigla}
          </div>
          <div className="flex-1">
            <div className={`text-lg font-bold ${isVencedor ? 'text-[#63E300]' : 'text-white'}`}>
              {time.nome}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="text-lg">{time.conferenciaIcone}</span>
              <span>{time.conferencia} - {time.regional}</span>
            </div>
            {time.titulos > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400">{time.titulos} título{time.titulos > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          {isVencedor && <Crown className="w-8 h-8 text-[#63E300]" />}
        </div>
      </div>
    )
  }

  const renderJogoCard = (jogo: JogoNacional, expandido: boolean = false) => {
    const isFinal = jogo.tipo === 'FINAL'
    
    return (
      <div className={`bg-[#272731] rounded-2xl border p-8 transition-all ${
        isFinal ? 'border-[#63E300] shadow-2xl' : 'border-gray-700'
      } ${expandido ? 'ring-2 ring-[#63E300]/50' : ''}`}>
        {/* Header do Jogo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${getStatusColor(jogo.status)}`}>
              {isFinal ? <Crown className="w-8 h-8 text-[#63E300]" /> : getStatusIcon(jogo.status)}
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${isFinal ? 'text-[#63E300]' : 'text-white'}`}>
                {jogo.nome}
              </h3>
              <div className="text-gray-400">{jogo.status}</div>
            </div>
          </div>

          <button
            onClick={() => setJogoSelecionado(expandido ? null : jogo.id)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Times */}
        <div className="space-y-6">
          {jogo.time1 && renderTimeCard(jogo.time1, jogo.vencedor?.id === jogo.time1.id, isFinal)}
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="text-gray-500 font-bold text-xl">VS</div>
              {jogo.status === 'FINALIZADO' && (
                <div className="flex gap-4 text-3xl font-bold text-white">
                  <span>{jogo.placarTime1}</span>
                  <span className="text-gray-500">×</span>
                  <span>{jogo.placarTime2}</span>
                </div>
              )}
            </div>
          </div>

          {jogo.time2 && renderTimeCard(jogo.time2, jogo.vencedor?.id === jogo.time2.id, isFinal)}
        </div>

        {/* Informações do Jogo */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {jogo.dataJogo && (
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-5 h-5" />
              <div>
                <div className="font-semibold">
                  {new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long'
                  })}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(jogo.dataJogo).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )}

          {jogo.estadio && (
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5" />
              <div>
                <div className="font-semibold">{jogo.local}</div>
                <div className="text-sm text-gray-400">{jogo.estadio}</div>
              </div>
            </div>
          )}

          {jogo.publico && (
            <div className="flex items-center gap-2 text-gray-300">
              <Users className="w-5 h-5" />
              <div>
                <div className="font-semibold">{jogo.publico.toLocaleString()}</div>
                <div className="text-sm text-gray-400">espectadores</div>
              </div>
            </div>
          )}
        </div>

        {/* MVP e Informações Extras */}
        {expandido && jogo.mvp && (
          <div className="mt-6 p-4 bg-[#63E300]/10 rounded-lg border border-[#63E300]/30">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-[#63E300]" />
              <span className="text-[#63E300] font-semibold">MVP do Jogo</span>
            </div>
            <div className="text-white">
              <span className="font-bold">{jogo.mvp.nome}</span> - {jogo.mvp.posicao} ({jogo.mvp.time})
            </div>
          </div>
        )}

        {/* Vencedor Destacado */}
        {jogo.vencedor && (
          <div className="mt-6 p-4 bg-gradient-to-r from-[#63E300]/20 to-yellow-500/20 rounded-lg border border-[#63E300]/30">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-[#63E300]" />
              <span className="text-[#63E300] font-bold text-lg">
                {isFinal ? '🏆 CAMPEÃO NACIONAL!' : '✨ Classificado para a Final!'}
              </span>
            </div>
            <div className="text-white font-bold text-xl mt-1">
              {jogo.vencedor.nome}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a]">
      {/* Header Hero */}
      <div className="relative bg-gradient-to-r from-[#1a1a2e] to-[#16213e] pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <Link
            href={`/superliga/${temporada}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Superliga
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Crown className="w-16 h-16 text-[#63E300]" />
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-2">
                  FASE NACIONAL
                </h1>
                <div className="text-2xl md:text-3xl font-bold text-[#63E300]">
                  {temporada}
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Os 4 melhores times do Brasil disputam o título nacional da Superliga
            </p>

            {/* Status da Fase */}
            <div className="inline-flex items-center gap-2 bg-[#63E300]/20 px-6 py-3 rounded-full border border-[#63E300]/30">
              {faseNacional.status === 'FINALIZADO' ? (
                <CheckCircle className="w-5 h-5 text-[#63E300]" />
              ) : faseNacional.status === 'FINAL' ? (
                <Crown className="w-5 h-5 text-[#63E300]" />
              ) : (
                <Target className="w-5 h-5 text-[#63E300]" />
              )}
              <span className="text-[#63E300] font-semibold">
                {faseNacional.status === 'FINALIZADO' ? 'Campeonato Finalizado' :
                 faseNacional.status === 'FINAL' ? 'Final Nacional' :
                 faseNacional.status === 'SEMIFINAIS' ? 'Semifinais em Andamento' :
                 'Aguardando Playoffs'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Campeões por Conferência */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            🏆 Campeões por Conferência
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(faseNacional.campeoesPorConferencia).map(([conf, time]) => (
              <div key={conf} className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-6 text-center">
                <div className="text-4xl mb-3">{time.conferenciaIcone}</div>
                <h3 className="text-lg font-bold text-white mb-2">{time.conferencia}</h3>
                
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: time.cor }}
                >
                  {time.sigla}
                </div>
                
                <div className="text-white font-semibold">{time.nome}</div>
                <div className="text-sm text-gray-400">{time.regional}</div>
                
                {time.titulos > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{time.titulos} título{time.titulos > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Semifinais Nacionais */}
        {faseNacional.semifinais.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              ⚡ Semifinais Nacionais
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {faseNacional.semifinais.map((jogo) => (
                <div key={jogo.id}>
                  {renderJogoCard(jogo, jogoSelecionado === jogo.id)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Nacional */}
        {faseNacional.final && (
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">
              👑 Grande Final Nacional
            </h2>
            
            <div className="max-w-4xl mx-auto">
              {renderJogoCard(faseNacional.final, jogoSelecionado === faseNacional.final.id)}
            </div>
          </div>
        )}

        {/* Campeão Nacional */}
        {faseNacional.campeaoNacional && (
          <div className="mb-12 text-center">
            <div className="bg-gradient-to-r from-[#63E300]/20 to-yellow-500/20 rounded-3xl border border-[#63E300]/50 p-12 max-w-2xl mx-auto">
              <div className="relative mb-6">
                <Crown className="w-24 h-24 text-[#63E300] mx-auto" />
                <div className="absolute -top-4 -right-4">
                  <Star className="w-12 h-12 text-yellow-400 animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-[#63E300] mb-4">
                CAMPEÃO NACIONAL
              </h2>
              
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: faseNacional.campeaoNacional.cor }}
              >
                {faseNacional.campeaoNacional.sigla}
              </div>
              
              <div className="text-3xl font-bold text-white mb-2">
                {faseNacional.campeaoNacional.nome}
              </div>
              
              <div className="text-gray-300 text-lg mb-4">
                {faseNacional.campeaoNacional.conferencia} - {faseNacional.campeaoNacional.regional}
              </div>
              
              <div className="text-gray-300">
                Superliga de Futebol Americano {temporada}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Medal className="w-12 h-12 text-yellow-400" />
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas da Fase Nacional */}
        <div className="bg-[#1a1a2e] rounded-xl border border-gray-800 p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">📊 Estatísticas da Fase Nacional</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {faseNacional.estatisticas.totalJogos}
              </div>
              <div className="text-sm text-gray-400">Total de Jogos</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {faseNacional.estatisticas.jogosFinalizados}
              </div>
              <div className="text-sm text-gray-400">Jogos Realizados</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {faseNacional.estatisticas.publicoTotal.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Público Total</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {faseNacional.estatisticas.pontosTotal}
              </div>
              <div className="text-sm text-gray-400">Pontos Marcados</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="text-gray-400 text-sm">
              A Fase Nacional reúne os campeões das 4 conferências da Superliga em um formato eliminatório simples
            </div>
          </div>
        </div>

        {/* Links de Navegação */}
        <div className="mt-12 text-center space-y-4">
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
            <Target className="w-5 h-5" />
            Ver Classificação Completa
          </Link>
        </div>
      </div>
    </div>
  )
}