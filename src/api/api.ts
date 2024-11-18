import { Time } from '@/types/time'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:4000',
})


export const getTimes = async (): Promise<Time[]> => {
    try {
        const response = await api.get('/times')
        return response.data || []
    } catch (error) {
        console.error('Erro ao buscar times:', error)
        throw new Error('Falha ao buscar times')
    }
}