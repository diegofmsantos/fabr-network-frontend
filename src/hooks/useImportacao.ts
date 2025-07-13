import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ImportacaoService, } from '@/services/importacao.service'
import { queryKeys } from './queryKeys'
import { useNotifications } from './useNotifications'

export function useImportarTimes() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.importarTimes(arquivo),
    onSuccess: (result: any) => { 
      queryClient.invalidateQueries({
        queryKey: queryKeys.times.lists()
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.all
      })

      notifications.success(
        'Times importados!',
        `${result.sucesso || 0} times processados com sucesso`
      )

      if (result.erros && result.erros.length > 0) {
        notifications.warning(
          'Importação com avisos',
          `${result.erros.length} itens com problemas. Verifique o console.`
        )
        console.warn('Erros na importação de times:', result.erros)
      }
    },
    onError: (error: any) => {
      notifications.error(
        'Erro na importação de times',
        error.message || 'Verifique o arquivo e tente novamente'
      )
    },
  })
}

export function useImportarJogadores() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.importarJogadores(arquivo),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogadores.lists()
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.times.lists()
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.all
      })

      notifications.success(
        'Jogadores importados!',
        `${result.sucesso || 0} jogadores processados com sucesso`
      )

      if (result.erros && result.erros.length > 0) {
        notifications.warning(
          'Importação com avisos',
          `${result.erros.length} jogadores com problemas. Verifique o console.`
        )
        console.warn('Erros na importação de jogadores:', result.erros)
      }
    },
    onError: (error: any) => {
      notifications.error(
        'Erro na importação de jogadores',
        error.message || 'Verifique o arquivo e tente novamente'
      )
    },
  })
}

export function useAtualizarEstatisticas() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({ arquivo, idJogo, dataJogo }: {
      arquivo: File
      idJogo: string
      dataJogo: string
    }) => ImportacaoService.atualizarEstatisticas(arquivo, idJogo, dataJogo),

    onSuccess: (result: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogadores.lists()
      })

      if (result.jogoId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.jogos.detail(parseInt(result.jogoId))
        })
      }

      queryClient.invalidateQueries({
        queryKey: queryKeys.jogos.lists()
      })

      notifications.success(
        'Estatísticas atualizadas!',
        `${result.jogadoresAtualizados || 0} jogadores atualizados, ${result.estatisticasProcessadas || 0} estatísticas processadas`
      )
    },
    onError: (error: any) => {
      notifications.error(
        'Erro ao atualizar estatísticas',
        error.message || 'Verifique o arquivo e os dados do jogo'
      )
    },
  })
}

export function useIniciarTemporada() {
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  return useMutation({
    mutationFn: ({
      ano,
      alteracoes
    }: {
      ano: string
      alteracoes: Parameters<typeof ImportacaoService.iniciarTemporada>[1]
    }) => ImportacaoService.iniciarTemporada(ano, alteracoes),

    onSuccess: (result: any, { ano }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.times.list(ano)
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.jogadores.list(ano)
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.campeonatos.lists()
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.all
      })

      notifications.success(
        `Temporada ${ano} iniciada!`,
        `${result.times || 0} times e ${result.jogadores || 0} jogadores criados. ${result.transferencias || 0} transferências processadas.`
      )

      if (result.transferencias && result.transferencias > 0) {
        notifications.info(
          'Transferências processadas',
          `${result.transferencias} jogadores foram transferidos`
        )
      }
    },
    onError: (error: any) => {
      notifications.error(
        'Erro ao iniciar temporada',
        error.message || 'Ocorreu um erro durante o processo'
      )
    },
  })
}

export function useTransferencias(temporadaOrigem: string, temporadaDestino: string) {
  return useQuery({
    queryKey: queryKeys.temporada.transition(temporadaOrigem, temporadaDestino),
    queryFn: () => ImportacaoService.getTransferencias(temporadaOrigem, temporadaDestino),
    enabled: !!(temporadaOrigem && temporadaDestino),
    staleTime: 1000 * 60 * 10,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('404')) return false
      return failureCount < 2
    },
    throwOnError: false,
  })
}

export function useVerificarTemporada(temporada: string) {
  return useQuery({
    queryKey: [...queryKeys.temporada.all, 'verificar', temporada],
    queryFn: () => ImportacaoService.verificarTemporada(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export function useEstatisticasImportacao(temporada: string) {
  return useQuery({
    queryKey: [...queryKeys.importacao.all, 'stats', temporada],
    queryFn: () => ImportacaoService.getEstatisticasImportacao(temporada),
    enabled: !!temporada,
    staleTime: 1000 * 60 * 2,
    retry: 2,
    throwOnError: false,
  })
}

export function useValidarPlanilhaTimes() {
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.validarPlanilhaTimes(arquivo),
    onSuccess: (result) => {
      notifications.success('Planilha válida!', 'A planilha de times está no formato correto')
    },
    onError: (error: any) => {
      notifications.error('Planilha inválida', error.message || 'Verifique o formato da planilha')
    },
  })
}

export function useValidarPlanilhaJogadores() {
  const notifications = useNotifications()

  return useMutation({
    mutationFn: (arquivo: File) => ImportacaoService.validarPlanilhaJogadores(arquivo),
    onSuccess: (result) => {
      notifications.success('Planilha válida!', 'A planilha de jogadores está no formato correto')
    },
    onError: (error: any) => {
      notifications.error('Planilha inválida', error.message || 'Verifique o formato da planilha')
    },
  })
}