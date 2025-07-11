// src/components/Player/PlayerGameStatsTable.tsx
'use client'

import React, { useState } from 'react'
import { EstatisticaJogo, Estatisticas } from '@/types'
import { ImageService } from '@/utils/services/ImageService'
import { usePlayerGameStats } from '@/hooks/usePlayerGameStats'
import { Loading } from '@/components/ui/Loading'
import Image from 'next/image'

interface PlayerGameStatsTableProps {
  jogadorId: number
  jogadorSetor: string
}

interface GameStatsRow {
  jogoId: number
  data: string
  adversario: string
  adversarioLogo: string
  local: 'Casa' | 'Visitante'
  resultado: string
  estatisticas: Estatisticas
}

export const PlayerGameStatsTable: React.FC<PlayerGameStatsTableProps> = ({
  jogadorId,
  jogadorSetor
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('passe')
  
  // Usar hook em vez de chamada direta da API
  const { data: estatisticasJogo = [], isLoading, error } = usePlayerGameStats(jogadorId)

  // Preparar dados da tabela
  const gameStatsRows: GameStatsRow[] = estatisticasJogo.map(stat => ({
    jogoId: stat.jogo?.id || 0,
    data: stat.jogo?.dataJogo ? new Date(stat.jogo.dataJogo).toLocaleDateString('pt-BR') : '',
    adversario: stat.jogo?.timeCasa.id === stat.timeId 
      ? stat.jogo?.timeVisitante.nome || ''
      : stat.jogo?.timeCasa.nome || '',
    adversarioLogo: stat.jogo?.timeCasa.id === stat.timeId
      ? ImageService.getTeamLogo(stat.jogo?.timeVisitante.nome || '')
      : ImageService.getTeamLogo(stat.jogo?.timeCasa.nome || ''),
    local: stat.jogo?.timeCasa.id === stat.timeId ? 'Casa' : 'Visitante',
    resultado: stat.jogo?.status === 'FINALIZADO' 
      ? `${stat.jogo.placarCasa} - ${stat.jogo.placarVisitante}`
      : 'N/A',
    estatisticas: stat.estatisticas
  }))

  // Definir categorias baseadas no setor do jogador
  const getAvailableCategories = () => {
    const categories = []
    
    if (jogadorSetor === 'Ataque' || jogadorSetor === 'Special') {
      categories.push(
        { key: 'passe', label: 'Passe' },
        { key: 'corrida', label: 'Corrida' },
        { key: 'recepcao', label: 'Recepção' }
      )
    }
    
    if (jogadorSetor === 'Defesa') {
      categories.push({ key: 'defesa', label: 'Defesa' })
    }
    
    if (jogadorSetor === 'Special') {
      categories.push(
        { key: 'retorno', label: 'Retorno' },
        { key: 'kicker', label: 'Kicker' },
        { key: 'punter', label: 'Punter' }
      )
    }
    
    return categories
  }

  const availableCategories = getAvailableCategories()

  // Renderizar cabeçalho da tabela baseado na categoria selecionada
  const renderTableHeaders = () => {
    const baseHeaders = ['Data', 'Adversário', 'Local', 'Resultado']
    
    let statHeaders: string[] = []
    
    switch (selectedCategory) {
      case 'passe':
        statHeaders = ['Comp/Tent', 'Jardas', 'TDs', 'INTs', 'Rating']
        break
      case 'corrida':
        statHeaders = ['Corridas', 'Jardas', 'Média', 'TDs']
        break
      case 'recepcao':
        statHeaders = ['Recep/Alvo', 'Jardas', 'Média', 'TDs']
        break
      case 'defesa':
        statHeaders = ['Tackles', 'TFL', 'Sacks', 'INTs', 'TD Def']
        break
      case 'retorno':
        statHeaders = ['Retornos', 'Jardas', 'Média', 'TDs']
        break
      case 'kicker':
        statHeaders = ['XP', '%XP', 'FG', '%FG', 'Mais Longo']
        break
      case 'punter':
        statHeaders = ['Punts', 'Jardas', 'Média']
        break
    }
    
    return [...baseHeaders, ...statHeaders]
  }

  // Renderizar linha de estatísticas
  const renderStatCells = (stats: Estatisticas) => {
    switch (selectedCategory) {
      case 'passe':
        const completions = stats.passe?.passes_completos || 0
        const attempts = stats.passe?.passes_tentados || 0
        const passYards = stats.passe?.jardas_de_passe || 0
        const passTDs = stats.passe?.td_passados || 0
        const ints = stats.passe?.interceptacoes_sofridas || 0
        const rating = attempts > 0 ? ((completions / attempts) * 100).toFixed(1) : '0.0'
        
        return [
          `${completions}/${attempts}`,
          passYards.toString(),
          passTDs.toString(),
          ints.toString(),
          `${rating}%`
        ]
        
      case 'corrida':
        const rushes = stats.corrida?.corridas || 0
        const rushYards = stats.corrida?.jardas_corridas || 0
        const rushTDs = stats.corrida?.tds_corridos || 0
        const rushAvg = rushes > 0 ? (rushYards / rushes).toFixed(1) : '0.0'
        
        return [
          rushes.toString(),
          rushYards.toString(),
          rushAvg,
          rushTDs.toString()
        ]
        
      case 'recepcao':
        const receptions = stats.recepcao?.recepcoes || 0
        const targets = stats.recepcao?.alvo || 0
        const recYards = stats.recepcao?.jardas_recebidas || 0
        const recTDs = stats.recepcao?.tds_recebidos || 0
        const recAvg = receptions > 0 ? (recYards / receptions).toFixed(1) : '0.0'
        
        return [
          `${receptions}/${targets}`,
          recYards.toString(),
          recAvg,
          recTDs.toString()
        ]
        
      case 'defesa':
        const tackles = stats.defesa?.tackles_totais || 0
        const tfl = stats.defesa?.tackles_for_loss || 0
        const sacks = stats.defesa?.sacks_forcado || 0
        const defInts = stats.defesa?.interceptacao_forcada || 0
        const defTDs = stats.defesa?.td_defensivo || 0
        
        return [
          tackles.toString(),
          tfl.toString(),
          sacks.toString(),
          defInts.toString(),
          defTDs.toString()
        ]
        
      case 'retorno':
        const returns = stats.retorno?.retornos || 0
        const returnYards = stats.retorno?.jardas_retornadas || 0
        const returnTDs = stats.retorno?.td_retornados || 0
        const returnAvg = returns > 0 ? (returnYards / returns).toFixed(1) : '0.0'
        
        return [
          returns.toString(),
          returnYards.toString(),
          returnAvg,
          returnTDs.toString()
        ]
        
      case 'kicker':
        const xpMade = stats.kicker?.xp_bons || 0
        const xpAttempts = stats.kicker?.tentativas_de_xp || 0
        const fgMade = stats.kicker?.fg_bons || 0
        const fgAttempts = stats.kicker?.tentativas_de_fg || 0
        const longest = stats.kicker?.fg_mais_longo || 0
        const xpPct = xpAttempts > 0 ? ((xpMade / xpAttempts) * 100).toFixed(1) : '0.0'
        const fgPct = fgAttempts > 0 ? ((fgMade / fgAttempts) * 100).toFixed(1) : '0.0'
        
        return [
          `${xpMade}/${xpAttempts}`,
          `${xpPct}%`,
          `${fgMade}/${fgAttempts}`,
          `${fgPct}%`,
          `${longest}y`
        ]
        
      case 'punter':
        const punts = stats.punter?.punts || 0
        const puntYards = stats.punter?.jardas_de_punt || 0
        const puntAvg = punts > 0 ? (puntYards / punts).toFixed(1) : '0.0'
        
        return [
          punts.toString(),
          puntYards.toString(),
          puntAvg
        ]
        
      default:
        return []
    }
  }

  if (gameStatsRows.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-300 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Estatísticas Jogo a Jogo</h3>
        <div className="text-center text-gray-600 py-8">
          <p>Nenhuma estatística de jogo encontrada para este jogador.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-100 rounded-lg border border-gray-300 p-6 max-w-[800px] mx-auto">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Estatísticas Jogo a Jogo</h3>
      
      {/* Filtros de Categoria */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availableCategories.map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Tabela de Estatísticas */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300">
              {renderTableHeaders().map((header, index) => (
                <th key={index} className="text-left py-3 px-2 text-gray-700 font-medium bg-gray-50">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gameStatsRows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2 text-gray-900">{row.data}</td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={row.adversarioLogo}
                      alt={`Logo ${row.adversario}`}
                      width={20}
                      height={20}
                      className="rounded"
                      onError={(e) => ImageService.handleTeamLogoError(e, row.adversario)}
                    />
                    <span className="text-gray-900 text-xs">{row.adversario}</span>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    row.local === 'Casa' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {row.local}
                  </span>
                </td>
                <td className="py-3 px-2 text-gray-900 font-mono text-xs">{row.resultado}</td>
                {renderStatCells(row.estatisticas).map((stat, statIndex) => (
                  <td key={statIndex} className="py-3 px-2 text-gray-900 font-mono text-xs">
                    {stat}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {gameStatsRows.length > 0 && (
        <div className="mt-4 text-xs text-gray-600">
          Total de jogos: {gameStatsRows.length}
        </div>
      )}
    </div>
  )
}