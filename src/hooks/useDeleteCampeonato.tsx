// src/hooks/useDeleteCampeonato.ts
"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { campeonatoQueryKeys } from './useCampeonatos'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function useDeleteCampeonato() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (campeonatoId: number): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/campeonatos/campeonatos/${campeonatoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        if (response.status === 404) {
          throw new Error('Campeonato não encontrado')
        }
        
        if (response.status === 409) {
          throw new Error('Não é possível excluir este campeonato pois possui jogos ou dados relacionados')
        }
        
        if (response.status === 403) {
          throw new Error('Você não tem permissão para excluir este campeonato')
        }
        
        throw new Error(errorData.message || 'Erro ao excluir campeonato')
      }

      // Se a resposta não for vazia, tenta fazer parse
      if (response.headers.get('content-length') !== '0') {
        try {
          return await response.json()
        } catch {
          // Se não conseguir fazer parse, retorna void
          return
        }
      }
    },
    
    onSuccess: (_, campeonatoId) => {
      // Invalidar todas as queries relacionadas a campeonatos
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      
      // Remover o campeonato específico do cache
      queryClient.removeQueries({ queryKey: campeonatoQueryKeys.detail(campeonatoId) })
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      queryClient.invalidateQueries({ queryKey: ['campeonatos'] })
      
      // Limpar dados relacionados ao campeonato excluído
      queryClient.removeQueries({ 
        queryKey: campeonatoQueryKeys.jogos({ campeonatoId }) 
      })
      queryClient.removeQueries({ 
        queryKey: campeonatoQueryKeys.classificacao(campeonatoId) 
      })
      queryClient.removeQueries({ 
        queryKey: campeonatoQueryKeys.proximosJogos(campeonatoId) 
      })
      queryClient.removeQueries({ 
        queryKey: campeonatoQueryKeys.ultimosResultados(campeonatoId) 
      })
    },
    
    onError: (error) => {
      console.error('Erro ao excluir campeonato:', error)
      
      // Aqui você pode adicionar notificações de erro
      // Por exemplo, usando uma biblioteca de toast
      // toast.error(error.message)
    }
  })
}

// Hook auxiliar para deletar múltiplos campeonatos
export function useBulkDeleteCampeonatos() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (campeonatoIds: number[]): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/admin/campeonatos/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: campeonatoIds })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Erro ao excluir campeonatos')
      }

      return response.json()
    },
    
    onSuccess: (_, campeonatoIds) => {
      // Invalidar todas as queries relacionadas
      queryClient.invalidateQueries({ queryKey: campeonatoQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      
      // Remover cada campeonato do cache
      campeonatoIds.forEach(id => {
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.detail(id) })
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.jogos({ campeonatoId: id }) })
        queryClient.removeQueries({ queryKey: campeonatoQueryKeys.classificacao(id) })
      })
    }
  })
}