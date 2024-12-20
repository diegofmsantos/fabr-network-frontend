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
