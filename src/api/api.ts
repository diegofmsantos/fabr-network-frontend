import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import { Noticia } from '@/types/noticia'
import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

// Cache para armazenar dados pré-carregados
let cachedData: { 
  times: Time[] | null; 
  jogadores: Jogador[] | null; 
  noticias: Noticia[] | null;
  [key: string]: Time[] | Jogador[] | Noticia[] | null | undefined;
} = {
  times: null,
  jogadores: null,
  noticias: null,
}

// Função para carregar os dados no cache
export const prefetchData = async (temporada: string = '2024'): Promise<void> => {
  try {
    const [timesResponse, jogadoresResponse, noticiasResponse] = await Promise.all([
      api.get<Time[]>(`/times?temporada=${temporada}`),
      api.get<Jogador[]>(`/jogadores?temporada=${temporada}`),
      api.get<Noticia[]>('/noticias'),
    ])

    cachedData.times = timesResponse.data || []
    cachedData.jogadores = jogadoresResponse.data || []
    cachedData.noticias = noticiasResponse.data || []
    console.log('Dados pré-carregados com sucesso!')
  } catch (error) {
    console.error('Erro ao pré-carregar dados:', error)
    throw new Error('Falha ao pré-carregar dados')
  }
}

// Função para buscar times (usando cache)
export const getTimes = async (temporada: string = '2024'): Promise<Time[]> => {
  const cacheKey = `times_${temporada}`

  if (cachedData[cacheKey]) {
    return cachedData[cacheKey] as Time[]
  }

  try {
    const response: AxiosResponse<Time[]> = await api.get(`/times?temporada=${temporada}`)
    cachedData[cacheKey] = response.data || []
    return cachedData[cacheKey] as Time[]
  } catch (error) {
    console.error('Erro ao buscar times:', error)
    throw new Error('Falha ao buscar times')
  }
}

// Função para buscar jogadores (usando cache)
export const getJogadores = async (temporada: string = '2024'): Promise<Jogador[]> => {
  const cacheKey = `jogadores_${temporada}`

  if (cachedData[cacheKey]) {
    return cachedData[cacheKey] as Jogador[]
  }

  try {
    const response: AxiosResponse<Jogador[]> = await api.get(`/jogadores?temporada=${temporada}`)
    cachedData[cacheKey] = response.data || []
    return cachedData[cacheKey] as Jogador[]
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error)
    throw new Error('Falha ao buscar jogadores')
  }
}

// Função para buscar notícias (usando cache)
export const getNoticias = async (): Promise<Noticia[]> => {
  if (cachedData.noticias) {
    return cachedData.noticias
  }

  try {
    const response: AxiosResponse<Noticia[]> = await api.get('/materias')
    cachedData.noticias = response.data || []
    return cachedData.noticias
  } catch (error) {
    console.error('Erro ao buscar notícias:', error)
    throw new Error('Falha ao buscar notícias')
  }
}