// components/SelectFilter.tsx
import React, { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Option {
  label: string;
  value: string;
}

interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  urlParam?: string;
}

export function SelectFilter({
  label,
  value,
  onChange,
  options,
  className = '',
  urlParam = 'temporada'
}: SelectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Atualiza o estado local quando o parâmetro da URL muda
  useEffect(() => {
    const paramValue = searchParams?.get(urlParam);
    if (paramValue && paramValue !== value && options.some(opt => opt.value === paramValue)) {
      onChange(paramValue);
    }
  }, [searchParams, urlParam, value, onChange, options]);

  const handleChange = (newValue: string) => {
    // Atualiza o estado local
    onChange(newValue);
    
    // Atualiza a URL
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set(urlParam, newValue);
    
    // Mantém todos os outros parâmetros existentes
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <label className="text-xs font-medium mb-1 text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md 
                   focus:ring-blue-500 focus:border-blue-500 block px-4 py-2 w-40 text-center"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}