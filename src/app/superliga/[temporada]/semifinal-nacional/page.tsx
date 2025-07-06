"use client"

import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSemifinalNacionalData } from '@/hooks/usePlayoffData'

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
  
  // ✅ NOVO: Usar hook intermediário simplificado
  const { data: semifinais, isLoading, error } = useSemifinalNacionalData(temporada)
  
  // Navegação
  const navigation = getSuperligaNavigation(pathname, temporada)

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Carregando...</div>
    </div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-400">Erro ao carregar dados: {error.message}</div>
    </div>
  }

  // ✅ MANTÉM HEADER SEMPRE VISÍVEL

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
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">SEMIFINAIS NACIONAIS</h1>
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
            {/* Header das Semifinais - Sempre visível */}
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-lg border border-red-200 p-6 min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                  🏆 FINAL FOUR NACIONAL
                </h2>
                <p className="text-gray-600 mb-4">
                  Os 4 campeões de conferência disputam as semifinais para definir a Grande Final Nacional
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="font-bold text-cyan-700">🧊 Sul × 🏭 Sudeste</p>
                    <p className="text-gray-600">Semifinal 1</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="font-bold text-orange-700">🌵 Nordeste × 🌲 Centro-Norte</p>
                    <p className="text-gray-600">Semifinal 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ CORRIGIDO: Mantém estrutura sempre, apenas troca conteúdo */}
            {(!semifinais || semifinais.length === 0) ? (
              <div className="text-center py-12">
                <div className="text-gray-600 text-lg">
                  Nenhuma Semifinal Nacional configurada ainda.
                </div>
              </div>
            ) : (
              semifinais.map((semifinal, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] 
              lg:ml-10 xl:ml-20 overflow-hidden">
                {/* Header da Semifinal */}
                <div className={`${index === 0 ? 'bg-gradient-to-r from-cyan-600 to-red-600' : 'bg-gradient-to-r from-orange-600 to-green-600'} text-white px-6 py-4`}>
                  <h2 className="text-lg font-bold">{semifinal.nome}</h2>
                  <p className="text-sm opacity-90">
                    {index === 0 ? 'Confronto Sul × Sudeste' : 'Confronto Nordeste × Centro-Norte'}
                  </p>
                </div>

                <div className="p-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50">
                    {/* Confronto */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center gap-2 text-[12px] md:text-xl">
                        <div className="bg-gray-100 px-4 py-3 rounded-lg font-medium text-gray-700 text-center min-w-[140px]">
                          <div className="font-bold">{semifinal.time1}</div>
                          {semifinal.placar1 !== undefined && (
                            <div className="text-2xl font-bold text-blue-600 mt-2">
                              {semifinal.placar1}
                            </div>
                          )}
                        </div>
                        <span className="text-gray-400 font-bold mx-3 text-xl">×</span>
                        <div className="bg-gray-100 px-4 py-3 rounded-lg font-medium text-gray-700 text-center min-w-[140px]">
                          <div className="font-bold">{semifinal.time2}</div>
                          {semifinal.placar2 !== undefined && (
                            <div className="text-2xl font-bold text-red-600 mt-2">
                              {semifinal.placar2}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status e Data */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      {semifinal.status && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          semifinal.status === 'FINALIZADO' ? 'bg-green-100 text-green-800' :
                          semifinal.status === 'AO_VIVO' ? 'bg-red-100 text-red-800' :
                          semifinal.status === 'AGUARDANDO' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {semifinal.status === 'FINALIZADO' ? 'Finalizado' :
                           semifinal.status === 'AO_VIVO' ? 'Ao Vivo' :
                           semifinal.status === 'AGUARDANDO' ? 'Aguardando' :
                           semifinal.status === 'AGENDADO' ? 'Agendado' : semifinal.status}
                        </span>
                      )}
                      
                      {semifinal.dataJogo && (
                        <span className="text-sm text-gray-500">
                          {new Date(semifinal.dataJogo).toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    
                    {/* Classificado para Final Nacional */}
                    {semifinal.vencedor && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-300">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="text-2xl">🏆</span>
                            <span className="font-bold text-green-800 text-lg">CLASSIFICADO PARA A FINAL NACIONAL</span>
                          </div>
                          <div className="font-bold text-green-900 text-xl mb-2">
                            {semifinal.vencedor.nome}
                          </div>
                          <div className="text-sm text-green-700 bg-green-100 rounded-full px-4 py-2 inline-block">
                            ✨ Disputará a Grande Decisão Nacional
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
            )}

            {/* Preview da Final Nacional - Mostrar sempre se há dados */}
            {semifinais && semifinais.some(s => s.vencedor) && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300 p-6 min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center justify-center gap-2">
                    🏆 GRANDE FINAL NACIONAL
                  </h3>
                  
                  {semifinais.filter(s => s.vencedor).length === 2 ? (
                    <div>
                      <p className="text-yellow-700 mb-4">Os finalistas estão definidos!</p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-yellow-300">
                          <p className="font-bold text-yellow-800">
                            {semifinais.find(s => s.vencedor)?.vencedor?.nome}
                          </p>
                          <p className="text-sm text-yellow-600">Vencedor Semifinal 1</p>
                        </div>
                        <span className="text-yellow-600 font-bold text-xl">VS</span>
                        <div className="bg-white rounded-lg p-4 border-2 border-yellow-300">
                          <p className="font-bold text-yellow-800">
                            {semifinais.filter(s => s.vencedor)[1]?.vencedor?.nome}
                          </p>
                          <p className="text-sm text-yellow-600">Vencedor Semifinal 2</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-yellow-700 mb-4">Aguardando resultado das semifinais</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {semifinais.map((semifinal, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-yellow-300">
                            <p className="font-medium text-yellow-700">{semifinal.nome}</p>
                            {semifinal.vencedor ? (
                              <p className="font-bold text-green-600">✓ {semifinal.vencedor.nome}</p>
                            ) : (
                              <p className="text-gray-500">Aguardando resultado</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Informações sobre as Semifinais - Sempre visível */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 p-6 min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20">
              <div className="text-center">
                <h3 className="font-bold text-gray-800 mb-3">Sobre as Semifinais Nacionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">🎯 Participantes</p>
                    <p>Os 4 campeões de conferência (Final Four)</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">🏆 Premiação</p>
                    <p>Classificação para a Grande Final Nacional</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">📅 Formato</p>
                    <p>Jogos únicos eliminatórios</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}