"use client"

import { useState } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useClassificacaoSuperliga } from '@/hooks/useSuperliga'

// Função de navegação
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
      path: `/superliga/${temporada}/${SUPERLIGA_PAGES[prevIndex].path}`,
      title: SUPERLIGA_PAGES[prevIndex].title
    } : null,
    next: nextIndex < SUPERLIGA_PAGES.length ? {
      path: `/superliga/${temporada}/${SUPERLIGA_PAGES[nextIndex].path}`,
      title: SUPERLIGA_PAGES[nextIndex].title
    } : null,
    current: SUPERLIGA_PAGES[currentIndex]
  }
}

// Função para obter a cor da conferência
const getConferenciaColor = (tipo: string) => {
  switch (tipo) {
    case 'SUDESTE': return 'bg-red-600'
    case 'SUL': return 'bg-cyan-500'
    case 'NORDESTE': return 'bg-orange-500'
    case 'CENTRO_NORTE': return 'bg-green-600'
    default: return 'bg-gray-600'
  }
}

// Template para jogos (mock data - substituir pela API real quando disponível)
const jogosTemplate = [
  { time1: "LOC", placar1: 28, time2: "VAS", placar2: 12, status: "Finalizado" },
  { time1: "LOC", placar1: 28, time2: "VAS", placar2: 12, status: "Finalizado" },
  { time1: "LOC", placar1: 28, time2: "VAS", placar2: 12, status: "Finalizado" },
  { time1: "LOC", placar1: 28, time2: "VAS", placar2: 12, status: "Finalizado" }
]

export default function TemporadaRegularPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const temporada = params.temporada as string
  
  // Dados da API
  const { data: classificacao, isLoading: loadingClassificacao } = useClassificacaoSuperliga(temporada)
  
  // Navegação
  const navigation = getSuperligaNavigation(pathname, temporada)

  const [rodadasConferencias, setRodadasConferencias] = useState<Record<string, number>>({
    SUDESTE: 1,
    SUL: 1,
    NORDESTE: 1,
    CENTRO_NORTE: 1
  })

  const setRodadaConferencia = (conferencia: string, rodada: number) => {
    setRodadasConferencias(prev => ({
      ...prev,
      [conferencia]: rodada
    }))
  }

  if (loadingClassificacao) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Carregando...</div>
    </div>
  }

  if (!classificacao) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Erro ao carregar dados</div>
    </div>
  }

  // Converter os dados da API para o formato esperado pelos componentes
  const conferencias = Object.entries(classificacao)

  return (
    <div className="min-h-screen">
      <div className="xl:ml-80 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[680px] md:h-14 md:pt-2 xl:ml-40 fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-4">
            <button 
              className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${
                !navigation.prev ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
              className={`p-2 hover:bg-gray-100 rounded-md transition-colors ${
                !navigation.next ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
              onClick={() => navigation.next && router.push(navigation.next.path)}
              disabled={!navigation.next}
              title={navigation.next?.title || 'Última página'}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 pt-44 md:ml-8 lg:ml-36">
          {conferencias.map(([conferenciaKey, conferencia]: [string, any]) => (
            <div key={conferenciaKey} className="flex flex-col items-center gap-8 xl:flex-row xl:items-start xl:mb-16">
              <div className="max-w-2xl space-y-10">
                {conferencia.regionais.map((regional: any) => (
                  <div key={regional.regionalId} className="">
                    <div className="text-white py-1 flex flex-col items-start gap-1">
                      <span className={`${getConferenciaColor(conferencia.tipo)} text-xs font-medium bg-black px-2 py-1 rounded`}>
                        {conferencia.nome}
                      </span>
                      <h3 className="font-extrabold italic leading-[55px] tracking-[-2px] uppercase text-2xl text-black">{regional.nome}</h3>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden p-6">
                      <div className="grid grid-cols-8 gap-3 pb-4 border-b text-gray-500">
                        <div>#</div>
                        <div className="col-span-2 font-bold">TIME</div>
                        <div className="text-center font-bold">V</div>
                        <div className="text-center font-bold">D</div>
                        <div className="text-center font-bold">P+</div>
                        <div className="text-center font-bold">P-</div>
                        <div className="text-center font-bold">S</div>
                      </div>

                      <div className="space-y-4 mt-4">
                        {regional.times.map((time: any) => (
                          <div key={time.timeId} className="grid grid-cols-8 py-2 md:items-baseline">
                            <div className="text-gray-600">{time.posicao}º</div>
                            <div className="col-span-2 flex items-center">
                              <span className="text-sm hidden md:block md:-ml-8 md:mr-4">🏈</span>
                              <span className="text-[12px] text-gray-900 text-wrap md:text-[15px]">{time.time.nome}</span>
                            </div>
                            <div className="text-center text-sm md:text-base">{time.vitorias}</div>
                            <div className="text-center text-sm md:text-base">{time.derrotas || (time.jogos - time.vitorias)}</div>
                            <div className="text-center text-sm md:text-base">{time.pontosPro}</div>
                            <div className="text-center text-sm md:text-base">{time.pontosContra}</div>
                            <div className="text-center text-sm md:text-base">{time.saldo > 0 ? '+' : ''}{time.saldo}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-80 mb-10 xl:mt-24">
                <div className="bg-white rounded-lg shadow-sm border sticky top-6">
                  <div className="space-y-3">
                    <div className={`${getConferenciaColor(conferencia.tipo)} text-white px-2 py-3 rounded-lg flex items-center justify-between`}>
                      <button
                        onClick={() => setRodadaConferencia(conferenciaKey, Math.max(1, rodadasConferencias[conferenciaKey] - 1))}
                        className="p-1 hover:bg-black hover:bg-opacity-20 rounded"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold">{rodadasConferencias[conferenciaKey]}ª Rodada</span>
                      <button
                        onClick={() => setRodadaConferencia(conferenciaKey, Math.min(4, rodadasConferencias[conferenciaKey] + 1))}
                        className="p-1 hover:bg-black hover:bg-opacity-20 rounded"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 mt-4">
                      {jogosTemplate.map((jogo, index) => (
                        <div key={index} className="flex flex-col items-center justify-between py-2 border-b">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">⚡</span>
                            <span className="font-medium">{jogo.time1} {jogo.placar1} x {jogo.placar2} {jogo.time2}</span>
                            <span className="text-xl">🛡️</span>
                          </div>
                          <span className="text-xs text-green-600 font-medium">{jogo.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}