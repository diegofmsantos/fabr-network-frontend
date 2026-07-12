"use client"

import { useQuery } from '@tanstack/react-query'
import { BaseService } from '@/services/base.service'
import { queryKeys } from './queryKeys'
import { useTemporadaStore } from '@/stores/temporadaStore'

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
  divisao?: string
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
  videoUrl?: string
  playByPlay?: string

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
  const divisao = useTemporadaStore((s) => s.divisao)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
  const divisaoAtiva = hasHydrated ? divisao : 'D1'

  return useQuery({
    queryKey: [...queryKeys.jogos.all, 'superliga', temporada, divisaoAtiva, filters],
    queryFn: () => JogosService.getJogos({ ...filters, temporada, divisao: divisaoAtiva }),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 3,
    retry: 2,
    refetchOnWindowFocus: false
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