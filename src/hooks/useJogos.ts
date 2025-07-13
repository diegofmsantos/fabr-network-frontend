"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseService } from '@/services/base.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'

interface JogosFilters {
  temporada?: string
  campeonatoId?: number
  status?: string
  fase?: string
  rodada?: number
  conferencia?: string
  regional?: string
  timeId?: number
  limite?: number
}

interface Time {
  id: number
  nome: string
  sigla: string
  logo?: string
  cor?: string
  presidente?: string
  head_coach?: string
  estadio?: string
  cidade?: string
}

interface Campeonato {
  id: number
  nome: string
  temporada: string
  status: string
  isSuperliga?: boolean
}

interface EstatisticaJogo {
  id: number
  jogadorId: number
  timeId: number
  estatisticas: any
  temporada?: string
  rodada?: number
  fase?: string
  jogador: {
    id: number
    nome: string
    posicao: string
  }
  time: {
    id: number
    nome: string
    sigla: string
  }
}

export interface Jogo {
  id: number
  campeonatoId: number
  timeCasaId: number
  timeVisitanteId: number
  dataJogo: string
  local?: string
  rodada: number
  fase: string
  status: 'AGENDADO' | 'AO VIVO' | 'FINALIZADO' | 'ADIADO'
  placarCasa?: number
  placarVisitante?: number
  observacoes?: string
  estatisticasProcessadas: boolean

  conferencia?: string
  regional?: string
  temporada?: string
  createdAt?: string
  updatedAt?: string

  timeCasa: Time
  timeVisitante: Time
  campeonato: Campeonato
  estatisticas?: EstatisticaJogo[]
}


class JogosService extends BaseService {

  static async getJogos(filters?: JogosFilters): Promise<Jogo[]> {
    const service = new JogosService()

    if (filters?.temporada) {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.fase) params.append('fase', filters.fase)
      if (filters.rodada) params.append('rodada', filters.rodada.toString())
      if (filters.conferencia) params.append('conferencia', filters.conferencia)
      if (filters.regional) params.append('regional', filters.regional)
      if (filters.limite) params.append('limite', filters.limite.toString())

      const queryString = params.toString()
      const url = `/superliga/${filters.temporada}/jogos${queryString ? `?${queryString}` : ''}`

      return service.get<Jogo[]>(url)
    }

    if (filters?.campeonatoId) {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.fase) params.append('fase', filters.fase)
      if (filters.rodada) params.append('rodada', filters.rodada.toString())
      if (filters.timeId) params.append('timeId', filters.timeId.toString())
      if (filters.limite) params.append('limite', filters.limite.toString())

      const queryString = params.toString()
      const url = `/admin/campeonatos/${filters.campeonatoId}/jogos${queryString ? `?${queryString}` : ''}`

      return service.get<Jogo[]>(url)
    }

    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.fase) params.append('fase', filters.fase)
    if (filters?.rodada) params.append('rodada', filters.rodada.toString())
    if (filters?.timeId) params.append('timeId', filters.timeId.toString())
    if (filters?.limite) params.append('limite', filters.limite.toString())

    const queryString = params.toString()
    const url = `/admin/jogos${queryString ? `?${queryString}` : ''}`

    return service.get<Jogo[]>(url)
  }

  static async getJogo(id: number): Promise<Jogo> {
    const service = new JogosService()
    return service.get<Jogo>(`/admin/jogos/${id}`)
  }

  static async atualizarResultado(id: number, dados: {
    placarCasa: number
    placarVisitante: number
    status?: string
    observacoes?: string
  }): Promise<{ message: string; jogo: Jogo }> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}/resultado`, dados)
  }

  static async finalizarJogo(id: number): Promise<Jogo> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}/finalizar`, {})
  }

  static async adiarJogo(id: number, novaData?: string): Promise<Jogo> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}/adiar`, { novaData })
  }

  static async criarJogo(dados: Partial<Jogo>): Promise<Jogo> {
    const service = new JogosService()
    return service.post('/admin/jogos', dados)
  }

  static async atualizarJogo(id: number, dados: Partial<Jogo>): Promise<Jogo> {
    const service = new JogosService()
    return service.put(`/admin/jogos/${id}`, dados)
  }

  static async deletarJogo(id: number): Promise<void> {
    const service = new JogosService()
    return service.delete(`/admin/jogos/${id}`)
  }
}


export function useJogos(filters?: JogosFilters) {
  return useQuery({
    queryKey: queryKeys.jogos.list(filters || {}),
    queryFn: () => JogosService.getJogos(filters),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    throwOnError: false
  })
}

export function useJogo(id: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(id),
    queryFn: () => JogosService.getJogo(id),
    enabled: !!id && id > 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false,
    throwOnError: false
  })
}

export function useJogosTime(timeId: number, filters?: Omit<JogosFilters, 'timeId'>) {
  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'jogos-time', timeId, filters],
    queryFn: () => JogosService.getJogos({ ...filters, timeId }),
    enabled: !!timeId && timeId > 0,
    staleTime: 1000 * 60 * 3,
    retry: 2,
    refetchOnWindowFocus: false
  })
}

export function useJogosSuperliga(temporada: string, filters?: Omit<JogosFilters, 'temporada'>) {
  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'superliga', temporada, filters],
    queryFn: () => JogosService.getJogos({ ...filters, temporada }),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 3,
    retry: 2,
    refetchOnWindowFocus: false
  })
}

export function useAtualizarResultadoJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({
      id,
      dados
    }: {
      id: number,
      dados: {
        placarCasa: number
        placarVisitante: number
        status?: string
        observacoes?: string
      }
    }) => JogosService.atualizarResultado(id, dados),
    onSuccess: (result, { id }) => {
      queryClient.setQueryData(queryKeys.jogos.detail(id), result.jogo)

      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })

      if (result.jogo.temporada) {
        queryClient.invalidateQueries({
          queryKey: ['superliga', result.jogo.temporada]
        })
      }

      notifications.success('Resultado atualizado!', 'Placar do jogo foi salvo com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar resultado', error.message || 'Tente novamente')
    }
  })
}

export function useFinalizarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (jogoId: number) => JogosService.finalizarJogo(jogoId),
    onSuccess: (updatedJogo) => {
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)

      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })

      if (updatedJogo.temporada) {
        queryClient.invalidateQueries({
          queryKey: ['superliga', updatedJogo.temporada]
        })
      }

      notifications.success('Jogo finalizado!', 'Jogo foi marcado como finalizado')
    },
    onError: (error: any) => {
      notifications.error('Erro ao finalizar jogo', error.message || 'Tente novamente')
    },
  })
}

export function useAdiarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ jogoId, novaData }: { jogoId: number; novaData?: string }) =>
      JogosService.adiarJogo(jogoId, novaData),
    onSuccess: (updatedJogo) => {
      queryClient.setQueryData(queryKeys.jogos.detail(updatedJogo.id), updatedJogo)

      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })

      if (updatedJogo.temporada) {
        queryClient.invalidateQueries({
          queryKey: ['superliga', updatedJogo.temporada]
        })
      }

      notifications.success('Jogo adiado!', 'Jogo foi adiado com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao adiar jogo', error.message || 'Tente novamente')
    },
  })
}

export function useCriarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (dados: Partial<Jogo>) => JogosService.criarJogo(dados),
    onSuccess: (newJogo) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })

      queryClient.setQueryData(queryKeys.jogos.detail(newJogo.id), newJogo)

      if (newJogo.temporada) {
        queryClient.invalidateQueries({
          queryKey: ['superliga', newJogo.temporada]
        })
      }

      notifications.success('Jogo criado!', 'Jogo foi criado com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao criar jogo', error.message || 'Tente novamente')
    },
  })
}

export function useAtualizarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: Partial<Jogo> }) =>
      JogosService.atualizarJogo(id, dados),
    onSuccess: (updatedJogo, { id }) => {
      queryClient.setQueryData(queryKeys.jogos.detail(id), updatedJogo)

      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })

      if (updatedJogo.temporada) {
        queryClient.invalidateQueries({
          queryKey: ['superliga', updatedJogo.temporada]
        })
      }

      notifications.success('Jogo atualizado!', 'Jogo foi atualizado com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao atualizar jogo', error.message || 'Tente novamente')
    },
  })
}

export function useDeletarJogo() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (id: number) => JogosService.deletarJogo(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: queryKeys.jogos.detail(id)
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })

      queryClient.invalidateQueries({
        queryKey: ['superliga']
      })

      notifications.success('Jogo removido!', 'Jogo foi excluído com sucesso')
    },
    onError: (error: any) => {
      notifications.error('Erro ao remover jogo', error.message || 'Tente novamente')
    },
  })
}

export function useEstatisticasJogos(filters?: JogosFilters) {
  const { data: jogos = [] } = useJogos(filters)

  return {
    totalJogos: jogos.length,
    jogosFinalizados: jogos.filter(j => j.status === 'FINALIZADO').length,
    jogosAgendados: jogos.filter(j => j.status === 'AGENDADO').length,
    jogosAoVivo: jogos.filter(j => j.status === 'AO VIVO').length,
    jogosAdiados: jogos.filter(j => j.status === 'ADIADO').length,
    proximoJogo: jogos
      .filter(j => j.status === 'AGENDADO' && new Date(j.dataJogo) > new Date())
      .sort((a, b) => new Date(a.dataJogo).getTime() - new Date(b.dataJogo).getTime())[0],
    ultimoJogo: jogos
      .filter(j => j.status === 'FINALIZADO')
      .sort((a, b) => new Date(b.dataJogo).getTime() - new Date(a.dataJogo).getTime())[0]
  }
}

export const useUpdateJogo = useAtualizarJogo
export const useDeleteJogo = useDeletarJogo
export const useCreateJogo = useCriarJogo