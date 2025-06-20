import React, { useMemo } from 'react'
import { Trophy, Target, TrendingUp, Users, Calendar, BarChart3, Award, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ImageService } from '@/utils/services/ImageService'
import { ClassificacaoGrupo, Jogo } from '@/types'

interface CampeonatoStatsProps {
  jogos: Jogo[]
  classificacao: ClassificacaoGrupo[]
  loading?: boolean
  temporada?: string
}

interface TeamStat {
  time: any
  valor: number
  adicional?: string
}

export const CampeonatoStats: React.FC<CampeonatoStatsProps> = ({
  jogos,
  classificacao,
  loading = false,
  temporada = '2025'
}) => {
  // Estatísticas gerais do campeonato
  const statsGerais = useMemo(() => {
    const jogosFinalizados = jogos.filter(j => j.status === 'FINALIZADO')
    const totalGols = jogosFinalizados.reduce((acc, jogo) => 
      acc + (jogo.placarCasa || 0) + (jogo.placarVisitante || 0), 0
    )
    
    const jogosComGols = jogosFinalizados.filter(j => 
      (j.placarCasa || 0) + (j.placarVisitante || 0) > 0
    )
    
    const mediaGolsPorJogo = jogosFinalizados.length > 0 ? totalGols / jogosFinalizados.length : 0
    
    const vitoriasCasa = jogosFinalizados.filter(j => 
      (j.placarCasa || 0) > (j.placarVisitante || 0)
    ).length
    
    const vitoriasVisitante = jogosFinalizados.filter(j => 
      (j.placarVisitante || 0) > (j.placarCasa || 0)
    ).length
    
    const empates = jogosFinalizados.filter(j => 
      (j.placarCasa || 0) === (j.placarVisitante || 0)
    ).length

    const percentualCasa = jogosFinalizados.length > 0 ? (vitoriasCasa / jogosFinalizados.length) * 100 : 0
    const percentualVisitante = jogosFinalizados.length > 0 ? (vitoriasVisitante / jogosFinalizados.length) * 100 : 0
    const percentualEmpate = jogosFinalizados.length > 0 ? (empates / jogosFinalizados.length) * 100 : 0

    return {
      totalJogos: jogos.length,
      jogosFinalizados: jogosFinalizados.length,
      jogosRestantes: jogos.length - jogosFinalizados.length,
      totalGols,
      mediaGolsPorJogo,
      vitoriasCasa,
      vitoriasVisitante,
      empates,
      percentualCasa,
      percentualVisitante,
      percentualEmpate,
      jogosComGols: jogosComGols.length
    }
  }, [jogos])

  // Times com melhor ataque
  const melhorAtaque = useMemo(() => {
    const stats = new Map<number, { time: any, pontosPro: number }>()
    
    classificacao.forEach(item => {
      stats.set(item.timeId, {
        time: item.time,
        pontosPro: item.pontosPro
      })
    })
    
    return Array.from(stats.values())
      .sort((a, b) => b.pontosPro - a.pontosPro)
      .slice(0, 5)
      .map(item => ({
        time: item.time,
        valor: item.pontosPro,
        adicional: `${item.pontosPro} pontos`
      }))
  }, [classificacao])

  // Times com melhor defesa
  const melhorDefesa = useMemo(() => {
    const stats = new Map<number, { time: any, pontosContra: number }>()
    
    classificacao.forEach(item => {
      stats.set(item.timeId, {
        time: item.time,
        pontosContra: item.pontosContra
      })
    })
    
    return Array.from(stats.values())
      .sort((a, b) => a.pontosContra - b.pontosContra)
      .slice(0, 5)
      .map(item => ({
        time: item.time,
        valor: item.pontosContra,
        adicional: `${item.pontosContra} pontos sofridos`
      }))
  }, [classificacao])

  // Times com melhor saldo
  const melhorSaldo = useMemo(() => {
    return classificacao
      .slice()
      .sort((a, b) => b.saldoPontos - a.saldoPontos)
      .slice(0, 5)
      .map(item => ({
        time: item.time,
        valor: item.saldoPontos,
        adicional: item.saldoPontos > 0 ? `+${item.saldoPontos}` : `${item.saldoPontos}`
      }))
  }, [classificacao])

  // Times mais regulares (maior aproveitamento)
  const maisRegulares = useMemo(() => {
    return classificacao
      .slice()
      .sort((a, b) => b.aproveitamento - a.aproveitamento)
      .slice(0, 5)
      .map(item => ({
        time: item.time,
        valor: item.aproveitamento,
        adicional: `${item.aproveitamento.toFixed(1)}%`
      }))
  }, [classificacao])

  const StatCard = ({ icon: Icon, title, value, description, color = "blue" }: {
    icon: any, title: string, value: string | number, description?: string, color?: string
  }) => (
    <div className="bg-white rounded-lg p-6 border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const TeamList = ({ title, teams, icon: Icon }: {
    title: string, teams: TeamStat[], icon: any
  }) => (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="divide-y">
        {teams.map((item, index) => (
          <Link 
            key={item.time.id}
            href={`/${item.time.nome}?temporada=${temporada}`}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-sm font-medium text-gray-500">
                {index + 1}
              </span>
              <Image
                src={ImageService.getTeamLogo(item.time.nome)}
                alt={`Logo ${item.time.nome}`}
                width={32}
                height={32}
                className="rounded"
                onError={(e) => ImageService.handleTeamLogoError(e, item.time.nome)}
              />
              <div>
                <div className="font-medium text-gray-900">{item.time.nome}</div>
                <div className="text-xs text-gray-500">{item.time.sigla}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{item.valor}</div>
              {item.adicional && (
                <div className="text-xs text-gray-500">{item.adicional}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Estatísticas Gerais */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estatísticas Gerais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            title="Jogos Realizados"
            value={`${statsGerais.jogosFinalizados}/${statsGerais.totalJogos}`}
            description={`${statsGerais.jogosRestantes} restantes`}
            color="blue"
          />
          
          <StatCard
            icon={Target}
            title="Total de Pontos"
            value={statsGerais.totalGols}
            description={`${statsGerais.mediaGolsPorJogo.toFixed(1)} por jogo`}
            color="green"
          />
          
          <StatCard
            icon={TrendingUp}
            title="Vitórias em Casa"
            value={`${statsGerais.percentualCasa.toFixed(1)}%`}
            description={`${statsGerais.vitoriasCasa} vitórias`}
            color="purple"
          />
          
          <StatCard
            icon={BarChart3}
            title="Empates"
            value={`${statsGerais.percentualEmpate.toFixed(1)}%`}
            description={`${statsGerais.empates} jogos`}
            color="yellow"
          />
        </div>
      </div>

      {/* Distribuição de Resultados */}
      <div className="bg-white rounded-lg p-6 border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Resultados</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Vitórias Mandante</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${statsGerais.percentualCasa}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12">{statsGerais.percentualCasa.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Empates</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${statsGerais.percentualEmpate}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12">{statsGerais.percentualEmpate.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Vitórias Visitante</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${statsGerais.percentualVisitante}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium w-12">{statsGerais.percentualVisitante.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rankings por Categoria */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Rankings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TeamList
            title="Melhor Ataque"
            teams={melhorAtaque}
            icon={Zap}
          />
          
          <TeamList
            title="Melhor Defesa"
            teams={melhorDefesa}
            icon={Award}
          />
          
          <TeamList
            title="Melhor Saldo"
            teams={melhorSaldo}
            icon={TrendingUp}
          />
          
          <TeamList
            title="Mais Regulares"
            teams={maisRegulares}
            icon={Trophy}
          />
        </div>
      </div>
    </div>
  )
}