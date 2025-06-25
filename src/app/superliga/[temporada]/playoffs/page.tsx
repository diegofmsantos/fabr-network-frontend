"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { usePlayoffBracket } from '@/hooks/useSuperliga'
import { Loading } from '@/components/ui/Loading'

export default function PlayoffsPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const { data: brackets, isLoading } = usePlayoffBracket(temporada)

  if (isLoading) return <Loading />

  return (
    <div className="min-h-screen bg-[#1C1C24] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🏆 Playoffs Superliga {temporada}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {brackets?.map((bracket) => (
            <div key={bracket.conferencia} className="bg-[#272731] rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {bracket.conferencia} - {bracket.nome}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}