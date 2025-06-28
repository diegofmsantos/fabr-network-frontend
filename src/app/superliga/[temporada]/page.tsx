"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loading } from '@/components/ui/Loading'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { ImageService } from '@/utils/services/ImageService'
import { Trophy, Users, Calendar, Target, ChevronRight, Play, CheckCircle } from 'lucide-react'
import { useCampeonatos, useClassificacao } from '@/hooks/useCampeonatos'
import { useJogos } from '@/hooks/useJogos'

interface ConferenciaInfo {
  tipo: string
  nome: string
  icone: string
  cor: string
  totalTimes: number
  regionais: string[]
}

export default function SuperligaPage() {
  const params = useParams()
  const temporada = params.temporada as string || '2025'
  const [activeTab, setActiveTab] = useState<'overview' | 'conferencias' | 'playoffs'>('overview')

  const { data: campeonatos = [], isLoading: loadingCampeonatos } = useCampeonatos({
    temporada
  })

  const superliga = campeonatos.find(c => c.isSuperliga === true)
  const superligaId = superliga?.id

  const { data: jogos = [], isLoading: loadingJogos } = useJogos({
    campeonatoId: superligaId
  })

  const { data: classificacao = [] } = useClassificacao(superligaId || 0)

  const loading = loadingCampeonatos || loadingJogos

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

  const conferencias: ConferenciaInfo[] = [
    {
      tipo: 'SUDESTE',
      nome: 'Conferência Sudeste',
      icone: '🏭',
      cor: 'from-orange-500 to-red-500',
      totalTimes: 12,
      regionais: ['Serramar', 'Canastra', 'Cantareira']
    },
    {
      tipo: 'SUL',
      nome: 'Conferência Sul',
      icone: '🧊',
      cor: 'from-blue-500 to-cyan-500',
      totalTimes: 8,
      regionais: ['Araucária', 'Pampa']
    },
    {
      tipo: 'NORDESTE',
      nome: 'Conferência Nordeste',
      icone: '🌵',
      cor: 'from-yellow-500 to-amber-500',
      totalTimes: 6,
      regionais: ['Atlântico']
    },
    {
      tipo: 'CENTRO_NORTE',
      nome: 'Conferência Centro-Norte',
      icone: '🌲',
      cor: 'from-green-500 to-emerald-500',
      totalTimes: 6,
      regionais: ['Cerrado', 'Amazônia']
    }
  ]

  const estatisticas = {
    totalJogos: jogos.length,
    jogosFinalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
    jogosPendentes: jogos.filter(j => j.status === 'AGENDADO').length,
    totalTimes: 32
  }

  const proximosJogos = jogos
    .filter(j => j.status === 'AGENDADO')
    .sort((a, b) => new Date(a.dataJogo).getTime() - new Date(b.dataJogo).getTime())
    .slice(0, 5)

  const ultimosResultados = jogos
    .filter(j => j.status === 'FINALIZADO')
    .sort((a, b) => new Date(b.dataJogo).getTime() - new Date(a.dataJogo).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f172a]">
      <div className="relative bg-gradient-to-r from-[#1a1a2e] to-[#16213e] pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-6xl">🏆</div>
              <div>
                <h1 className="text-5xl md:text-6xl font-black text-white mb-2">
                  SUPERLIGA
                </h1>
                <div className="text-2xl md:text-3xl font-bold text-[#63E300]">
                  {temporada}
                </div>
              </div>
            </div>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              O maior campeonato de futebol americano do Brasil. 32 times, 4 conferências,
              8 regionais e a busca pelo título nacional.
            </p>

            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[#63E300]">{estatisticas.totalTimes}</div>
                <div className="text-gray-400">Times</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#63E300]">{estatisticas.totalJogos}</div>
                <div className="text-gray-400">Jogos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#63E300]">4</div>
                <div className="text-gray-400">Conferências</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#63E300]">8</div>
                <div className="text-gray-400">Regionais</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1C1C24] border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Visão Geral', icon: Target },
              { id: 'conferencias', label: 'Conferências', icon: Users },
              { id: 'playoffs', label: 'Playoffs', icon: Trophy }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                      ? 'border-[#63E300] text-[#63E300]'
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
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-[#1C1C24] rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="text-[#63E300]" />
                Status do Campeonato
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#272731] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="text-blue-400" size={20} />
                    <h3 className="font-semibold text-white">Temporada Regular</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progresso</span>
                      <span className="text-white">
                        {Math.round((estatisticas.jogosFinalizados / estatisticas.totalJogos) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#63E300] h-2 rounded-full transition-all"
                        style={{
                          width: `${(estatisticas.jogosFinalizados / estatisticas.totalJogos) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {estatisticas.jogosFinalizados} de {estatisticas.totalJogos} jogos finalizados
                    </div>
                  </div>
                </div>

                <div className="bg-[#272731] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Play className="text-green-400" size={20} />
                    <h3 className="font-semibold text-white">Próximos Jogos</h3>
                  </div>
                  <div className="text-2xl font-bold text-[#63E300] mb-1">
                    {estatisticas.jogosPendentes}
                  </div>
                  <div className="text-xs text-gray-400">
                    Jogos agendados
                  </div>
                </div>

                <div className="bg-[#272731] rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="text-purple-400" size={20} />
                    <h3 className="font-semibold text-white">Fase Atual</h3>
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {superliga.status === 'EM_ANDAMENTO' ? 'Temporada Regular' : 'Não Iniciado'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {superliga.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Aguardando início'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#1C1C24] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Próximos Jogos</h3>
                <div className="space-y-3">
                  {proximosJogos.length > 0 ? proximosJogos.map((jogo) => (
                    <div key={jogo.id} className="bg-[#272731] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={ImageService.getTeamLogo(jogo.timeCasa.logo)}
                            alt={jogo.timeCasa.nome}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                          <span className="text-white font-medium">{jogo.timeCasa.sigla}</span>
                          <span className="text-gray-400">×</span>
                          <span className="text-white font-medium">{jogo.timeVisitante.sigla}</span>
                          <Image
                            src={ImageService.getTeamLogo(jogo.timeVisitante.logo)}
                            alt={jogo.timeVisitante.nome}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-[#63E300]">
                            {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {jogo.fase} - R{jogo.rodada}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-400 py-8">
                      Nenhum jogo agendado
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#1C1C24] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Últimos Resultados</h3>
                <div className="space-y-3">
                  {ultimosResultados.length > 0 ? ultimosResultados.map((jogo) => (
                    <div key={jogo.id} className="bg-[#272731] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Image
                            src={ImageService.getTeamLogo(jogo.timeCasa.logo)}
                            alt={jogo.timeCasa.nome}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                          <span className="text-white font-medium">{jogo.timeCasa.sigla}</span>
                          <div className="bg-[#1C1C24] px-2 py-1 rounded text-sm">
                            <span className="text-[#63E300]">{jogo.placarCasa}</span>
                            <span className="text-gray-400 mx-1">×</span>
                            <span className="text-[#63E300]">{jogo.placarVisitante}</span>
                          </div>
                          <span className="text-white font-medium">{jogo.timeVisitante.sigla}</span>
                          <Image
                            src={ImageService.getTeamLogo(jogo.timeVisitante.logo)}
                            alt={jogo.timeVisitante.nome}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">
                            {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {jogo.fase} - R{jogo.rodada}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-400 py-8">
                      Nenhum resultado disponível
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conferencias' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Conferências da Superliga</h2>
              <p className="text-gray-400">
                Cada conferência reúne times de diferentes regionais para competir pelo título de campeão conferência.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conferencias.map((conf) => (
                <Link
                  key={conf.tipo}
                  href={`/superliga/${temporada}/conferencia/${conf.tipo.toLowerCase()}`}
                  className="group"
                >
                  <div className={`bg-gradient-to-br ${conf.cor} p-6 rounded-xl hover:scale-105 transition-transform duration-300`}>
                    <div className="bg-black/20 backdrop-blur rounded-lg p-6 h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl">{conf.icone}</div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-[#63E300] transition-colors">
                            {conf.nome}
                          </h3>
                          <p className="text-white/80">{conf.totalTimes} times</p>
                        </div>
                        <ChevronRight className="ml-auto text-white/60 group-hover:text-[#63E300] transition-colors" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">Regionais:</h4>
                        <div className="flex flex-wrap gap-2">
                          {conf.regionais.map((regional) => (
                            <span key={regional} className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                              {regional}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'playoffs' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Playoffs da Superliga</h2>
              <p className="text-gray-400">
                Sistema único de playoffs por conferência culminando na Grande Final Nacional.
              </p>
            </div>

            <div className="bg-[#1C1C24] rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Como Funcionam os Playoffs</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {conferencias.map((conf, index) => (
                  <div key={conf.tipo} className="space-y-4">
                    <div className={`bg-gradient-to-r ${conf.cor} p-4 rounded-lg`}>
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-2xl">{conf.icone}</span>
                        <span className="font-bold">{conf.nome.replace('Conferência ', '')}</span>
                      </div>
                    </div>

                    <div className="bg-[#272731] p-4 rounded-lg">
                      <h4 className="font-semibold text-white mb-2">Classificação:</h4>
                      <ul className="text-sm text-gray-400 space-y-1">
                        {conf.regionais.map((regional) => (
                          <li key={regional}>• {regional}: 1º e 2º colocados</li>
                        ))}
                        {conf.totalTimes > 6 && (
                          <li>• Wild Cards regionais</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-[#63E300]/10 to-[#63E300]/20 rounded-lg border border-[#63E300]/30">
                <h4 className="font-bold text-[#63E300] mb-2">🏆 Grande Final Nacional</h4>
                <p className="text-gray-300 text-sm">
                  Os campeões de cada conferência se enfrentam em semifinais cruzadas:<br />
                  <strong>Semifinal 1:</strong> Campeão Sul × Campeão Sudeste<br />
                  <strong>Semifinal 2:</strong> Campeão Nordeste × Campeão Centro-Norte<br />
                  <strong>Final:</strong> Vencedor Semifinal 1 × Vencedor Semifinal 2
                </p>
              </div>
            </div>

            <Link
              href={`/superliga/${temporada}/playoffs`}
              className="block bg-gradient-to-r from-[#63E300] to-[#52C41A] text-black font-bold py-4 px-8 rounded-xl text-center hover:scale-105 transition-transform"
            >
              Ver Chaveamento Completo dos Playoffs
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}