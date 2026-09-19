import React, { useMemo } from 'react'
import Slider from 'react-slick'
import { useTimes } from '@/hooks/useTimes'
import { RankingCard } from './RankingCard'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { NoStats } from '../ui/NoStats'
import { calculateStat, compareValues, shouldIncludePlayer } from '@/utils/services/StatsServices'
import { normalizeValue } from '@/utils/helpers/formatUrl'
import { ImageService } from '@/utils/services/ImageService'
import { Jogador, StatKey } from '@/types'

interface RankingGroupProps {
  title: string;
  stats: { key: StatKey; title: string }[]
  players: Jogador[]
  temporada: string
}

const SLIDER_SETTINGS = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1.2,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1.5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1.2,
        slidesToScroll: 1,
      },
    },
  ],
}

export const RankingGroup: React.FC<RankingGroupProps> = ({ title, stats, players, temporada }) => {
  const { data: times = [], isLoading } = useTimes(temporada)

  const teamsById = useMemo(() => new Map(times.map((t) => [t.id, t])), [times])

  const getTeamInfo = (timeId: number) => {
    const team = teamsById.get(timeId)
    return {
      nome: team?.nome || 'time-desconhecido',
      cor: team?.cor || '#000000',
    }
  }

  const rankings = useMemo(
    () =>
      stats.map((stat) => ({
        stat,
        top: players
          .filter((player) => shouldIncludePlayer(player, stat.key, title))
          .map((player) => ({ player, value: calculateStat(player, stat.key) }))
          .sort((a, b) => compareValues(a.value, b.value))
          .slice(0, 5),
      })),
    [stats, players, title]
  )

  const hasValidPlayers = rankings.some((r) => r.top.length > 0)

  if (isLoading) {
    return <div className="mb-6 pl-4 py-8">Carregando estatísticas...</div>;
  }

  if (!hasValidPlayers) {
    return (
      <div className="mb-6 pl-4 py-8">
        <h2 className="text-4xl pl-2 font-extrabold italic mb-4 leading-[30px] tracking-[-2px]">{title}</h2>
        <NoStats />
      </div>
    );
  }

  return (
    <div className="pl-4 pb-8 mb-10 overflow-x-hidden overflow-y-hidden mx-auto xl:px-12 xl:overflow-x xl:overflow-y">
      <h2 className="text-4xl mt-8 pl-2 font-extrabold italic mb-4 leading-[30px] tracking-[-2px] lg:pl-16 xl:pl-20">{title}</h2>
      <Slider {...SLIDER_SETTINGS}>
        {rankings.map(({ stat, top }, index) => {
          if (top.length === 0) {
            return (
              <div key={index}>
                <div className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
                  {stat.title}
                </div>
                <NoStats />
              </div>
            )
          }

          return (
            <div key={index}>
              <RankingCard
                title={stat.title}
                category={title}
                stat={stat.key}
                players={top.map(({ player, value: rawValue }, playerIndex) => {
                  const teamInfo = getTeamInfo(player.timeId ?? 0)
                  return {
                    id: player.id,
                    name: player.nome,
                    team: teamInfo.nome,
                    value: normalizeValue(rawValue, stat.key),
                    camisa: player.camisa || '', 
                    teamColor: playerIndex === 0 ? teamInfo.cor : undefined,
                    teamLogo: ImageService.getTeamLogo(teamInfo.nome),
                    isFirst: playerIndex === 0,
                  }
                })}
              />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}