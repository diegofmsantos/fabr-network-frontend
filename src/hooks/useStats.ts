import { useTimes } from '@/hooks/useTimes'
import { useJogadores } from '@/hooks/useJogadores'

export const useStats = (temporada: string = '2025') => {
  const { data: times = [], isLoading: timesLoading, error: timesError } = useTimes(temporada)
  const { data: players = [], isLoading: playersLoading, error: playersError } = useJogadores(temporada)
  
  const loading = timesLoading || playersLoading
  
  const error = timesError || playersError

  return { players, times, loading, error }
}