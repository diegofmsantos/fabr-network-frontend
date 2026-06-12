import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Temporada } from '@/types'

export const TEMPORADAS_DISPONIVEIS: Temporada[] = ['2025', '2026']
export const TEMPORADA_PADRAO: Temporada = '2026'

interface TemporadaState {
  temporada: Temporada
  hasHydrated: boolean
  setTemporada: (temporada: Temporada) => void
  setHasHydrated: (value: boolean) => void
}

export const useTemporadaStore = create<TemporadaState>()(
  persist(
    (set) => ({
      temporada: TEMPORADA_PADRAO,
      hasHydrated: false,
      setTemporada: (temporada) => {
        if (!TEMPORADAS_DISPONIVEIS.includes(temporada)) {
          console.warn(`Temporada inválida ignorada: ${temporada}`)
          return
        }
        set({ temporada })
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'fabr-temporada',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)