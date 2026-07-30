"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useTemporadaStore } from '@/stores/temporadaStore'
import transferenciasData2025 from '@/data/transferencia-2025'
import transferenciasData2026 from '@/data/transferencia-2026'

interface Transferencia {
  jogador: string
  posicao: string
  timeOrigem: string
  timeOrigemLogo: string
  timeDestino: string
  timeDestinoLogo: string
}

const DADOS_POR_TEMPORADA: Record<string, Transferencia[]> = {
  '2025': transferenciasData2025,
  '2026': transferenciasData2026,
}

const LABELS_TEMPORADA: Record<string, { origem: string; destino: string }> = {
  '2025': { origem: '2024', destino: '2025' },
  '2026': { origem: '2025', destino: '2026' },
}

export default function MercadoPage() {
  const temporada = useTemporadaStore((s) => s.temporada)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
  const [searchTerm, setSearchTerm] = useState('')

  // Aguarda hidratação do store para não exibir temporada errada no SSR
  const temporadaAtiva = hasHydrated ? temporada : '2025'

  const transferencias: Transferencia[] = DADOS_POR_TEMPORADA[temporadaAtiva] ?? []
  const labels = LABELS_TEMPORADA[temporadaAtiva] ?? { origem: '—', destino: temporadaAtiva }

  const filteredTransferencias = searchTerm
    ? transferencias.filter(t =>
      t.jogador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.timeOrigem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.timeDestino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.posicao?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : transferencias

  const transferenciasAgrupadas = filteredTransferencias.reduce((acc, transferencia) => {
    const timeDestino = transferencia.timeDestino || 'Desconhecido'
    if (!acc[timeDestino]) acc[timeDestino] = []
    acc[timeDestino].push(transferencia)
    return acc
  }, {} as Record<string, Transferencia[]>)

  const timesOrdenados = Object.entries(transferenciasAgrupadas).sort(
    ([, a], [, b]) => b.length - a.length
  )

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/assets/logo-fabr-color.png'
  }

  return (
    <div className="bg-[#ECECEC] min-h-screen pb-20 pt-4 lg:pt-6 max-w-[900px] mx-auto xl:ml-96 xl:mr-4 xl:pt-0 2xl:ml-[700px] 2xl:mr-20">
      <div className="mt-24 flex flex-col gap-4 max-w-7xl mx-auto px-4 lg:mt-24">

        {/* Cabeçalho com info da temporada e busca */}
        <div className="bg-[#272731] rounded-lg p-4 mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-white font-bold text-lg">Mercado de Transferências</p>
            <p className="text-gray-400 text-sm">
              Temporada {labels.origem} → {labels.destino}
              {transferencias.length > 0 && (
                <span className="ml-2 text-[#63E300]">({transferencias.length} movimentações)</span>
              )}
            </p>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar jogador, time ou posição..."
            className="w-full sm:w-64 px-3 py-2 bg-[#1C1C24] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[#63E300]"
          />
        </div>

        {timesOrdenados.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500 font-bold text-lg mb-2">Nenhuma transferência encontrada</p>
            <p className="text-gray-600">
              {searchTerm
                ? `Nenhum resultado para "${searchTerm}".`
                : `Não há dados de transferências para ${labels.origem} → ${labels.destino}.`}
            </p>
          </div>
        ) : (
          timesOrdenados.map(([timeDestino, transferenciasDoTime]) => (
            <div key={timeDestino} className="rounded-lg shadow-md overflow-hidden mb-6">

              {/* Cabeçalho do time destino */}
              <div className="bg-[#272731] text-white p-4 flex items-center gap-3">
                <Image
                  src={`/assets/times/logos/${transferenciasDoTime[0]?.timeDestinoLogo}`}
                  alt={`${timeDestino} logo`}
                  width={50}
                  height={50}
                  className="rounded-full"
                  onError={handleImgError}
                />
                <div>
                  <h2 className="text-xl font-bold">{timeDestino}</h2>
                  <p className="text-gray-400 text-xs">
                    {transferenciasDoTime.length} chegada{transferenciasDoTime.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Lista de transferências */}
              <div className="p-4 space-y-3">
                {transferenciasDoTime.map((transferencia, index) => (
                  <div
                    key={`${transferencia.jogador}-${index}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex gap-5 justify-between w-full items-center">
                      <div className="ml-4 flex flex-col gap-3">
                        <div className="text-sm font-semibold text-gray-900 md:text-lg">
                          {transferencia.jogador}{' '}
                          <span className="text-gray-500 font-normal">({transferencia.posicao})</span>
                        </div>
                        <div className="text-[14px] text-gray-600">
                          {transferencia.timeOrigem} → {transferencia.timeDestino}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                          <Image
                            src={`/assets/times/logos/${transferencia.timeOrigemLogo}`}
                            alt={transferencia.timeOrigem}
                            width={32}
                            height={32}
                            className="rounded-full"
                            onError={handleImgError}
                          />
                          <span className="text-xs text-gray-500 mt-1 md:text-sm">
                            {transferencia.timeOrigem}
                          </span>
                        </div>

                        <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 w-4 h-4" />

                        <div className="flex flex-col items-center">
                          <Image
                            src={`/assets/times/logos/${transferencia.timeDestinoLogo}`}
                            alt={transferencia.timeDestino}
                            width={32}
                            height={32}
                            className="rounded-full"
                            onError={handleImgError}
                          />
                          <span className="text-xs text-gray-500 mt-1 md:text-sm">
                            {transferencia.timeDestino}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}