/**
 * TemporadaSelector.tsx — atualizado para D1/D2
 * Substitui: src/components/ui/TemporadaSelector.tsx (frontend de exibição)
 *
 * Agora exibe combinações "D1 — 2026", "D2 — 2026", "D1 — 2025".
 * Ao mudar, atualiza o store E navega para a URL correta se estiver na /tabela.
 */
"use client"

import { usePathname, useRouter } from 'next/navigation'
import { useTemporadaStore, LIGAS_DISPONIVEIS, type Liga } from '@/stores/temporadaStore'

interface Props {
  className?: string
}

export function TemporadaSelector({ className = '' }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const temporada = useTemporadaStore((s) => s.temporada)
  const divisao = useTemporadaStore((s) => s.divisao)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
  const setLiga = useTemporadaStore((s) => s.setLiga)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [div, temp] = e.target.value.split('|') as [string, string]
    const novaLiga: Liga = {
      divisao: div as 'D1' | 'D2',
      temporada: temp as '2025' | '2026',
      label: `${div} — ${temp}`
    }
    setLiga(novaLiga)

    // Se estiver numa rota da /tabela, navega para a URL correta
    if (pathname?.startsWith('/tabela/')) {
      const partes = pathname.split('/')
      // /tabela/[divisao]/[temporada]/[subrota...]
      // partes: ['', 'tabela', divisao, temporada, ...]
      if (partes.length >= 4) {
        partes[2] = div.toLowerCase()   // divisao
        partes[3] = temp                 // temporada
        router.push(partes.join('/'))
      }
    }
  }

  const valorAtual = hasHydrated ? `${divisao}|${temporada}` : `${LIGAS_DISPONIVEIS[0].divisao}|${LIGAS_DISPONIVEIS[0].temporada}`

  return (
    <select
      aria-label="Selecionar liga e temporada"
      value={valorAtual}
      onChange={handleChange}
      className={`bg-[#373740] text-white text-sm font-bold italic rounded-md px-3 py-1.5 border border-black focus:outline-none focus:ring-2 focus:ring-[#63E300] cursor-pointer ${className}`}
    >
      {LIGAS_DISPONIVEIS.map((liga) => (
        <option key={liga.label} value={`${liga.divisao}|${liga.temporada}`}>
          {liga.label}
        </option>
      ))}
    </select>
  )
}