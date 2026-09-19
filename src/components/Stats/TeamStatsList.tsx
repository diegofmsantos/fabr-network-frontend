import React, { useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { NoStats } from '../ui/NoStats'
import { formatValue } from '@/utils/services/FormatterService'
import { ImageService } from '@/utils/services/ImageService'
import { Jogador, StatConfig, Time } from '@/types'

interface TeamStatsListProps {
  players: Jogador[]
  times: Time[]
  statMapping: StatConfig
}

interface RankedTeam {
  time: {
    id: number
    nome: string
    cor?: string
    capacete?: string
  }
  value: number
}

const toNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

const calculateTeamStat = (teamPlayers: Jogador[], statMapping: StatConfig): number | null => {
    try {
      let total = 0
      let divisor = 0

      if (statMapping.key === 'fumble_de_passador') {
        teamPlayers.forEach(player => {
          total += toNumber(player.estatisticas?.passe?.fumble_de_passador)
        })
        return total > 0 ? total : null
      }

      if (statMapping.key === 'jardas_punt_media') {
        teamPlayers.forEach(player => {
          total += toNumber(player.estatisticas?.punter?.jardas_de_punt)
          divisor += toNumber(player.estatisticas?.punter?.punts)
        })
        return divisor > 0 ? total / divisor : null
      }

      if (statMapping.isCalculated) {
        switch (statMapping.key) {
          case 'passes_percentual':
            teamPlayers.forEach(player => {
              total += toNumber(player.estatisticas?.passe?.passes_completos)
              divisor += toNumber(player.estatisticas?.passe?.passes_tentados)
            })
            return divisor > 0 ? (total / divisor) * 100 : null

          case 'jardas_media':
            teamPlayers.forEach(player => {
              total += toNumber(player.estatisticas?.passe?.jardas_de_passe)
              divisor += toNumber(player.estatisticas?.passe?.passes_tentados)
            })
            return divisor > 0 ? total / divisor : null

          case 'jardas_corridas_media':
            teamPlayers.forEach(player => {
              total += toNumber(player.estatisticas?.corrida?.jardas_corridas)
              divisor += toNumber(player.estatisticas?.corrida?.corridas)
            })
            return divisor > 0 ? total / divisor : null

          case 'jardas_recebidas_media':
            teamPlayers.forEach(player => {
              total += toNumber(player.estatisticas?.recepcao?.jardas_recebidas)
              divisor += toNumber(player.estatisticas?.recepcao?.alvo)
            })
            return divisor > 0 ? total / divisor : null

          case 'jardas_retornadas_media':
            teamPlayers.forEach(player => {
              total += toNumber(player.estatisticas?.retorno?.jardas_retornadas)
              divisor += toNumber(player.estatisticas?.retorno?.retornos)
            })
            return divisor > 0 ? total / divisor : null

          case 'extra_points':
            teamPlayers.forEach(player => {
              total += toNumber(player.estatisticas?.kicker?.xp_bons)
              divisor += toNumber(player.estatisticas?.kicker?.tentativas_de_xp)
            })
            return divisor > 0 ? (total / divisor) * 100 : null

          case 'field_goals':
            teamPlayers.forEach(player => {
              total += toNumber(player.estatisticas?.kicker?.fg_bons)
              divisor += toNumber(player.estatisticas?.kicker?.tentativas_de_fg)
            })
            return divisor > 0 ? (total / divisor) * 100 : null

          default:
            return null
        }
      }

      teamPlayers.forEach(player => {
        switch (statMapping.category) {
          case 'passe': {
            const value = toNumber((player.estatisticas?.passe as any)?.[statMapping.key])
            total += value
            break
          }
          case 'corrida': {
            const value = toNumber((player.estatisticas?.corrida as any)?.[statMapping.key])
            total += value
            break
          }
          case 'recepcao': {
            const value = toNumber((player.estatisticas?.recepcao as any)?.[statMapping.key])
            total += value
            break
          }
          case 'retorno': {
            const value = toNumber((player.estatisticas?.retorno as any)?.[statMapping.key])
            total += value
            break
          }
          case 'defesa': {
            const value = toNumber((player.estatisticas?.defesa as any)?.[statMapping.key])
            total += value
            break
          }
          case 'kicker': {
            const value = toNumber((player.estatisticas?.kicker as any)?.[statMapping.key])
            total += value
            break
          }
          case 'punter': {
            const value = toNumber((player.estatisticas?.punter as any)?.[statMapping.key])
            total += value
            break
          }
        }
      })

      return total > 0 ? total : null
    } catch (error) {
      console.error(`Erro ao calcular estatística:`, error)
      return null
    }
}

const TeamListItem: React.FC<{ team: RankedTeam; index: number; statMapping: StatConfig }> = React.memo(({ team, index, statMapping }) => {
  return (
    <div className="bg-[#ECECEC] max-w-[1200px] mx-auto">
      <Link
        href={`/${encodeURIComponent(team.time.nome || '')}`}
        className="block"
      >
        <div
          className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md
                    ${index === 0 ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"}`}
          style={{ backgroundColor: index === 0 ? team.time.cor : undefined }}
        >
          {index === 0 ? (
            <div className="flex justify-around items-center w-full text-white min-[375px]:px-4 md:justify-around md:pl-6">
              <div className="flex flex-col justify-center pt-4">
                <p className="text-[25px] font-bold">{index + 1}</p>
                <h4 className="font-extrabold italic text-xl max-w-36 uppercase leading-4 md:text-[28px] md:leading-6">{team.time.nome}</h4>
                <div className="flex items-center gap-1 ">
                  <Image
                    src={ImageService.getTeamLogo(team.time.nome)}
                    width={60}
                    height={60}
                    alt={`Logo do time ${team.time.nome}`}
                    onError={(e) => ImageService.handleTeamLogoError(e, team.time.nome)}
                  />
                </div>
                <span className="font-extrabold italic text-[40px]">
                  {formatValue(team.value, statMapping.title)}
                </span>
              </div>
              <div className="relative w-[200px] h-[200px]">
                <Image
                  src={ImageService.getTeamHelmet(team.time.nome, team.time.capacete)}
                  fill
                  sizes="200px"
                  alt={`Capacete do ${team.time.nome}`}
                  className="object-contain"
                  priority
                  quality={85}
                  onError={(e) => ImageService.handleTeamHelmetError(e, team.time.nome)}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-auto flex justify-between items-center gap-2 min-[350px]:px-4 min-[425px]:px-7 md:justify-around">
              <div className="flex items-center md:w-60">
                <span className="font-bold flex items-center gap-2">
                  <div>{index + 1}</div>
                  <Image
                    src={ImageService.getTeamLogo(team.time.nome)}
                    width={40}
                    height={40}
                    alt={`Logo do time ${team.time.nome}`}
                    className='mr-4'
                    onError={(e) => ImageService.handleTeamLogoError(e, team.time.nome)}
                  />
                </span>
                <div className=" text-sm">
                  {team.time.nome}
                </div>
              </div>
              <span className="font-bold text-lg">
                {formatValue(team.value, statMapping.title)}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
})
TeamListItem.displayName = 'TeamListItem'

export const TeamStatsList: React.FC<TeamStatsListProps> = ({ players, times, statMapping }) => {
  const rankedTeams = useMemo(() => {
    const playersByTeam = new Map<number, Jogador[]>()
    for (const player of players) {
      if (!player.timeId) continue
      const list = playersByTeam.get(player.timeId)
      if (list) list.push(player)
      else playersByTeam.set(player.timeId, [player])
    }

    return times
      .map(time => ({
        time,
        value: time.id ? calculateTeamStat(playersByTeam.get(time.id) ?? [], statMapping) : null
      }))
      .filter((team): team is { time: Time; value: number } =>
        typeof team.value === 'number' && !isNaN(team.value) && team.value > 0
      )
      .sort((a, b) =>
        b.value === a.value ? a.time.nome.localeCompare(b.time.nome) : b.value - a.value
      )
  }, [players, times, statMapping])

  if (!rankedTeams.length) {
    return (
      <div className="bg-[#ECECEC] py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">{statMapping.category}</h1>
        <div className="max-w-2xl mx-auto px-4">
          <NoStats />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ECECEC] py-8 max-w-[1200px] mx-auto">
      <Link
        href={`/ranking/times`}
        className='fixed top-8 left-5 rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-black/40 z-50 xl:left-96 2xl:left-[650px]'
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </Link>
      <div className="">
        {rankedTeams.map((team, index) => (
          <TeamListItem key={`team-list-${team.time.id}`} team={team} index={index} statMapping={statMapping} />
        ))}
      </div>
    </div>
  )
}