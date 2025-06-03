"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { CampeonatoHeader } from '@/components/Campeonato/CampeonatoHeader'
import { TabelaClassificacao } from '@/components/Campeonato/TabelaClassificacao'
import { CalendarioJogos } from '@/components/Campeonato/CalendarioJogos'
import { CampeonatoStats } from '@/components/Campeonato/CampeonatoStats'
import { JogoCard } from '@/components/Campeonato/JogoCard'
import { useCampeonato, useJogos, useClassificacao, useProximosJogos, useUltimosResultados } from '@/hooks/useCampeonatos'
import { Trophy, Calendar, BarChart3, Users, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { NoDataFound } from '@/components/ui/NoDataFound'

type TabType = 'overview' | 'tabela' | 'jogos' | 'estatisticas'

export default function CampeonatoPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  
  const campeonatoId = parseInt(params.id as string)

  // Hooks para buscar dados
  const { data: campeonato, isLoading: loadingCampeonato, error: errorCampeonato } = useCampeonato(campeonatoId)
  const { data: classificacao = [], isLoading: loadingClassificacao } = useClassificacao(campeonatoId)
  const { data: proximosJogos = [], isLoading: loadingProximos } = useProximosJogos(campeonatoId, 6)
  const { data: ultimosResultados = [], isLoading: loadingUltimos } = useUltimosResultados(campeonatoId, 6)
  
  // Dados condicionais baseados na tab ativa
  const { data: todosJogos = [], isLoading: loadingTodosJogos } = useJogos(
    activeTab === 'jogos' ? { campeonatoId } : {}
  )

  const loading = loadingCampeonato || loadingClassificacao

  if (loading) return <Loading />

  if (errorCampeonato || !campeonato) {
    return (
      <NoDataFound
        type="campeonato"
        entityName={params.id as string}
        onGoBack={() => router.back()}
      />
    )
  }

  const renderOverviewTab = () => (
    <div className="space-y-8">
      {/* Resumo do Campeonato */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Status */}
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {campeonato.status === 'EM_ANDAMENTO' ? 'Em Andamento' :
                 campeonato.status === 'NAO_INICIADO' ? 'Não Iniciado' : 'Finalizado'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {campeonato._count?.jogos || 0} jogos no total
              </p>
            </div>
            <Trophy className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Card de Grupos */}
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Grupos</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {campeonato.grupos.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {campeonato.grupos.reduce((acc, grupo) => acc + grupo.times.length, 0)} times participando
              </p>
            </div>
            <Users className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Card de Rodadas */}
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rodadas</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {campeonato.formato?.numeroRodadas || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {campeonato.formato?.tipoDisputa || 'Formato não definido'}
              </p>
            </div>
            <Calendar className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Seção de Próximos Jogos e Últimos Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximos Jogos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Próximos Jogos</h2>
            <Link 
              href={`/campeonato/${campeonatoId}?tab=jogos`}
              onClick={() => setActiveTab('jogos')}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loadingProximos ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : proximosJogos.length > 0 ? (
            <div className="space-y-3">
              {proximosJogos.map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} compact={true} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border text-center">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Nenhum jogo agendado</p>
            </div>
          )}
        </div>

        {/* Últimos Resultados */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Últimos Resultados</h2>
            <Link 
              href={`/campeonato/${campeonatoId}?tab=jogos`}
              onClick={() => setActiveTab('jogos')}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loadingUltimos ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : ultimosResultados.length > 0 ? (
            <div className="space-y-3">
              {ultimosResultados.map(jogo => (
                <JogoCard key={jogo.id} jogo={jogo} compact={true} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 border text-center">
              <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Nenhum resultado disponível</p>
            </div>
          )}
        </div>
      </div>

      {/* Classificação Resumida */}
      {classificacao.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Classificação</h2>
            <Link 
              href={`/campeonato/${campeonatoId}?tab=tabela`}
              onClick={() => setActiveTab('tabela')}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
            >
              Ver completa <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Grupos da Classificação */}
          <div className="space-y-6">
            {campeonato.grupos.map(grupo => {
              const classificacaoGrupo = classificacao.filter(c => c.grupoId === grupo.id)
              if (classificacaoGrupo.length === 0) return null
              
              return (
                <TabelaClassificacao
                  key={grupo.id}
                  classificacao={classificacaoGrupo.slice(0, 4)} // Mostrar apenas top 4
                  grupoNome={grupo.nome}
                  compact={true}
                  temporada={campeonato.temporada}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  const renderTabelaTab = () => (
    <div className="space-y-6">
      {campeonato.grupos.map(grupo => {
        const classificacaoGrupo = classificacao.filter(c => c.grupoId === grupo.id)
        if (classificacaoGrupo.length === 0) return null
        
        return (
          <TabelaClassificacao
            key={grupo.id}
            classificacao={classificacaoGrupo}
            grupoNome={grupo.nome}
            temporada={campeonato.temporada}
          />
        )
      })}
    </div>
  )

  const renderJogosTab = () => (
    <CalendarioJogos 
      jogos={todosJogos} 
      loading={loadingTodosJogos}
    />
  )

  const renderEstatisticasTab = () => (
    <CampeonatoStats
      jogos={todosJogos}
      classificacao={classificacao}
      loading={loadingTodosJogos}
      temporada={campeonato.temporada}
    />
  )

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab()
      case 'tabela': return renderTabelaTab()
      case 'jogos': return renderJogosTab()
      case 'estatisticas': return renderEstatisticasTab()
      default: return renderOverviewTab()
    }
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] py-24 px-4 max-w-[1400px] mx-auto xl:pt-10 xl:ml-[600px]">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/campeonato" className="hover:text-blue-600">
            Campeonatos
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">{campeonato.nome}</span>
        </div>
      </nav>

      {/* Header do Campeonato */}
      <CampeonatoHeader 
        campeonato={campeonato}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      {/* Conteúdo da Tab Ativa */}
      <div className="pb-8">
        {renderActiveTab()}
      </div>
    </div>
  )
}