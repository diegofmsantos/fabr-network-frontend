import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { NoStats } from '../ui/NoStats'
import { ImageService } from '@/utils/services/ImageService'
import { calculateStat, shouldIncludePlayer } from '@/utils/services/StatsServices'
import { Jogador, StatConfig, Time, StatKey } from '@/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'

interface PlayerStatsListProps {
  players: Jogador[]
  times: Time[]
  statMapping: StatConfig
}

interface RankedPlayer {
  player: Jogador
  time: {
    id: number
    nome: string
    cor?: string
  }
  value: number
}

export const PlayerStatsList: React.FC<PlayerStatsListProps> = ({ players, times, statMapping }) => {

  const getTeamInfo = (timeId: number) => {
    const team = times.find(t => t.id === timeId)
    return {
      id: team?.id || 0,
      nome: team?.nome || 'Time Desconhecido',
      cor: team?.cor || '#CCCCCC'
    }
  }

  const getTeamLogoPath = (teamName: string) => {
    return ImageService.getTeamLogo(teamName)
  }

const formatStatValue = (value: number | null): string => {
    if (value === null) return 'N/A'

    if (statMapping.key.includes('percentual') || statMapping.key === 'field_goals' || statMapping.key === 'extra_points') {
      return `${Math.round(value)}%`
    }

    if (statMapping.key.includes('media')) {
      return value.toFixed(1).replace('.', ',')
    }

    if (statMapping.key === 'sacks_forcado' || statMapping.key === 'tackles_for_loss' || statMapping.key === 'tackles_totais') {
      if (value % 1 !== 0) {
        return value.toFixed(1).replace('.', ',')
      }
      return value.toString()
    }

    return Math.round(value).toLocaleString('pt-BR')
}

  const rankedPlayers: RankedPlayer[] = players
    .filter(player => shouldIncludePlayer(player, statMapping.key as StatKey, statMapping.category))
    .map(player => {
      const statValue = calculateStat(player, statMapping.key as StatKey)
      const teamInfo = getTeamInfo(player.timeId || 0)

      return {
        player,
        time: teamInfo,
        value: typeof statValue === 'number' ? statValue : 0
      }
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  if (rankedPlayers.length === 0) {
    return <NoStats />
  }

  return (
    <div className="px-4">
      <Link
        href={`/ranking`}
        className='fixed top-8 left-5 rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-gray-400/40 z-50 xl:left-96 2xl:left-[650px]'
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </Link>
      <ul className="flex flex-col gap-2">
        {rankedPlayers.map((item, index) => {
          const { player, time, value } = item
          const teamLogoPath = getTeamLogoPath(time.nome)
          const isFirst = index === 0
          const formattedValue = formatStatValue(value)

          return (
            <li
              key={player.id}
              className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md ${isFirst ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"
                }`}
              style={{ backgroundColor: isFirst ? time.cor : undefined }}
            >
              <Link
                href={`/${ImageService.normalizeForFilePath(time.nome)}/${player.id}`}
                className="w-full"
              >
                {isFirst ? (
                  <div className="flex justify-between items-center w-full text-white min-[375px]:pl-4 md:justify-around md:pl-6">
                    <div className="flex flex-col justify-center">
                      <p className="text-[25px] font-bold">{index + 1}</p>
                      <h4 className="font-bold flex flex-col leading-tight md:mt-2">
                        <span className="text-[12px] font-extrabold italic uppercase leading-4 md:text-lg md:leading-5">
                          {player.nome.split(" ")[0]}
                        </span>
                        <span className="text-2xl font-extrabold italic uppercase leading-4 md:text-3xl md:leading-5">
                          {player.nome.split(" ").slice(1).join(" ")}
                        </span>
                      </h4>
                      <div className="flex items-center gap-1 min-w-32 max-[374px]:hidden md:mt-3">
                        <Image
                          src={teamLogoPath}
                          width={40}
                          height={40}
                          alt={`Logo do time ${time.nome}`}
                        />
                        <p className="text-[10px]">{time.nome}</p>
                      </div>
                      <span className="font-extrabold italic text-[40px] max-[374px]:mt-4">
                        {formattedValue}
                      </span>
                    </div>
                    <div className="relative w-[200px] h-[200px]">
                      <Image
                        src={ImageService.getPlayerShirt(time.nome, player.camisa || '')}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt={`Camisa do ${player.nome}`}
                        className="object-contain"
                        priority
                        quality={100}
                        loading="eager"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-auto flex justify-between items-center gap-2 min-[350px]:px-4 min-[425px]:px-7 md:justify-around">
                    <div className="flex items-center md:w-60">
                      <span className="font-bold flex items-center gap-2">
                        <div>{index + 1}</div>
                        <Image
                          src={teamLogoPath}
                          width={40}
                          height={40}
                          alt={`Logo do time ${time.nome}`}
                        />
                      </span>
                      <div className="flex flex-col">
                        <div className="font-bold text-[14px]">{player.nome}</div>
                        <div className="font-light text-[14px]">{time.nome}</div>
                      </div>
                    </div>
                    <span className="font-bold text-lg">{formattedValue}</span>
                  </div>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}