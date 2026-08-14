'use client'

import React, { useMemo } from 'react'
import { Estatisticas } from '@/types'
import { ImageService } from '@/utils/services/ImageService'
import { useJogosJogador } from '@/hooks/useJogadores'
import { Loading } from '@/components/ui/Loading'
import Image from 'next/image'
import { formatJardas } from '@/utils/services/FormatterService'


interface PlayerGameStatsTableProps {
  jogadorId: number
  jogadorSetor: string
  temporada: string
}

interface ColumnConfig {
  key: string
  label: string
  category: keyof Estatisticas
  statKey: string
  format?: (stats: any) => string
}

interface GameStatsRow {
  data: string
  adversario: string
  adversarioLogo: string
  local: string
  resultado: string
  estatisticas: any
}

export const PlayerGameStatsTable: React.FC<PlayerGameStatsTableProps> = ({
  jogadorId,
  jogadorSetor,
  temporada
}) => {
  const { data: estatisticasJogo = [], isLoading, error } = useJogosJogador(jogadorId, temporada)

  const allColumns: ColumnConfig[] = [
    {
      key: 'comp_tent', label: 'COMP/TENT', category: 'passe', statKey: 'passes_completos',
      format: (stats) => {
        const comp = stats.passe?.passes_completos || 0
        const tent = stats.passe?.passes_tentados || 0
        return tent > 0 ? `${comp}/${tent}` : '0/0'
      }
    },
    { key: 'pass_yards', label: 'JDS PASSE', category: 'passe', statKey: 'jardas_de_passe' },
    { key: 'pass_tds', label: 'TD PASSE', category: 'passe', statKey: 'td_passados' },
    { key: 'interceptions', label: 'INT', category: 'passe', statKey: 'interceptacoes_sofridas' },
    { key: 'sacks_suf', label: 'SACKS SOF.', category: 'passe', statKey: 'sacks_sofridos' },
    { key: 'pass_fumbles', label: 'FMB PASSE', category: 'passe', statKey: 'fumble_de_passador' },

    { key: 'rush_yards', label: 'JDS CORRIDA', category: 'corrida', statKey: 'jardas_corridas' },
    { key: 'rushes', label: 'CORRIDAS', category: 'corrida', statKey: 'corridas' },
    { key: 'rush_tds', label: 'TD CORRIDA', category: 'corrida', statKey: 'tds_corridos' },
    { key: 'rush_fumbles', label: 'FMB CORRIDA', category: 'corrida', statKey: 'fumble_de_corredor' },

    { key: 'rec_yards', label: 'JDS REC.', category: 'recepcao', statKey: 'jardas_recebidas' },
    { key: 'receptions', label: 'RECEPÇÕES', category: 'recepcao', statKey: 'recepcoes' },
    { key: 'targets', label: 'ALVOS', category: 'recepcao', statKey: 'alvo' },
    { key: 'rec_tds', label: 'TD REC.', category: 'recepcao', statKey: 'tds_recebidos' },

    { key: 'ret_yards', label: 'JDS RET.', category: 'retorno', statKey: 'jardas_retornadas' },
    { key: 'returns', label: 'RETORNOS', category: 'retorno', statKey: 'retornos' },
    { key: 'ret_tds', label: 'TD RET.', category: 'retorno', statKey: 'td_retornados' },

    { key: 'tackles', label: 'TACKLES', category: 'defesa', statKey: 'tackles_totais' },
    { key: 'tfl', label: 'TFL', category: 'defesa', statKey: 'tackles_for_loss' },
    { key: 'sacks', label: 'SACKS', category: 'defesa', statKey: 'sacks_forcado' },
    { key: 'fumbles_forced', label: 'FMB FORÇ.', category: 'defesa', statKey: 'fumble_forcado' },
    { key: 'int_forced', label: 'INT FORÇ.', category: 'defesa', statKey: 'interceptacao_forcada' },
    { key: 'pass_def', label: 'PASS DEF.', category: 'defesa', statKey: 'passe_desviado' },
    { key: 'safety', label: 'SAFETY', category: 'defesa', statKey: 'safety' },
    { key: 'def_tds', label: 'TD DEF.', category: 'defesa', statKey: 'td_defensivo' },

    { key: 'fg_made', label: 'FG BONS', category: 'kicker', statKey: 'fg_bons' },
    { key: 'fg_att', label: 'FG TENT.', category: 'kicker', statKey: 'tentativas_de_fg' },
    { key: 'xp_made', label: 'XP BONS', category: 'kicker', statKey: 'xp_bons' },
    { key: 'xp_att', label: 'XP TENT.', category: 'kicker', statKey: 'tentativas_de_xp' },
    { key: 'fg_long', label: 'FG LONGO', category: 'kicker', statKey: 'fg_mais_longo' },

    { key: 'punts', label: 'PUNTS', category: 'punter', statKey: 'punts' },
    { key: 'punt_yards', label: 'JDS PUNT', category: 'punter', statKey: 'jardas_de_punt' },
  ]

  const activeColumns = useMemo(() => {
    if (estatisticasJogo.length === 0) return []

    const usedStats = new Set<string>()
    const hasDataInCategory = new Set<string>()

    estatisticasJogo.forEach((estatistica) => {
      const stats = estatistica.estatisticas || {}

      const categorias: (keyof Estatisticas)[] = ['passe', 'corrida', 'recepcao', 'retorno', 'defesa', 'kicker', 'punter']

      categorias.forEach((category) => {
        const categoryStats = stats[category]
        if (categoryStats && typeof categoryStats === 'object') {
          let hasAnyDataInCategory = false

          Object.keys(categoryStats).forEach((statKey) => {
            const value = (categoryStats as any)[statKey]
            if (value && value > 0) {
              usedStats.add(`${category}.${statKey}`)
              hasAnyDataInCategory = true
            }
          })

          if (hasAnyDataInCategory) {
            hasDataInCategory.add(category)
          }
        }
      })
    })

    return allColumns.filter((col) => {
      return usedStats.has(`${col.category}.${col.statKey}`) ||
        hasDataInCategory.has(col.category) ||
        (col.format && hasDataInCategory.has(col.category))
    })
  }, [estatisticasJogo])

  const gameStatsRows: GameStatsRow[] = useMemo(() => {
    return estatisticasJogo
      .map((stat: any) => {
        const jogo = stat.jogo
        const timeId = stat.timeId

        if (!jogo) {
          console.warn('🚨 Jogo não encontrado para estatística:', stat)
          return null
        }

        if (jogo.status !== 'FINALIZADO') {
          console.log(`🔍 [DEBUG] Ignorando jogo ${jogo.id} - Status: ${jogo.status}`)
          return null
        }

        const isTimeCasa = jogo.timeCasaId === timeId
        const adversario = isTimeCasa ? jogo.timeVisitante : jogo.timeCasa

        return {
          data: jogo.dataJogo ? new Date(jogo.dataJogo).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            timeZone: 'UTC'
          }) : '',
          adversario: adversario?.nome || 'Adversário',
          adversarioLogo: adversario?.nome ? ImageService.getTeamLogo(adversario.nome) : '',
          local: isTimeCasa ? 'Casa' : 'Visitante',
          resultado: `${jogo.placarCasa || 0} - ${jogo.placarVisitante || 0}`,
          estatisticas: stat.estatisticas || {}
        }
      })
      .filter((row): row is GameStatsRow => row !== null)
  }, [estatisticasJogo])


  const getStat = (stats: any, column: ColumnConfig) => {
    if (column.format) {
      return column.format(stats)
    }

    const categoryStats = stats[column.category]
    if (!categoryStats) return '0'

    const value = categoryStats[column.statKey] || 0

    if (column.statKey.includes('jardas')) {
      return formatJardas(value)
    }

    return value.toString()
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-bold text-black mb-4">Estatísticas Jogo a Jogo</h3>
        <Loading />
      </div>
    )
  }

  if (error) {
    console.error('🚨 Erro ao carregar estatísticas do jogador:', error)
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-bold text-black mb-4">Estatísticas Jogo a Jogo</h3>
        <div className="text-center text-black py-8">
          <p>📊 Estatísticas de jogos ainda não disponíveis.</p>
          <p className="text-sm mt-2">Os dados aparecerão após a importação dos resultados e estatísticas dos jogos.</p>
        </div>
      </div>
    )
  }

  if (gameStatsRows.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-xl font-bold text-black mb-4">Estatísticas Jogo a Jogo</h3>
        <div className="text-center text-black py-8">
          <p>Nenhuma estatística de jogo encontrada para este jogador.</p>
          <p className="text-sm mt-2">As estatísticas aparecerão após os jogos serem disputados e as estatísticas importadas.</p>
        </div>
      </div>
    )
  }


  return (
    <div className="bg-white rounded-lg p-3">
      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className=" border-b border-black">
              <th className="text-left py-3 px-3 text-black font-medium text-[14px] uppercase sticky left-0 ">DATA</th>
              <th className="text-center py-3 px-3 text-black font-medium text-[14px] uppercase">ADV.</th>
              <th className="text-center py-3 px-3 text-black font-medium text-[14px] uppercase">RESULTADO</th>
              {activeColumns.map((column) => (
                <th key={column.key} className="text-center py-3 px-3 text-black font-medium text-[14px] uppercase whitespace-nowrap">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gameStatsRows.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-white'}>
                <td className="py-3 px-3 text-black font-medium sticky left-0 bg-inherit">
                  {row.data}
                </td>
                <td className="py-3 px-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {row.adversarioLogo && (
                      <Image
                        src={row.adversarioLogo}
                        alt={row.adversario}
                        width={20}
                        height={20}
                        className="rounded"
                      />
                    )}
                    <span className="text-sm text-black">{row.adversario}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-black text-sm">
                  <span className={`inline-block px-2 py-1 rounded text-xs ${row.local === 'Casa' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                    {row.local}
                  </span>
                  <div className="mt-1">{row.resultado}</div>
                </td>
                {activeColumns.map((column) => (
                  <td key={column.key} className="py-3 px-3 text-center text-black">
                    {getStat(row.estatisticas, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}