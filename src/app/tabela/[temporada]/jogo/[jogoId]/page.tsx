"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Trophy } from 'lucide-react'
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
  // ========== PASSE ==========
  { label: 'PASSES COMPLETOS', categoria: 'passe', statKey: 'passes_completos' },
  { label: 'PASSES TENTADOS', categoria: 'passe', statKey: 'passes_tentados' },
  { label: 'PASSES (%)', categoria: 'passe', statKey: 'passes_percentual' },
  { label: 'JARDAS DE PASSE', categoria: 'passe', statKey: 'jardas_de_passe', format: formatJardas },
  { label: 'TD PASSADOS', categoria: 'passe', statKey: 'td_passados' },
  { label: 'INTERCEPTAÇÕES SOFRIDAS', categoria: 'passe', statKey: 'interceptacoes_sofridas' },
  { label: 'SACKS SOFRIDOS', categoria: 'passe', statKey: 'sacks_sofridos' },
  { label: 'FUMBLES DE PASSADOR', categoria: 'passe', statKey: 'fumble_de_passador' },

  // ========== CORRIDA ==========
  { label: 'CORRIDAS', categoria: 'corrida', statKey: 'corridas' },
  { label: 'JARDAS CORRIDAS', categoria: 'corrida', statKey: 'jardas_corridas', format: formatJardas },
  { label: 'TD CORRIDOS', categoria: 'corrida', statKey: 'tds_corridos' },
  { label: 'FUMBLES DE CORREDOR', categoria: 'corrida', statKey: 'fumble_de_corredor' },

  // ========== RECEPÇÃO ==========
  { label: 'RECEPÇÕES', categoria: 'recepcao', statKey: 'recepcoes' },
  { label: 'ALVOS', categoria: 'recepcao', statKey: 'alvo' },
  { label: 'JARDAS RECEBIDAS', categoria: 'recepcao', statKey: 'jardas_recebidas', format: formatJardas },
  { label: 'TD RECEBIDOS', categoria: 'recepcao', statKey: 'tds_recebidos' },

  // ========== RETORNO ==========
  { label: 'RETORNOS', categoria: 'retorno', statKey: 'retornos' },
  { label: 'JARDAS RETORNADAS', categoria: 'retorno', statKey: 'jardas_retornadas', format: formatJardas },
  { label: 'TD RETORNADOS', categoria: 'retorno', statKey: 'td_retornados' },

  // ========== DEFESA ==========
  { label: 'TACKLES TOTAIS', categoria: 'defesa', statKey: 'tackles_totais' },
  { label: 'TACKLES FOR LOSS', categoria: 'defesa', statKey: 'tackles_for_loss' },
  { label: 'SACKS', categoria: 'defesa', statKey: 'sacks_forcado' },
  { label: 'FUMBLES FORÇADOS', categoria: 'defesa', statKey: 'fumble_forcado' },
  { label: 'INTERCEPTAÇÕES', categoria: 'defesa', statKey: 'interceptacao_forcada' },
  { label: 'PASSES DESVIADOS', categoria: 'defesa', statKey: 'passe_desviado' },
  { label: 'SAFETIES', categoria: 'defesa', statKey: 'safety' },
  { label: 'TD DEFENSIVOS', categoria: 'defesa', statKey: 'td_defensivo' },

  // ========== KICKER ==========
  { label: 'FG BONS', categoria: 'kicker', statKey: 'fg_bons' },
  { label: 'FG TENTADOS', categoria: 'kicker', statKey: 'tentativas_de_fg' },
  { label: 'FG (%)', categoria: 'kicker', statKey: 'fg_percentual' },
  { label: 'FG MAIS LONGO', categoria: 'kicker', statKey: 'fg_mais_longo' },
  { label: 'XP BONS', categoria: 'kicker', statKey: 'xp_bons' },
  { label: 'XP TENTADOS', categoria: 'kicker', statKey: 'tentativas_de_xp' },
  { label: 'XP (%)', categoria: 'kicker', statKey: 'xp_percentual' },

  // ========== PUNTER ==========
  { label: 'PUNTS', categoria: 'punter', statKey: 'punts' },
  { label: 'JARDAS DE PUNT', categoria: 'punter', statKey: 'jardas_de_punt', format: formatJardas }
]

type TabType = 'ESTATISTICAS' | 'PLAYBYPLAY' | 'MELHORES_MOMENTOS'

export default function JogoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const jogoId = parseInt(params.jogoId as string)
  const temporada = params.temporada as string

  const [activeTab, setActiveTab] = useState<TabType>('ESTATISTICAS')

  const { data: jogo, isLoading, error } = useJogoDetalhes(jogoId)

  useEffect(() => {
    if (jogo) {
      const confronto = `${jogo.timeCasa?.sigla || 'TBD'} vs ${jogo.timeVisitante?.sigla || 'TBD'}`
      document.title = `FABR Network - ${confronto}`
    } else {
      document.title = "FABR Network - Detalhes do Jogo"
    }
  }, [jogo])

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
    if (statKey === 'passes_percentual') {
      const completos = stats.passe?.passes_completos || 0
      const tentados = stats.passe?.passes_tentados || 0
      return tentados > 0 ? Math.round((completos / tentados) * 100) : 0
    }

    if (statKey === 'fg_percentual') {
      const bons = stats.kicker?.fg_bons || 0
      const tentados = stats.kicker?.tentativas_de_fg || 0
      return tentados > 0 ? Math.round((bons / tentados) * 100) : 0
    }

    if (statKey === 'xp_percentual') {
      const bons = stats.kicker?.xp_bons || 0
      const tentados = stats.kicker?.tentativas_de_xp || 0
      return tentados > 0 ? Math.round((bons / tentados) * 100) : 0
    }

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
    <div className="lg:ml-32 xl:ml-60 2xl:ml-[550px] absolute overflow-x-hidden md:ml-4">
      <div className="xl:w-[900px] md:pt-2 xl:ml-[170px] z-50 xl:pt-12 xl:mt-0">
        <div className="mb-2 relative mt-24 ml-2 xl:mt-0">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar para Tabela</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-x-hidden mb-4">
          <div className="bg-white p-3 overflow-x-hidden">
            <div className='flex flex-col items-center justify-center gap-4 md:gap-8'>
              <div className='flex items-center justify-center gap-4 md:gap-8 w-full max-w-full'>
                <div className="flex flex-col items-center justify-center text-center flex-shrink min-w-0">
                  <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 flex-shrink-0">
                    <Image
                      src={ImageService.getTeamLogo(jogo.timeCasa.nome)}
                      alt={jogo.timeCasa.nome}
                      width={128}
                      height={128}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h2 className="text-sm md:text-2xl font-bold text-gray-800 tracking-[-1px] italic uppercase max-w-[100px] md:max-w-none">
                    {jogo.timeCasa.nome}
                  </h2>
                </div>

                <div className='flex flex-col items-center flex-shrink-0'>
                  <div className="text-4xl md:text-6xl font-bold italic tracking-[-2px] flex items-center gap-2 md:gap-4">
                    <span className="text-gray-800">
                      {jogo.placarCasa !== null ? jogo.placarCasa : '-'}
                    </span>
                    <span className="text-2xl md:text-4xl text-gray-400">X</span>
                    <span className="text-gray-800">
                      {jogo.placarVisitante !== null ? jogo.placarVisitante : '-'}
                    </span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-2 uppercase font-semibold">
                    {jogo.status === 'FINALIZADO' ? 'FINAL' : jogo.status}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 text-center px-2 break-words max-w-[200px] md:max-w-none">
                    {dataJogoFormatada} • {jogo.local || 'Local não definido'}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center flex-shrink min-w-0">
                  <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 flex-shrink-0">
                    <Image
                      src={ImageService.getTeamLogo(jogo.timeVisitante.nome)}
                      alt={jogo.timeVisitante.nome}
                      width={128}
                      height={128}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <h2 className="text-sm md:text-2xl font-bold text-gray-800 tracking-[-1px] italic uppercase max-w-[100px] md:max-w-none">
                    {jogo.timeVisitante.nome}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg mb-24">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ESTATISTICAS')}
              className={`flex-1 py-4 px-2 text-sm font-bold uppercase transition-colors italic tracking-[-1px] md:text-lg ${activeTab === 'ESTATISTICAS'
                ? 'bg-[#63E300] text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              ESTATÍSTICAS
            </button>
            <button
              onClick={() => setActiveTab('PLAYBYPLAY')}
              className={`flex-1 py-4 px-2 text-sm font-bold uppercase transition-colors italic tracking-[-1px] md:text-lg ${activeTab === 'PLAYBYPLAY'
                ? 'bg-[#63E300] text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              PLAY-BY-PLAY
            </button>
            <button
              onClick={() => setActiveTab('MELHORES_MOMENTOS')}
              className={`flex-1 py-4 px-2 text-sm font-bold uppercase transition-colors italic tracking-[-1px] md:text-lg ${activeTab === 'MELHORES_MOMENTOS'
                ? 'bg-[#63E300] text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              MELHORES MOMENTOS
            </button>
          </div>

          <div>
            {activeTab === 'ESTATISTICAS' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 uppercase text-center italic tracking-[-1px] mt-2">Estatísticas do Jogo</h3>
                <div>
                  {STATS_CONFIG.map((stat, idx) => {
                    const valorCasa = getStatValue(estatisticasConsolidadas.timeCasa, stat.categoria, stat.statKey)
                    const valorVisitante = getStatValue(estatisticasConsolidadas.timeVisitante, stat.categoria, stat.statKey)

                    const formatarValor = (valor: number) => {
                      if (stat.statKey.includes('percentual')) {
                        return `${valor}%`
                      }
                      if (stat.format) {
                        return stat.format(valor)
                      }
                      return valor.toString()
                    }

                    const valorCasaFormatado = formatarValor(valorCasa)
                    const valorVisitanteFormatado = formatarValor(valorVisitante)

                    const winner = valorCasa > valorVisitante ? 'casa' : valorVisitante > valorCasa ? 'visitante' : 'empate'

                    return (
                      <div
                        key={stat.statKey || idx}
                        className={`flex justify-between items-center py-3 px-2 md:px-4 gap-2 md:gap-4 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <div className={`text-xl md:text-2xl lg:text-3xl font-bold italic tracking-[-1px] min-w-[60px] md:min-w-[80px] text-right ${winner === 'casa' ? 'text-[#63E300]' : 'text-gray-800'}`}>
                          {valorCasaFormatado}
                        </div>
                        <div className="text-xs md:text-sm lg:text-lg font-semibold text-gray-600 uppercase italic tracking-[-1px] text-center flex-1 min-w-0 px-2">
                          {stat.label}
                        </div>
                        <div className={`text-xl md:text-2xl lg:text-3xl font-bold italic tracking-[-1px] min-w-[60px] md:min-w-[80px] text-left ${winner === 'visitante' ? 'text-[#63E300]' : 'text-gray-800'}`}>
                          {valorVisitanteFormatado}
                        </div>
                      </div>
                    )
                  })}

                </div>

              </div>
            )}

            {activeTab === 'PLAYBYPLAY' && (
              <div className='p-2'>
                <h3 className="text-xl font-bold text-gray-800 uppercase mb-4 italic tracking-[-1px] text-center mt-2">Play-by-Play</h3>
                {jogo.playByPlay && jogo.playByPlay.trim() !== '' ? (
                  <div className="bg-gray-50 rounded-lg p-6 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                      {jogo.playByPlay}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-semibold">Play-by-Play não disponível</p>
                    <p className="text-sm mt-2">As jogadas deste jogo ainda não foram registradas.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'MELHORES_MOMENTOS' && (
              <div className='p-2'>
                <h3 className="text-xl font-bold text-gray-800 uppercase mb-4 italic tracking-[-1px] text-center mt-2">Melhores Momentos</h3>
                {jogo.videoUrl && jogo.videoUrl.trim() !== '' ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={jogo.videoUrl}
                      title="Melhores Momentos do Jogo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg font-semibold">Vídeo não disponível</p>
                    <p className="text-sm mt-2">Os melhores momentos deste jogo ainda não foram publicados.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}