"use client"

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { TabelaClassificacao } from '@/components/Campeonato/TabelaClassificacao'
import { useCampeonato, useClassificacao } from '@/hooks/useCampeonatos'
import { ArrowLeft, Trophy, Filter, Download, BarChart3, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { NoDataFound } from '@/components/ui/NoDataFound'

type ViewMode = 'grupos' | 'geral' | 'consolidada'

export default function TabelaPage() {
  const params = useParams()
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('grupos')
  const [selectedGrupo, setSelectedGrupo] = useState<number | 'todos'>('todos')
  
  const campeonatoId = parseInt(params.id as string)

  const { data: campeonato, isLoading: loadingCampeonato, error } = useCampeonato(campeonatoId)
  const { data: classificacao = [], isLoading: loadingClassificacao } = useClassificacao(campeonatoId)

  const loading = loadingCampeonato || loadingClassificacao

  // Filtrar classificação por grupo
  const classificacaoFiltrada = useMemo(() => {
    if (selectedGrupo === 'todos') return classificacao
    return classificacao.filter(item => item.grupoId === selectedGrupo)
  }, [classificacao, selectedGrupo])

  // Classificação geral (todos os times em uma tabela única)
  const classificacaoGeral = useMemo(() => {
    return [...classificacao]
      .sort((a, b) => {
        // Ordenar por: 1) Pontos, 2) Saldo, 3) Pontos Pró
        if (b.pontos !== a.pontos) return b.pontos - a.pontos
        if (b.saldoPontos !== a.saldoPontos) return b.saldoPontos - a.saldoPontos
        return b.pontosPro - a.pontosPro
      })
      .map((item, index) => ({
        ...item,
        posicao: index + 1
      }))
  }, [classificacao])

  // Estatísticas da classificação
  const statsClassificacao = useMemo(() => {
    if (classificacao.length === 0) return null

    const totalJogos = classificacao.reduce((acc, item) => acc + item.jogos, 0)
    const totalPontos = classificacao.reduce((acc, item) => acc + item.pontosPro, 0)
    const mediaPontosPorTime = totalPontos / classificacao.length
    const mediaPontosPorJogo = totalJogos > 0 ? totalPontos / totalJogos : 0

    const timeMelhorAtaque = classificacao.reduce((prev, curr) => 
      curr.pontosPro > prev.pontosPro ? curr : prev
    )
    
    const timeMelhorDefesa = classificacao.reduce((prev, curr) => 
      curr.pontosContra < prev.pontosContra ? curr : prev
    )

    const timeMelhorSaldo = classificacao.reduce((prev, curr) => 
      curr.saldoPontos > prev.saldoPontos ? curr : prev
    )

    return {
      totalJogos,
      totalPontos,
      mediaPontosPorTime,
      mediaPontosPorJogo,
      timeMelhorAtaque,
      timeMelhorDefesa,
      timeMelhorSaldo
    }
  }, [classificacao])

  if (loading) return <Loading />

  if (error || !campeonato) {
    return (
      <NoDataFound
        type="campeonato"
        entityName={params.id as string}
        onGoBack={() => router.back()}
      />
    )
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }: {
    icon: any, title: string, value: string | number, subtitle?: string, color?: string
  }) => (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const TeamHighlight = ({ team, stat, label }: {
    team: any, stat: string | number, label: string
  }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Image
        src={ImageService.getTeamLogo(team.time.nome)}
        alt={`Logo ${team.time.nome}`}
        width={32}
        height={32}
        className="rounded"
        onError={(e) => ImageService.handleTeamLogoError(e, team.time.nome)}
      />
      <div className="flex-1">
        <div className="font-medium text-gray-900">{team.time.nome}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
      <div className="text-lg font-bold text-blue-600">{stat}</div>
    </div>
  )

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
          <span className="text-gray-900 font-medium">Classificação</span>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg p-6 border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold italic tracking-[-2px] mb-2">
              CLASSIFICAÇÃO
            </h1>
            <p className="text-gray-600">{campeonato.nome} - {campeonato.temporada}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Modo de Visualização */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grupos')}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  viewMode === 'grupos' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Por Grupos
              </button>
              <button
                onClick={() => setViewMode('geral')}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  viewMode === 'geral' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Geral
              </button>
            </div>

            {/* Botão de Download */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas Resumidas */}
      {statsClassificacao && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={BarChart3}
            title="Total de Pontos"
            value={statsClassificacao.totalPontos}
            subtitle={`${statsClassificacao.mediaPontosPorJogo.toFixed(1)} por jogo`}
            color="blue"
          />
          <StatCard
            icon={Trophy}
            title="Média por Time"
            value={statsClassificacao.mediaPontosPorTime.toFixed(1)}
            subtitle="pontos por time"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            title="Jogos Realizados"
            value={statsClassificacao.totalJogos}
            subtitle={`${classificacao.length} times`}
            color="purple"
          />
          <StatCard
            icon={Trophy}
            title="Líder Geral"
            value={classificacaoGeral[0]?.time.sigla || '-'}
            subtitle={`${classificacaoGeral[0]?.pontos || 0} pontos`}
            color="yellow"
          />
        </div>
      )}

      {/* Destaques */}
      {statsClassificacao && (
        <div className="bg-white rounded-lg p-6 border mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Destaques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TeamHighlight
              team={statsClassificacao.timeMelhorAtaque}
              stat={statsClassificacao.timeMelhorAtaque.pontosPro}
              label="Melhor Ataque"
            />
            <TeamHighlight
              team={statsClassificacao.timeMelhorDefesa}
              stat={statsClassificacao.timeMelhorDefesa.pontosContra}
              label="Melhor Defesa"
            />
            <TeamHighlight
              team={statsClassificacao.timeMelhorSaldo}
              stat={`+${statsClassificacao.timeMelhorSaldo.saldoPontos}`}
              label="Melhor Saldo"
            />
          </div>
        </div>
      )}

      {/* Filtros (apenas para modo grupos) */}
      {viewMode === 'grupos' && campeonato.grupos.length > 1 && (
        <div className="bg-white rounded-lg p-4 border mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={selectedGrupo}
              onChange={(e) => setSelectedGrupo(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
              className="border rounded-md px-3 py-2"
            >
              <option value="todos">Todos os Grupos</option>
              {campeonato.grupos.map(grupo => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="space-y-8">
        {viewMode === 'grupos' && (
          selectedGrupo === 'todos' ? (
            // Mostrar todos os grupos
            campeonato.grupos.map(grupo => {
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
            })
          ) : (
            // Mostrar grupo específico
            <TabelaClassificacao
              classificacao={classificacaoFiltrada}
              grupoNome={campeonato.grupos.find(g => g.id === selectedGrupo)?.nome}
              temporada={campeonato.temporada}
            />
          )
        )}

        {viewMode === 'geral' && (
          <TabelaClassificacao
            classificacao={classificacaoGeral}
            grupoNome="Classificação Geral"
            showGroup={campeonato.grupos.length > 1}
            temporada={campeonato.temporada}
          />
        )}
      </div>

      {/* Rodapé com Informações */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start gap-3">
          <Trophy className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Critérios de Classificação</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>1º critério:</strong> Maior número de pontos</p>
              <p><strong>2º critério:</strong> Melhor saldo de pontos</p>
              <p><strong>3º critério:</strong> Maior número de pontos marcados</p>
              <p><strong>4º critério:</strong> Confronto direto (quando aplicável)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}