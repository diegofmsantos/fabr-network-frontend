"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { useSuperligaFinal } from '@/hooks/useSuperliga'
import { Loading } from '@/components/ui/Loading'

export default function FinalNacionalPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const { data: finalData, isLoading } = useSuperligaFinal(temporada)

  if (isLoading) return <Loading />

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🏆 Grande Final Nacional {temporada}
        </h1>

        {finalData ? (
          <div className="space-y-8">
            <div className="bg-[#272731] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Semifinais Nacionais</h2>
            </div>

            <div className="bg-[#272731] rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Grande Decisão</h2>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            <p>Final nacional ainda não foi gerada.</p>
          </div>
        )}
      </div>
    </div>
  )
}