"use client"

import { useQuery } from '@tanstack/react-query'
import { Campeonato, Jogo, ClassificacaoGrupo, FiltroJogos } from '@/types/campeonato'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const campeonatoQueryKeys = {
  all: ['campeonatos'] as const,
  lists: () => [...campeonatoQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...campeonatoQueryKeys.lists(), filters] as const,
  details: () => [...campeonatoQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...campeonatoQueryKeys.details(), id] as const,
  jogos: (filters: FiltroJogos) => [...campeonatoQueryKeys.all, 'jogos', filters] as const,
  classificacao: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'classificacao', campeonatoId] as const,
  proximosJogos: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'proximos', campeonatoId] as const,
  ultimosResultados: (campeonatoId: number) => [...campeonatoQueryKeys.all, 'resultados', campeonatoId] as const,
}

export function useCampeonatos(filters?: { temporada?: string; tipo?: string; status?: string }) {
  return useQuery({
    queryKey: campeonatoQueryKeys.list(filters || {}),
    queryFn: async (): Promise<Campeonato[]> => {
      const params = new URLSearchParams()
      if (filters?.temporada) params.append('temporada', filters.temporada)
      if (filters?.tipo) params.append('tipo', filters.tipo)
      if (filters?.status) params.append('status', filters.status)
    
      const url = `${API_BASE_URL}/campeonatos/campeonatos${params.toString() ? `?${params.toString()}` : ''}`
      
      console.log('🔍 URL corrigida:', url) // Para debug
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar campeonatos')
      }
      
      return response.json()
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useCampeonato(id: number) {
  return useQuery({
    queryKey: campeonatoQueryKeys.detail(id),
    queryFn: async (): Promise<Campeonato> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Campeonato não encontrado')
        }
        throw new Error('Erro ao buscar campeonato')
      }
      
      return response.json()
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

export function useJogo(jogoId: number) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'jogo', jogoId] as const,
    queryFn: async (): Promise<Jogo> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos/${jogoId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Jogo não encontrado')
        }
        throw new Error('Erro ao buscar jogo')
      }
      
      return response.json()
    },
    enabled: !!jogoId,
    staleTime: 1000 * 60 * 2, 
  })
}

export function useJogos(filters: FiltroJogos) {
  return useQuery({
    queryKey: campeonatoQueryKeys.jogos(filters),
    queryFn: async (): Promise<Jogo[]> => {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })

      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jogos')
      }
      
      return response.json()
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useProximosJogos(campeonatoId: number, limit: number = 10) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.proximosJogos(campeonatoId), limit] as const,
    queryFn: async (): Promise<Jogo[]> => {
      const response = await fetch(
        `${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}/proximos-jogos?limit=${limit}`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar próximos jogos')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5, 
  })
}

export function useUltimosResultados(campeonatoId: number, limit: number = 10) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.ultimosResultados(campeonatoId), limit] as const,
    queryFn: async (): Promise<Jogo[]> => {
      const response = await fetch(
        `${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}/ultimos-resultados?limit=${limit}`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar últimos resultados')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5, 
  })
}

export function useClassificacao(campeonatoId: number) {
  return useQuery({
    queryKey: campeonatoQueryKeys.classificacao(campeonatoId),
    queryFn: async (): Promise<ClassificacaoGrupo[]> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/classificacao/campeonato/${campeonatoId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar classificação')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useJogosTime(timeId: number, campeonatoId?: number, limit: number = 20) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'jogos-time', timeId, campeonatoId, limit] as const,
    queryFn: async (): Promise<Jogo[]> => {
      const params = new URLSearchParams()
      params.append('timeId', String(timeId))
      params.append('limit', String(limit))
      
      if (campeonatoId) {
        params.append('campeonatoId', String(campeonatoId))
      }

      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jogos do time')
      }
      
      return response.json()
    },
    enabled: !!timeId,
    staleTime: 1000 * 60 * 3, // 3 minutos
  })
}

// Hook para jogos de uma rodada específica
export function useJogosRodada(campeonatoId: number, rodada: number) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'rodada', campeonatoId, rodada] as const,
    queryFn: async (): Promise<Jogo[]> => {
      const response = await fetch(
        `${API_BASE_URL}/campeonatos/jogos?campeonatoId=${campeonatoId}&rodada=${rodada}`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar jogos da rodada')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId && !!rodada,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para classificação de um grupo específico
export function useClassificacaoGrupo(grupoId: number) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'classificacao-grupo', grupoId] as const,
    queryFn: async (): Promise<ClassificacaoGrupo[]> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/classificacao/grupo/${grupoId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar classificação do grupo')
      }
      
      return response.json()
    },
    enabled: !!grupoId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}