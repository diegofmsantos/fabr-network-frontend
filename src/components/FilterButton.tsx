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
            className={`relative w-full h-12 flex justify-center shadow items-center p-4 rounded-b-2xl  transition-colors ${isSelected ? 'bg-[#72FF30]' : 'bg-[#A2A3A1] text-gray-600'}`}
        >
            <span className="text-[28px] font-extrabold italic uppercase">{label}</span>
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