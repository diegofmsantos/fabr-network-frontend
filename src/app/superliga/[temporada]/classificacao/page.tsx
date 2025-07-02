"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, TrendingUp, TrendingDown, Minus, Crown, Filter } from 'lucide-react'
import { Loading } from '@/components/ui/Loading'
import { useClassificacaoGeral, useConferencias } from '@/hooks/useSuperliga'

interface TimeClassificacao {
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

export default function ClassificacaoPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const [conferenciaAtiva, setConferenciaAtiva] = useState<string>('TODAS')
  const [visualizacao, setVisualizacao] = useState<'geral' | 'conferencia'>('geral')

  const { data: classificacao, isLoading: loadingClassificacao } = useClassificacaoGeral(temporada)
  const { data: conferencias, isLoading: loadingConferencias } = useConferencias(temporada)

  const getTendenciaIcon = (posicao: number, posicaoAnterior?: number) => {
    if (!posicaoAnterior) return <Minus className="w-4 h-4 text-gray-400" />
    
    if (posicao < posicaoAnterior) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (posicao > posicaoAnterior) return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getClassificacaoStyle = (classificacao: string) => {
    switch (classificacao) {
      case 'DIRETO':
        return 'bg-green-500/20 border-l-4 border-green-500'
      case 'WILD_CARD':
        return 'bg-yellow-500/20 border-l-4 border-yellow-500'
      default:
        return 'bg-gray-500/10 border-l-4 border-gray-500'
    }
  }

  const getConferenciaColor = (conferencia: string) => {
    switch (conferencia) {
      case 'SUDESTE': return 'from-orange-500 to-red-500'
      case 'SUL': return 'from-blue-500 to-cyan-500'
      case 'NORDESTE': return 'from-yellow-500 to-orange-500'
      case 'CENTRO_NORTE': return 'from-green-500 to-emerald-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const renderUltimosJogos = (ultimos: ('V' | 'D')[]) => (
    <div className="flex gap-1">
      {ultimos.slice(-5).map((resultado, index) => (
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

  if (loadingClassificacao || loadingConferencias) return <Loading />

  const timesClassificacao = classificacao?.ranking || []
  const timesFiltrados = conferenciaAtiva === 'TODAS' 
    ? timesClassificacao 
    : timesClassificacao.filter(time => time.conferencia === conferenciaAtiva)

  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Header com gradiente */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href={`/superliga/${temporada}`}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Classificação Superliga {temporada}</h1>
              <p className="text-blue-100 mt-1">Acompanhe a classificação de todas as conferências</p>
            </div>
          </div>

          {/* Navegação de Conferências */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setConferenciaAtiva('TODAS')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                conferenciaAtiva === 'TODAS' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Todas as Conferências
            </button>
            {conferencias?.map((conf) => (
              <button
                key={conf.tipo}
                onClick={() => setConferenciaAtiva(conf.tipo)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  conferenciaAtiva === conf.tipo 
                    ? 'bg-white text-blue-600' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span className="mr-2">{conf.icone}</span>
                {conf.nome}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-800">Visualização:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setVisualizacao('geral')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    visualizacao === 'geral' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Ranking Geral
                </button>
                <button
                  onClick={() => setVisualizacao('conferencia')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    visualizacao === 'conferencia' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Por Conferência
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {timesFiltrados.length} times • Temporada {temporada}
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Legenda de Classificação</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Classificação Direta para Semifinal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Wild Card (Repescagem)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm text-gray-600">Eliminado</span>
            </div>
          </div>
        </div>

        {/* Tabela de Classificação */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    J
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    V
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    D
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PF
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PC
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SG
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    %
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Últimos 5
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timesFiltrados.map((time, index) => (
                  <tr 
                    key={time.timeId}
                    className={`hover:bg-gray-50 transition-colors ${getClassificacaoStyle(time.classificacao)}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {time.posicao}
                          </span>
                          {getTendenciaIcon(time.posicao, time.posicaoAnterior)}
                        </div>
                        {time.posicao === 1 && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={time.time.logo || '/api/placeholder/40/40'} 
                            alt={time.time.nome}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {time.time.nome}
                          </div>
                          <div className="text-xs text-gray-500">
                            {time.regional} • {time.conferencia}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {time.jogos}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-green-600">
                        {time.vitorias}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-red-600">
                        {time.derrotas}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {time.pontosPro}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {time.pontosContra}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-sm font-semibold ${
                        time.saldo > 0 ? 'text-green-600' : 
                        time.saldo < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {time.saldo > 0 ? '+' : ''}{time.saldo}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {time.aproveitamento.toFixed(1)}%
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderUltimosJogos(time.ultimosJogos)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Links de Navegação */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href={`/superliga/${temporada}/playoffs`}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            Ver Playoffs
          </Link>

          <Link
            href={`/superliga/${temporada}/conferencia/sudeste`}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
          >
            🏭 Conferência Sudeste
          </Link>

          <Link
            href={`/superliga/${temporada}/final`}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
          >
            <Crown className="w-5 h-5 inline mr-2" />
            Grande Final
          </Link>
        </div>
      </div>
    </div>
  )
}