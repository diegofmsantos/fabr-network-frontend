"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RankingFilters } from '../ui/FilterButton'
import { useJogadores } from '@/hooks/useJogadores'
import { useTimes } from '@/hooks/useTimes'

interface RankingLayoutProps {
    children: React.ReactNode
    initialFilter: 'jogadores' | 'times'
}

export function RankingLayout({ children, initialFilter }: RankingLayoutProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [season, setSeason] = useState(searchParams.get('temporada') || '2025')

    const { data: jogadores, refetch: refetchJogadores } = useJogadores(season)
    const { data: times, refetch: refetchTimes } = useTimes(season)

    useEffect(() => {
        refetchJogadores()
        refetchTimes()
    }, [season, refetchJogadores, refetchTimes])

    const handleFilterChange = (filter: 'jogadores' | 'times') => {
        if (filter === 'jogadores') {
            router.push('/ranking')
        } else {
            router.push('/ranking/times')
        }
    }

    const handleSeasonChange = (newSeason: string) => {
        setSeason(newSeason)
        const currentPath = window.location.pathname
        router.push(`${currentPath}?temporada=${newSeason}`)
    }

    return (
        <div className="min-h-screen max-w-[1100px] mx-auto bg-[#ECECEC] 2xl:max-w-[1200px]">
            <div className="w-full pt-20 xl:pt-0 xl:ml-32 2xl:ml-40">
                <div className=''>
                    <RankingFilters
                        currentFilter={initialFilter}
                        onFilterChange={handleFilterChange}
                    />
                </div>
             
                {children}
            </div>
        </div>
    )
}