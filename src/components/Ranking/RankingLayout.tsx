"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RankingFilters } from '../FilterButton'
import { SelectFilter } from '../SelectFilter'
import { useJogadores, useTimes } from '@/hooks/queries' // Importe os hooks necessários

interface RankingLayoutProps {
    children: React.ReactNode
    initialFilter: 'jogadores' | 'times'
}

export function RankingLayout({ children, initialFilter }: RankingLayoutProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [season, setSeason] = useState(searchParams.get('temporada') || '2024')

    // Use a temporada nos hooks de busca
    const { data: jogadores, refetch: refetchJogadores } = useJogadores(season)
    const { data: times, refetch: refetchTimes } = useTimes(season)

    // Efeito para refetch quando a temporada muda
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
        <div className="min-h-screen max-w-[1200px] mx-auto bg-[#ECECEC]">
            <div className="w-full pt-20">
                <RankingFilters
                    currentFilter={initialFilter}
                    onFilterChange={handleFilterChange}
                />
                <div className="w-full mt-8 flex justify-center">
                    <SelectFilter
                        label="TEMPORADA"
                        value={season}
                        onChange={handleSeasonChange}
                        options={[
                            { label: '2024', value: '2024' },
                            { label: '2025', value: '2025' }
                        ]}
                    />
                </div>
                {children}
            </div>
        </div>
    )
}