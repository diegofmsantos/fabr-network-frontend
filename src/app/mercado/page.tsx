"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Loading } from '@/components/ui/Loading'
import { SelectFilter } from '@/components/ui/SelectFilter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import transferenciasData from '@/data/transferencia-2025-2026'

interface Transferencia {
  jogador: string
  posicao: string
  timeOrigem: string
  timeOrigemLogo: string
  timeDestino: string
  timeDestinoLogo: string
}

export default function MercadoPage() {
  const searchParams = useSearchParams()
  const [temporadaOrigem, setTemporadaOrigem] = useState('2025')
  const [temporadaDestino, setTemporadaDestino] = useState('2026')
  const [transferencias, setTransferencias] = useState<Transferencia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadTransferencias = async () => {
      try {
        setLoading(true)
        setError(null)
        await new Promise(resolve => setTimeout(resolve, 500))
        setTransferencias(transferenciasData)
      } catch (err) {
        console.error('Erro ao carregar transferências:', err)
        setError('Não foi possível carregar os dados de transferências.')
      } finally {
        setLoading(false)
      }
    }

    loadTransferencias()
  }, [temporadaOrigem, temporadaDestino])

  const filteredTransferencias = searchTerm
    ? transferencias.filter(t =>
      t.jogador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.timeOrigem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.timeDestino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.posicao?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : transferencias

  const transferenciasAgrupadas = (transferencias || []).reduce((acc, transferencia) => {
    const timeDestino = transferencia.timeDestino || 'Desconhecido'

    if (!acc[timeDestino]) {
      acc[timeDestino] = []
    }

    acc[timeDestino].push(transferencia)
    return acc
  }, {} as Record<string, Transferencia[]>)

  const timesOrdenados = Object.entries(transferenciasAgrupadas)
    .sort(([, transferenciasA], [, transferenciasB]) =>
      transferenciasB.length - transferenciasA.length
    )

  return (
    <div className="bg-[#ECECEC] min-h-screen pb-20 pt-4 lg:pt-6 max-w-[900px] mx-auto xl:mr-44 xl:pt-0">
      <h1 className="w-full text-[40px] bg-[#ECECEC] fixed mt-16 z-50 text-black max-w-7xl p-4 px-2 font-extrabold italic leading-[55px] tracking-[-5px] uppercase lg:static lg:mt-16 lg:flex lg:justify-center">
        Mercado {temporadaOrigem}/{temporadaDestino}
      </h1>

      <div className="mt-40 lg:mt-4 flex flex-col gap-4 max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center my-12">
            <Loading />
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-red-500 font-bold text-lg mb-2">Erro</p>
            <p>{error}</p>
            <p className="mt-4 text-sm text-gray-600">
              Verifique se os dados de transferências para as temporadas selecionadas estão disponíveis.
            </p>
          </div>
        ) : transferencias.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500 font-bold text-lg mb-2">Nenhuma transferência encontrada</p>
            <p className="text-gray-600">
              Não há dados de transferências disponíveis para {temporadaOrigem}/{temporadaDestino}.
            </p>
          </div>
        ) : (
          <>
            {timesOrdenados.map(([timeDestino, transferenciasDoTime]) => (
              <div key={timeDestino} className="rounded-lg shadow-md overflow-hidden mb-6">
                <div className="bg-[#272731] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Image
                      src={`/assets/times/logos/${transferenciasDoTime[0]?.timeDestinoLogo}`}
                      alt={`${timeDestino} logo`}
                      width={50}
                      height={50}
                      className="rounded-full mr-3"
                    />
                    <h2 className="text-xl font-bold">{timeDestino}</h2>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {transferenciasDoTime.map((transferencia, index) => (
                      <div
                        key={`${transferencia.jogador}-${index}`}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between w-full items-center">
                          <div className="ml-4">
                            <div className="font-semibold text-gray-900">
                              {transferencia.jogador} ({transferencia.posicao})
                            </div>
                            <div className="text-sm text-gray-600">
                              {transferencia.timeOrigem} → {transferencia.timeDestino}
                            </div>
                          </div>
                          <div className='flex items-center gap-6'>
                            <div className="flex flex-col items-center">
                              <Image
                                src={`/assets/times/logos/${transferencia.timeOrigemLogo}`}
                                alt={`${transferencia.timeOrigem} logo`}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <span className="text-xs text-gray-500 mt-1">
                                {transferencia.timeOrigem}
                              </span>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 w-4 h-4" />
                            <div className="flex flex-col items-center">
                              <Image
                                src={`/assets/times/logos/${transferencia.timeDestinoLogo}`}
                                alt={`${transferencia.timeDestino} logo`}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <span className="text-xs text-gray-500 mt-1">
                                {transferencia.timeDestino}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}