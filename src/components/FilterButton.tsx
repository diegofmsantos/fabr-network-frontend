import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface FilterButtonProps {
    isSelected: boolean;
    onClick: () => void;
    label: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
    isSelected,
    onClick,
    label
}) => {
    return (
        <button
            onClick={onClick}
            className={`relative w-full h-12 flex justify-center shadow items-center p-4 rounded-b-3xl transition-colors ${isSelected ? 'bg-[#63E300]' : 'bg-[#A2A3A1] text-gray-600'}`}
        >
            <span className="text-[28px] font-extrabold italic uppercase tracking-[-3px]">{label}</span>
        </button>
    );
};

interface RankingFiltersProps {
    currentFilter: 'jogadores' | 'times';
    onFilterChange: (filter: 'jogadores' | 'times') => void;
    isStatsPage?: boolean; // Nova prop para identificar se está na página de stats
}

export const RankingFilters: React.FC<RankingFiltersProps> = ({
    currentFilter,
    onFilterChange,
    isStatsPage = false
}) => {
    const searchParams = useSearchParams();
    const statParam = searchParams.get('stat');

    // Define as URLs baseado em se está na página de stats ou ranking
    const jogadoresUrl = isStatsPage
        ? `/ranking/stats?stat=${statParam}`
        : "/ranking";
    const timesUrl = isStatsPage
        ? `/ranking/times/stats?stat=${statParam}`
        : "/ranking/times";

    return (
        <div className="flex justify-center items-center">
            <Link href={jogadoresUrl} className='flex-1'>
                <FilterButton
                    isSelected={currentFilter === 'jogadores'}
                    onClick={() => onFilterChange('jogadores')}
                    label="Jogadores"
                />
            </Link>
            <Link href={timesUrl} className='flex-1'>
                <FilterButton
                    isSelected={currentFilter === 'times'}
                    onClick={() => onFilterChange('times')}
                    label="Times"
                />
            </Link>
        </div>
    );
};