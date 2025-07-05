"use client"

import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePlayoffBracket } from '@/hooks/useSuperliga'

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

export default function FinalNacionalPage() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const temporada = params.temporada as string
  
  // Usar dados da API
  const { data: bracket, isLoading } = usePlayoffBracket(temporada)
  
  // Navegação
  const navigation = getSuperligaNavigation(pathname, temporada)

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Carregando...</div>
    </div>
  }

  if (!bracket) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Nenhum playoff configurado ainda</div>
    </div>
  }

  // Processar dados da final nacional
  const bracketData = bracket as any
  const hasData = bracketData && bracketData.faseNacional && bracketData.faseNacional.final
  const finalNacional = hasData ? bracketData.faseNacional.final : null

  // Converter para o formato da página de referência
  const finalData = finalNacional ? {
    nome: finalNacional.nome || "FINAL",
    time1: finalNacional.timeClassificado1?.nome || finalNacional.descricaoTime1 || "Finalista Semifinal 1",
    time2: finalNacional.timeClassificado2?.nome || finalNacional.descricaoTime2 || "Finalista Semifinal 2", 
    descricao: finalNacional.nome || `${finalNacional.timeClassificado1?.nome || 'Finalista 1'} × ${finalNacional.timeClassificado2?.nome || 'Finalista 2'}`,
    placar1: finalNacional.placarTime1,
    placar2: finalNacional.placarTime2,
    status: finalNacional.status,
    dataJogo: finalNacional.dataJogo,
    vencedor: finalNacional.timeVencedor,
    local: finalNacional.local
  } : null

  return (
    <div>
      <div className="xl:ml-80 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[900px] md:h-14 md:pt-2 xl:ml-[100px] fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-2">
            <button 
              className={`p-1 hover:bg-gray-100 rounded-md transition-colors ${
                !navigation.prev ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
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
        
        <div className="mt-44 h-full mb-24 ml-3">
          <div className="flex flex-col gap-5 min-[375px]:ml-4 min-[425px]:ml-2">
            {!hasData || !finalData ? (
              <div className="text-center py-12">
                <div className="text-gray-600 text-lg">
                  Nenhuma final nacional configurada ainda
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20 overflow-hidden">
                <div className="bg-black text-white px-6 py-4 md:text-xl">
                  <h2 className="text-lg font-bold text-center">{finalData.nome}</h2>
                  {finalData.dataJogo && (
                    <div className="text-sm text-center mt-1 text-gray-300">
                      {new Date(finalData.dataJogo).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                </div>
                
                <div className="p-3 md:p-6">
                  <div className="border-2 border-yellow-400 rounded-lg p-4 md:p-6 bg-gradient-to-r from-yellow-50 to-amber-50">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 text-[12px] md:text-xl md:gap-6">
                        <div className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-gray-800 text-center shadow-md border-2 border-yellow-300 min-w-[120px]">
                          {finalData.time1}
                          {finalData.placar1 !== undefined && (
                            <div className="text-lg font-bold text-blue-600 mt-1 md:text-2xl">
                              {finalData.placar1}
                            </div>
                          )}
                        </div>
                        <div className="text-yellow-600 font-bold text-lg md:text-3xl mx-2">
                          ×
                        </div>
                        <div className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-gray-800 text-center shadow-md border-2 border-yellow-300 min-w-[120px]">
                          {finalData.time2}
                          {finalData.placar2 !== undefined && (
                            <div className="text-lg font-bold text-red-600 mt-1 md:text-2xl">
                              {finalData.placar2}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-700 font-medium md:text-lg md:mt-4">
                      {finalData.descricao}
                    </div>
                    
                    {/* Status */}
                    {finalData.status && (
                      <div className="text-center mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          finalData.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' :
                          finalData.status === 'AO_VIVO' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {finalData.status === 'FINALIZADO' ? 'Finalizado' :
                           finalData.status === 'AO_VIVO' ? 'Ao Vivo' :
                           finalData.status === 'AGUARDANDO' ? 'Aguardando' : 'Agendado'}
                        </span>
                      </div>
                    )}
                    
                    {/* Local */}
                    {finalData.local && (
                      <div className="text-center mt-2">
                        <span className="text-xs text-gray-600">📍 {finalData.local}</span>
                      </div>
                    )}
                    
                    {/* Destaque - Campeão ou Grande Decisão */}
                    <div className="text-center mt-4 md:mt-6">
                      {finalData.vencedor ? (
                        <div>
                          <div className="inline-flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm md:gap-2 md:px-6 md:py-2 md:text-lg mb-3">
                            🏆 CAMPEÃO NACIONAL 🏆
                          </div>
                          <div className="font-bold text-xl text-yellow-800 md:text-2xl">
                            {finalData.vencedor.nome}
                          </div>
                          <div className="text-sm text-yellow-600 mt-1">
                            Superliga {temporada}
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm md:gap-2 md:px-6 md:py-2 md:text-lg">
                          🏆 GRANDE DECISÃO NACIONAL 🏆
                        </div>
                      )}
                    </div>
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