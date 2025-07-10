import { useEstatisticasPorJogo } from "@/hooks/useJogadores"

interface EstatisticaJogoProps {
  jogadorId: number
  temporada: string
}

export function EstatisticasPorJogo({ jogadorId, temporada }: EstatisticaJogoProps) {
  const { data: estatisticas, isLoading } = useEstatisticasPorJogo(jogadorId, temporada)

  if (isLoading) return <div className="animate-pulse">Carregando estatísticas...</div>

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h3 className="text-lg font-bold">ÚLTIMOS JOGOS</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATA</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADV.</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">COMP/TENT</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JDS</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TDS</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INT</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SCK</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AVG</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PASS%</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FUM</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {estatisticas?.map((stat: any, index: number) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {new Date(stat.dataJogo).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit' 
                  })}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={`/assets/times/logos/${stat.adversario.logo}`} 
                      alt={stat.adversario.nome}
                      className="w-6 h-6 mr-2"
                    />
                    <span className="text-sm font-medium">{stat.adversario.sigla}</span>
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {stat.passes?.completos || 0}/{stat.passes?.tentados || 0}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {stat.passes?.jardas || 0}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {stat.passes?.touchdowns || 0}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {stat.passes?.interceptacoes || 0}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {stat.passes?.sacks || 0}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {stat.passes?.media?.toFixed(1) || '0.0'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {stat.passes?.percentual?.toFixed(0) || '0'}%
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {stat.passes?.fumbles || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}