import React from 'react'
import { Campeonato } from '@/types/campeonato'
import { Calendar, Trophy, Users, Play, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface CampeonatoHeaderProps {
  campeonato: Campeonato
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export const CampeonatoHeader: React.FC<CampeonatoHeaderProps> = ({ 
  campeonato, 
  activeTab = 'overview',
  onTabChange 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO': return 'bg-gray-500'
      case 'EM_ANDAMENTO': return 'bg-green-500'
      case 'FINALIZADO': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO': return 'Não Iniciado'
      case 'EM_ANDAMENTO': return 'Em Andamento'
      case 'FINALIZADO': return 'Finalizado'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NAO_INICIADO': return <Calendar className="w-4 h-4" />
      case 'EM_ANDAMENTO': return <Play className="w-4 h-4" />
      case 'FINALIZADO': return <CheckCircle className="w-4 h-4" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'REGULAR': return <Trophy className="w-6 h-6" />
      case 'PLAYOFFS': return <Play className="w-6 h-6" />
      case 'COPA': return <Trophy className="w-6 h-6" />
      default: return <Trophy className="w-6 h-6" />
    }
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'tabela', label: 'Classificação' },
    { id: 'jogos', label: 'Jogos' },
    { id: 'estatisticas', label: 'Estatísticas' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      {/* Header Principal */}
      <div className="p-6 border-b">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Info do Campeonato */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-gray-100">
              {getTipoIcon(campeonato.tipo)}
            </div>
            
            <div>
              <h1 className="text-3xl font-extrabold italic tracking-[-2px] mb-2">
                {campeonato.nome.toUpperCase()}
              </h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-medium">Temporada {campeonato.temporada}</span>
                <span>•</span>
                <span>{campeonato.tipo === 'REGULAR' ? 'Temporada Regular' : 
                       campeonato.tipo === 'PLAYOFFS' ? 'Playoffs' : 'Copa'}</span>
              </div>
            </div>
          </div>

          {/* Status e Datas */}
          <div className="flex flex-col lg:items-end gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${getStatusColor(campeonato.status)}`}>
              {getStatusIcon(campeonato.status)}
              {getStatusText(campeonato.status)}
            </div>
            
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(new Date(campeonato.dataInicio), "dd 'de' MMM", { locale: ptBR })}
                  {campeonato.dataFim && (
                    <> - {format(new Date(campeonato.dataFim), "dd 'de' MMM", { locale: ptBR })}</>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Descrição */}
        {campeonato.descricao && (
          <p className="mt-4 text-gray-700 max-w-3xl">{campeonato.descricao}</p>
        )}

        {/* Stats Rápidas */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold">{campeonato._count?.grupos || 0}</div>
            <div className="text-sm text-gray-600">Grupos</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <Play className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold">{campeonato._count?.jogos || 0}</div>
            <div className="text-sm text-gray-600">Jogos</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold">
              {campeonato.grupos.reduce((acc, grupo) => acc + grupo.times.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Times</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold">
              {campeonato.formato?.numeroRodadas || 0}
            </div>
            <div className="text-sm text-gray-600">Rodadas</div>
          </div>
        </div>
      </div>

      {/* Navegação por Tabs */}
      {onTabChange && (
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}