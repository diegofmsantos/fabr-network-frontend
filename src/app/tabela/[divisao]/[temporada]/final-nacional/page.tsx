"use client"

import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useFinalNacionalData } from '@/hooks/usePlayoffData'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { Loading } from '@/components/ui/Loading'
import Link from 'next/link'
import { useEffect } from 'react'
import { getSuperligaNavigation } from '@/utils/superliga-navigation'

export default function FinalNacionalPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const temporada = params.temporada as string
  const divisao = params.divisao as string

  const { data: finalNacional, isLoading, error } = useFinalNacionalData(temporada)

  useEffect(() => {
    document.title = `FABR Network - Superliga ${divisao.toUpperCase()} ${temporada}`
  }, [temporada, divisao])

  const navigation = getSuperligaNavigation(pathname, divisao, temporada)

  if (isLoading) return <Loading />
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-400">Erro ao carregar dados: {error.message}</div></div>

  return (
    <div>
      <div className="xl:ml-60 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-3 xl:w-[900px] md:h-14 md:pt-2 xl:ml-[170px] fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-2">
            <button className={`p-1 hover:bg-gray-100 rounded-md transition-colors ${!navigation.prev ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => navigation.prev && router.push(navigation.prev.path)} disabled={!navigation.prev}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[22px] min-[375px]:text-[26px] min-[375px]:h-16 min-[375px]:pt-2 min-[425px]:text-[28px] font-extrabold italic leading-[55px] 
            tracking-[-2px] text-black md:pt-0 md:h-10 md:text-3xl xl:text-4xl">FINAL NACIONAL</h1>
            <button className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${!navigation.next ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => navigation.next && router.push(navigation.next.path)} disabled={!navigation.next}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mt-44 h-full mb-24 ml-3 xl:ml-20">
          <div className="flex flex-col gap-8 min-[375px]:ml-4 min-[425px]:ml-2">
            {!finalNacional ? (
              <div className="text-center py-1 md:ml-40 xl:ml-96"><div className="text-black text-lg">Final Nacional ainda não definida.</div></div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20 overflow-hidden">
                <div className="bg-[#272731] text-white px-6 py-4">
                  <h2 className="text-xl font-black italic tracking-tight text-center">FINAL NACIONAL</h2>
                </div>
                <div className="p-2 space-y-4 min-[375px]:p-3">
                  <div className="flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <Image
                        src={ImageService.getTeamLogo(finalNacional.time1)}
                        alt={finalNacional.time1}
                        width={100}
                        height={100}
                        className="rounded"
                        onError={(e) => ImageService.handleTeamLogoError(e, finalNacional.time1)} />
                      <span className="font-black text-lg text-center max-w-[120px]">{finalNacional.time1}</span>
                      {finalNacional.placar1 !== null && finalNacional.placar1 !== undefined && (
                        <span className="text-4xl font-black text-[#63E300]">{finalNacional.placar1}</span>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-black text-5xl font-bold">×</span>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <Image
                        src={ImageService.getTeamLogo(finalNacional.time2)}
                        alt={finalNacional.time2}
                        width={100}
                        height={100}
                        className="rounded"
                        onError={(e) => ImageService.handleTeamLogoError(e, finalNacional.time2)} />
                      <span className="font-black text-lg text-center max-w-[120px]">{finalNacional.time2}</span>
                      {finalNacional.placar2 !== null && finalNacional.placar2 !== undefined && (
                        <span className="text-4xl font-black text-[#63E300]">{finalNacional.placar2}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 mt-6">
                    {finalNacional.status && <span className={`px-4 py-1 rounded-full text-sm font-bold ${finalNacional.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-black'}`}>{finalNacional.status === 'FINALIZADO' ? '🏆 Finalizado' : finalNacional.status === 'AGENDADO' ? 'Agendado' : finalNacional.status}</span>}
                    {finalNacional.dataJogo && <span className="text-sm text-black">{new Date(finalNacional.dataJogo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>}
                    {finalNacional.local && <span className="text-sm text-black">📍 {finalNacional.local}</span>}
                    {finalNacional.vencedor && <div className="mt-2 text-lg font-black text-[#63E300]">🏆 Campeão: {finalNacional.vencedor}</div>}
                    {finalNacional.status === 'FINALIZADO' && finalNacional.id && (
                      <Link href={`/tabela/${divisao}/${temporada}/jogo/${finalNacional.id}`} className="text-[10px] text-gray-300 italic uppercase hover:underline font-semibold bg-[#272731] py-1 px-2 rounded-lg mt-2">Saiba como foi</Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}