"use client"

import { useQuery } from '@tanstack/react-query'
import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import { Noticia } from '@/types/noticia'
import { api } from '@/libs/axios'
import { createSlug, findPlayerBySlug, getTeamSlug } from '@/utils/formatUrl'
import { useSearchParams } from 'next/navigation'
import { queryKeys } from './queryKeys'

// Funções de fetch
const fetchTimes = async (temporada: string = '2024'): Promise<Time[]> => {
    const { data } = await api.get<Time[]>(`/times?temporada=${temporada}`)
    return data
}

const fetchJogadores = async (temporada: string = '2024'): Promise<Jogador[]> => {
    const { data } = await api.get<Jogador[]>(`/jogadores?temporada=${temporada}`)
    return data
}

const fetchNoticias = async (): Promise<Noticia[]> => {
    const { data } = await api.get<Noticia[]>('/materias')
    return data
}

// Função helper para notícias relacionadas
function shuffleAndFilterNews(allNews: Noticia[], currentNewsId: number, limit: number = 6) {
    return allNews
        .filter(news => news.id !== currentNewsId)
        .sort(() => Math.random() - 0.5)
        .slice(0, limit)
}

// Hook para obter a temporada dos parâmetros da URL
export function useTemporada() {
    const searchParams = useSearchParams()
    return searchParams?.get('temporada') || '2024'
}

// Hooks básicos
export function useJogadores(temporada: string = '2024') {
    return useQuery({
        queryKey: queryKeys.jogadores(temporada),
        queryFn: () => fetchJogadores(temporada),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

export function useTimes(temporada: string = '2024') {
    return useQuery({
        queryKey: queryKeys.times(temporada),
        queryFn: () => fetchTimes(temporada),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

export function useNoticias() {
    return useQuery({
        queryKey: queryKeys.noticias,
        queryFn: fetchNoticias,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

// Hooks compostos
export function useTeam(teamName: string | undefined) {
    const temporada = useTemporada()
    return useQuery({
        queryKey: [...queryKeys.times(temporada), teamName],
        queryFn: async () => {
            const times = await fetchTimes(temporada)
            if (!teamName) throw new Error("Nome do time não encontrado.")

            return times.find(t => {
                if (!t.nome) return false
                const teamSlug = getTeamSlug(t.nome)
                const currentSlug = createSlug(teamName)
                return teamSlug === currentSlug
            }) || null
        },
        enabled: !!teamName
    })
}

export function usePlayerDetails(
    timeSlug: string | undefined,
    jogadorSlug: string | undefined,
    temporada?: string // Torna o parâmetro opcional
) {
    // Se nenhuma temporada for passada, usa o hook para buscar
    const urlTemporada = useTemporada()
    const currentTemporada = temporada || urlTemporada

    const { data: jogadores = [], isLoading: jogadoresLoading } = useJogadores(currentTemporada)
    const { data: times = [], isLoading: timesLoading } = useTimes(currentTemporada)

    return useQuery({
        queryKey: [...queryKeys.jogadores(currentTemporada), timeSlug, jogadorSlug],
        queryFn: async () => {
            if (!jogadores || !times || !timeSlug || !jogadorSlug) return null

            const jogadorEncontrado = findPlayerBySlug(jogadores, jogadorSlug, timeSlug, times)

            if (jogadorEncontrado && jogadorEncontrado.timeId) {
                const timeEncontrado = times.find((time) => time.id === jogadorEncontrado.timeId)
                if (timeEncontrado) {
                    return {
                        jogador: jogadorEncontrado,
                        time: timeEncontrado,
                    }
                }
            }
            return null
        },
        enabled: !!jogadores.length && !!times.length && !!timeSlug && !!jogadorSlug
    })
}

export function useNoticiaDetalhes(noticiaId: number) {
    const { data: noticias = [], isLoading } = useNoticias()

    return {
        noticia: noticias.find(n => n.id === noticiaId),
        noticiasRelacionadas: isLoading ? [] : shuffleAndFilterNews(noticias, noticiaId),
        isLoading,
        noticias
    }
}

// Função de prefetch atualizada para suportar temporada
export const prefetchQueries = async (queryClient: any, temporada: string = '2024') => {
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: queryKeys.times(temporada),
            queryFn: () => fetchTimes(temporada),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.jogadores(temporada),
            queryFn: () => fetchJogadores(temporada),
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.noticias,
            queryFn: fetchNoticias,
        }),
    ])
}