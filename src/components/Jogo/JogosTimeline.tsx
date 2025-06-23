import React, { useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Clock, 
  Target, 
  Flag, 
  AlertCircle, 
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Users,
  Timer
} from 'lucide-react'
import { Jogo } from '@/types'
import { ImageService } from '@/utils/services/ImageService'

interface EventoJogo {
  id: string
  tipo: 'touchdown' | 'field_goal' | 'safety' | 'fumble' | 'interceptacao' | 'falta' | 'inicio_periodo' | 'fim_periodo' | 'timeout'
  tempo: string // Ex: "1Q 14:32"
  periodo: number // 1, 2, 3, 4
  timeId: number
  jogadorId?: number
  jogadorNome?: string
  descricao: string
  pontos?: number
  timestamp: string
}

interface JogoTimelineProps {
  jogo: Jogo
  eventos?: EventoJogo[]
  loading?: boolean
}

export const JogoTimeline: React.FC<JogoTimelineProps> = ({ jogo, eventos = [], loading = false }) => {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroPeriodo, setFiltroPeriodo] = useState<number | 'todos'>('todos')

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Eventos mock para demonstração (você pode remover quando tiver dados reais)
  const eventosMock: EventoJogo[] = eventos.length > 0 ? eventos : [
    {
      id: '1',
      tipo: 'inicio_periodo',
      tempo: '1Q 15:00',
      periodo: 1,
      timeId: jogo.timeCasaId,
      descricao: 'Início do 1º período',
      timestamp: jogo.dataJogo
    },
    {
      id: '2',
      tipo: 'touchdown',
      tempo: '1Q 12:45',
      periodo: 1,
      timeId: jogo.timeCasaId,
      jogadorNome: 'João Silva',
      descricao: 'Touchdown de 15 jardas (corrida)',
      pontos: 6,
      timestamp: jogo.dataJogo
    },
    {
      id: '3',
      tipo: 'field_goal',
      tempo: '1Q 12:32',
      periodo: 1,
      timeId: jogo.timeCasaId,
      jogadorNome: 'Pedro Santos',
      descricao: 'Extra point convertido',
      pontos: 1,
      timestamp: jogo.dataJogo
    },
    {
      id: '4',
      tipo: 'fim_periodo',
      tempo: '1Q 00:00',
      periodo: 1,
      timeId: jogo.timeCasaId,
      descricao: 'Fim do 1º período',
      timestamp: jogo.dataJogo
    }
  ]

  const getIconeEvento = (tipo: string) => {
    switch (tipo) {
      case 'touchdown': return Target
      case 'field_goal': return Flag
      case 'safety': return AlertCircle
      case 'fumble': return RotateCcw
      case 'interceptacao': return CheckCircle
      case 'falta': return AlertCircle
      case 'inicio_periodo': return Play
      case 'fim_periodo': return Pause
      case 'timeout': return Timer
      default: return Clock
    }
  }

  const getCorEvento = (tipo: string) => {
    switch (tipo) {
      case 'touchdown': return 'text-green-600 bg-green-100'
      case 'field_goal': return 'text-blue-600 bg-blue-100'
      case 'safety': return 'text-purple-600 bg-purple-100'
      case 'fumble': return 'text-red-600 bg-red-100'
      case 'interceptacao': return 'text-orange-600 bg-orange-100'
      case 'falta': return 'text-yellow-600 bg-yellow-100'
      case 'inicio_periodo': return 'text-gray-600 bg-gray-100'
      case 'fim_periodo': return 'text-gray-600 bg-gray-100'
      case 'timeout': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'touchdown': return 'Touchdown'
      case 'field_goal': return 'Field Goal'
      case 'safety': return 'Safety'
      case 'fumble': return 'Fumble'
      case 'interceptacao': return 'Interceptação'
      case 'falta': return 'Falta'
      case 'inicio_periodo': return 'Início'
      case 'fim_periodo': return 'Fim'
      case 'timeout': return 'Timeout'
      default: return tipo
    }
  }

  const getTimeInfo = (timeId: number) => {
    if (timeId === jogo.timeCasaId) {
      return {
        nome: jogo.timeCasa.nome,
        sigla: jogo.timeCasa.sigla,
        logo: ImageService.getTeamLogo(jogo.timeCasa.nome || '')
      }
    } else {
      return {
        nome: jogo.timeVisitante.nome,
        sigla: jogo.timeVisitante.sigla,
        logo: ImageService.getTeamLogo(jogo.timeVisitante.nome || '')
      }
    }
  }

  const eventosFiltrados = eventosMock.filter(evento => {
    const matchTipo = filtroTipo === 'todos' || evento.tipo === filtroTipo
    const matchPeriodo = filtroPeriodo === 'todos' || evento.periodo === filtroPeriodo
    return matchTipo && matchPeriodo
  })

  const tiposEventos = [...new Set(eventosMock.map(e => e.tipo))]
  const periodosEventos = [...new Set(eventosMock.map(e => e.periodo))].sort()

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Timeline do Jogo</h2>
            <p className="text-sm text-gray-500">
              {jogo.timeCasa.sigla} vs {jogo.timeVisitante.sigla} • {jogo.rodada}ª Rodada
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filtro por Tipo */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos os eventos</option>
              {tiposEventos.map(tipo => (
                <option key={tipo} value={tipo}>{getTipoLabel(tipo)}</option>
              ))}
            </select>
          </div>

          {/* Filtro por Período */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value === 'todos' ? 'todos' : parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todos">Todos os períodos</option>
              {periodosEventos.map(periodo => (
                <option key={periodo} value={periodo}>{periodo}º Período</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6">
        {eventosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
            <p>Não há eventos registrados com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {eventosFiltrados.map((evento, index) => {
              const IconeEvento = getIconeEvento(evento.tipo)
              const timeInfo = getTimeInfo(evento.timeId)
              const isLastEvent = index === eventosFiltrados.length - 1

              return (
                <div key={evento.id} className="relative flex gap-4">
                  {/* Linha da Timeline */}
                  {!isLastEvent && (
                    <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200"></div>
                  )}

                  {/* Ícone do Evento */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getCorEvento(evento.tipo)}`}>
                    <IconeEvento className="w-5 h-5" />
                  </div>

                  {/* Conteúdo do Evento */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header do Evento */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {evento.tempo}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCorEvento(evento.tipo)}`}>
                            {getTipoLabel(evento.tipo)}
                          </span>
                          {evento.pontos && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              +{evento.pontos} pts
                            </span>
                          )}
                        </div>

                        {/* Descrição */}
                        <p className="text-gray-900 font-medium mb-2">{evento.descricao}</p>

                        {/* Jogador e Time */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Image
                              src={timeInfo.logo}
                              alt={`Logo ${timeInfo.nome}`}
                              width={20}
                              height={20}
                              className="rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">{timeInfo.sigla}</span>
                          </div>
                          {evento.jogadorNome && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{evento.jogadorNome}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-xs text-gray-500 ml-4">
                        {format(new Date(evento.timestamp), 'HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer com Resumo */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{eventosFiltrados.length} eventos exibidos</span>
          <span>
            Total de pontos: {eventosFiltrados.reduce((acc, e) => acc + (e.pontos || 0), 0)}
          </span>
        </div>
      </div>
    </div>
  )
}