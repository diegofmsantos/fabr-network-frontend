import React, { useState } from 'react'
import Image from 'next/image'
import { 
  BarChart3, 
  Target, 
  Activity, 
  Shield, 
  Zap,
  Award,
  TrendingUp,
  Users
} from 'lucide-react'
import { Jogo, Jogador, Estatisticas } from '@/types'
import { ImageService } from '@/utils/services/ImageService'

interface JogadorEstatistica extends Jogador {
  estatisticasJogo?: Estatisticas
}

interface EstatisticasJogoData {
  jogo: Jogo
  estatisticasTimeCasa: JogadorEstatistica[]
  estatisticasTimeVisitante: JogadorEstatistica[]
}

interface JogoEstatisticasProps {
  data: EstatisticasJogoData
  loading?: boolean
}

type CategoriaEstat = 'passe' | 'corrida' | 'recepcao' | 'defesa' | 'kicker' | 'punter'

export const JogoEstatisticas: React.FC<JogoEstatisticasProps> = ({ data, loading = false }) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaEstat>('passe')
  const [timeAtivo, setTimeAtivo] = useState<'casa' | 'visitante' | 'ambos'>('ambos')

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const { jogo, estatisticasTimeCasa, estatisticasTimeVisitante } = data

  const categorias = [
    { key: 'passe', label: 'Passe', icon: Target },
    { key: 'corrida', label: 'Corrida', icon: TrendingUp },
    { key: 'recepcao', label: 'Recepção', icon: Activity },
    { key: 'defesa', label: 'Defesa', icon: Shield },
    { key: 'kicker', label: 'Chutes', icon: Award },
    { key: 'punter', label: 'Punt', icon: Zap },
  ] as const

  const getEstatisticasPorCategoria = (jogador: JogadorEstatistica, categoria: CategoriaEstat) => {
    const stats = jogador.estatisticasJogo?.[categoria]
    if (!stats) return null

    switch (categoria) {
      case 'passe':
        return [
          { label: 'Jardas', valor: stats.jardas_de_passe || 0 },
          { label: 'Completos', valor: stats.passes_completos || 0 },
          { label: 'Tentados', valor: stats.passes_tentados || 0 },
          { label: 'TDs', valor: stats.td_passados || 0 },
          { label: 'Ints', valor: stats.interceptacoes_sofridas || 0 },
          { label: 'Sacks', valor: stats.sacks_sofridos || 0 },
        ]
      case 'corrida':
        return [
          { label: 'Jardas', valor: stats.jardas_corridas || 0 },
          { label: 'Corridas', valor: stats.corridas || 0 },
          { label: 'TDs', valor: stats.tds_corridos || 0 },
          { label: 'Fumbles', valor: stats.fumble_de_corredor || 0 },
        ]
      case 'recepcao':
        return [
          { label: 'Jardas', valor: stats.jardas_recebidas || 0 },
          { label: 'Recepções', valor: stats.recepcoes || 0 },
          { label: 'Alvos', valor: stats.alvo || 0 },
          { label: 'TDs', valor: stats.tds_recebidos || 0 },
        ]
      case 'defesa':
        return [
          { label: 'Tackles', valor: stats.tackles_totais || 0 },
          { label: 'TFL', valor: stats.tackles_for_loss || 0 },
          { label: 'Sacks', valor: stats.sacks_forcado || 0 },
          { label: 'Ints', valor: stats.interceptacao_forcada || 0 },
          { label: 'PD', valor: stats.passe_desviado || 0 },
        ]
      case 'kicker':
        return [
          { label: 'FG Bons', valor: stats.fg_bons || 0 },
          { label: 'FG Tent.', valor: stats.tentativas_de_fg || 0 },
          { label: 'XP Bons', valor: stats.xp_bons || 0 },
          { label: 'XP Tent.', valor: stats.tentativas_de_xp || 0 },
          { label: 'Mais Longo', valor: stats.fg_mais_longo || 0 },
        ]
      case 'punter':
        return [
          { label: 'Punts', valor: stats.punts || 0 },
          { label: 'Jardas', valor: stats.jardas_de_punt || 0 },
          { label: 'Média', valor: stats.punts ? Math.round((stats.jardas_de_punt || 0) / stats.punts * 10) / 10 : 0 },
        ]
      default:
        return []
    }
  }

  const getJogadoresComEstatisticas = (jogadores: JogadorEstatistica[], categoria: CategoriaEstat) => {
    return jogadores.filter(jogador => {
      const stats = getEstatisticasPorCategoria(jogador, categoria)
      return stats && stats.some(stat => stat.valor > 0)
    })
  }

  const renderTabelaEstatisticas = (jogadores: JogadorEstatistica[], time: 'casa' | 'visitante') => {
    const jogadoresComStats = getJogadoresComEstatisticas(jogadores, categoriaAtiva)
    
    if (jogadoresComStats.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma estatística registrada para {categorias.find(c => c.key === categoriaAtiva)?.label}</p>
        </div>
      )
    }

    const estatisticasReferencia = getEstatisticasPorCategoria(jogadoresComStats[0], categoriaAtiva)

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-700">Jogador</th>
              {estatisticasReferencia?.map(stat => (
                <th key={stat.label} className="text-center py-3 px-2 font-medium text-gray-700 min-w-[60px]">
                  {stat.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jogadoresComStats.map(jogador => {
              const stats = getEstatisticasPorCategoria(jogador, categoriaAtiva)
              return (
                <tr key={jogador.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                        #{jogador.numero || '-'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{jogador.nome}</p>
                        <p className="text-xs text-gray-500">{jogador.posicao}</p>
                      </div>
                    </div>
                  </td>
                  {stats?.map(stat => (
                    <td key={stat.label} className="text-center py-3 px-2 font-medium">
                      {stat.valor}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Estatísticas do Jogo</h2>
            <p className="text-sm text-gray-500">
              {jogo.timeCasa.sigla} vs {jogo.timeVisitante.sigla} • {jogo.rodada}ª Rodada
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col gap-4">
          {/* Categorias */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {categorias.map(categoria => {
                const Icon = categoria.icon
                return (
                  <button
                    key={categoria.key}
                    onClick={() => setCategoriaAtiva(categoria.key)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categoriaAtiva === categoria.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {categoria.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Times */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Visualizar</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeAtivo('ambos')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeAtivo === 'ambos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Ambos os Times
              </button>
              <button
                onClick={() => setTimeAtivo('casa')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeAtivo === 'casa'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {jogo.timeCasa.sigla}
              </button>
              <button
                onClick={() => setTimeAtivo('visitante')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeAtivo === 'visitante'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {jogo.timeVisitante.sigla}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        {timeAtivo === 'ambos' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Time da Casa */}
            <div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <Image
                  src={ImageService.getTeamLogo(jogo.timeCasa.nome || '')}
                  alt={`Logo ${jogo.timeCasa.nome}`}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{jogo.timeCasa.nome}</h3>
                  <p className="text-sm text-gray-500">{jogo.timeCasa.sigla}</p>
                </div>
              </div>
              {renderTabelaEstatisticas(estatisticasTimeCasa, 'casa')}
            </div>

            {/* Time Visitante */}
            <div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <Image
                  src={ImageService.getTeamLogo(jogo.timeVisitante.nome || '')}
                  alt={`Logo ${jogo.timeVisitante.nome}`}
                  width={32}
                  height={32}
                  className="rounded"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{jogo.timeVisitante.nome}</h3>
                  <p className="text-sm text-gray-500">{jogo.timeVisitante.sigla}</p>
                </div>
              </div>
              {renderTabelaEstatisticas(estatisticasTimeVisitante, 'visitante')}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b">
              <Image
                src={ImageService.getTeamLogo(
                  timeAtivo === 'casa' ? jogo.timeCasa.nome || '' : jogo.timeVisitante.nome || ''
                )}
                alt={`Logo ${timeAtivo === 'casa' ? jogo.timeCasa.nome : jogo.timeVisitante.nome}`}
                width={40}
                height={40}
                className="rounded"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {timeAtivo === 'casa' ? jogo.timeCasa.nome : jogo.timeVisitante.nome}
                </h3>
                <p className="text-sm text-gray-500">
                  {timeAtivo === 'casa' ? jogo.timeCasa.sigla : jogo.timeVisitante.sigla}
                </p>
              </div>
            </div>
            {renderTabelaEstatisticas(
              timeAtivo === 'casa' ? estatisticasTimeCasa : estatisticasTimeVisitante,
              timeAtivo
            )}
          </div>
        )}
      </div>
    </div>
  )
}