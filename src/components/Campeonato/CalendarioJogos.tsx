import React, { useState, useMemo } from 'react'
import { JogoCard } from './JogoCard'
import { format, parseISO, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Filter, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react'
import { Jogo } from '@/types'

interface CalendarioJogosProps {
  jogos: Jogo[]
  loading?: boolean
  showFilters?: boolean
  compact?: boolean
}

type ViewMode = 'calendar' | 'list' | 'rodadas'
type FilterStatus = 'todos' | 'agendado' | 'ao_vivo' | 'finalizado' | 'adiado'

export const CalendarioJogos: React.FC<CalendarioJogosProps> = ({
  jogos,
  loading = false,
  showFilters = true,
  compact = false
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos')
  const [selectedRodada, setSelectedRodada] = useState<number | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(new Date())

  // Filtrar jogos
  const filteredJogos = useMemo(() => {
    let filtered = jogos

    // Filtro por status
    if (filterStatus !== 'todos') {
      filtered = filtered.filter(jogo => jogo.status.toLowerCase() === filterStatus.toUpperCase())
    }

    // Filtro por rodada (apenas no modo rodadas)
    if (viewMode === 'rodadas' && selectedRodada) {
      filtered = filtered.filter(jogo => jogo.rodada === selectedRodada)
    }

    return filtered
  }, [jogos, filterStatus, viewMode, selectedRodada])

  // Agrupar jogos por data
  const jogosPorData = useMemo(() => {
    const grupos = new Map<string, Jogo[]>()
    
    filteredJogos.forEach(jogo => {
      const data = format(parseISO(jogo.dataJogo), 'yyyy-MM-dd')
      if (!grupos.has(data)) {
        grupos.set(data, [])
      }
      grupos.get(data)!.push(jogo)
    })

    // Ordenar jogos dentro de cada data
    grupos.forEach(jogosData => {
      jogosData.sort((a, b) => new Date(a.dataJogo).getTime() - new Date(b.dataJogo).getTime())
    })

    return grupos
  }, [filteredJogos])

  // Agrupar jogos por rodada
  const jogosPorRodada = useMemo(() => {
    const grupos = new Map<number, Jogo[]>()
    
    filteredJogos.forEach(jogo => {
      if (!grupos.has(jogo.rodada)) {
        grupos.set(jogo.rodada, [])
      }
      grupos.get(jogo.rodada)!.push(jogo)
    })

    return grupos
  }, [filteredJogos])

  // Obter rodadas disponíveis
  const rodadasDisponiveis = useMemo(() => {
    const rodadas = [...new Set(jogos.map(jogo => jogo.rodada))]
    return rodadas.sort((a, b) => a - b)
  }, [jogos])

  // Jogos da semana selecionada (para modo calendar)
  const jogosDaSemana = useMemo(() => {
    const inicio = startOfWeek(selectedWeek, { weekStartsOn: 1 })
    const fim = endOfWeek(selectedWeek, { weekStartsOn: 1 })
    
    return filteredJogos.filter(jogo => {
      const dataJogo = parseISO(jogo.dataJogo)
      return dataJogo >= inicio && dataJogo <= fim
    })
  }, [filteredJogos, selectedWeek])

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    setSelectedWeek(newDate)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles de Visualização e Filtros */}
      {showFilters && (
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Modo de Visualização */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Visualização:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4 inline mr-1" />
                  Lista
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Semana
                </button>
                <button
                  onClick={() => setViewMode('rodadas')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === 'rodadas' ? 'bg-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-4 h-4 inline mr-1" />
                  Rodadas
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-4">
              {/* Filtro por Status */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="text-sm border rounded-md px-2 py-1"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="agendado">Agendados</option>
                  <option value="ao_vivo">Ao Vivo</option>
                  <option value="finalizado">Finalizados</option>
                  <option value="adiado">Adiados</option>
                </select>
              </div>

              {/* Filtro por Rodada (apenas no modo rodadas) */}
              {viewMode === 'rodadas' && (
                <select
                  value={selectedRodada || ''}
                  onChange={(e) => setSelectedRodada(e.target.value ? Number(e.target.value) : null)}
                  className="text-sm border rounded-md px-2 py-1"
                >
                  <option value="">Todas as Rodadas</option>
                  {rodadasDisponiveis.map(rodada => (
                    <option key={rodada} value={rodada}>
                      {rodada}ª Rodada
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navegação da Semana (apenas no modo calendar) */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-semibold">
              {format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), "dd 'de' MMM", { locale: ptBR })} - {' '}
              {format(endOfWeek(selectedWeek, { weekStartsOn: 1 }), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
            </h3>
            
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      {filteredJogos.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum jogo encontrado</h3>
          <p className="text-gray-500">Ajuste os filtros para ver mais jogos</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Modo Lista - Agrupado por Data */}
          {viewMode === 'list' && (
            <div className="space-y-6">
              {Array.from(jogosPorData.entries())
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([data, jogosData]) => (
                  <div key={data} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      {format(parseISO(data), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                    </h3>
                    <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 lg:grid-cols-2'}`}>
                      {jogosData.map(jogo => (
                        <JogoCard 
                          key={jogo.id} 
                          jogo={jogo} 
                          showDate={false}
                          compact={compact}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Modo Calendar - Jogos da Semana */}
          {viewMode === 'calendar' && (
            <div className="bg-white rounded-lg overflow-hidden border">
              <div className="grid grid-cols-7">
                {eachDayOfInterval({
                  start: startOfWeek(selectedWeek, { weekStartsOn: 1 }),
                  end: endOfWeek(selectedWeek, { weekStartsOn: 1 })
                }).map(dia => {
                  const jogosDoDia = jogosDaSemana.filter(jogo => 
                    isSameDay(parseISO(jogo.dataJogo), dia)
                  )

                  return (
                    <div key={dia.toISOString()} className="border-r border-b last:border-r-0">
                      <div className="p-3 bg-gray-50 border-b">
                        <div className="text-sm font-medium text-gray-900">
                          {format(dia, 'EEE', { locale: ptBR })}
                        </div>
                        <div className="text-lg font-bold text-gray-700">
                          {format(dia, 'dd')}
                        </div>
                      </div>
                      <div className="p-2 min-h-[200px] space-y-2">
                        {jogosDoDia.map(jogo => (
                          <JogoCard 
                            key={jogo.id} 
                            jogo={jogo} 
                            compact={true}
                            showDate={false}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Modo Rodadas */}
          {viewMode === 'rodadas' && (
            <div className="space-y-6">
              {Array.from(jogosPorRodada.entries())
                .sort(([a], [b]) => a - b)
                .map(([rodada, jogosRodada]) => (
                  <div key={rodada} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                      {rodada}ª Rodada ({jogosRodada.length} jogos)
                    </h3>
                    <div className={`grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'}`}>
                      {jogosRodada.map(jogo => (
                        <JogoCard 
                          key={jogo.id} 
                          jogo={jogo} 
                          showGroup={true}
                          compact={compact}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}