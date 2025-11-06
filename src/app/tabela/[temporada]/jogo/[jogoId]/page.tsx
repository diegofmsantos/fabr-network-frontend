"use client"

import React, { useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Calendar, MapPin, Trophy, Users } from 'lucide-react'
import { useJogoDetalhes } from '@/hooks/useJogoDetalhes'
import { Loading } from '@/components/ui/Loading'
import { ImageService } from '@/utils/services/ImageService'
import { formatJardas } from '@/utils/services/FormatterService'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface StatComparison {
  label: string
  categoria: string
  statKey: string
  format?: (value: number) => string
}

const STATS_CONFIG: StatComparison[] = [
  { label: 'PASSES COMPLETOS', categoria: 'passe', statKey: 'passes_completos' },
  { label: 'PASSES TENTADOS', categoria: 'passe', statKey: 'passes_tentados' },
  { label: 'JARDAS DE PASSE', categoria: 'passe', statKey: 'jardas_de_passe', format: formatJardas },
  { label: 'TD PASSADOS', categoria: 'passe', statKey: 'td_passados' },
  { label: 'INTERCEPTAÇÕES', categoria: 'passe', statKey: 'interceptacoes_sofridas' },
  { label: 'CORRIDAS', categoria: 'corrida', statKey: 'corridas' },
  { label: 'JARDAS CORRIDAS', categoria: 'corrida', statKey: 'jardas_corridas', format: formatJardas },
  { label: 'TD CORRIDOS', categoria: 'corrida', statKey: 'tds_corridos' },
  { label: 'RECEPÇÕES', categoria: 'recepcao', statKey: 'recepcoes' },
  { label: 'JARDAS RECEBIDAS', categoria: 'recepcao', statKey: 'jardas_recebidas', format: formatJardas },
  { label: 'TD RECEBIDOS', categoria: 'recepcao', statKey: 'tds_recebidos' },
  { label: 'TACKLES TOTAIS', categoria: 'defesa', statKey: 'tackles_totais' },
  { label: 'SACKS', categoria: 'defesa', statKey: 'sacks_forcado' },
  { label: 'INTERCEPTAÇÕES FORÇADAS', categoria: 'defesa', statKey: 'interceptacao_forcada' },
  { label: 'FUMBLES FORÇADOS', categoria: 'defesa', statKey: 'fumble_forcado' },
]

export default function JogoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const jogoId = parseInt(params.jogoId as string)
  const temporada = params.temporada as string

  const { data: jogo, isLoading, error } = useJogoDetalhes(jogoId)

  const estatisticasConsolidadas = useMemo(() => {
    if (!jogo?.estatisticas || jogo.estatisticas.length === 0) {
      return { timeCasa: {}, timeVisitante: {} }
    }

    const consolidarPorTime = (timeId: number) => {
      const estatisticasTime = jogo.estatisticas?.filter(e => e.timeId === timeId) || []

      const consolidado: any = {
        passe: {},
        corrida: {},
        recepcao: {},
        defesa: {},
        kicker: {},
        punter: {},
        retorno: {}
      }

      estatisticasTime.forEach(est => {
        const stats = est.estatisticas

        Object.keys(stats).forEach(categoria => {
          if (!consolidado[categoria]) consolidado[categoria] = {}

          Object.keys(stats[categoria] || {}).forEach(stat => {
            const valor = stats[categoria][stat] || 0
            consolidado[categoria][stat] = (consolidado[categoria][stat] || 0) + valor
          })
        })
      })

      return consolidado
    }

    return {
      timeCasa: consolidarPorTime(jogo.timeCasaId),
      timeVisitante: consolidarPorTime(jogo.timeVisitanteId)
    }
  }, [jogo])

  if (isLoading) return <Loading />

  if (error || !jogo) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center">
        <div className="text-center p-8">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Jogo não encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar os detalhes deste jogo.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-[#63E300] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#50B800] transition-colors"
          >
            Voltar para Tabela
          </button>
        </div>
      </div>
    )
  }

  const dataJogoFormatada = format(new Date(jogo.dataJogo), "dd 'de' MMMM 'de' yyyy • HH:mm", { locale: ptBR })

  const getStatValue = (stats: any, categoria: string, statKey: string): number => {
    return stats[categoria]?.[statKey] || 0
  }

  const getWinner = (stat: StatComparison): 'casa' | 'visitante' | 'empate' => {
    const valorCasa = getStatValue(estatisticasConsolidadas.timeCasa, stat.categoria, stat.statKey)
    const valorVisitante = getStatValue(estatisticasConsolidadas.timeVisitante, stat.categoria, stat.statKey)

    if (valorCasa > valorVisitante) return 'casa'
    if (valorVisitante > valorCasa) return 'visitante'
    return 'empate'
  }

  return (
    <div className="lg:ml-32 xl:ml-60 2xl:ml-[550px] absolute">
      <div className="xl:w-[900px] md:pt-2 md:ml-10 xl:ml-[170px] z-50 xl:pt-12 xl:mt-0">
        <div className="mb-2 relative mt-24 ml-2 xl:mt-0">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar para Tabela</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-white p-8">
            <div className="flex flex-col">
              <div className='flex items-center justify-center'>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className=" flex-1 md:w-32 md:h-32 mx-auto mb-4">
                    <Image
                      src={ImageService.getTeamLogo(jogo.timeCasa.nome)}
                      alt={jogo.timeCasa.nome}
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="md:text-2xl flex-1 font-bold text-gray-800 tracking-[-1px] italic uppercase">
                    {jogo.timeCasa.nome}
                  </h2>
                </div>
                <div className='flex flex-col'>
                  <div className="text-4xl font-bold italic tracking-[-2px]">
                    {jogo.placarCasa !== null && jogo.placarVisitante !== null ? (
                      <div className="flex items-center justify-center gap-3">
                        <span>
                          {jogo.placarCasa}
                        </span>
                        <span className='text-xl'>X</span>
                        <span>
                          {jogo.placarVisitante}
                        </span>
                      </div>
                    ) : (
                      <div className="text-2xl font-bold text-gray-400">
                        - × -
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className=" flex-1 md:w-32 md:h-32 mx-auto mb-4">
                    <Image
                      src={ImageService.getTeamLogo(jogo.timeVisitante.nome)}
                      alt={jogo.timeVisitante.nome}
                      width={128}
                      height={128}
                      className="object-contain"
                    />
                  </div>
                  <h2 className="md:text-2xl flex-1 font-bold text-gray-800 tracking-[-1px] italic uppercase">
                    {jogo.timeVisitante.nome}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-center mt-3 text-xs border-t pt-2">
                <div>
                  <span className="uppercase">
                    {jogo.fase} • Rodada {jogo.rodada}
                  </span>
                </div>
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{dataJogoFormatada}</span>
                  </div>

                </div>
                {jogo.local && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{jogo.local}</span>
                  </div>
                )}

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${jogo.status === 'FINALIZADO' ? 'bg-green-600' :
                  jogo.status === 'AO VIVO' ? 'bg-red-600' :
                    jogo.status === 'ADIADO' ? 'bg-yellow-600' : 'bg-blue-600'
                  }`}>
                  {jogo.status === 'FINALIZADO' ? 'FINALIZADO' :
                    jogo.status === 'AO VIVO' ? 'AO VIVO' :
                      jogo.status === 'ADIADO' ? 'ADIADO' : 'AGENDADO'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {jogo.status === 'FINALIZADO' && jogo.estatisticas && jogo.estatisticas.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-20 p-2">
            <div className="bg-[#272731] p-4 rounded-md">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Estatísticas do Jogo
              </h3>
            </div>

            <div className="px-6 pt-2">
              <div className="space-y-1">
                {STATS_CONFIG.map((stat, index) => {
                  const valorCasa = getStatValue(estatisticasConsolidadas.timeCasa, stat.categoria, stat.statKey)
                  const valorVisitante = getStatValue(estatisticasConsolidadas.timeVisitante, stat.categoria, stat.statKey)
                  const winner = getWinner(stat)

                  if (valorCasa === 0 && valorVisitante === 0) return null

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-3 items-center py-2 gap-x-8 border-b  border-gray-100 last:border-0 "
                    >
                      <div className={`text-right pr-4 text-xl font-bold tracking-[-1px] italic md:text-3xl ${winner === 'casa' ? 'text-[#63E300]' : 'text-gray-600'
                        }`}>
                        {stat.format ? stat.format(valorCasa) : valorCasa}
                      </div>

                      <div className="text-center">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {stat.label}
                        </span>
                      </div>

                      <div className={`text-left pl-4 text-xl font-bold tracking-[-1px] italic md:text-3xl ${winner === 'visitante' ? 'text-[#63E300]' : 'text-gray-600'
                        }`}>
                        {stat.format ? stat.format(valorVisitante) : valorVisitante}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              Estatísticas não disponíveis
            </h3>
            <p className="text-sm text-gray-500">
              {jogo.status === 'AGENDADO'
                ? 'As estatísticas estarão disponíveis após o jogo ser finalizado.'
                : 'Não há estatísticas registradas para este jogo.'}
            </p>
          </div>
        )}

        {jogo.observacoes && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Observações</h4>
            <p className="text-sm text-yellow-700">{jogo.observacoes}</p>
          </div>
        )}
      </div>
    </div>
  )
}