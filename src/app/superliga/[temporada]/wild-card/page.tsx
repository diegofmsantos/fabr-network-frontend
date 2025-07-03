'use client'

import { useParams } from 'next/navigation'
import { useConferencias } from '@/hooks/useSuperliga'
import { Loading } from '@/components/ui/Loading'

interface Regional {
  id: number
  nome: string
  tipo: string
  timesPorRegional: number
}

interface Conferencia {
  id: number
  nome: string
  tipo: string
  icone: string
  ordem: number
  totalTimes: number
  regionais?: Regional[]
}

export default function ConferenciaPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const { data: conferenciasData, isLoading } = useConferencias(temporada)

  if (isLoading) return <Loading />

  // Verificar se conferenciasData é um array ou objeto
  const conferencias: Conferencia[] = Array.isArray(conferenciasData)
    ? conferenciasData
    : conferenciasData ? [conferenciasData]
      : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C24] via-[#2A1810] to-[#1C1C24] text-white">
      {/* Header */}
      <div className="bg-black/40 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">CONFERÊNCIAS DA SUPERLIGA {temporada}</h1>
          <p className="text-center text-gray-300">Estrutura organizacional do campeonato</p>
        </div>
      </div>

      {/* Grid de Conferências */}
      <div className="container mx-auto px-4 py-8">
        {conferencias.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {conferencias.map((conferencia: Conferencia) => (
              <div key={conferencia.id} className="bg-black/30 rounded-lg overflow-hidden">
                {/* Header da Conferência */}
                <div className={`p-6 ${getConferenciaBackground(conferencia.tipo)}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{conferencia.icone || getConferenciaIcone(conferencia.tipo)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{conferencia.nome}</h2>
                      <p className="text-white/80">{conferencia.totalTimes} times</p>
                    </div>
                  </div>
                </div>

                {/* Regionais */}
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-white text-lg">Regionais:</h3>
                  <div className="space-y-3">
                    {conferencia.regionais && conferencia.regionais.length > 0 ? (
                      conferencia.regionais.map((regional: Regional) => (
                        <div key={regional.id} className="bg-gray-800/50 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">{regional.nome}</h4>
                          <div className="text-sm text-gray-400">
                            {regional.timesPorRegional} times por regional
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm">
                        Regionais não carregadas
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhuma conferência disponível para a temporada {temporada}</p>
            <p className="text-gray-500 text-sm mt-2">Verifique se a Superliga foi criada corretamente</p>
          </div>
        )}
      </div>

      {/* Informações Adicionais */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-black/20 rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Estrutura da Superliga</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">4</div>
              <div className="text-sm text-gray-400">Conferências</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">8</div>
              <div className="text-sm text-gray-400">Regionais</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">32</div>
              <div className="text-sm text-gray-400">Times</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">4</div>
              <div className="text-sm text-gray-400">Jogos por Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getConferenciaBackground(tipo: string) {
  const backgrounds = {
    'SUDESTE': 'bg-gradient-to-r from-red-600 to-red-700',
    'SUL': 'bg-gradient-to-r from-blue-600 to-blue-700',
    'NORDESTE': 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    'CENTRO_NORTE': 'bg-gradient-to-r from-green-600 to-green-700'
  }
  return backgrounds[tipo as keyof typeof backgrounds] || 'bg-gradient-to-r from-gray-600 to-gray-700'
}

function getConferenciaIcone(tipo: string) {
  const icones = {
    'SUDESTE': '🏭',
    'SUL': '🧊',
    'NORDESTE': '🌵',
    'CENTRO_NORTE': '🌲'
  }
  return icones[tipo as keyof typeof icones] || '⚡'
}