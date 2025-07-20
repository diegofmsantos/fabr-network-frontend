"use client"

import { useState } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useClassificacaoSuperliga } from '@/hooks/useSuperliga'
import { useJogosSuperliga } from '@/hooks/useJogos'
import { useRodadas } from '@/hooks/useRodadas'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { Loading } from '@/components/ui/Loading'

const SUPERLIGA_PAGES = [
  { path: 'temporada-regular', title: 'TEMPORADA REGULAR' },
  { path: 'wild-card', title: 'WILD CARD' },
  { path: 'semifinal-conferencia', title: 'SEMIFINAL CONFERÊNCIA' },
  { path: 'final-conferencia', title: 'FINAL CONFERÊNCIA' },
  { path: 'semifinal-nacional', title: 'SEMIFINAL NACIONAL' },
  { path: 'final-nacional', title: 'FINAL NACIONAL' }
]

function getSuperligaNavigation(currentPath: string, temporada: string) {
  const currentIndex = SUPERLIGA_PAGES.findIndex(page => currentPath.includes(page.path))

  if (currentIndex === -1) return { prev: null, next: null, current: null }

  const prevIndex = currentIndex - 1
  const nextIndex = currentIndex + 1

  return {
    prev: prevIndex >= 0 ? {
      path: `/tabela/${temporada}/${SUPERLIGA_PAGES[prevIndex].path}`,
      title: SUPERLIGA_PAGES[prevIndex].title
    } : null,
    next: nextIndex < SUPERLIGA_PAGES.length ? {
      path: `/tabela/${temporada}/${SUPERLIGA_PAGES[nextIndex].path}`,
      title: SUPERLIGA_PAGES[nextIndex].title
    } : null,
    current: SUPERLIGA_PAGES[currentIndex]
  }
}

const getConferenciaColor = (tipo: string) => {
  switch (tipo) {
    case 'SUDESTE': return 'bg-red-600'
    case 'SUL': return 'bg-cyan-500'
    case 'NORDESTE': return 'bg-orange-500'
    case 'CENTRO NORTE': return 'bg-green-600'
    default: return 'bg-gray-600'
  }
}

const QuadroRodadas = ({ rodadas, conferenciaKey }: { rodadas: any; conferenciaKey: string }) => {
  const [rodadaAtiva, setRodadaAtiva] = useState(1)

  const mapeamentoConferencias: Record<string, string> = {
    'SUDESTE': 'Sudeste',
    'SUL': 'Sul',
    'NORDESTE': 'Nordeste',
    'CENTRO NORTE': 'Centro-Norte'
  }

  const chaveBackend = mapeamentoConferencias[conferenciaKey] || conferenciaKey
  const jogosRodada = rodadas?.[chaveBackend]?.[rodadaAtiva] || []

  console.log('🔍 QuadroRodadas debug:', {
    conferenciaKey,
    chaveBackend,
    jogosRodada: jogosRodada.length
  })


  return (
    <div className="bg-white rounded-lg p-3 min-w-[280px] w-full md:max-w-[660px] xl:mt-24 2xl:w-60">
      <div className={`flex items-center justify-between mb-4 text-white px-4 py-2 rounded-t-lg ${getConferenciaColor(conferenciaKey)}`}>
        <button
          onClick={() => setRodadaAtiva(prev => prev > 1 ? prev - 1 : 4)}
          className="p-1 hover:bg-black/20 rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-bold text-lg">
          {rodadaAtiva}ª Rodada
        </h3>
        <button
          onClick={() => setRodadaAtiva(prev => prev < 4 ? prev + 1 : 1)}
          className="p-1 hover:bg-black/20 rounded transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 ">
        {jogosRodada.length > 0 ? (
          jogosRodada.map((jogo: any) => (
            <div key={jogo.id} className="flex flex-col items-center justify-between p-1 border bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Image
                    src={ImageService.getTeamLogo(jogo.timeCasa.nome)}
                    alt={`Logo ${jogo.timeCasa.nome}`}
                    width={32}
                    height={32}
                    className="rounded"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeCasa.nome)}
                  />
                  <span className="font-medium text-sm">{jogo.timeCasa.sigla}</span>
                  <div className="text-right">
                    {jogo.status === 'FINALIZADO' ? (
                      <div className="text-sm font-bold">
                        {jogo.placarCasa} x {jogo.placarVisitante}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">
                        {new Date(jogo.dataJogo).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                  <Image
                    src={ImageService.getTeamLogo(jogo.timeVisitante.nome)}
                    alt={`Logo ${jogo.timeVisitante.nome}`}
                    width={32}
                    height={32}
                    className="rounded"
                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.timeVisitante.nome)}
                  />
                  <span className="font-medium text-sm">{jogo.timeVisitante.sigla}</span>
                </div>
              </div>


              <div className="text-xs text-gray-500">
                {jogo.status === 'FINALIZADO' ? 'Finalizado' :
                  jogo.status === 'AO VIVO' ? 'Ao Vivo' : 'Agendado'}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            <p className="text-sm">Nenhum jogo encontrado</p>
            <p className="text-xs">para esta rodada</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TemporadaRegularPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const temporada = params.temporada as string

  const { data: classificacao, isLoading: loadingClassificacao } = useClassificacaoSuperliga(temporada)
  const { data: jogos = [], isLoading: loadingJogos } = useJogosSuperliga(temporada, {
    fase: 'TEMPORADA REGULAR'
  })
  const { data: rodadas, isLoading: loadingRodadas } = useRodadas(temporada)

  const navigation = getSuperligaNavigation(pathname, temporada)

  if (loadingClassificacao || loadingJogos || loadingRodadas) return <Loading />

  if (!classificacao) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Erro ao carregar dados</div>
    </div>
  }

  const conferencias = Object.entries(classificacao)

  return (
    <div className="min-h-screen">
      <div className="xl:ml-80 w-full max-w-5xl 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[665px] md:h-14 md:pt-2 xl:ml-36 fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-4">
            <button
              className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${!navigation.prev ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              onClick={() => navigation.prev && router.push(navigation.prev.path)}
              disabled={!navigation.prev}
              title={navigation.prev?.title || 'Primeira página'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[22px] font-extrabold italic leading-[55px] tracking-[-2px] text-gray-900 md:text-3xl xl:text-4xl">
              TEMPORADA <span className='ml-2'>REGULAR</span>
            </h1>
            <button
              className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${!navigation.next ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              onClick={() => navigation.next && router.push(navigation.next.path)}
              disabled={!navigation.next}
              title={navigation.next?.title || 'Última página'}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-8 mb-24 pt-44 w-full md:ml-8 lg:ml-36">
          {conferencias.map(([conferenciaKey, conferencia]: [string, any]) => (
            <div key={conferenciaKey} className="ml-3 w-full flex flex-col justify-between items-center gap-8 pr-4 xl:flex-row xl:items-start xl:mb-16 max-w-5xl overflow-x-hidden">
              <div className="max-w-2xl  space-y-10 w-full">
                {conferencia.regionais.map((regional: any) => (
                  <div key={regional.regionalId} className="w-full">
                    <div className="text-white py-1 flex flex-col items-start gap-1">
                      <span className={`${getConferenciaColor(conferencia.tipo)} text-md font-medium px-2 py-1 rounded`}>
                        {conferencia.nome}
                      </span>
                      <h3 className="font-extrabold italic leading-[55px] tracking-[-2px] uppercase text-2xl text-black">{regional.nome}</h3>
                    </div>

                    <div className="bg-white w-full rounded-lg shadow-sm border overflow-hidden p-6 min-w-[320px] max-w-[650px]">
                      <div className="grid grid-cols-8 gap-3 pb-4 border-b text-gray-500">
                        <div>#</div>
                        <div className="col-span-2 font-bold">TIME</div>
                        <div className="col-span-5 flex justify-between md:justify-evenly md:gap-1">
                          <div className="text-center font-bold">V</div>
                          <div className="text-center font-bold">D</div>
                          <div className="text-center font-bold">P+</div>
                          <div className="text-center font-bold">P-</div>
                          <div className="text-center font-bold">S</div>
                        </div>
                      </div>

                      <div className="space-y-4 mt-4">
                        {regional.times.map((time: any) => (
                          <div key={time.timeId} className="grid grid-cols-8 py-2 md:items-end border-b">
                            <div className="text-gray-600 text-sm">{time.posicao}º</div>
                            <div className="col-span-2 -ml-3 -mt-2  flex items-end">
                              <Image
                                src={ImageService.getTeamLogo(time.time.nome)}
                                alt={`Logo ${time.time.nome}`}
                                width={30}
                                height={30}
                                className="mr-3 md:-ml-10 md:mr-2 rounded"
                                onError={(e) => ImageService.handleTeamLogoError(e, time.time.nome)}
                              />
                              <span className="text-[14px] font-bold text-gray-900 text-wrap md:text-[15px] md:hidden">{time.time.sigla}</span>
                              <span className="hidden md:block text-[15px] text-gray-900 whitespace-nowrap">{time.time.nome}</span>
                            </div>
                            <div className="col-span-5 flex justify-between md:justify-evenly md:gap-1">
                              <div className="text-center text-sm md:text-base">{time.vitorias}</div>
                              <div className="text-center text-sm md:text-base">{time.derrotas || (time.jogos - time.vitorias)}</div>
                              <div className="text-center text-sm md:text-base">{time.pontosPro}</div>
                              <div className="text-center text-sm md:text-base">{time.pontosContra}</div>
                              <div className="text-center text-sm md:text-base">{time.saldo > 0 ? '+' : ''}{time.saldo}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <QuadroRodadas rodadas={rodadas} conferenciaKey={conferenciaKey} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}