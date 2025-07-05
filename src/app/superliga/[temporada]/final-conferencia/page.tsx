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

// Função para obter a cor da conferência
const getConferenciaColor = (conferenciaKey: string) => {
  switch (conferenciaKey) {
    case 'SUDESTE': return 'bg-red-600'
    case 'SUL': return 'bg-cyan-500'
    case 'NORDESTE': return 'bg-orange-500'
    case 'CENTRO_NORTE': return 'bg-green-600'
    default: return 'bg-gray-600'
  }
}

export default function FinalConferenciaPage() {
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

  // Filtrar apenas jogos de Final de Conferência e converter para o formato da página de referência
  const bracketData = bracket as any
  const finalConferencias = bracketData?.conferencias ? Object.entries(bracketData.conferencias)
    .filter(([_, conferencia]: [string, any]) => conferencia.final !== null)
    .map(([conferenciaKey, conferencia]: [string, any]) => ({
      nome: `CONFERÊNCIA ${conferenciaKey}`,
      cor: getConferenciaColor(conferenciaKey),
      jogo: {
        id: conferencia.final.id,
        time1: conferencia.final.timeClassificado1?.nome || conferencia.final.descricaoTime1 || 'Semifinal1',
        time2: conferencia.final.timeClassificado2?.nome || conferencia.final.descricaoTime2 || 'Semifinal2',
        descricao: conferencia.final.nome || `${conferencia.final.timeClassificado1?.nome || 'Semifinal1'} × ${conferencia.final.timeClassificado2?.nome || 'Semifinal2'}`,
        placar1: conferencia.final.placarTime1,
        placar2: conferencia.final.placarTime2,
        status: conferencia.final.status,
        dataJogo: conferencia.final.dataJogo,
        vencedor: conferencia.final.timeVencedor
      }
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
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">FINAIS DE CONFERÊNCIA</h1>
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
          <div className="flex flex-col gap-8 min-[375px]:ml-4 min-[425px]:ml-2">
            {finalConferencias.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600 text-lg">
                  Não há jogos de Final de Conferência configurados ainda.
                </div>
              </div>
            ) : (
              finalConferencias.map((conferencia, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] 
                lg:ml-10 xl:ml-20 overflow-hidden">
                  <div className={`${conferencia.cor} text-white px-6 py-4 md:text-xl`}>
                    <h2 className="text-lg font-bold">{conferencia.nome}</h2>
                  </div>
                  
                  <div className="p-3">
                    <div className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2 text-[12px] md:text-xl">
                          <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700 text-center min-w-[120px]">
                            {conferencia.jogo.time1}
                            {conferencia.jogo.placar1 !== undefined && (
                              <div className="text-lg font-bold text-blue-600 mt-1">
                                {conferencia.jogo.placar1}
                              </div>
                            )}
                          </div>
                          <span className="text-gray-400 font-bold mx-2">×</span>
                          <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700 text-center min-w-[120px]">
                            {conferencia.jogo.time2}
                            {conferencia.jogo.placar2 !== undefined && (
                              <div className="text-lg font-bold text-red-600 mt-1">
                                {conferencia.jogo.placar2}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-600 md:text-md">
                        {conferencia.jogo.descricao}
                      </div>
                      
                      {/* Status, Data e Campeão */}
                      <div className="flex flex-col items-center gap-3 mt-4">
                        <div className="flex items-center gap-4">
                          {conferencia.jogo.status && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              conferencia.jogo.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' :
                              conferencia.jogo.status === 'AO_VIVO' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {conferencia.jogo.status === 'FINALIZADO' ? 'Finalizado' :
                               conferencia.jogo.status === 'AO_VIVO' ? 'Ao Vivo' :
                               conferencia.jogo.status === 'AGUARDANDO' ? 'Aguardando' : 'Agendado'}
                            </span>
                          )}
                          
                          {conferencia.jogo.dataJogo && (
                            <span className="text-xs text-gray-500">
                              {new Date(conferencia.jogo.dataJogo).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                        
                        {/* Campeão da Conferência */}
                        {conferencia.jogo.vencedor && (
                          <div className="w-full p-3 bg-yellow-50 rounded border border-yellow-200">
                            <div className="text-center">
                              <span className="text-xs text-yellow-600">🏆 CAMPEÃO DA CONFERÊNCIA</span>
                              <div className="font-bold text-yellow-800 text-sm mt-1">
                                {conferencia.jogo.vencedor.nome}
                              </div>
                              <div className="text-xs text-yellow-600 mt-1">
                                Classificado para a Semifinal Nacional
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