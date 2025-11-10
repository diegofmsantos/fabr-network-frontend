import React from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Trophy, Calendar, ArrowLeft, BarChart3, Eye } from 'lucide-react'
import { Jogo } from '@/types'
import { ImageService } from '@/utils/services/ImageService'
import Link from 'next/link'

interface JogoDetalhesProps {
  jogo: Jogo
  onBack?: () => void
}

export const JogoDetalhes: React.FC<JogoDetalhesProps> = ({ jogo, onBack }) => {
  const isFinished = jogo.status === 'FINALIZADO'
  const hasScore = jogo.placarCasa !== null && jogo.placarVisitante !== null
  
  const winner = hasScore && isFinished ? (
    jogo.placarCasa! > jogo.placarVisitante! ? 'casa' : 
    jogo.placarVisitante! > jogo.placarCasa! ? 'visitante' : 'empate'
  ) : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'bg-blue-100 text-blue-800'
      case 'AO VIVO': return 'bg-red-100 text-red-800'
      case 'FINALIZADO': return 'bg-green-100 text-green-800'
      case 'ADIADO': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AGENDADO': return 'Agendado'
      case 'AO VIVO': return 'Ao Vivo'
      case 'FINALIZADO': return 'Finalizado'
      case 'ADIADO': return 'Adiado'
      default: return status
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Detalhes do Jogo
              </h1>
              <p className="text-sm text-gray-500">
                {jogo.rodada}ª Rodada
              </p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(jogo.status)}`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
            {getStatusText(jogo.status)}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Data</p>
              <p className="text-sm text-gray-600">
                {format(new Date(jogo.dataJogo), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              <p className="text-sm text-gray-600">
                {format(new Date(jogo.dataJogo), "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          {jogo.local && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Local</p>
                <p className="text-sm text-gray-600">{jogo.local}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <Trophy className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Fase</p>
              <p className="text-sm text-gray-600">
                {jogo.fase === 'FASE_GRUPOS' ? 'Fase de Grupos' : jogo.fase}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="flex flex-col items-center">
                <Image
                  src={ImageService.getTeamLogo(jogo.timeCasa.nome || '')}
                  alt={`Logo ${jogo.timeCasa.nome}`}
                  width={80}
                  height={80}
                  className="mb-4 rounded-lg"
                  onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeCasa.nome || '')}
                />
                <h2 className={`text-xl font-bold mb-2 ${winner === 'casa' ? 'text-green-600' : 'text-gray-900'}`}>
                  {jogo.timeCasa.nome}
                </h2>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {jogo.timeCasa.sigla}
                </p>
                {winner === 'casa' && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <Trophy className="w-3 h-3" />
                    Vencedor
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 mx-8">
              <div className="text-center">
                <div className="flex items-center gap-4">
                  <div className={`text-6xl font-bold ${winner === 'casa' ? 'text-green-600' : 'text-gray-700'}`}>
                    {hasScore ? jogo.placarCasa : '-'}
                  </div>
                  <div className="text-4xl font-light text-gray-400">×</div>
                  <div className={`text-6xl font-bold ${winner === 'visitante' ? 'text-green-600' : 'text-gray-700'}`}>
                    {hasScore ? jogo.placarVisitante : '-'}
                  </div>
                </div>
                {isFinished && winner === 'empate' && (
                  <p className="mt-2 text-sm font-medium text-gray-600">Empate</p>
                )}
                {!isFinished && (
                  <p className="mt-2 text-sm text-gray-500">
                    {jogo.status === 'AO VIVO' ? 'Em andamento' : 'Aguardando início'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex-1 text-center">
              <div className="flex flex-col items-center">
                <Image
                  src={ImageService.getTeamLogo(jogo.timeVisitante.nome || '')}
                  alt={`Logo ${jogo.timeVisitante.nome}`}
                  width={80}
                  height={80}
                  className="mb-4 rounded-lg"
                  onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeVisitante.nome || '')}
                />
                <h2 className={`text-xl font-bold mb-2 ${winner === 'visitante' ? 'text-green-600' : 'text-gray-900'}`}>
                  {jogo.timeVisitante.nome}
                </h2>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {jogo.timeVisitante.sigla}
                </p>
                {winner === 'visitante' && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <Trophy className="w-3 h-3" />
                    Vencedor
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {jogo.observacoes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-yellow-800 mb-1">Observações</h3>
                <p className="text-sm text-yellow-700">{jogo.observacoes}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 pt-6 border-t">
          {isFinished && (
            <Link
              href={`/campeonatos/${jogo.campeonatoId}/jogo/${jogo.id}/estatisticas`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              Ver Estatísticas
            </Link>
          )}
          
          <Link
            href={`/campeonatos/${jogo.campeonatoId}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Ver Campeonato
          </Link>
        </div>
      </div>
    </div>
  )
}