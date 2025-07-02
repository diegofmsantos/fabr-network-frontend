'use client'

import { useParams } from 'next/navigation'
import { useClassificacaoGeral } from '@/hooks/useSuperliga'
import { Loading } from '@/components/ui/Loading'

interface ClassificacaoTime {
  posicao: number
  timeId: number
  time: {
    id: number
    nome: string
    sigla: string
    logo: string
  }
  regional: string
  conferencia: string
  jogos: number
  vitorias: number
  derrotas: number
  pontosPro: number
  pontosContra: number
  saldo: number
  aproveitamento: number
}

interface ClassificacaoRegional {
  regionalId: number
  regional: string
  conferencia: string
  times: ClassificacaoTime[]
}

export default function ClassificacaoPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const { data: classificacao, isLoading } = useClassificacaoGeral(temporada)

  if (isLoading) return <Loading />

  // Verificar se classificacao é um array
  const regionais = Array.isArray(classificacao) ? classificacao :
    (classificacao as any)?.regionais || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C24] via-[#2A1810] to-[#1C1C24] text-white">
      {/* Header */}
      <div className="bg-black/40 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">CLASSIFICAÇÃO SUPERLIGA {temporada}</h1>
          <p className="text-center text-gray-300">Temporada Regular</p>
        </div>
      </div>

      {/* Tabelas por Regional */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {regionais.length > 0 ? (
          regionais.map((regional: ClassificacaoRegional) => (
            <div key={regional.regionalId} className="bg-black/30 rounded-lg overflow-hidden">
              <div className={`p-4 ${getConferenciaColor(regional.conferencia)}`}>
                <h2 className="text-xl font-bold text-center text-white">
                  {regional.regional}
                </h2>
              </div>

              {/* Tabela de classificação */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/50">
                    <tr className="text-white text-sm">
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">TIME</th>
                      <th className="p-3 text-center">V</th>
                      <th className="p-3 text-center">D</th>
                      <th className="p-3 text-center">P+</th>
                      <th className="p-3 text-center">P-</th>
                      <th className="p-3 text-center">S</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regional.times?.map((time: ClassificacaoTime) => (
                      <tr key={time.timeId} className={`border-b border-gray-700 ${getPositionColor(time.posicao)}`}>
                        <td className="p-3 font-bold">{time.posicao}º</td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={time.time.logo} alt={time.time.nome} className="w-8 h-8" />
                            <div>
                              <div className="font-semibold">{time.time.nome}</div>
                              <div className="text-xs text-gray-400">{time.time.sigla}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold text-green-400">{time.vitorias}</td>
                        <td className="p-3 text-center font-bold text-red-400">{time.derrotas}</td>
                        <td className="p-3 text-center">{time.pontosPro}</td>
                        <td className="p-3 text-center">{time.pontosContra}</td>
                        <td className="p-3 text-center font-bold">{time.saldo > 0 ? '+' : ''}{time.saldo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Nenhuma classificação disponível para a temporada {temporada}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function getConferenciaColor(conferencia: string) {
  const colors = {
    'SUDESTE': 'bg-red-600',
    'SUL': 'bg-blue-600',
    'NORDESTE': 'bg-yellow-600',
    'CENTRO_NORTE': 'bg-green-600'
  }
  return colors[conferencia as keyof typeof colors] || 'bg-gray-600'
}

function getPositionColor(posicao: number) {
  if (posicao === 1) return 'bg-green-900/30'
  if (posicao === 2) return 'bg-blue-900/30'
  if (posicao === 3) return 'bg-yellow-900/30'
  return 'hover:bg-gray-800/50'
}