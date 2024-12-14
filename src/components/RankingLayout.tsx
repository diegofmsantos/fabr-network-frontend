// src/components/RankingLayout.tsx
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RankingFilters } from './FilterButton';
import { SelectFilter } from './SelectFilter';

interface RankingLayoutProps {
    children: React.ReactNode;
    initialFilter: 'jogadores' | 'times';
}

export function RankingLayout({ children, initialFilter }: RankingLayoutProps) {
    const router = useRouter();
    const [season, setSeason] = useState('2024');

    const handleFilterChange = (filter: 'jogadores' | 'times') => {
        if (filter === 'jogadores') {
            router.push('/ranking');
        } else {
            router.push('/ranking/times');
        }
    };

    const handleSeasonChange = (newSeason: string) => {
        setSeason(newSeason);
        // Aqui você pode adicionar lógica adicional quando a temporada mudar
    };

    return (
        <div className="min-h-screen w-full bg-[#ECECEC]">
            <div className="w-full container mx-auto pt-1">
                <RankingFilters
                    currentFilter={initialFilter}
                    onFilterChange={handleFilterChange}
                    season={season}
                    onSeasonChange={handleSeasonChange}
                />
                <div className="flex justify-center items-center gap-4 my-8 -ml-4">
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
    );
}