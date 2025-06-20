"use client"

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { CalendarioJogos } from '@/components/Campeonato/CalendarioJogos'
import { JogoCard } from '@/components/Campeonato/JogoCard'
import { useCampeonato, useJogos } from '@/hooks/useCampeonatos'
import { ArrowLeft, Calendar, Filter, Search, Download, BarChart3, Clock, CheckCircle, Play, Pause, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { NoDataFound } from '@/components/ui/NoDataFound'

type FilterStatus = 'todos' | 'agendado' | 'ao_vivo' | 'finalizado' | 'adiado'
type ViewMode = 'calendar' | 'list' | 'rodadas'

export default function JogosPage() {
  const params = useParams()
  const router = useRouter()
  
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [filterGrupo, setFilterGrupo] = useState<number | 'todos'>('todos')
  const [filterTime, setFilterTime] = useState<number | 'todos'>('todos')
  const [filterRodada, setFilterRodada] = useState<number | 'todas'>('todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  
  const campeonatoId = parseInt(params.id as string)

  const { data: campeonato, isLoading: loadingCampeonato, error } = useCampeonato(campeonatoId)
  const { data: jogos = [], isLoading: loadingJogos } = useJogos({ campeonatoId })

  const loading = loadingCampeonato || loadingJogos

  // Filtros aplicados
  const jogosFiltrados = useMemo(() => {
    let filtered = jogos

    // Filtro por status
    if (filterStatus !== 'todos') {
      filtered = filtered.filter(jogo => jogo.status.toLowerCase() === filterStatus.toUpperCase())
    }

    // Filtro por grupo
    if (filterGrupo !== 'todos') {
      filtered = filtered.filter(jogo => jogo.grupoId === filterGrupo)
    }

    // Filtro por time
    if (filterTime !== 'todos') {
      filtered = filtered.filter(jogo => 
        jogo.timeCasaId === filterTime || jogo.timeVisitanteId === filterTime
      )
    }

    // Filtro por rodada
    if (filterRodada !== 'todas') {
      filtered = filtered.filter(jogo => jogo.rodada === filterRodada)
    }

    // Busca por texto
    if (searchTerm) {
      filtered = filtered.filter(jogo =>
        jogo.timeCasa.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jogo.timeVisitante.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jogo.timeCasa.sigla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jogo.timeVisitante.sigla?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [jogos, filterStatus, filterGrupo, filterTime, filterRodada, searchTerm])

  // Estatísticas dos jogos
  const statsJogos = useMemo(() => {
    const total = jogos.length
    const finalizados = jogos.filter(j => j.status === 'FINALIZADO').length
    const agendados = jogos.filter(j => j.status === 'AGENDADO').length
    const aoVivo = jogos.filter(j => j.status === 'AO_VIVO').length
    const adiados = jogos.filter(j => j.status === 'ADIADO').length

    const totalGols = jogos
      .filter(j => j.status === 'FINALIZADO')
      .reduce((acc, jogo) => acc + (jogo.placarCasa || 0) + (jogo.placarVisitante || 0), 0)

    const mediaGolsPorJogo = finalizados > 0 ? totalGols / finalizados : 0

    const proximoJogo = jogos
      .filter(j => j.status === 'AGENDADO')
      .sort((a, b) => new Date(a.dataJogo).getTime() - new Date(b.dataJogo).getTime())[0]

    return {
      total,
      finalizados,
      agendados,
      aoVivo,
      adiados,
      totalGols,
      mediaGolsPorJogo,
      proximoJogo,
      percentualConcluido: total > 0 ? (finalizados / total) * 100 : 0
    }
  }, [jogos])

  // Obter listas para filtros
  const grupos = campeonato?.grupos || []
  const times = useMemo(() => {
    const timesSet = new Set()
    jogos.forEach(jogo => {
      timesSet.add(JSON.stringify({ id: jogo.timeCasaId, nome: jogo.timeCasa.nome, sigla: jogo.timeCasa.sigla }))
      timesSet.add(JSON.stringify({ id: jogo.timeVisitanteId, nome: jogo.timeVisitante.nome, sigla: jogo.timeVisitante.sigla }))
    })
    return Array.from(timesSet).map(time => JSON.parse(time as string))
  }, [jogos])

  const rodadas = useMemo(() => {
    const rodasSet = new Set(jogos.map(jogo => jogo.rodada))
    return Array.from(rodasSet).sort((a, b) => a - b)
  }, [jogos])

  // Função para limpar filtros
  const clearFilters = () => {
    setFilterStatus('todos')
    setFilterGrupo('todos')
    setFilterTime('todos')
    setFilterRodada('todas')
    setSearchTerm('')
  }

  // Função para exportar dados
  const handleExport = () => {
    // Implementar exportação em CSV/PDF
    console.log('Exportar jogos:', jogosFiltrados)
  }

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
          <span className="text-gray-900 font-medium">Jogos</span>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg p-6 border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold italic tracking-[-2px] mb-2">
              JOGOS
            </h1>
            <p className="text-gray-600">{campeonato.nome} - {campeonato.temporada}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Busca */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar times..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Botão de Download */}
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas dos Jogos */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          icon={Calendar}
          title="Total de Jogos"
          value={statsJogos.total}
          subtitle={`${statsJogos.percentualConcluido.toFixed(1)}% concluído`}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          title="Finalizados"
          value={statsJogos.finalizados}
          color="green"
        />
        <StatCard
          icon={Clock}
          title="Agendados"
          value={statsJogos.agendados}
          color="blue"
        />
        <StatCard
          icon={Play}
          title="Ao Vivo"
          value={statsJogos.aoVivo}
          color="red"
        />
        <StatCard
          icon={BarChart3}
          title="Total de Pontos"
          value={statsJogos.totalGols}
          subtitle={`${statsJogos.mediaGolsPorJogo.toFixed(1)} por jogo`}
          color="purple"
        />
        <StatCard
          icon={Pause}
          title="Adiados"
          value={statsJogos.adiados}
          color="yellow"
        />
      </div>

      {/* Próximo Jogo */}
      {statsJogos.proximoJogo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximo Jogo</h2>
          <div className="max-w-md">
            <JogoCard jogo={statsJogos.proximoJogo} compact={true} />
          </div>
        </div>
      )}

      {/* Filtros Avançados */}
      <div className="bg-white rounded-lg p-6 border mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="todos">Todos</option>
              <option value="agendado">Agendados</option>
              <option value="ao_vivo">Ao Vivo</option>
              <option value="finalizado">Finalizados</option>
              <option value="adiado">Adiados</option>
            </select>
          </div>

          {/* Grupo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
            <select
              value={filterGrupo}
              onChange={(e) => setFilterGrupo(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="todos">Todos os Grupos</option>
              {grupos.map(grupo => (
                <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <select
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="todos">Todos os Times</option>
              {times.map(time => (
                <option key={time.id} value={time.id}>{time.nome}</option>
              ))}
            </select>
          </div>

          {/* Rodada */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rodada</label>
            <select
              value={filterRodada}
              onChange={(e) => setFilterRodada(e.target.value === 'todas' ? 'todas' : parseInt(e.target.value))}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="todas">Todas as Rodadas</option>
              {rodadas.map(rodada => (
                <option key={rodada} value={rodada}>{rodada}ª Rodada</option>
              ))}
            </select>
          </div>

          {/* Limpar Filtros */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Limpar
            </button>
          </div>
        </div>

        {/* Filtros Ativos */}
        {(filterStatus !== 'todos' || filterGrupo !== 'todos' || filterTime !== 'todos' || filterRodada !== 'todas' || searchTerm) && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Filtros ativos:</p>
            <div className="flex flex-wrap gap-2">
              {filterStatus !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Status: {filterStatus}
                  <button onClick={() => setFilterStatus('todos')} className="hover:text-blue-900">×</button>
                </span>
              )}
              {filterGrupo !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Grupo: {grupos.find(g => g.id === filterGrupo)?.nome}
                  <button onClick={() => setFilterGrupo('todos')} className="hover:text-green-900">×</button>
                </span>
              )}
              {filterTime !== 'todos' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Time: {times.find(t => t.id === filterTime)?.nome}
                  <button onClick={() => setFilterTime('todos')} className="hover:text-purple-900">×</button>
                </span>
              )}
              {filterRodada !== 'todas' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Rodada: {filterRodada}ª
                  <button onClick={() => setFilterRodada('todas')} className="hover:text-yellow-900">×</button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  Busca: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-gray-900">×</button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Componente de Calendário */}
      <CalendarioJogos 
        jogos={jogosFiltrados} 
        loading={loading}
        showFilters={false} // Já temos filtros acima
        compact={false}
      />

      {/* Footer com informações */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Informações</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Total de jogos encontrados:</strong> {jogosFiltrados.length}</p>
          <p><strong>Jogos finalizados:</strong> {jogosFiltrados.filter(j => j.status === 'FINALIZADO').length}</p>
          <p><strong>Próximos jogos:</strong> {jogosFiltrados.filter(j => j.status === 'AGENDADO').length}</p>
        </div>
      </div>
    </div>
  )
}