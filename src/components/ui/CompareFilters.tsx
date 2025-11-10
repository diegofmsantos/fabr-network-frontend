import React from 'react'
import Link from 'next/link'
import { FilterButton } from './FilterButton'

interface CompareFiltersProps {
    currentFilter: 'jogadores' | 'times'
    onFilterChange: (filter: 'jogadores' | 'times') => void
}

export const CompareFilters: React.FC<CompareFiltersProps> = ({ 
    currentFilter, 
    onFilterChange 
}) => {
    return (
        <div className="w-full flex justify-around pt-24 xl:mt-6 xl:hidden">
            <Link href="/compare/jogadores" className=''>
                <FilterButton 
                    isSelected={currentFilter === 'jogadores'} 
                    onClick={() => onFilterChange('jogadores')} 
                    label="Jogadores" 
                />
            </Link>
            <Link href="/compare/times" className=''>
                <FilterButton 
                    isSelected={currentFilter === 'times'} 
                    onClick={() => onFilterChange('times')} 
                    label="Times" 
                />
            </Link>
        </div>
    )
}