"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { usePlayoffBracket } from '@/hooks/useSuperliga'
import { Loading } from '@/components/ui/Loading'
// IMPORTAR O TIPO CORRETO DO SERVICE
import { SuperligaBracket } from '@/services/superliga.service'

export default function PlayoffsPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const { data: brackets, isLoading } = usePlayoffBracket(temporada)

  if (isLoading) return <Loading />

  // USAR O TIPO CORRETO DO SERVICE
  const renderBracket = (bracket: SuperligaBracket) => {
    return (
      <div className="bg-[#272731] rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Chaveamento Superliga {temporada}
        </h2>
        
        {/* Renderizar conferências */}
        {Object.entries(bracket.conferencias || {}).map(([key, conferencia]) => (
          <div key={key} className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Conferência {key}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conferencia.jogos?.map((jogo, index) => (
                <div key={index} className="bg-[#1C1C24] p-4 rounded">
                  <p className="text-white">Jogo {index + 1}</p>
                  {/* Renderizar dados do jogo */}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Renderizar fase nacional */}
        {bracket.faseNacional && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-3">
              Fase Nacional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bracket.faseNacional.semifinais?.map((jogo, index) => (
                <div key={index} className="bg-[#1C1C24] p-4 rounded">
                  <p className="text-white">Semifinal {index + 1}</p>
                </div>
              ))}
            </div>
            {bracket.faseNacional.final && (
              <div className="mt-4">
                <div className="bg-[#1C1C24] p-4 rounded">
                  <p className="text-white">Final Nacional</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🏆 Playoffs Superliga {temporada}
        </h1>

        {brackets ? renderBracket(brackets) : (
          <div className="text-center text-gray-400">
            Nenhum chaveamento encontrado
          </div>
        )}
      </div>
    </div>
  )
}