"use client"

import { useParams, useRouter, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useFinalNacionalData } from '@/hooks/usePlayoffData'

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
  
  // ✅ NOVO: Usar hook intermediário simplificado
  const { data: finalNacional, isLoading, error } = useFinalNacionalData(temporada)
  
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

  const isJogoFinalizado = finalNacional?.status === 'FINALIZADO'
  const temCampeao = finalNacional?.vencedor

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
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">GRANDE FINAL NACIONAL</h1>
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
            {/* Header da Final Nacional - Sempre visível */}
            <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 rounded-lg border-2 border-yellow-400 p-8 min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-4xl">🏆</span>
                  <h2 className="text-3xl font-bold text-yellow-800">GRANDE FINAL NACIONAL</h2>
                  <span className="text-4xl">🏆</span>
                </div>
                <p className="text-lg text-yellow-700 mb-2">
                  Superliga de Futebol Americano {temporada}
                </p>
                <p className="text-yellow-600">
                  O jogo decisivo para definir o Campeão Nacional
                </p>
              </div>
            </div>

            {/* ✅ CORRIGIDO: Mantém estrutura sempre, apenas troca conteúdo */}
            {!finalNacional ? (
              <div className="text-center py-12">
                <div className="text-gray-600 text-lg">
                  A Grande Final Nacional ainda não foi configurada.
                </div>
              </div>
            ) : (
              <>
                {/* Conteúdo da final aqui */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-yellow-400 min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20 overflow-hidden">
              {/* Header do Jogo */}
              <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-blue-600 text-white px-6 py-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">DECISÃO NACIONAL</h3>
                  <p className="text-lg opacity-90">
                    {finalNacional.local || 'Arena Nacional'} • {temporada}
                  </p>
                </div>
              </div>

              <div className="p-6">
                {/* Confronto Principal */}
                <div className="mb-6">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-4 text-lg md:text-2xl">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-4 rounded-xl border-2 border-blue-300 text-center min-w-[160px]">
                        <div className="font-bold text-blue-800 mb-2">{finalNacional.time1}</div>
                        {finalNacional.placar1 !== undefined && (
                          <div className="text-3xl font-bold text-blue-600">
                            {finalNacional.placar1}
                          </div>
                        )}
                      </div>
                      
                      <div className="mx-4 text-center">
                        <span className="text-gray-400 font-bold text-2xl">×</span>
                        <div className="text-xs text-gray-500 mt-1">VS</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-red-50 to-red-100 px-6 py-4 rounded-xl border-2 border-red-300 text-center min-w-[160px]">
                        <div className="font-bold text-red-800 mb-2">{finalNacional.time2}</div>
                        {finalNacional.placar2 !== undefined && (
                          <div className="text-3xl font-bold text-red-600">
                            {finalNacional.placar2}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status e Data */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {finalNacional.status && (
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        finalNacional.status === 'FINALIZADO' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                        finalNacional.status === 'AO_VIVO' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                        finalNacional.status === 'AGUARDANDO' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                        'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      }`}>
                        {finalNacional.status === 'FINALIZADO' ? '🏁 FINALIZADO' :
                         finalNacional.status === 'AO_VIVO' ? '🔴 AO VIVO' :
                         finalNacional.status === 'AGUARDANDO' ? '⏳ AGUARDANDO' :
                         finalNacional.status === 'AGENDADO' ? '📅 AGENDADO' : finalNacional.status}
                      </span>
                    )}
                  </div>
                  
                  {finalNacional.dataJogo && (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-1">Data e horário:</p>
                      <p className="font-bold text-gray-800 text-lg">
                        {new Date(finalNacional.dataJogo).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-gray-600">
                        {new Date(finalNacional.dataJogo).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Local do Jogo */}
                <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm mb-1">Local:</p>
                  <p className="font-bold text-gray-800 text-lg">
                    {finalNacional.local || 'Arena Nacional'}
                  </p>
                </div>
              </div>
            </div>

            {/* Campeão Nacional */}
            {temCampeao && (
              <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 rounded-lg border-4 border-yellow-500 p-8 min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <span className="text-6xl animate-bounce">🏆</span>
                    <div>
                      <h3 className="text-3xl font-bold text-yellow-800 mb-2">
                        CAMPEÃO NACIONAL
                      </h3>
                      <p className="text-lg text-yellow-700">Superliga {temporada}</p>
                    </div>
                    <span className="text-6xl animate-bounce">🏆</span>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 border-4 border-yellow-400 mb-6">
                    <h4 className="text-4xl font-bold text-yellow-800 mb-2">
                      {finalNacional.vencedor.nome}
                    </h4>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-2xl">👑</span>
                      <span className="text-xl font-bold text-yellow-700">CAMPEÃO NACIONAL</span>
                      <span className="text-2xl">👑</span>
                    </div>
                    <p className="text-yellow-600">
                      Conquistou o título máximo do futebol americano brasileiro
                    </p>
                  </div>

                  {/* Placar Final */}
                  {finalNacional.placar1 !== undefined && finalNacional.placar2 !== undefined && (
                    <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
                      <p className="text-yellow-700 font-bold text-lg mb-2">PLACAR FINAL</p>
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-lg font-medium">
                          {finalNacional.time1}: {finalNacional.placar1}
                        </span>
                        <span className="text-yellow-600">×</span>
                        <span className="text-lg font-medium">
                          {finalNacional.time2}: {finalNacional.placar2}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            </>
            )}

            {/* Jornada até a Final - Sempre visível */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6 min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20">
              <div className="text-center">
                <h3 className="font-bold text-blue-800 mb-4 text-lg">🛣️ JORNADA ATÉ A FINAL</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="font-bold text-blue-700 mb-1">1. TEMPORADA REGULAR</p>
                    <p className="text-blue-600">128 jogos • 4 rodadas</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="font-bold text-blue-700 mb-1">2. PLAYOFFS</p>
                    <p className="text-blue-600">Wild Card + Semifinais + Finais</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="font-bold text-blue-700 mb-1">3. SEMIFINAL NACIONAL</p>
                    <p className="text-blue-600">Final Four • 4 campeões</p>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-3 border-2 border-yellow-400">
                    <p className="font-bold text-yellow-800 mb-1">4. FINAL NACIONAL</p>
                    <p className="text-yellow-700">Grande Decisão</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações sobre a Final - Sempre visível */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 p-6 min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20">
              <div className="text-center">
                <h3 className="font-bold text-gray-800 mb-4">Sobre a Grande Final Nacional</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">🏆 Prêmio</p>
                    <p>Título de Campeão Nacional da Superliga</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">🎯 Participantes</p>
                    <p>Vencedores das Semifinais Nacionais</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">📍 Local</p>
                    <p>{finalNacional?.local || 'Arena Nacional'}</p>
                  </div>
                </div>

                {finalNacional && !isJogoFinalizado && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium">
                      🔥 O maior jogo do futebol americano brasileiro está chegando!
                    </p>
                  </div>
                )}

                {finalNacional && isJogoFinalizado && temCampeao && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">
                      🎉 Parabéns ao {finalNacional.vencedor.nome} pelo título da Superliga {temporada}!
                    </p>
                  </div>
                )}

                {!finalNacional && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 font-medium">
                      ⏳ Aguardando a definição dos finalistas nas Semifinais Nacionais
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}