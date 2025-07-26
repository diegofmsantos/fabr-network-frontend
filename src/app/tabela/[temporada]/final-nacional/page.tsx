"use client"

import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useFinalNacionalData } from '@/hooks/usePlayoffData'
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

export default function FinalNacionalPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const temporada = params.temporada as string

  const { data: finalNacional, isLoading, error } = useFinalNacionalData(temporada)

  const navigation = getSuperligaNavigation(pathname, temporada)

if (isLoading) return <Loading />

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-400">Erro ao carregar dados: {error.message}</div>
    </div>
  }

  const isJogoFinalizado = finalNacional?.status === 'FINALIZADO'
  const temCampeao = finalNacional?.vencedor

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
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">FINAL NACIONAL</h1>
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
            {!finalNacional ? (
              <div className="text-center py-12 md:py-0 md:ml-40 xl:ml-96">
                <div className="text-gray-600 text-lg">
                  Final Nacional ainda não foi configurada.
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow-lg min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20 overflow-hidden">
                  <div className="bg-[#272731] text-[#63E300] px-6 py-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">DECISÃO NACIONAL</h3>
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="mb-6 border p-2">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center text-lg md:text-2xl">
                          <div className="flex-1 flex-col justify-between h-full bg-gray-100 p-1 min-h-[150px] rounded-xl text-center min-w-[100px] md:flex md:flex-row md:min-h-12 md:px-4">
                            <div className="flex h-full flex-col-reverse items-center justify-center gap-2 md:flex-row-reverse md:h-auto">
                              <span className='text-sm md:ml-5'>{finalNacional.time1}</span>
                              <Image
                                src={ImageService.getTeamLogo(finalNacional.time1)}
                                alt={`Logo ${finalNacional.time1}`}
                                width={60}
                                height={60}
                                className="rounded"
                                onError={(e) => ImageService.handleTeamLogoError(e, finalNacional.time1)}
                              />
                            </div>
                            {finalNacional.placar1 !== undefined && (
                              <div className="text-2xl font-bold text-blue-600  md:text-2xl lg:ml-4 md:mt-4">
                                {finalNacional.placar1}
                              </div>
                            )}
                          </div>
                          <div className="mx-4 text-center ">
                            <span className="text-gray-400 font-bold text-3xl">×</span>
                            <div className="text-sm text-gray-500 mt-1 ">VS</div>
                          </div>
                          <div className="flex-1 flex-col justify-between h-full bg-gray-100 p-1 min-h-[150px] rounded-xl text-center min-w-[100px] md:flex md:flex-row-reverse md:min-h-12 md:px-4">
                            <div className="flex flex-col-reverse h-full justify-between items-center gap-2 md:flex-row md:h-auto">
                              <span className='text-sm md:ml-4'>{finalNacional.time2}</span>
                              <Image
                                src={ImageService.getTeamLogo(finalNacional.time2)}
                                alt={`Logo ${finalNacional.time2}`}
                                width={60}
                                height={60}
                                className="rounded lg:ml-4"
                                onError={(e) => ImageService.handleTeamLogoError(e, finalNacional.time2)}
                              />
                            </div>
                            {finalNacional.placar2 !== undefined && (
                              <div className="text-2xl font-bold text-red-600  md:text-2xl lg:mr-4 md:mt-4">
                                {finalNacional.placar2}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        {finalNacional.status && (
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${finalNacional.status === 'FINALIZADO' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                            finalNacional.status === 'AO VIVO' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                              finalNacional.status === 'AGUARDANDO' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                                'bg-blue-100 text-blue-800 border-2 border-blue-300'
                            }`}>
                            {finalNacional.status === 'FINALIZADO' ? '🏁 FINALIZADO' :
                              finalNacional.status === 'AO VIVO' ? '🔴 AO VIVO' :
                                finalNacional.status === 'AGUARDANDO' ? '⏳ AGUARDANDO' :
                                  finalNacional.status === 'AGENDADO' ? '📅 AGENDADO' : finalNacional.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}