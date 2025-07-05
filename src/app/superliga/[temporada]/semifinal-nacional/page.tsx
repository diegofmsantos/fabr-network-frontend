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

export default function SemifinalNacionalPage() {
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

  // Processar dados das semifinais nacionais
  const bracketData = bracket as any
  const hasData = bracketData && bracketData.faseNacional && bracketData.faseNacional.semifinais && bracketData.faseNacional.semifinais.length

  // Converter para o formato da página de referência
  const semifinais = hasData ? bracketData.faseNacional.semifinais.map((jogo: any, index: number) => ({
    nome: jogo.nome || `SEMIFINAL ${index + 1}`,
    time1: jogo.timeClassificado1?.nome || jogo.descricaoTime1 || `Campeão Conferência ${index === 0 ? '1' : '3'}`,
    time2: jogo.timeClassificado2?.nome || jogo.descricaoTime2 || `Campeão Conferência ${index === 0 ? '2' : '4'}`,
    descricao: jogo.nome || `${jogo.timeClassificado1?.nome || 'Campeão 1'} × ${jogo.timeClassificado2?.nome || 'Campeão 2'}`,
    placar1: jogo.placarTime1,
    placar2: jogo.placarTime2,
    status: jogo.status,
    dataJogo: jogo.dataJogo,
    vencedor: jogo.timeVencedor
  })) : []

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
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">SEMIFINAL NACIONAL</h1>
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
          <div className="flex flex-col gap-7 min-[375px]:ml-4 min-[425px]:ml-2">
            {!hasData ? (
              <div className="text-center py-12">
                <div className="text-gray-600 text-lg">
                  Nenhuma semifinal nacional configurada ainda
                </div>
              </div>
            ) : (
              semifinais.map((semifinal, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] 
                lg:ml-10 xl:ml-20 overflow-hidden">
                  <div className="bg-black text-white px-6 py-4 md:text-xl">
                    <h2 className="text-lg font-bold">{semifinal.nome}</h2>
                  </div>
                  
                  <div className="p-3">
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2 text-[12px] md:text-xl">
                          <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700 text-center min-w-[120px]">
                            {semifinal.time1}
                            {semifinal.placar1 !== undefined && (
                              <div className="text-lg font-bold text-blue-600 mt-1">
                                {semifinal.placar1}
                              </div>
                            )}
                          </div>
                          <span className="text-gray-400 font-bold mx-2">×</span>
                          <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700 text-center min-w-[120px]">
                            {semifinal.time2}
                            {semifinal.placar2 !== undefined && (
                              <div className="text-lg font-bold text-red-600 mt-1">
                                {semifinal.placar2}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-600 md:text-md">
                        {semifinal.descricao}
                      </div>
                      
                      {/* Status, Data e Classificado */}
                      <div className="flex flex-col items-center gap-3 mt-4">
                        <div className="flex items-center gap-4">
                          {semifinal.status && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              semifinal.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' :
                              semifinal.status === 'AO_VIVO' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {semifinal.status === 'FINALIZADO' ? 'Finalizado' :
                               semifinal.status === 'AO_VIVO' ? 'Ao Vivo' :
                               semifinal.status === 'AGUARDANDO' ? 'Aguardando' : 'Agendado'}
                            </span>
                          )}
                          
                          {semifinal.dataJogo && (
                            <span className="text-xs text-gray-500">
                              {new Date(semifinal.dataJogo).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                        
                        {/* Classificado para Final Nacional */}
                        {semifinal.vencedor && (
                          <div className="w-full p-3 bg-green-50 rounded border border-green-200">
                            <div className="text-center">
                              <span className="text-xs text-green-600">🏆 CLASSIFICADO PARA A FINAL NACIONAL</span>
                              <div className="font-bold text-green-800 text-sm mt-1">
                                {semifinal.vencedor.nome}
                              </div>
                              <div className="text-xs text-green-600 mt-1">
                                Vai disputar a Grande Decisão Nacional
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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