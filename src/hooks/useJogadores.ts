// src/hooks/useJogadores.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { JogadoresService } from '@/services/jogadores.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Jogador } from '@/types'

// Hook para buscar jogadores
export function useJogadores(temporada: string = '2025') {
  return useQuery({
    queryKey: queryKeys.jogadores.list({ temporada }),
    queryFn: () => JogadoresService.getJogadores(temporada),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

// Hook para buscar um jogador específico
export function useJogador(id: number) {
  return useQuery({
    queryKey: queryKeys.jogadores.detail(id),
    queryFn: () => JogadoresService.getJogador(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

// Hook para criar jogador
export function useCreateJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: Omit<Jogador, 'id'>) => JogadoresService.createJogador(data),
    onSuccess: (newJogador) => {
      // Invalidar lista de jogadores
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      
      // Invalidar times (jogador está associado a um time)
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.lists() 
      })
      
      // Adicionar ao cache
      queryClient.setQueryData(queryKeys.jogadores.detail(newJogador.id), newJogador)
      
      notifications.success('Jogador criado!', `${newJogador.nome} foi criado com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar jogador', error.message || 'Tente novamente')
    },
  })
}

// Hook para atualizar jogador
export function useUpdateJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Jogador> }) =>
      JogadoresService.updateJogador(id, data),
    onSuccess: (updatedJogador, { id }) => {
      // Atualizar cache específico
      queryClient.setQueryData(queryKeys.jogadores.detail(id), updatedJogador)
      
      // Invalidar listas
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.lists() 
      })
      
      notifications.success('Jogador atualizado!', `${updatedJogador.nome} foi atualizado`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar jogador', error.message)
    },
  })
}

// Hook para deletar jogador
export function useDeleteJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: JogadoresService.deleteJogador,
    onSuccess: (_, id) => {
      // Remover do cache
      queryClient.removeQueries({ 
        queryKey: queryKeys.jogadores.detail(id) 
      })
      
      // Invalidar listas
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.jogadores.lists() 
      })
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.times.lists() 
      })
      
      notifications.success('Jogador removido!', 'Jogador foi excluído com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover jogador', error.message)
    },
  })
}