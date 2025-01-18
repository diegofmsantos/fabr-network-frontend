import { useQuery } from '@tanstack/react-query'
import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import { Noticia } from '@/types/noticia'
import { api } from '@/libs/axios'
import { createSlug, findPlayerBySlug, getTeamSlug } from '@/utils/formatUrl'
import { ProcessedPlayer } from '@/types/processedPlayer'
import { CategoryKey, getTierForValue } from '@/utils/categoryThresholds'
import { getStatMapping } from '@/utils/statMappings'
import React from 'react'

// Keys para as queries
export const queryKeys = {
    times: ['times'],
    jogadores: ['jogadores'],
    noticias: ['noticias']
} as const

// Funções de fetch
const fetchTimes = async (): Promise<Time[]> => {
    const { data } = await api.get<Time[]>('/times')
    return data
}

const fetchJogadores = async (): Promise<Jogador[]> => {
    const { data } = await api.get<Jogador[]>('/jogadores')
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

// Hooks básicos
export function useTimes() {
    return useQuery({
        queryKey: queryKeys.times,
        queryFn: fetchTimes,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

export function useJogadores() {
    return useQuery({
        queryKey: queryKeys.jogadores,
        queryFn: fetchJogadores,
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
    return useQuery({
        queryKey: [...queryKeys.times, teamName],
        queryFn: async () => {
            const times = await fetchTimes()
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

export function usePlayerDetails(timeSlug: string | undefined, jogadorSlug: string | undefined) {
    const { data: jogadores = [], isLoading: jogadoresLoading } = useJogadores()
    const { data: times = [], isLoading: timesLoading } = useTimes()

    return useQuery({
        queryKey: [...queryKeys.jogadores, timeSlug, jogadorSlug],
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

// Função de prefetch exatamente como está nas imagens
export const prefetchQueries = async (queryClient: any) => {
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: queryKeys.times,
            queryFn: fetchTimes,
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.jogadores,
            queryFn: fetchJogadores,
        }),
        queryClient.prefetchQuery({
            queryKey: queryKeys.noticias,
            queryFn: fetchNoticias,
        }),
    ])
}