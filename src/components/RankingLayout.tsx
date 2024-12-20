"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RankingFilters } from './FilterButton'
import { SelectFilter } from './SelectFilter'
interface RankingLayoutProps {
    children: React.ReactNode
    initialFilter: 'jogadores' | 'times'
}

export function RankingLayout({ children, initialFilter }: RankingLayoutProps) {
    const router = useRouter()
    const [season, setSeason] = useState('2024')

    const handleFilterChange = (filter: 'jogadores' | 'times') => {
        if (filter === 'jogadores') {
            router.push('/ranking')
        } else {
            router.push('/ranking/times')
        }
    }

    const handleSeasonChange = (newSeason: string) => {
        setSeason(newSeason)
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
                        onChange={setSeason}
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