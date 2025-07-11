// src/hooks/usePlayerGameStats.ts
import { useQuery } from '@tanstack/react-query'
import { EstatisticaJogo } from '@/types'

// Função temporária que simula dados até a rota real ser criada
const fetchPlayerGameStats = async (jogadorId: number): Promise<EstatisticaJogo[]> => {
  // Simular dados para demonstração (remover quando a rota real existir)
  const dadosSimulados: EstatisticaJogo[] = [
    {
      id: 1,
      jogoId: 1,
      jogadorId,
      timeId: 1,
      temporada: '2025',
      estatisticas: {
        recepcao: {
          recepcoes: 4,
          alvo: 6,
          jardas_recebidas: 65,
          tds_recebidos: 1
        }
      },
      jogo: {
        id: 1,
        dataJogo: '2025-03-15T19:00:00Z',
        status: 'FINALIZADO' as const,
        placarCasa: 21,
        placarVisitante: 14,
        rodada: 1,
        fase: 'TEMPORADA REGULAR',
        local: 'Arena Nacional',
        timeCasa: {
          id: 1,
          nome: 'Recife Mariners',
          sigla: 'REC',
          cor: '#1f4e79'
        },
        timeVisitante: {
          id: 2,
          nome: 'São Paulo Storm',
          sigla: 'SP',
          cor: '#ff6b35'
        }
      },
      jogador: {
        id: jogadorId,
        nome: 'Athos Daniel',
        posicao: 'TE'
      }
    },
    {
      id: 2,
      jogoId: 2,
      jogadorId,
      timeId: 1,
      temporada: '2025',
      estatisticas: {
        recepcao: {
          recepcoes: 3,
          alvo: 5,
          jardas_recebidas: 42,
          tds_recebidos: 0
        }
      },
      jogo: {
        id: 2,
        dataJogo: '2025-03-22T18:00:00Z',
        status: 'FINALIZADO' as const,
        placarCasa: 28,
        placarVisitante: 17,
        rodada: 2,
        fase: 'TEMPORADA REGULAR',
        local: 'Estádio do Arruda',
        timeCasa: {
          id: 1,
          nome: 'Recife Mariners',
          sigla: 'REC',
          cor: '#1f4e79'
        },
        timeVisitante: {
          id: 3,
          nome: 'Rio de Janeiro Titans',
          sigla: 'RJ',
          cor: '#2d5a27'
        }
      },
      jogador: {
        id: jogadorId,
        nome: 'Athos Daniel',
        posicao: 'TE'
      }
    }
  ]

  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 500))
  
  console.log(`🎭 Retornando dados simulados para jogador ${jogadorId}`)
  return dadosSimulados
}

export const usePlayerGameStats = (jogadorId: number) => {
  return useQuery({
    queryKey: ['player-game-stats', jogadorId],
    queryFn: () => fetchPlayerGameStats(jogadorId),
    enabled: !!jogadorId,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: false, // Não tentar novamente 
    refetchOnWindowFocus: false
  })
}