// src/components/Jogador/PlayerGameStatsTable.tsx
'use client'

import React from 'react'
import { EstatisticaJogo, Estatisticas } from '@/types'
import { ImageService } from '@/utils/services/ImageService'
import { usePlayerGameStats } from '@/hooks/usePlayerGameStats'
import { Loading } from '@/components/ui/Loading'
import Image from 'next/image'

interface PlayerGameStatsTableProps {
  jogadorId: number
  jogadorSetor: string
}

export const PlayerGameStatsTable: React.FC<PlayerGameStatsTableProps> = ({
  jogadorId,
  jogadorSetor
}) => {
  const { data: estatisticasJogo = [], isLoading, error } = usePlayerGameStats(jogadorId)

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }

  const gameStatsRows = estatisticasJogo.map((stat: any) => {
    const jogo = stat.jogo
    const timeId = stat.timeId
    
    if (!jogo) return null

    const isTimeCasa = jogo.timeCasaId === timeId
    const adversario = isTimeCasa ? jogo.timeVisitante : jogo.timeCasa
    
    return {
      data: jogo.dataJogo ? new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      }) : '',
      adversario: adversario?.nome || 'Adversário',
      adversarioLogo: adversario?.nome ? ImageService.getTeamLogo(adversario.nome) : '',
      local: isTimeCasa ? 'Casa' : 'Visitante',
      resultado: jogo.status === 'FINALIZADO' 
        ? `${jogo.placarCasa || 0} - ${jogo.placarVisitante || 0}`
        : 'N/A',
      estatisticas: stat.estatisticas || {}
    }
  }).filter(Boolean) 

  const renderPasseStats = (stats: any) => {
    const passe = stats.passe || {}
    
    const completions = passe.passes_completos || 0
    const attempts = passe.passes_tentados || 0
    const yards = passe.jardas_de_passe || 0
    const tds = passe.td_passados || 0
    const ints = passe.interceptacoes_sofridas || 0
    const sacks = passe.sacks_sofridos || 0
    const fumbles = passe.fumble_de_passador || 0
    
    const avg = attempts > 0 ? (yards / attempts).toFixed(1) : '0.0'
    const percentage = attempts > 0 ? Math.round((completions / attempts) * 100) : 0
    
    return {
      compTent: attempts > 0 ? `${completions}/${attempts}` : '0/0',
      jardas: yards,
      touchdowns: tds,
      interceptacoes: ints,
      sacks: sacks,
      avg: avg,
      percentage: `${percentage}%`,
      fumbles: fumbles
    }
  }

  if (gameStatsRows.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Estatísticas Jogo a Jogo</h3>
        <div className="text-center text-gray-600 py-8">
          <p>Nenhuma estatística de jogo encontrada para este jogador.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="text-left py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">DATA</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">ADV.</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">COMP/TENT</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">JDS</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">TDS</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">INT</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">SCK</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">AVG</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">PASS%</th>
              <th className="text-center py-3 px-3 text-gray-700 font-medium text-[14px] uppercase">FUN</th>
            </tr>
          </thead>
          <tbody>
            {gameStatsRows.map((row: any, index: number) => {
              const stats = renderPasseStats(row.estatisticas)
              
              return (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 text-gray-900 text-base">
                    {row.data}
                  </td>
                  
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-center">
                      {row.adversarioLogo && (
                        <Image
                          src={row.adversarioLogo}
                          alt={`Logo ${row.adversario}`}
                          width={30}
                          height={30}
                          className="rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/assets/times/logos/default-logo.png'
                          }}
                        />
                      )}
                    </div>
                  </td>
                  
                  <td className="py-3 px-3 text-center text-gray-900 font-mono text-lg">
                    {stats.compTent}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-900 font-mono text-lg">
                    {stats.jardas}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-900 font-mono text-lg">
                    {stats.touchdowns}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-900 font-mono text-lg">
                    {stats.interceptacoes}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-900 font-mono text-lg">
                    {stats.sacks}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-900 font-mono text-lg">
                    {stats.avg}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-900 font-mono text-lg">
                    {stats.percentage}
                  </td>
                  <td className="py-3 px-3 text-center text-gray-900 font-mono text-lg">
                    {stats.fumbles}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {gameStatsRows.length > 0 && (
        <div className="mt-4 text-xs text-gray-600 text-center">
          Total de jogos: {gameStatsRows.length}
        </div>
      )}
    </div>
  )
}