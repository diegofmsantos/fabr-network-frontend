"use client"

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { CampeonatoStats } from '@/components/Campeonato/CampeonatoStats'
import { useCampeonato, useJogos, useClassificacao } from '@/hooks/useCampeonatos'
import { useJogadores, useTimes } from '@/hooks/queries'
import { ArrowLeft, Trophy, Target, TrendingUp, Users, BarChart3, Award, Zap, Filter, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { calculateStat, shouldIncludePlayer } from '@/utils/services/StatsServices'
import { StatKey } from '@/types'

type StatCategory = 'geral' | 'individuais' | 'times' | 'grupos'

export default function EstatisticasPage() {
  const params = useParams()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<StatCategory>('geral')
  const [selectedGrupo, setSelectedGrupo] = useState<number | 'todos'>('todos')
  
  const campeonatoId = parseInt(params.id as string)

  const { data: campeonato, isLoading: loadingCampeonato, error } = useCampeonato(campeonatoId)
  const { data: jogos = [], isLoading: loadingJogos } = useJogos({ campeonatoId })
  const { data: classificacao = [], isLoading: loadingClassificacao } = useClassificacao(campeonatoId)
  const { data: jogadores = [] } = useJogadores(campeonato?.temporada || '2025')
  const { data: times = [] } = useTimes(campeonato?.temporada || '2025')

  const loading = loadingCampeonato || loadingJogos || loadingClassificacao

  // Filtrar jogadores por times que participam do campeonato
  const jogadoresCampeonato = useMemo(() => {
    if (!campeonato) return []
    
    const timesIds = campeonato.grupos.flatMap(grupo => 
      grupo.times.map(gt => gt.timeId)
    )
    
    return jogadores.filter(jogador => timesIds.includes(jogador.timeId || 0))
  }, [jogadores, campeonato])

  // Líderes individuais por categoria
  const lideresIndividuais = useMemo(() => {
    const categorias = [
      { title: 'Jardas de Passe', key: 'jardas_de_passe' as StatKey, category: 'PASSE' },
      { title: 'TDs de Passe', key: 'td_passados' as StatKey, category: 'PASSE' },
      { title: 'Jardas de Corrida', key: 'jardas_corridas' as StatKey, category: 'CORRIDA' },
      { title: 'TDs de Corrida', key: 'tds_corridos' as StatKey, category: 'CORRIDA' },
      { title: 'Jardas de Recepção', key: 'jardas_recebidas' as StatKey, category: 'RECEPÇÃO' },
      { title: 'TDs de Recepção', key: 'tds_recebidos' as StatKey, category: 'RECEPÇÃO' },
      { title: 'Sacks', key: 'sacks_forcado' as StatKey, category: 'DEFESA' },
      { title: 'Interceptações', key: 'interceptacao_forcada' as StatKey, category: 'DEFESA' },
    ]

    return categorias.map(cat => {
      const lideres = jogadoresCampeonato
        .filter(jogador => shouldIncludePlayer(jogador, cat.key, cat.category))
        .map(jogador => ({
          jogador,
          valor: calculateStat(jogador, cat.key) || 0,
          time: times.find(t => t.id === jogador.timeId)
        }))
        .filter(item => typeof item.valor === 'number' && item.valor > 0)
        .sort((a, b) => (b.valor as number) - (a.valor as number))
        .slice(0, 10)

      return {
        title: cat.title,
        lideres
      }
    })
  }, [jogadoresCampeonato, times])

  if (loading) return <Loading />

  if (error || !campeonato) {
    return (
      <NoDataFound
        type="campeonato"
        entityName={params.id as string}
        onGoBack={() => router.back()}
        temporada="2025"
      />
    )
  }

  const StatLeaderCard = ({ title, lideres }: { title: string, lideres: any[] }) => (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y max-h-80 overflow-y-auto">
        {lideres.slice(0, 5).map((item, index) => (
          <Link 
            key={item.jogador.id}
            href={`/${item.time?.nome}/${item.jogador.nome}?temporada=${campeonato.temporada}`}
            className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-sm font-medium text-gray-500">
                {index + 1}
              </span>
              <Image
                src={ImageService.getTeamLogo(item.time?.nome || '')}
                alt={`Logo ${item.time?.nome}`}
                width={24}
                height={24}
                className="rounded"
                onError={(e) => ImageService.handleTeamLogoError(e, item.time?.nome || '')}
              />
              <div>
                <div className="font-medium text-gray-900 text-sm">{item.jogador.nome}</div>
                <div className="text-xs text-gray-500">{item.time?.sigla} • {item.jogador.posicao}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{item.valor}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeCategory) {
      case 'geral':
        return <CampeonatoStats jogos={jogos} classificacao={classificacao} temporada={campeonato.temporada} />
      
      case 'individuais':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Líderes Individuais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lideresIndividuais.map((categoria, index) => (
                  <StatLeaderCard
                    key={index}
                    title={categoria.title}
                    lideres={categoria.lideres}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'times':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Rankings de Times</h2>
              
              {/* Filtro por Grupo */}
              {campeonato.grupos.length > 1 && (
                <div className="mb-6">
                  <select
                    value={selectedGrupo}
                    onChange={(e) => setSelectedGrupo(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="todos">Todos os Grupos</option>
                    {campeonato.grupos.map(grupo => (
                      <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Melhor Ataque */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    Melhor Ataque
                  </h3>
                  <div className="space-y-2">
                    {classificacao
                      .filter(item => selectedGrupo === 'todos' || item.grupoId === selectedGrupo)
                      .sort((a, b) => b.pontosPro - a.pontosPro)
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">{index + 1}º</span>
                            <Image
                              src={ImageService.getTeamLogo(item.time.nome || '')}
                              alt={`Logo ${item.time.nome}`}
                              width={32}
                              height={32}
                              onError={(e) => ImageService.handleTeamLogoError(e, item.time.nome || '')}
                            />
                            <span className="font-medium">{item.time.nome}</span>
                          </div>
                          <span className="font-bold text-orange-600">{item.pontosPro}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Melhor Defesa */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-500" />
                    Melhor Defesa
                  </h3>
                  <div className="space-y-2">
                    {classificacao
                      .filter(item => selectedGrupo === 'todos' || item.grupoId === selectedGrupo)
                      .sort((a, b) => a.pontosContra - b.pontosContra)
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500">{index + 1}º</span>
                            <Image
                              src={ImageService.getTeamLogo(item.time.nome || '')}
                              alt={`Logo ${item.time.nome}`}
                              width={32}
                              height={32}
                              onError={(e) => ImageService.handleTeamLogoError(e, item.time.nome || '')}
                            />
                            <span className="font-medium">{item.time.nome}</span>
                          </div>
                          <span className="font-bold text-blue-600">{item.pontosContra}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'grupos':
        return (
          <div className="space-y-6">
            {campeonato.grupos.map(grupo => {
              const classificacaoGrupo = classificacao.filter(c => c.grupoId === grupo.id)
              const statsGrupo = {
                totalJogos: jogos.filter(j => j.grupoId === grupo.id && j.status === 'FINALIZADO').length,
                totalPontos: classificacaoGrupo.reduce((acc, item) => acc + item.pontosPro, 0),
                mediaAproveitamento: classificacaoGrupo.reduce((acc, item) => acc + item.aproveitamento, 0) / classificacaoGrupo.length || 0
              }

              return (
                <div key={grupo.id} className="bg-white rounded-lg p-6 border">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{grupo.nome}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{statsGrupo.totalJogos}</div>
                      <div className="text-sm text-blue-800">Jogos Realizados</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{statsGrupo.totalPontos}</div>
                      <div className="text-sm text-green-800">Total de Pontos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{statsGrupo.mediaAproveitamento.toFixed(1)}%</div>
                      <div className="text-sm text-purple-800">Aproveitamento Médio</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {classificacaoGrupo.slice(0, 4).map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white
                            ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'}`}>
                            {index + 1}
                          </span>
                          <Image
                            src={ImageService.getTeamLogo(item.time.nome || '')}
                            alt={`Logo ${item.time.nome}`}
                            width={32}
                            height={32}
                            onError={(e) => ImageService.handleTeamLogoError(e, item.time.nome || '')}
                          />
                          <span className="font-medium">{item.time.nome}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.pontos} pts</div>
                          <div className="text-sm text-gray-500">{item.aproveitamento.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] py-24 px-4 max-w-[1400px] mx-auto xl:pt-10 xl:ml-[600px]">
      {/* Breadcrumb e Navegação */}
      <div className="mb-6">
        <Link
          href={`/campeonato/${campeonatoId}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Campeonato
        </Link>
        
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/campeonato" className="hover:text-blue-600">
            Campeonatos
          </Link>
          <span>›</span>
          <Link href={`/campeonato/${campeonatoId}`} className="hover:text-blue-600">
            {campeonato.nome}
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">Estatísticas</span>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg p-6 border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold italic tracking-[-2px] mb-2">
              ESTATÍSTICAS
            </h1>
            <p className="text-gray-600">{campeonato.nome} - {campeonato.temporada}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Botão de Download */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Navegação por Categorias */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="flex overflow-x-auto">
          {[
            { id: 'geral', label: 'Visão Geral', icon: BarChart3 },
            { id: 'individuais', label: 'Líderes Individuais', icon: Trophy },
            { id: 'times', label: 'Rankings de Times', icon: Users },
            { id: 'grupos', label: 'Por Grupos', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as StatCategory)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeCategory === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Conteúdo */}
      {renderContent()}
    </div>
  )
}