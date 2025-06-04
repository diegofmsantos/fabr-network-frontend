"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Campeonato, Jogo, ClassificacaoGrupo, FiltroJogos, CriarCampeonatoRequest } from '@/types/campeonato'
import { useNotifications } from '@/hooks/useNotifications'
import { handleApiError } from '@/utils/errorHandler'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Query Keys
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

// Hook para listar campeonatos
export function useCampeonatos(filters?: { temporada?: string; tipo?: string; status?: string }) {
  return useQuery({
    queryKey: campeonatoQueryKeys.list(filters || {}),
    queryFn: async (): Promise<Campeonato[]> => {
      const params = new URLSearchParams()
      if (filters?.temporada) params.append('temporada', filters.temporada)
      if (filters?.tipo) params.append('tipo', filters.tipo)
      if (filters?.status) params.append('status', filters.status)

      const url = `${API_BASE_URL}/campeonatos/campeonatos${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar campeonatos')
      }
      
      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para buscar campeonato específico
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

// Hook para listar jogos
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
    staleTime: 1000 * 60 * 2, // 2 minutos (jogos mudam mais frequentemente)
  })
}

// Hook para buscar jogo específico
export function useJogo(id: number) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'jogo', id],
    queryFn: async (): Promise<Jogo> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Jogo não encontrado')
        }
        throw new Error('Erro ao buscar jogo')
      }
      
      return response.json()
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  })
}

// Hook para classificação do campeonato
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

// Hook para classificação de grupo específico
export function useClassificacaoGrupo(grupoId: number) {
  return useQuery({
    queryKey: [...campeonatoQueryKeys.all, 'classificacao-grupo', grupoId],
    queryFn: async (): Promise<ClassificacaoGrupo[]> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/classificacao/grupo/${grupoId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar classificação do grupo')
      }
      
      return response.json()
    },
    enabled: !!grupoId,
    staleTime: 1000 * 60 * 5,
  })
}

// Hook para próximos jogos
export function useProximosJogos(campeonatoId: number, limit = 10) {
  return useQuery({
    queryKey: campeonatoQueryKeys.proximosJogos(campeonatoId),
    queryFn: async (): Promise<Jogo[]> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}/proximos-jogos?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar próximos jogos')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
  })
}

// Hook para últimos resultados
export function useUltimosResultados(campeonatoId: number, limit = 10) {
  return useQuery({
    queryKey: campeonatoQueryKeys.ultimosResultados(campeonatoId),
    queryFn: async (): Promise<Jogo[]> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}/ultimos-resultados?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar últimos resultados')
      }
      
      return response.json()
    },
    enabled: !!campeonatoId,
    staleTime: 1000 * 60 * 5,
  })
}

// Mutations para operações de escrita
export function useCreateCampeonato() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: async (data: CriarCampeonatoRequest): Promise<Campeonato> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw handleApiError({ response, message: error.message })
      }

      return response.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      notifications.success(
        'Campeonato criado!', 
        `${data.nome} foi criado com sucesso`
      )
    },
    onError: (error) => {
      notifications.error(
        'Erro ao criar campeonato', 
        error.message || 'Tente novamente'
      )
    },
  })
}

export function useUpdateJogo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Jogo> }): Promise<Jogo> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/jogos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar jogo')
      }

      return response.json()
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.classificacao(data.campeonatoId) })
      queryClient.invalidateQueries({ queryKey: [...campeonatoQueryKeys.all, 'jogo', data.id] })
    },
  })
}

export function useGerarJogos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (campeonatoId: number) => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}/gerar-jogos`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar jogos')
      }

      return response.json()
    },
    onSuccess: (_, campeonatoId) => {
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.detail(campeonatoId) })
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.jogos({}) })
    },
  })
}