"use client"

import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSemifinalNacionalData } from '@/hooks/usePlayoffData'
import Image from 'next/image'
import { ImageService } from '@/utils/services/ImageService'
import { Loading } from '@/components/ui/Loading'
import Link from 'next/link'
import { useEffect } from 'react'
import { getSuperligaNavigation } from '@/utils/superliga-navigation'

export default function SemifinalNacionalPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const temporada = params.temporada as string
  const divisao = params.divisao as string

  const { data: semifinais, isLoading, error } = useSemifinalNacionalData(temporada)

  useEffect(() => {
    document.title = `FABR Network - Superliga ${divisao.toUpperCase()} ${temporada}`
  }, [temporada, divisao])

  const navigation = getSuperligaNavigation(pathname, divisao, temporada)

  if (isLoading) return <Loading />
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-400">Erro ao carregar dados: {error.message}</div></div>

  return (
    <div>
      <div className="xl:ml-60 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[900px] md:h-14 md:pt-2 xl:ml-[170px] fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-2">
            <button className={`p-1 hover:bg-gray-100 rounded-md transition-colors ${!navigation.prev ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => navigation.prev && router.push(navigation.prev.path)} disabled={!navigation.prev}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[16px] min-[375px]:text-xl min-[375px]:h-16 min-[375px]:pt-4 min-[425px]:text-[23px] font-extrabold italic leading-[55px] tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">SEMIFINAL NACIONAL</h1>
            <button className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${!navigation.next ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => navigation.next && router.push(navigation.next.path)} disabled={!navigation.next}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mt-44 h-full mb-24 ml-3 xl:ml-20">
          <div className="flex flex-col gap-8 min-[375px]:ml-4 min-[425px]:ml-2">
            {(!semifinais || semifinais.length === 0) ? (
              <div className="text-center py-1 md:ml-40 xl:ml-96"><div className="text-gray-600 text-lg">Nenhum jogo de Semifinal Nacional configurado ainda.</div></div>
            ) : (
              semifinais.map((jogo: any, idx: number) => (
                <div key={jogo.id || idx} className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20 overflow-hidden">
                  <div className="bg-gray-800 text-white px-6 py-4">
                    <h2 className="text-lg font-bold">{jogo.nome || `Semifinal Nacional ${idx + 1}`}</h2>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <Image src={ImageService.getTeamLogo(jogo.time1)} alt={jogo.time1} width={80} height={80} className="rounded" onError={(e) => ImageService.handleTeamLogoError(e, jogo.time1)} />
                        <span className="font-bold text-center">{jogo.time1}</span>
                        {jogo.placar1 !== undefined && <span className="text-2xl font-black">{jogo.placar1}</span>}
                      </div>
                      <span className="text-gray-400 text-4xl font-bold">×</span>
                      <div className="flex flex-col items-center gap-2">
                        <Image src={ImageService.getTeamLogo(jogo.time2)} alt={jogo.time2} width={80} height={80} className="rounded" onError={(e) => ImageService.handleTeamLogoError(e, jogo.time2)} />
                        <span className="font-bold text-center">{jogo.time2}</span>
                        {jogo.placar2 !== undefined && <span className="text-2xl font-black">{jogo.placar2}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 mt-4">
                      {jogo.status && <span className={`px-3 py-1 rounded-full text-sm font-medium ${jogo.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{jogo.status === 'FINALIZADO' ? 'Finalizado' : jogo.status === 'AGENDADO' ? 'Agendado' : jogo.status}</span>}
                      {jogo.dataJogo && <span className="text-xs text-gray-500">{new Date(jogo.dataJogo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>}
                      <div className='text-xs text-gray-500'>{jogo.local}</div>
                      {jogo.status === 'FINALIZADO' && (
                        <Link href={`/tabela/${divisao}/${temporada}/jogo/${jogo.id}`} className="text-[10px] text-gray-300 italic uppercase hover:underline font-semibold bg-[#272731] py-1 px-2 rounded-lg">Saiba como foi</Link>
                      )}
                    </div>
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