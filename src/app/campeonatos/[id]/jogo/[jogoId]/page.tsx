"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ArrowLeft, MapPin, Calendar, Users, Trophy, Target, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { NoDataFound } from '@/components/ui/NoDataFound'
import { useJogo } from '@/hooks/useCampeonatos'

export default function JogoDetalhesPage() {
  const params = useParams()
  const router = useRouter()

  const jogoId = parseInt(params.jogoId as string)
  const campeonatoId = parseInt(params.id as string)

  const { data: jogo, isLoading, error } = useJogo(jogoId)

  if (isLoading) return <Loading />

  if (error || !jogo) {
    return (
      <NoDataFound
        type="jogo"
        entityName={params.jogoId as string}
        onGoBack={() => router.back()}
        temporada="2025"
      />
    )
  }

  const isFinished = jogo.status === 'FINALIZADO'
  const hasScore = jogo.placarCasa !== null && jogo.placarVisitante !== null

  const getWinner = () => {
    if (!hasScore) return null
    if (jogo.placarCasa! > jogo.placarVisitante!) return 'casa'
    if (jogo.placarVisitante! > jogo.placarCasa!) return 'visitante'
    return 'empate'
  }

  const winner = getWinner()

  const StatCard = ({ icon: Icon, title, value, description }: {
    icon: any, title: string, value: string | number, description?: string
  }) => (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-100">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#ECECEC] py-24 px-4 max-w-[1200px] mx-auto xl:pt-10 xl:ml-[600px]">
      {/* Breadcrumb e Navegação */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/campeonato" className="hover:text-blue-600">
            Campeonatos
          </Link>
          <span>›</span>
          <Link href={`/campeonato/${campeonatoId}`} className="hover:text-blue-600">
            {jogo.campeonato?.nome}
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">
            {jogo.timeCasa.sigla} vs {jogo.timeVisitante.sigla}
          </span>
        </nav>
      </div>

      {/* Card Principal do Jogo */}
      <div className="bg-white rounded-lg border overflow-hidden mb-8">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {jogo.rodada}ª Rodada
              </span>
              {jogo.grupo && (
                <span className="text-sm text-gray-600">{jogo.grupo.nome}</span>
              )}
              {jogo.fase !== 'FASE_GRUPOS' && (
                <span className="text-sm font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  {jogo.fase}
                </span>
              )}
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600">
                {format(new Date(jogo.dataJogo), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
              <div className="text-sm font-medium">
                {format(new Date(jogo.dataJogo), "HH:mm", { locale: ptBR })}
              </div>
            </div>
          </div>
        </div>

        {/* Confronto Principal */}
        <div className="p-8">
          <div className="flex items-center justify-between">
            {/* Time da Casa */}
            <div className="flex-1 text-center">
              <Link
                href={`/${jogo.timeCasa.nome}?temporada=${jogo.campeonato?.temporada || '2025'}`}
                className="group block"
              >
                <div className="mb-4">
                  <Image
                    src={ImageService.getTeamLogo(jogo.timeCasa.nome || '')}
                    alt={`Logo ${jogo.timeCasa.nome}`}
                    width={80}
                    height={80}
                    className="mx-auto group-hover:scale-105 transition-transform"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeCasa.nome || '')}
                  />
                </div>
                <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors
                  ${winner === 'casa' ? 'text-green-600' : 'text-gray-900'}`}>
                  {jogo.timeCasa.nome}
                </h3>
                <p className="text-sm text-gray-600">{jogo.timeCasa.sigla}</p>
              </Link>
            </div>

            {/* Placar */}
            <div className="flex-1 text-center px-8">
              {hasScore ? (
                <div className="flex items-center justify-center gap-4">
                  <div className={`text-5xl font-bold ${winner === 'casa' ? 'text-green-600' : 'text-gray-700'}`}>
                    {jogo.placarCasa}
                  </div>
                  <div className="text-3xl text-gray-400 font-bold">-</div>
                  <div className={`text-5xl font-bold ${winner === 'visitante' ? 'text-green-600' : 'text-gray-700'}`}>
                    {jogo.placarVisitante}
                  </div>
                </div>
              ) : (
                <div className="text-2xl text-gray-400 font-bold">VS</div>
              )}

              <div className="mt-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                  ${jogo.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' :
                    jogo.status === 'AO_VIVO' ? 'bg-red-100 text-red-800' :
                      jogo.status === 'AGENDADO' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                  {jogo.status === 'FINALIZADO' ? 'Finalizado' :
                    jogo.status === 'AO_VIVO' ? 'Ao Vivo' :
                      jogo.status === 'AGENDADO' ? 'Agendado' : 'Adiado'}
                </span>
              </div>

              {winner === 'empate' && (
                <div className="mt-2 text-sm text-gray-600">Empate</div>
              )}
            </div>

            {/* Time Visitante */}
            <div className="flex-1 text-center">
              <Link
                href={`/${jogo.timeVisitante.nome}?temporada=${jogo.campeonato?.temporada || '2025'}`}
                className="group block"
              >
                <div className="mb-4">
                  <Image
                    src={ImageService.getTeamLogo(jogo.timeVisitante.nome || '')}
                    alt={`Logo ${jogo.timeVisitante.nome}`}
                    width={80}
                    height={80}
                    className="mx-auto group-hover:scale-105 transition-transform"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeVisitante.nome || '')}
                  />
                </div>
                <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors
                  ${winner === 'visitante' ? 'text-green-600' : 'text-gray-900'}`}>
                  {jogo.timeVisitante.nome}
                </h3>
                <p className="text-sm text-gray-600">{jogo.timeVisitante.sigla}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Calendar}
          title="Data e Hora"
          value={format(new Date(jogo.dataJogo), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          description={format(new Date(jogo.dataJogo), "EEEE", { locale: ptBR })}
        />

        {jogo.local && (
          <StatCard
            icon={MapPin}
            title="Local"
            value={jogo.local}
          />
        )}

        <StatCard
          icon={Trophy}
          title="Fase"
          value={jogo.fase === 'FASE_GRUPOS' ? 'Fase de Grupos' : jogo.fase}
          description={`${jogo.rodada}ª Rodada`}
        />
      </div>

      {/* Estatísticas do Jogo */}
      {isFinished && jogo.estatisticasProcessadas && jogo.estatisticas && jogo.estatisticas.length > 0 && (
        <div className="bg-white rounded-lg border overflow-hidden mb-8">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Estatísticas do Jogo</h2>
          </div>
          <div className="p-6">
            <p className="text-center text-gray-500">
              Estatísticas detalhadas em breve...
            </p>
          </div>
        </div>
      )}

      {/* Observações */}
      {jogo.observacoes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="p-1 rounded bg-yellow-200">
              <Target className="w-4 h-4 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-medium text-yellow-800 mb-1">Observações</h3>
              <p className="text-yellow-700 text-sm">{jogo.observacoes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Link de Volta */}
      <div className="text-center">
        <Link
          href={`/campeonato/${campeonatoId}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver mais jogos do campeonato
          <ArrowLeft className="w-4 h-4 transform rotate-180" />
        </Link>
      </div>
    </div>
  )
}