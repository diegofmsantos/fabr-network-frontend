import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FilterButtonProps {
    isSelected: boolean;
    onClick: () => void;
    icon: 'camisa-padrao.png' | 'capacete-padrao.png';
    label: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
    isSelected,
    onClick,
    icon,
    label
}) => {
    return (
        <button
            onClick={onClick}
            className={`relative w-full h-60 flex flex-col items-center p-4 rounded-b-2xl  transition-colors ${isSelected ? 'bg-[#72FF30]' : 'bg-[#A2A3A1]'}`}
        >
            <div className='w-28 h-40'>
                <Image
                    src={`/assets/${icon}`}
                    alt={label}
                    width={40}
                    height={60}
                    quality={100}
                    className='w-auto h-auto'
                    priority
                />
            </div>
            <span className="text-2xl font-bold uppercase">{label}</span>
        </button>
    );
};

interface RankingFiltersProps {
    currentFilter: 'jogadores' | 'times';
    onFilterChange: (filter: 'jogadores' | 'times') => void;
}

export const RankingFilters: React.FC<RankingFiltersProps> = ({
    currentFilter,
    onFilterChange,
}) => {
    return (
        <div className="flex justify-center items-center">
            <Link href="/ranking" className='flex-1'>
                <FilterButton
                    isSelected={currentFilter === 'jogadores'}
                    onClick={() => onFilterChange('jogadores')}
                    icon="camisa-padrao.png"
                    label="Jogadores"
                />
            </Link>
            <Link href="/ranking/times" className='flex-1'>
                <FilterButton
                    isSelected={currentFilter === 'times'}
                    onClick={() => onFilterChange('times')}
                    icon="capacete-padrao.png"
                    label="Times"
                />
            </Link>
        </div>
    );
};