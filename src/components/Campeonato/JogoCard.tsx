import React from 'react'
import { Jogo } from '@/types/campeonato'
import Image from 'next/image'
import Link from 'next/link'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Clock, MapPin, Play, CheckCircle, Calendar, Pause } from 'lucide-react'
import { ImageService } from '@/utils/services/ImageService'

interface JogoCardProps {
  jogo: Jogo
  showDate?: boolean
  showGroup?: boolean
  compact?: boolean
  clickable?: boolean
}

export const JogoCard: React.FC<JogoCardProps> = ({ 
  jogo, 
  showDate = true,
  showGroup = false,
  compact = false,
  clickable = true
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AGENDADO': return <Clock className="w-4 h-4" />
      case 'AO_VIVO': return <Play className="w-4 h-4 text-red-500" />
      case 'FINALIZADO': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'ADIADO': return <Pause className="w-4 h-4 text-yellow-500" />
      default: return <Calendar className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'bg-blue-100 text-blue-800'
      case 'AO_VIVO': return 'bg-red-100 text-red-800'
      case 'FINALIZADO': return 'bg-green-100 text-green-800'
      case 'ADIADO': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'Agendado'
      case 'AO_VIVO': return 'Ao Vivo'
      case 'FINALIZADO': return 'Finalizado'
      case 'ADIADO': return 'Adiado'
      default: return status
    }
  }

  const formatGameDate = (dataJogo: string) => {
    const date = new Date(dataJogo)
    
    if (isToday(date)) {
      return `Hoje, ${format(date, 'HH:mm')}`
    }
    if (isTomorrow(date)) {
      return `Amanhã, ${format(date, 'HH:mm')}`
    }
    if (isPast(date)) {
      return format(date, "dd/MM 'às' HH:mm", { locale: ptBR })
    }
    return format(date, "dd/MM 'às' HH:mm", { locale: ptBR })
  }

  const getWinner = () => {
    if (jogo.status !== 'FINALIZADO' || jogo.placarCasa === null || jogo.placarVisitante === null) {
      return null
    }
    // @ts-ignore
    if (jogo.placarCasa > jogo.placarVisitante) return 'casa'// @ts-ignore
    if (jogo.placarVisitante > jogo.placarCasa) return 'visitante'
    return 'empate'
  }

  const winner = getWinner()

  const CardContent = () => (
    <div className={`bg-white rounded-lg border transition-all duration-200 
      ${clickable ? 'hover:shadow-md hover:border-blue-300 cursor-pointer' : ''}
      ${compact ? 'p-3' : 'p-4'}`}
    >
      {/* Header do Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Rodada */}
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
            {jogo.rodada}ª Rodada
          </span>
          
          {/* Grupo */}
          {showGroup && jogo.grupo && (
            <span className="text-xs text-gray-500">
              {jogo.grupo.nome}
            </span>
          )}
          
          {/* Fase */}
          {jogo.fase !== 'FASE_GRUPOS' && (
            <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {jogo.fase}
            </span>
          )}
        </div>

        {/* Status */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(jogo.status)}`}>
          {getStatusIcon(jogo.status)}
          {getStatusText(jogo.status)}
        </div>
      </div>

      {/* Times e Placar */}
      <div className="space-y-3">
        {/* Time da Casa */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <Image
                src={ImageService.getTeamLogo(jogo.timeCasa.nome || '')}
                alt={`Logo ${jogo.timeCasa.nome}`}
                width={compact ? 32 : 40}
                height={compact ? 32 : 40}
                className="rounded"
                onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeCasa.nome || '')}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className={`font-medium ${compact ? 'text-sm' : 'text-base'} 
                ${winner === 'casa' ? 'text-green-600 font-bold' : 'text-gray-900'}`}>
                {compact ? jogo.timeCasa.sigla : jogo.timeCasa.nome}
              </div>
              {!compact && (
                <div className="text-xs text-gray-500">{jogo.timeCasa.sigla}</div>
              )}
            </div>
          </div>
          
          {/* Placar Casa */}
          <div className={`text-right ${compact ? 'text-lg' : 'text-xl'} font-bold
            ${winner === 'casa' ? 'text-green-600' : 'text-gray-700'}`}>
            {jogo.placarCasa !== null ? jogo.placarCasa : '-'}
          </div>
        </div>

        {/* Separador */}
        <div className="flex items-center justify-center">
          <div className="text-gray-400 font-medium">VS</div>
        </div>

        {/* Time Visitante */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <Image
                src={ImageService.getTeamLogo(jogo.timeVisitante.nome || '')}
                alt={`Logo ${jogo.timeVisitante.nome}`}
                width={compact ? 32 : 40}
                height={compact ? 32 : 40}
                className="rounded"
                onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeVisitante.nome || '')}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className={`font-medium ${compact ? 'text-sm' : 'text-base'}
                ${winner === 'visitante' ? 'text-green-600 font-bold' : 'text-gray-900'}`}>
                {compact ? jogo.timeVisitante.sigla : jogo.timeVisitante.nome}
              </div>
              {!compact && (
                <div className="text-xs text-gray-500">{jogo.timeVisitante.sigla}</div>
              )}
            </div>
          </div>
          
          {/* Placar Visitante */}
          <div className={`text-right ${compact ? 'text-lg' : 'text-xl'} font-bold
            ${winner === 'visitante' ? 'text-green-600' : 'text-gray-700'}`}>
            {jogo.placarVisitante !== null ? jogo.placarVisitante : '-'}
          </div>
        </div>
      </div>

      {/* Footer do Card */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          {/* Data/Hora */}
          {showDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatGameDate(jogo.dataJogo)}
            </div>
          )}
          
          {/* Local */}
          {jogo.local && !compact && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {jogo.local}
            </div>
          )}
          
          {/* Link para detalhes */}
          {clickable && jogo.status === 'FINALIZADO' && (
            <span className="text-blue-600 hover:text-blue-800">
              Ver detalhes →
            </span>
          )}
        </div>
      </div>

      {/* Observações */}
      {jogo.observacoes && !compact && (
        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
          {jogo.observacoes}
        </div>
      )}
    </div>
  )

  if (clickable && jogo.status === 'FINALIZADO') {
    return (
      <Link href={`/campeonato/${jogo.campeonatoId}/jogo/${jogo.id}`}>
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}