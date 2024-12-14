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
            className={`relative flex flex-col items-center justify-center rounded-2xl p-12 transition-colors ${isSelected ? 'bg-[#72FF30]' : 'bg-[#A2A3A1]'
                }`}
            style={{
                width: '200px',
                height: '200px'
            }}
        >
            <Image
                src={`/assets/${icon}`}
                alt={label}
                width={120}
                height={120}
                className="object-contain"
            />
            <span className="text-2xl font-bold uppercase">{label}</span>
        </button>
    );
};

interface RankingFiltersProps {
    currentFilter: 'jogadores' | 'times';
    onFilterChange: (filter: 'jogadores' | 'times') => void;
    season: string;
    onSeasonChange: (season: string) => void;
}

export const RankingFilters: React.FC<RankingFiltersProps> = ({
    currentFilter,
    onFilterChange,
    season,
    onSeasonChange
}) => {
    return (
        <div className="w-full flex flex-col items-center gap-8">
            <select
                value={season}
                onChange={(e) => onSeasonChange(e.target.value)}
                className="w-full max-w-[200px] p-2 rounded-md text-center font-bold"
            >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
            </select>

            <div className="flex">
                <Link href="/ranking">
                    <FilterButton
                        isSelected={currentFilter === 'jogadores'}
                        onClick={() => onFilterChange('jogadores')}
                        icon="camisa-padrao.png"
                        label="Jogadores"
                    />
                </Link>
                <Link href="/ranking/times">
                    <FilterButton
                        isSelected={currentFilter === 'times'}
                        onClick={() => onFilterChange('times')}
                        icon="capacete-padrao.png"
                        label="Times"
                    />
                </Link>
            </div>
        </div>
    );
};