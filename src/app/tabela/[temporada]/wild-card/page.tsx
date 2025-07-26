"use client"

import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWildCardData } from '@/hooks/usePlayoffData'
import { ImageService } from '@/utils/services/ImageService'
import Image from 'next/image'
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

export default function WildCardPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const temporada = params.temporada as string

  const { data: wildCardConferencias, isLoading, error } = useWildCardData(temporada)

  const navigation = getSuperligaNavigation(pathname, temporada)

  if (isLoading) return <Loading />

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-400">Erro ao carregar dados: {error.message}</div>
    </div>
  }

  return (
    <div>
      <div className="xl:ml-80 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[900px] md:h-14 md:pt-2 xl:ml-[170px] fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-2">
            <button
              className={`p-1 hover:bg-gray-100 rounded-md transition-colors ${!navigation.prev ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              onClick={() => navigation.prev && router.push(navigation.prev.path)}
              disabled={!navigation.prev}
              title={navigation.prev?.title || 'Primeira página'}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[16px] min-[375px]:text-xl min-[375px]:h-16 min-[375px]:pt-4 min-[425px]:text-[23px] font-extrabold italic leading-[55px] 
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">WILD CARD DE CONFERÊNCIA</h1>
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

        <div className="mt-44 h-full mb-24 ml-3 xl:ml-20">
          <div className="flex flex-col gap-8 min-[375px]:ml-4 min-[425px]:ml-2">
            {(!wildCardConferencias || wildCardConferencias.length === 0) ? (
              <div className="text-center py-1 md:ml-40 xl:ml-96">
                <div className="text-gray-600 text-lg">
                  Nenhum jogo de Wild Card configurado ainda.
                </div>
              </div>
            ) : (
              wildCardConferencias.map((conferencia) => (
                <div key={conferencia.key} className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] 
              lg:ml-10 xl:ml-20 overflow-hidden">
                  <div className={`${conferencia.cor} text-white px-6 py-4 md:text-xl`}>
                    <h2 className="text-lg font-bold">{conferencia.nome || conferencia.tipo}</h2>
                  </div>

                  <div className="p-3 space-y-4">
                    {conferencia.jogos.map((jogo: any, jogoIndex: number) => (
                      <div key={`wild-card-jogo-${jogo.id || jogoIndex}`} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-2 text-[12px] md:text-lg">
                            <div className="flex flex-col bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700 text-center min-w-[100px] lg:flex-row">
                              <div className="flex flex-col items-center justify-center mb-1 lg:flex-row">
                                <div className="flex flex-col-reverse items-center justify-center lg:flex-row-reverse">
                                  <span>{jogo.time1}</span>
                                  <Image
                                    src={ImageService.getTeamLogo(jogo.time1)}
                                    alt={`Logo ${jogo.time1}`}
                                    width={40}
                                    height={40}
                                    className="rounded lg:mr-4"
                                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.time1)}
                                  />
                                </div>
                                {jogo.placar1 !== undefined && (
                                  <div className="text-lg font-bold text-blue-600 mt-1 md:text-2xl lg:ml-4">
                                    {jogo.placar1}
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="text-gray-400 text-3xl font-bold mx-2">×</span>
                            <div className="flex-col  bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700 text-center min-w-[100px] lg:flex-row">
                              <div className="flex flex-col items-center justify-center mb-1 lg:flex-row-reverse">
                                <div className="flex flex-col-reverse items-center justify-center lg:flex-row">
                                  <span>{jogo.time2}</span>
                                  <Image
                                    src={ImageService.getTeamLogo(jogo.time2)}
                                    alt={`Logo ${jogo.time2}`}
                                    width={40}
                                    height={40}
                                    className="rounded lg:ml-4"
                                    onError={(e) => ImageService.handleTeamLogoError(e, jogo.time2)}
                                  />
                                </div>
                                {jogo.placar2 !== undefined && (
                                  <div className="text-lg font-bold text-red-600 mt-1 md:text-2xl lg:mr-4">
                                    {jogo.placar2}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-3">
                          {jogo.status && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${jogo.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' :
                              jogo.status === 'AO VIVO' ? 'bg-red-100 text-red-800' :
                                jogo.status === 'AGUARDANDO' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {jogo.status === 'FINALIZADO' ? 'Finalizado' :
                                jogo.status === 'AO VIVO' ? 'Ao Vivo' :
                                  jogo.status === 'AGUARDANDO' ? 'Aguardando' :
                                    jogo.status === 'AGENDADO' ? 'Agendado' : jogo.status}
                            </span>
                          )}

                          {jogo.dataJogo && (
                            <span className="text-xs text-gray-500">
                              {new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}