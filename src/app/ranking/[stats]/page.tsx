"use client"

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loading } from '@/components/ui/Loading'
import { getStatMapping } from '@/utils/constants/statMappings'
import { statGroups } from '@/utils/statGroups'
import { StatsLayout } from '@/components/Stats/StatsLayout'
import { useStats } from '@/hooks/useStats'
import { useTeamInfo } from '@/hooks/useTeamInfo'
import { PlayerStatsList } from '@/components/Stats/PlayerStatsList'
import { useTemporada } from '@/hooks/queries'

const getStatGroup = (statParam: string): string => {
    for (const group of statGroups) {
        if (group.stats.some((stat: any) => stat.urlParam === statParam)) {
            return group.title
        }
    }
    return 'Passando'
}

const PlayerStatSelect = React.memo(({ currentStat }: { currentStat: string }) => {
    const router = useRouter()
    const currentGroup = getStatGroup(currentStat)

    const handleStatChange = (newStat: string) => {
        router.push(`/ranking/stats?stat=${newStat}`)
    }

    return (
        <div className="mb-6 mx-4">
            <h1 className="text-4xl font-extrabold italic mb-4 text-center uppercase">{currentGroup}</h1>
            <select
                value={currentStat}
                onChange={(e) => handleStatChange(e.target.value)}
                className="w-full p-2 rounded-md border border-black bg-white"
            >
                {statGroups.map((group) => (
                    <optgroup key={group.groupLabel} label={group.title}>
                        {group.stats.map((stat: any) => (
                            <option key={stat.urlParam} value={stat.urlParam}>
                                {stat.title}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    )
})

PlayerStatSelect.displayName = 'PlayerStatSelect'

function PlayerStatsContent() {
    const searchParams = useSearchParams()
    const statParam = searchParams.get('stat') || 'passe-jardas'
    const temporada = useTemporada()
    const { players, times, loading } = useStats(temporada)
    const getTeamInfo = useTeamInfo(times)
    const statMapping = getStatMapping(statParam)

    if (loading) {
        return <Loading />
    }

    return (
        <Suspense fallback={<Loading />}>
            <div>
                <PlayerStatSelect currentStat={statParam} />
                <PlayerStatsList
                    players={players}
                    times={times}
                    statMapping={statMapping}
                />
            </div>
        </Suspense>
    );
}

export default function PlayerStatsPage() {
    const searchParams = useSearchParams();
    const statParam = searchParams.get('stat') || '';

    return (
        <Suspense fallback={<Loading />}>
            <StatsLayout initialFilter="jogadores" statType={statParam}>
                <div className="bg-[#ECECEC] min-h-screen pt-7 pb-14 px-2 lg:max-w-[800px] lg:min-w-[800px] lg:m-auto">
                    <PlayerStatsContent />
                </div>
            </StatsLayout>
        </Suspense>
    )
}