"use client"

import { useQuery } from '@tanstack/react-query'
import { createSlug, findPlayerBySlug, getPlayerSlug, getTeamSlug } from '@/utils/helpers/formatUrl'
import { useRouter, useSearchParams } from 'next/navigation'
import { queryKeys } from './queryKeys'
import { MateriasService } from '@/services/materias.service'
import { useTimes } from '@/hooks/useTimes'
import { useJogadores } from '@/hooks/useJogadores'
import { useTemporadaStore } from '@/stores/temporadaStore'

interface DataNotFoundError extends Error {
    code: 'NOT_FOUND';
    temporada: string;
    entityName?: string;
}

const createNotFoundError = (temporada: string, entityName?: string): DataNotFoundError => {
    const error = new Error(`Dados não encontrados para temporada ${temporada}`) as DataNotFoundError;
    error.code = 'NOT_FOUND';
    error.temporada = temporada;
    error.entityName = entityName;
    return error;
};

export function useTemporada(explicitTemporada?: string) {
    const temporadaStore = useTemporadaStore((s) => s.temporada);

    // Caso a temporada venha explícita (ex.: rota /tabela/[temporada]), ela prevalece.
    let temporada = explicitTemporada || temporadaStore;

    const TEMPORADAS_VALIDAS = ['2024', '2025', '2026']
    if (!TEMPORADAS_VALIDAS.includes(temporada)) {
        console.warn(`Temporada inválida: ${temporada}, usando 2025`);
        temporada = '2025';
    }

    return temporada;
}

export function useNoticias() {
    return useQuery({
        queryKey: queryKeys.materias.lists(),
        queryFn: () => MateriasService.getMaterias(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 30,
    })
}

export function useTeam(teamName: string | undefined, explicitTemporada?: string) {
    const temporada = useTemporada(explicitTemporada);
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: times = [], isLoading: timesLoading, error: timesError } = useTimes(temporada);

    return useQuery({
        queryKey: [...queryKeys.times.list(temporada), teamName],
        queryFn: async () => {
            if (!teamName) throw new Error("Nome do time não encontrado.");

            if (timesError && (timesError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(temporada, teamName);
            }

            if (!times.length && !timesLoading) {
                throw createNotFoundError(temporada, teamName);
            }

            console.log(`Buscando time: ${teamName} na temporada: ${temporada}`);

            const teamSlug = createSlug(teamName);
            let timeEncontrado = times.find(t => {
                if (!t.nome) return false;
                return getTeamSlug(t.nome) === teamSlug;
            });

            if (timeEncontrado) {
                console.log(`Time encontrado na temporada ${temporada}:`, timeEncontrado.nome);
                return timeEncontrado;
            }

            console.log(`Time ${teamName} não encontrado em nenhuma temporada`);
            throw createNotFoundError(temporada, teamName);
        },
        enabled: !!teamName && !timesLoading,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

export function usePlayerDetails(
    timeSlug: string | undefined,
    jogadorSlug: string | undefined,
    temporada?: string
) {
    const urlTemporada = useTemporada(temporada);
    const currentTemporada = temporada || urlTemporada;
    const router = useRouter();

    const { data: jogadores = [], isLoading: jogadoresLoading, error: jogadoresError } = useJogadores(currentTemporada);
    const { data: times = [], isLoading: timesLoading, error: timesError } = useTimes(currentTemporada);

    return useQuery({
        queryKey: [...queryKeys.jogadores.list(currentTemporada), timeSlug, jogadorSlug],
        queryFn: async () => {
            if (jogadoresError && (jogadoresError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(currentTemporada, jogadorSlug);
            }

            if (timesError && (timesError as DataNotFoundError).code === 'NOT_FOUND') {
                throw createNotFoundError(currentTemporada, jogadorSlug);
            }

            if (!jogadores.length || !times.length || !timeSlug || !jogadorSlug) {
                if (!jogadoresLoading && !timesLoading) {
                    throw createNotFoundError(currentTemporada, jogadorSlug);
                }
                return null;
            }

            console.log(`Buscando jogador: ${jogadorSlug} do time: ${timeSlug} na temporada: ${currentTemporada}`);

            let jogadorEncontrado = findPlayerBySlug(jogadores, jogadorSlug, timeSlug, times);

            if (jogadorEncontrado && jogadorEncontrado.timeId) {
                const timeAtual = times.find(t => t.id === jogadorEncontrado?.timeId);

                if (timeAtual) {
                    const jogadorMudouDeTime = getTeamSlug(timeAtual.nome || '') !== createSlug(timeSlug);

                    if (jogadorMudouDeTime) {
                        console.log(`Jogador encontrado, mas em time diferente: ${timeAtual.nome}`);
                        const timeCorretoSlug = getTeamSlug(timeAtual.nome || '');
                        const jogadorSlugCorreto = getPlayerSlug(jogadorEncontrado.nome);

                        setTimeout(() => {
                            router.replace(`/${timeCorretoSlug}/${jogadorSlugCorreto}?temporada=${currentTemporada}`);
                        }, 0);
                    }

                    return {
                        jogador: jogadorEncontrado,
                        time: timeAtual,
                        jogadorMudouDeTime
                    };
                }
            }

            console.log(`Jogador ${jogadorSlug} não encontrado na temporada ${currentTemporada}`);
            throw createNotFoundError(currentTemporada, jogadorSlug);
        },
        enabled: !!timeSlug && !!jogadorSlug && !jogadoresLoading && !timesLoading,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * A listagem (`useNoticias`) só traz campos leves (sem o corpo `texto` do artigo,
 * que pode ter várias centenas de KB por causa de imagens). Esse hook busca o
 * registro completo de UMA matéria por vez, só quando a página realmente precisa
 * renderizar o corpo do artigo.
 */
export function useMateriaCompleta(id: number | undefined) {
    return useQuery({
        queryKey: id ? queryKeys.materias.detail(id) : [...queryKeys.materias.all, 'detail', 'disabled'],
        queryFn: () => MateriasService.getMateria(id as number),
        enabled: !!id,
        staleTime: 1000 * 60 * 10,
    })
}

export function useNoticiaRedzone() {
    const { data: noticias = [], isLoading: listaLoading } = useNoticias()

    const resumoRedzone = [...noticias]
        .filter(n => n.tipo === 'REDZONE')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    const { data: noticiaCompleta, isLoading: completaLoading } = useMateriaCompleta(resumoRedzone?.id)

    return {
        data: noticiaCompleta,
        noticias,
        isLoading: listaLoading || (!!resumoRedzone && completaLoading)
    }
}

export function useNoticiaDetalhes(id: number) {
    const { data: todasNoticias = [], isLoading: noticiasLoading } = useNoticias()
    const noticias = todasNoticias.filter(n => n.tipo !== 'REDZONE')
    const existeNaListaPublica = noticias.some(n => n.id === id)

    const { data: noticiaCompleta, isLoading: completaLoading } = useMateriaCompleta(
        existeNaListaPublica ? id : undefined
    )

    return {
        data: noticiaCompleta ? { noticia: noticiaCompleta, noticias } : undefined,
        isLoading: noticiasLoading || (existeNaListaPublica && completaLoading)
    }
}