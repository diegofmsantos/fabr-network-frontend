"use client"

import { useRouter } from 'next/navigation'
import { RankingFilters } from '../ui/FilterButton'

interface RankingLayoutProps {
    children: React.ReactNode
    initialFilter: 'jogadores' | 'times'
}

export function RankingLayout({ children, initialFilter }: RankingLayoutProps) {
    const router = useRouter()
    const handleFilterChange = (filter: 'jogadores' | 'times') => {
        if (filter === 'jogadores') {
            router.push('/ranking')
        } else {
            router.push('/ranking/times')
        }
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