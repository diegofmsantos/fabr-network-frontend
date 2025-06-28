"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Loading } from '@/components/ui/Loading'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { Trophy, Users, Calendar, Target, ChevronRight, Play, CheckCircle, Star, Award, Crown, BarChart3, Clock } from 'lucide-react'
import { useSuperliga, useStatusSuperliga, useConferencias, useProximosJogos, useUltimosResultados } from '@/hooks/useSuperliga'

// Tipagens baseadas na estrutura da Superliga
interface ConferenciaInfo {
  id: number
  nome: string
  tipo: string
  icone: string
  ordem: number
  totalTimes: number
  regionais?: {
    id: number
    nome: string
    tipo: string
    timesPorRegional: number
  }[]
}

interface SuperligaData {
  id: number
  nome: string
  temporada: string
  status: string
  dataInicio: string
  dataFim?: string
  isSuperliga: boolean
}

interface StatusData {
  campeonatoId: number
  fase: string
  jogosTemporadaRegular: {
    total: number
    finalizados: number
    percentual: number
  }
  playoffsStatus?: any
  faseNacionalStatus?: any
}

export default function SuperligaPage() {
  const params = useParams()
  const temporada = params.temporada as string || '2025'
  const [activeTab, setActiveTab] = useState<'overview' | 'conferencias' | 'playoffs'>('overview')

  const { data: superliga, isLoading: loadingSuperliga } = useSuperliga(temporada)
  const { data: status, isLoading: loadingStatus } = useStatusSuperliga(temporada)
  const { data: conferencias, isLoading: loadingConferencias } = useConferencias(temporada)
  const { data: proximosJogos } = useProximosJogos(temporada, 3)
  const { data: ultimosResultados } = useUltimosResultados(temporada, 3)

  const loading = loadingSuperliga || loadingStatus || loadingConferencias

  if (loading) {
    return <Loading />
  }

  if (!superliga) {
    return (
      <NoDataFound
        message={`A Superliga ${temporada} ainda não foi criada`}
        description="Aguarde a criação da Superliga para esta temporada."
      />
    )
  }

  const superligaData = superliga as SuperligaData
  const statusData = status as StatusData
  const conferenciasData = conferencias as ConferenciaInfo[]

  // Configuração das conferências com ícones e cores
  const getConferenciaDisplay = (tipo: string) => {
    switch (tipo) {
      case 'SUDESTE':
        return {
          icone: '🏭',
          cor: 'from-blue-600 to-blue-800',
          regionais: ['Regional Serramar', 'Regional Canastra', 'Regional Cantareira']
        }
      case 'SUL':
        return {
          icone: '🧊',
          cor: 'from-cyan-600 to-cyan-800',
          regionais: ['Regional Araucária', 'Regional Pampa']
        }
      case 'NORDESTE':
        return {
          icone: '🌵',
          cor: 'from-orange-600 to-orange-800',
          regionais: ['Regional Atlântico']
        }
      case 'CENTRO_NORTE':
        return {
          icone: '🌲',
          cor: 'from-green-600 to-green-800',
          regionais: ['Regional Cerrado', 'Regional Amazônia']
        }
      default:
        return {
          icone: '⚽',
          cor: 'from-gray-600 to-gray-800',
          regionais: []
        }
    }
  }

  const getFaseLabel = (fase: string) => {
    switch (fase) {
      case 'CONFIGURACAO': return 'Configuração'
      case 'TEMPORADA_REGULAR': return 'Temporada Regular'
      case 'PLAYOFFS': return 'Playoffs das Conferências'
      case 'FASE_NACIONAL': return 'Fase Nacional'
      case 'FINALIZADO': return 'Finalizado'
      default: return fase
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO': return 'text-gray-400'
      case 'EM_ANDAMENTO': return 'text-blue-400'
      case 'FINALIZADO': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'conferencias', label: 'Conferências', icon: Users },
    { id: 'playoffs', label: 'Playoffs', icon: Trophy }
  ]

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Status da Superliga */}
      <div className="bg-[#272731] rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{superligaData.nome}</h2>
            <p className="text-gray-300">Temporada {superligaData.temporada}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Fase Atual</p>
            <p className="text-lg font-semibold text-[#63E300]">
              {getFaseLabel(statusData?.fase || 'CONFIGURACAO')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#63E300]">32</div>
            <div className="text-sm text-gray-400">Times</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#63E300]">4</div>
            <div className="text-sm text-gray-400">Conferências</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#63E300]">8</div>
            <div className="text-sm text-gray-400">Regionais</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#63E300]">
              {statusData?.jogosTemporadaRegular?.percentual || 0}%
            </div>
            <div className="text-sm text-gray-400">Progresso</div>
          </div>
        </div>

        {/* Barra de Progresso */}
        {statusData?.jogosTemporadaRegular && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Temporada Regular</span>
              <span className="text-white">
                {statusData.jogosTemporadaRegular.finalizados} / {statusData.jogosTemporadaRegular.total} jogos
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#63E300] to-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${statusData.jogosTemporadaRegular.percentual}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Próximos Jogos e Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Jogos */}
        {Array.isArray(proximosJogos) && proximosJogos.length > 0 && (
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-[#63E300]" />
              Próximos Jogos
            </h3>
            <div className="space-y-3">
              {proximosJogos.slice(0, 3).map((jogo: any) => (
                <div key={jogo.id} className="flex items-center justify-between p-3 bg-[#1C1C24] rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      {jogo.timeCasa?.nome || 'Time A'} vs {jogo.timeVisitante?.nome || 'Time B'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {jogo.dataJogo ? new Date(jogo.dataJogo).toLocaleDateString('pt-BR') : 'Data a definir'}
                    </p>
                  </div>
                  <div className="text-yellow-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={`/superliga/${temporada}/jogos`}
              className="block mt-4 text-center text-[#63E300] hover:underline"
            >
              Ver todos os jogos
            </Link>
          </div>
        )}

        {/* Últimos Resultados */}
        {Array.isArray(ultimosResultados) && ultimosResultados.length > 0 && (
          <div className="bg-[#272731] rounded-lg border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Últimos Resultados
            </h3>
            <div className="space-y-3">
              {ultimosResultados.slice(0, 3).map((jogo: any) => (
                <div key={jogo.id} className="flex items-center justify-between p-3 bg-[#1C1C24] rounded-lg">
                  <div>
                    <p className="text-white font-medium">
                      {jogo.timeCasa?.nome || 'Time A'} {jogo.placarCasa || 0} x {jogo.placarVisitante || 0} {jogo.timeVisitante?.nome || 'Time B'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {jogo.dataJogo ? new Date(jogo.dataJogo).toLocaleDateString('pt-BR') : 'Data a definir'}
                    </p>
                  </div>
                  <div className="text-green-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={`/superliga/${temporada}/resultados`}
              className="block mt-4 text-center text-[#63E300] hover:underline"
            >
              Ver todos os resultados
            </Link>
          </div>
        )}

        {/* Fallback quando não há jogos */}
        {(!Array.isArray(proximosJogos) || proximosJogos.length === 0) &&
          (!Array.isArray(ultimosResultados) || ultimosResultados.length === 0) && (
            <div className="col-span-2 bg-[#272731] rounded-lg border border-gray-700 p-6 text-center">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Nenhum jogo encontrado</h3>
              <p className="text-gray-400">Os jogos da temporada ainda não foram gerados ou não há dados disponíveis.</p>
            </div>
          )}
      </div>

      {/* Links Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/superliga/${temporada}/classificacao`}
          className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl hover:scale-105 transition-transform duration-300 group"
        >
          <div className="flex items-center gap-4">
            <Target className="w-8 h-8 text-white" />
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#63E300] transition-colors">
                Classificação
              </h3>
              <p className="text-blue-100 text-sm">Ver tabela completa</p>
            </div>
            <ChevronRight className="ml-auto text-white/60 group-hover:text-[#63E300] transition-colors" />
          </div>
        </Link>

        <Link
          href={`/superliga/${temporada}/playoffs`}
          className="bg-gradient-to-br from-orange-600 to-red-600 p-6 rounded-xl hover:scale-105 transition-transform duration-300 group"
        >
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-white" />
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#63E300] transition-colors">
                Playoffs
              </h3>
              <p className="text-orange-100 text-sm">Chaveamento</p>
            </div>
            <ChevronRight className="ml-auto text-white/60 group-hover:text-[#63E300] transition-colors" />
          </div>
        </Link>

        <Link
          href={`/superliga/${temporada}/final`}
          className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-6 rounded-xl hover:scale-105 transition-transform duration-300 group"
        >
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8 text-white" />
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#63E300] transition-colors">
                Fase Nacional
              </h3>
              <p className="text-yellow-100 text-sm">Grande final</p>
            </div>
            <ChevronRight className="ml-auto text-white/60 group-hover:text-[#63E300] transition-colors" />
          </div>
        </Link>
      </div>
    </div>
  )

  const renderConferencias = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Conferências da Superliga</h2>
        <p className="text-gray-400">
          4 conferências divididas em 8 regionais, totalizando 32 times
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {conferenciasData?.map((conferencia) => {
          const display = getConferenciaDisplay(conferencia.tipo)
          return (
            <Link
              key={conferencia.id}
              href={`/superliga/${temporada}/conferencia/${conferencia.tipo.toLowerCase()}`}
              className="group"
            >
              <div className={`bg-gradient-to-br ${display.cor} p-6 rounded-xl hover:scale-105 transition-transform duration-300`}>
                <div className="bg-black/20 backdrop-blur rounded-lg p-6 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{display.icone}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#63E300] transition-colors">
                        {conferencia.nome}
                      </h3>
                      <p className="text-white/80">{conferencia.totalTimes} times</p>
                    </div>
                    <ChevronRight className="ml-auto text-white/60 group-hover:text-[#63E300] transition-colors" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Regionais:</h4>
                    <div className="flex flex-wrap gap-2">
                      {conferencia.regionais?.map((regional) => (
                        <span key={regional.id} className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                          {regional.nome}
                        </span>
                      )) || display.regionais.map((regional) => (
                        <span key={regional} className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                          {regional}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )

  const renderPlayoffs = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Playoffs da Superliga</h2>
        <p className="text-gray-400">
          Sistema único de playoffs por conferência culminando na Grande Final Nacional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {conferenciasData?.map((conferencia) => {
          const display = getConferenciaDisplay(conferencia.tipo)
          return (
            <div key={conferencia.id} className="bg-[#272731] rounded-lg border border-gray-700 p-6">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">{display.icone}</div>
                <h3 className="text-white font-semibold">{conferencia.nome}</h3>
                <p className="text-gray-400 text-sm">Playoffs</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Wild Card:</span>
                  <span className="text-yellow-400">Em breve</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Semifinal:</span>
                  <span className="text-yellow-400">Em breve</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Final:</span>
                  <span className="text-yellow-400">Em breve</span>
                </div>
              </div>

              <Link
                href={`/superliga/${temporada}/conferencia/${conferencia.tipo.toLowerCase()}`}
                className="block mt-4 text-center bg-[#63E300] text-black py-2 rounded-md font-medium hover:bg-[#50B800] transition-colors"
              >
                Ver Detalhes
              </Link>
            </div>
          )
        })}
      </div>

      <div className="text-center">
        <Link
          href={`/superliga/${temporada}/final`}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-yellow-800 text-white font-semibold py-3 px-8 rounded-xl hover:from-yellow-700 hover:to-yellow-900 transition-colors"
        >
          <Crown className="w-6 h-6" />
          Ver Fase Nacional
        </Link>
      </div>
    </div>
  )

  return (
    <div className='bg-[#ECECEC]'>
      <div className="min-h-screen bg-[#ECECEC] p-6 max-w-[1200px] mx-auto xl:ml-[510px]">
        {/* Header */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#272731] mb-2 flex items-center justify-center gap-3">
              <Trophy className="w-10 h-10 text-[#63E300]" />
              Superliga de Futebol Americano
            </h1>
            <p className="text-[#272731] text-lg">Temporada {temporada}</p>
            <p className={`text-sm ${getStatusColor(superligaData.status)}`}>
              Status: {superligaData.status === 'NAO_INICIADO' ? 'Não Iniciado' :
                superligaData.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Finalizado'}
            </p>
          </div>

          {/* Navegação */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#272731] rounded-lg border border-gray-700 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-[#63E300] text-black'
                    : 'text-gray-400 hover:text-white hover:bg-[#1C1C24]'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'conferencias' && renderConferencias()}
            {activeTab === 'playoffs' && renderPlayoffs()}
          </div>
        </div>
      </div>
    </div>
  )
}