import { Time } from '@/types/time';
import { Jogador } from '@/types/jogador';
import { Noticia } from '@/types/noticia';

import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Cache para armazenar dados pré-carregados
let cachedData: {
  times: Time[] | null;
  jogadores: Jogador[] | null;
  noticias: Noticia[] | null;
} = {
  times: null,
  jogadores: null,
  noticias: null,
};

// Função para carregar os dados no cache
export const prefetchData = async (): Promise<void> => {
  try {
    const [timesResponse, jogadoresResponse, noticiasResponse] = await Promise.all([
      api.get<Time[]>('/times'),
      api.get<Jogador[]>('/jogadores'),
      api.get<Noticia[]>('/noticias'),
    ]);

    cachedData.times = timesResponse.data || [];
    cachedData.jogadores = jogadoresResponse.data || [];
    cachedData.noticias = noticiasResponse.data || [];
    console.log('Dados pré-carregados com sucesso!');
  } catch (error) {
    console.error('Erro ao pré-carregar dados:', error);
    throw new Error('Falha ao pré-carregar dados');
  }
};

// Função para buscar times (usando cache)
export const getTimes = async (): Promise<Time[]> => {
  if (cachedData.times) {
    return cachedData.times;
  }

  try {
    const response: AxiosResponse<Time[]> = await api.get('/times');
    cachedData.times = response.data || [];
    return cachedData.times;
  } catch (error) {
    console.error('Erro ao buscar times:', error);
    throw new Error('Falha ao buscar times');
  }
};

// Função para buscar jogadores (usando cache)
export const getJogadores = async (): Promise<Jogador[]> => {
  if (cachedData.jogadores) {
    return cachedData.jogadores;
  }

  try {
    const response: AxiosResponse<Jogador[]> = await api.get('/jogadores');
    cachedData.jogadores = response.data || [];
    return cachedData.jogadores;
  } catch (error) {
    console.error('Erro ao buscar jogadores:', error);
    throw new Error('Falha ao buscar jogadores');
  }
};

// Função para buscar notícias (usando cache)
export const getNoticias = async (): Promise<Noticia[]> => {
  if (cachedData.noticias) {
    return cachedData.noticias;
  }

  try {
    const response: AxiosResponse<Noticia[]> = await api.get('/materias');
    cachedData.noticias = response.data || [];
    return cachedData.noticias;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    throw new Error('Falha ao buscar notícias');
  }
};
