"use client"
import { JogosService } from '../services/jogos.service';
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'

export interface JogoDetalhes {
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
  
  timeCasa: {
    id: number
    nome: string
    sigla: string
    logo: string
    cor: string
    presidente: string
    head_coach: string
    estadio: string
  }
  
  timeVisitante: {
    id: number
    nome: string
    sigla: string
    logo: string
    cor: string
    presidente: string
    head_coach: string
    estadio: string
  }
  
  campeonato: {
    id: number
    nome: string
    temporada: string
    isSuperliga?: boolean
  }
  
  estatisticas: Array<{
    id: number
    jogoId: number
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
  }>
}

export function useJogoDetalhes(jogoId: number) {
  return useQuery({
    queryKey: queryKeys.jogos.detail(jogoId),
    queryFn: () => JogosService.getJogo(jogoId),
    enabled: !!jogoId && jogoId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  })
}