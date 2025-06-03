"use client"

import { useState } from 'react'
import { Loading } from '@/components/ui/Loading'
import Link from 'next/link'
import { Trophy, Calendar, Users, Play } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useCampeonatos } from '@/hooks/useCampeonatos'

export default function CampeonatosPage() {
  const [filtroTemporada, setFiltroTemporada] = useState('2025')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')

  const { data: campeonatos = [], isLoading, error } = useCampeonatos({
    temporada: filtroTemporada || undefined,
    tipo: filtroTipo || undefined,
    status: filtroStatus || undefined,
  })

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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'REGULAR': return <Trophy className="w-5 h-5" />
      case 'PLAYOFFS': return <Play className="w-5 h-5" />
      case 'COPA': return <Trophy className="w-5 h-5" />
      default: return <Trophy className="w-5 h-5" />
    }
  }

  if (isLoading) return <Loading />

  if (error) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar campeonatos</h2>
          <p className="text-gray-600">Tente novamente mais tarde</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] py-24 px-4 max-w-[1200px] mx-auto xl:pt-10 xl:ml-[600px]">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold italic tracking-[-2px] mb-6">CAMPEONATOS</h1>
        
        {/* Filtros */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Temporada</label>
              <select
                value={filtroTemporada}
                onChange={(e) => setFiltroTemporada(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Todas</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Todos</option>
                <option value="REGULAR">Regular</option>
                <option value="PLAYOFFS">Playoffs</option>
                <option value="COPA">Copa</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Todos</option>
                <option value="NAO_INICIADO">Não Iniciado</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="FINALIZADO">Finalizado</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Campeonatos */}
      {campeonatos.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Nenhum campeonato encontrado</h3>
          <p className="text-gray-600">Ajuste os filtros ou tente novamente mais tarde</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campeonatos.map((campeonato) => (
            <Link
              key={campeonato.id}
              href={`/campeonato/${campeonato.id}`}
              className="block"
            >
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getTipoIcon(campeonato.tipo)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{campeonato.nome}</h3>
                      <p className="text-sm text-gray-600">{campeonato.temporada}</p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(campeonato.status)}`}>
                    {getStatusText(campeonato.status)}
                  </span>
                </div>

                {/* Informações */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {format(new Date(campeonato.dataInicio), "dd 'de' MMM", { locale: ptBR })}
                      {campeonato.dataFim && (
                        <> - {format(new Date(campeonato.dataFim), "dd 'de' MMM", { locale: ptBR })}</>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{campeonato._count?.grupos || 0} grupos • {campeonato._count?.jogos || 0} jogos</span>
                  </div>
                  
                  {campeonato.descricao && (
                    <p className="text-sm text-gray-700 line-clamp-2">{campeonato.descricao}</p>
                  )}
                </div>

                {/* Footer do Card */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {campeonato.tipo === 'REGULAR' ? 'Temporada Regular' : 
                       campeonato.tipo === 'PLAYOFFS' ? 'Playoffs' : 'Copa'}
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      Ver detalhes →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}