import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import { Times as timesData } from '@/data/times'

// Cache para armazenar dados pré-carregados
type CachedDataType = {
  times: Time[] | null
  jogadores: Jogador[] | null
}

let cachedData: CachedDataType = {
  times: null,
  jogadores: null
}

// Função auxiliar para simular delay de rede
const delay = (ms: number = 100) => new Promise(resolve => setTimeout(resolve, ms))

// Função auxiliar para verificar se um objeto é um Jogador válido
const isJogadorValid = (jogador: Partial<Jogador>): jogador is Jogador => {
  return jogador !== null && typeof jogador === 'object'
}

// Função para processar jogadores de um time
const processJogadoresDoTime = (time: Time): Jogador[] => {
  const jogadores = time.jogadores || []
  
  return jogadores.map(jogador => ({
    ...jogador,
    timeId: time.id ?? 0,
  }))
}

// Função para carregar os dados no cache
export const prefetchData = async (): Promise<void> => {
  try {
    await delay()
    
    // Processa os times e jogadores de forma segura
    const todosJogadores = timesData.flatMap((time) => {
      if (!Array.isArray(time.jogadores)) return []
      return processJogadoresDoTime(time)
    })
    
    cachedData.times = [...timesData]
    cachedData.jogadores = todosJogadores
    
    console.log('Dados pré-carregados com sucesso!')
  } catch (error) {
    console.error('Erro ao pré-carregar dados:', error)
    throw new Error('Falha ao pré-carregar dados')
  }
}

// Função para buscar times (usando cache)
export const getTimes = async (): Promise<Time[]> => {
  if (cachedData.times) {
    return cachedData.times
  }

  try {
    await delay()
    cachedData.times = [...timesData]
    return cachedData.times
  } catch (error) {
    console.error('Erro ao buscar times:', error)
    throw new Error('Falha ao buscar times')
  }
}

// Função para buscar jogadores (usando cache)
export const getJogadores = async (): Promise<Jogador[]> => {
  if (cachedData.jogadores) {
    return cachedData.jogadores
  }
  
  try {
    await delay()
    const jogadores = timesData.flatMap((time) => {
      if (!Array.isArray(time.jogadores)) return []
      return processJogadoresDoTime(time)
    })
    cachedData.jogadores = jogadores
    return jogadores
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error)
    throw new Error('Falha ao buscar jogadores')
  }
}

// API mock que mantém a interface do axios
export const api = {
  get: async (url: string) => {
    await delay()
    
    if (url === '/times') {
      const times = await getTimes()
      return { data: times }
    }
    
    if (url === '/jogadores') {
      const jogadores = await getJogadores()
      return { data: jogadores }
    }
    
    // Busca por time específico
    const timeMatch = url.match(/\/times\/(\d+)/)
    if (timeMatch) {
      const timeId = parseInt(timeMatch[1])
      const time = timesData.find(t => t.id === timeId)
      if (!time) throw new Error('Time não encontrado')
      return { data: time }
    }
    
    throw new Error('Rota não implementada')
  },
  
  create: (config: any) => api
}

export default api


/*
import { Time } from '@/types/time'
import { Jogador } from '@/types/jogador'
import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

// Cache para armazenar dados pré-carregados
let cachedData: {
  times: Time[] | null
  jogadores: Jogador[] | null
} = {
  times: null,
  jogadores: null,
}

// Função para carregar os dados no cache
export const prefetchData = async (): Promise<void> => {
  try {
    const [timesResponse, jogadoresResponse] = await Promise.all([
      api.get<Time[]>('/times'),
      api.get<Jogador[]>('/jogadores'),
    ])

    cachedData.times = timesResponse.data || []
    cachedData.jogadores = jogadoresResponse.data || []
    console.log('Dados pré-carregados com sucesso!')
  } catch (error) {
    console.error('Erro ao pré-carregar dados:', error)
    throw new Error('Falha ao pré-carregar dados')
  }
}

// Função para buscar times (usando cache)
export const getTimes = async (): Promise<Time[]> => {
  if (cachedData.times) {
    return cachedData.times
  }

  try {
    const response: AxiosResponse<Time[]> = await api.get('/times')
    cachedData.times = response.data || []
    return cachedData.times
  } catch (error) {
    console.error('Erro ao buscar times:', error)
    throw new Error('Falha ao buscar times')
  }
}

// Função para buscar jogadores (usando cache)
export const getJogadores = async (): Promise<Jogador[]> => {
  if (cachedData.jogadores) return cachedData.jogadores
  
  try {
    const response: AxiosResponse<Jogador[]> = await api.get('/jogadores')
    cachedData.jogadores = response.data || []
    return cachedData.jogadores
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error)
    throw new Error('Falha ao buscar jogadores')
  }
}
  */
