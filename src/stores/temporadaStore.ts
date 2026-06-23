/**
 * temporadaStore.ts — atualizado para D1/D2
 * Substitui: src/stores/temporadaStore.ts (frontend de exibição)
 *
 * MUDANÇAS:
 *  - Adiciona campo `divisao: 'D1' | 'D2'`
 *  - `liga` é a combinação display (ex: 'D1 — 2026')
 *  - Padrão: D1 / 2026
 *  - LIGAS_DISPONIVEIS define as combinações válidas
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Temporada } from '@/types'

export type Divisao = 'D1' | 'D2'

export interface Liga {
  divisao: Divisao
  temporada: Temporada
  label: string  // ex: "D1 — 2026"
}

export const LIGAS_DISPONIVEIS: Liga[] = [
  { divisao: 'D1', temporada: '2026', label: 'D1 — 2026' },
  { divisao: 'D2', temporada: '2026', label: 'D2 — 2026' },
  { divisao: 'D1', temporada: '2025', label: 'D1 — 2025' },
]

export const LIGA_PADRAO: Liga = LIGAS_DISPONIVEIS[0] // D1 2026

// Manter retrocompatibilidade: TEMPORADAS_DISPONIVEIS usado em outros componentes
export const TEMPORADAS_DISPONIVEIS: Temporada[] = ['2025', '2026']
export const TEMPORADA_PADRAO: Temporada = '2026'

interface TemporadaState {
  temporada: Temporada
  divisao: Divisao
  hasHydrated: boolean
  setTemporada: (temporada: Temporada) => void
  setDivisao: (divisao: Divisao) => void
  setLiga: (liga: Liga) => void
  setHasHydrated: (value: boolean) => void
}

export const useTemporadaStore = create<TemporadaState>()(
  persist(
    (set) => ({
      temporada: LIGA_PADRAO.temporada,
      divisao: LIGA_PADRAO.divisao,
      hasHydrated: false,

      setTemporada: (temporada) => {
        if (!TEMPORADAS_DISPONIVEIS.includes(temporada)) {
          console.warn(`Temporada inválida ignorada: ${temporada}`)
          return
        }
        set({ temporada })
      },

      setDivisao: (divisao) => set({ divisao }),

      setLiga: ({ temporada, divisao }) => {
        const valida = LIGAS_DISPONIVEIS.some(l => l.temporada === temporada && l.divisao === divisao)
        if (!valida) {
          console.warn(`Liga inválida: ${divisao} ${temporada}`)
          return
        }
        set({ temporada, divisao })
      },

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'fabr-liga',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)