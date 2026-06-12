"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useTemporadaStore, TEMPORADAS_DISPONIVEIS } from '@/stores/temporadaStore'
import type { Temporada } from '@/types'

interface Props {
  className?: string
}

export function TemporadaSelector({ className = '' }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const temporada = useTemporadaStore((s) => s.temporada)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
  const setTemporada = useTemporadaStore((s) => s.setTemporada)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nova = e.target.value as Temporada
    setTemporada(nova)

    if (pathname?.startsWith('/tabela/')) {
      const partes = pathname.split('/')

      if (partes.length >= 3) {
        partes[2] = nova
        router.push(partes.join('/'))
      }
    }
  }

  const valor = hasHydrated ? temporada : TEMPORADAS_DISPONIVEIS[0]

  return (
    <select
      aria-label="Selecionar temporada"
      value={valor}
      onChange={handleChange}
      className={`bg-[#373740] text-white text-sm font-bold italic rounded-md px-3 py-1.5 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#63E300] cursor-pointer ${className}`}
    >
      {TEMPORADAS_DISPONIVEIS.map((t) => (
        <option key={t} value={t}>
          Temporada {t}
        </option>
      ))}
    </select>
  )
}