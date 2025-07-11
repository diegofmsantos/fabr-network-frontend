import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { JogadoresService } from '@/services/jogadores.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'
import { Jogador } from '@/types'


export function useJogadores(temporada: string = '2025') {
  return useQuery({
    queryKey: queryKeys.jogadores.list(temporada),
    queryFn: () => JogadoresService.getJogadores(temporada),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useJogador(id: number) {
  return useQuery({
    queryKey: queryKeys.jogadores.detail(id),
    queryFn: () => JogadoresService.getJogador(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })
}

export function useCreateJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (data: Omit<Jogador, 'id'>) => JogadoresService.createJogador(data),
    onSuccess: (newJogador) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogadores.lists()
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.times.lists()
      })

      queryClient.setQueryData(queryKeys.jogadores.detail(newJogador.id), newJogador)

      notifications.success('Jogador criado!', `${newJogador.nome} foi criado com sucesso`)
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar jogador', error.message || 'Tente novamente')
    },
  })
}

export function useUpdateJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Jogador> }) =>
      JogadoresService.updateJogador(id, data),
    onSuccess: (updatedJogador, { id }) => {
      queryClient.setQueryData(queryKeys.jogadores.detail(id), updatedJogador)

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

export function useDeleteJogador() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: JogadoresService.deleteJogador,
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.jogadores.detail(id)
      })

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

export interface JogoJogador {
  id: number
  jogoId: number
  temporada: string
  estatisticas: any

  // Dados do jogo
  jogo: {
    id: number
    dataJogo: string
    status: string
    placarCasa?: number
    placarVisitante?: number
    rodada: number
    fase: string
    local?: string
    timeCasa: {
      id: number
      nome: string
      sigla: string
      cor: string
      logo: string
    }
    timeVisitante: {
      id: number
      nome: string
      sigla: string
      cor: string
      logo: string
    }
  }
}

export function useJogosJogador(jogadorId: number, temporada: string) {
  return useQuery({
    queryKey: ['jogos-jogador', jogadorId, temporada],
    queryFn: () => {
      console.log(`🔍 [HOOK] Chamando service para jogador ${jogadorId}`)
      return JogadoresService.getEstatisticasJogo(jogadorId, temporada)
    },
    enabled: !!jogadorId && !!temporada,
    staleTime: 1000 * 60 * 5,
  })
}