"use client"

import React, { useState, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useTimes } from '@/hooks/useTimes'
import { Time } from '@/types'
import { Loading } from '@/components/ui/Loading'
import { ImageService } from '@/utils/services/ImageService'
import { formatJardas } from '@/utils/services/FormatterService'
import { getTeamSlug } from '@/utils/helpers/formatUrl'

interface TimeSelecionado {
    time: Time
    teamLogo: string
    teamColor?: string
}

interface StatComparison {
    label: string
    categoria: string
    statKey: string
    format?: (value: number) => string
}

const STATS_CONFIG: StatComparison[] = [
    { label: 'PASSES COMPLETOS', categoria: 'passe', statKey: 'passes_completos' },
    { label: 'PASSES TENTADOS', categoria: 'passe', statKey: 'passes_tentados' },
    { label: 'PASSES (%)', categoria: 'passe', statKey: 'passes_percentual' },
    { label: 'JARDAS DE PASSE', categoria: 'passe', statKey: 'jardas_de_passe', format: formatJardas },
    { label: 'TD PASSADOS', categoria: 'passe', statKey: 'td_passados' },
    { label: 'INTERCEPTAÇÕES', categoria: 'passe', statKey: 'interceptacoes_sofridas' },
    { label: 'CORRIDAS', categoria: 'corrida', statKey: 'corridas' },
    { label: 'JARDAS CORRIDAS', categoria: 'corrida', statKey: 'jardas_corridas', format: formatJardas },
    { label: 'TD CORRIDOS', categoria: 'corrida', statKey: 'tds_corridos' },
    { label: 'RECEPÇÕES', categoria: 'recepcao', statKey: 'recepcoes' },
    { label: 'JARDAS RECEBIDAS', categoria: 'recepcao', statKey: 'jardas_recebidas', format: formatJardas },
    { label: 'TD RECEBIDOS', categoria: 'recepcao', statKey: 'tds_recebidos' },
    { label: 'TACKLES TOTAIS', categoria: 'defesa', statKey: 'tackles_totais' },
    { label: 'SACKS', categoria: 'defesa', statKey: 'sacks_forcado' },
    { label: 'INTERCEPTAÇÕES', categoria: 'defesa', statKey: 'interceptacao_forcada' },
    { label: 'FUMBLES FORÇADOS', categoria: 'defesa', statKey: 'fumble_forcado' },
    { label: 'FIELD GOALS', categoria: 'kicker', statKey: 'fg_bons' },
    { label: 'EXTRA POINTS', categoria: 'kicker', statKey: 'xp_bons' },
    { label: 'PUNTS', categoria: 'punter', statKey: 'punts' },
    { label: 'JARDAS DE PUNT', categoria: 'punter', statKey: 'jardas_de_punt', format: formatJardas }
]

export default function CompararTimesPage() {
    const [time1, setTime1] = useState<TimeSelecionado | null>(null)
    const [time2, setTime2] = useState<TimeSelecionado | null>(null)
    const [searchTerm1, setSearchTerm1] = useState('')
    const [searchTerm2, setSearchTerm2] = useState('')
    const [showDropdown1, setShowDropdown1] = useState(false)
    const [showDropdown2, setShowDropdown2] = useState(false)

    const { data: times = [], isLoading: loadingTimes } = useTimes('2025')

    const timesFiltrados = useMemo(() => {
        return times
    }, [times])

    const timesDropdown1 = useMemo(() => {
        return timesFiltrados.filter(time =>
            time.nome?.toLowerCase().includes(searchTerm1.toLowerCase()) &&
            time.id !== time2?.time.id
        ).slice(0, 10)
    }, [timesFiltrados, searchTerm1, time2])

    const timesDropdown2 = useMemo(() => {
        return timesFiltrados.filter(time =>
            time.nome?.toLowerCase().includes(searchTerm2.toLowerCase()) &&
            time.id !== time1?.time.id
        ).slice(0, 10)
    }, [timesFiltrados, searchTerm2, time1])

    const selecionarTime = (time: Time, position: 1 | 2) => {
        const timeSelecionado: TimeSelecionado = {
            time,
            teamLogo: ImageService.getTeamLogo(time.nome || ''),
            teamColor: time.cor
        }

        if (position === 1) {
            setTime1(timeSelecionado)
            setSearchTerm1(time.nome || '')
            setShowDropdown1(false)
        } else {
            setTime2(timeSelecionado)
            setSearchTerm2(time.nome || '')
            setShowDropdown2(false)
        }
    }

    const resetComparacao = () => {
        setTime1(null)
        setTime2(null)
        setSearchTerm1('')
        setSearchTerm2('')
    }

    const obterValorEstatistica = (time: Time, stat: StatComparison) => {
        if (!time.jogadores || time.jogadores.length === 0) return 0
        
        let total = 0
        
       time.jogadores.forEach(jogador => {  
        if (jogador?.estatisticas) {  
            const categoria = jogador.estatisticas[stat.categoria as keyof typeof jogador.estatisticas]
            if (categoria) {
                const valor = (categoria as any)[stat.statKey] || 0
                total += typeof valor === 'number' ? valor : 0
            }
        }
    })
        
        if (stat.statKey === 'passes_percentual') {
            const jogadoresComPasses = time.jogadores.filter(jt => 
                jt.jogador?.estatisticas?.passe?.passes_tentados && 
                jt.jogador.estatisticas.passe.passes_tentados > 0
            )
            
            if (jogadoresComPasses.length === 0) return 0
            
            const somaPercentuais = jogadoresComPasses.reduce((acc, jt) => {
                const passe = jt.jogador!.estatisticas!.passe
                const percentual = (passe.passes_completos / passe.passes_tentados) * 100
                return acc + percentual
            }, 0)
            
            return Math.round(somaPercentuais / jogadoresComPasses.length)
        }
        
        return total
    }

    const formatarValor = (valor: number, stat: StatComparison) => {
        if (stat.statKey === 'passes_percentual') {
            return `${Math.round(valor)}%`
        }

        if (stat.format) {
            return stat.format(valor)
        }

        return valor.toString()
    }

    if (loadingTimes) {
        return <Loading />
    }

    const getTeamUrl = (time: Time) => {
        const teamSlug = getTeamSlug(time.nome || '')
        return `/${teamSlug}`
    }

    return (
        <div className="min-h-screen bg-[#ECECEC]">
            <div className="border-b border-gray-200 px-4 py-4 xl:ml-80 2xl:ml-[550px]">
                <div className="mt-20 max-w-7xl mx-auto flex flex-col items-center gap-5 xl:mt-7">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black">
                        <ArrowLeft size={20} />
                        <span>Voltar</span>
                    </Link>
                    <h1 className="text-3xl font-extrabold italic leading-[35px] tracking-[-3px] md:text-5xl">COMPARAR TIMES</h1>
                </div>
            </div>

            <div className="xl:ml-80 2xl:ml-[550px] px-4 py-8 md:py-5">
                <div className="mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Primeiro Time
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm1}
                                    onChange={(e) => {
                                        setSearchTerm1(e.target.value)
                                        setShowDropdown1(true)
                                    }}
                                    onFocus={() => setShowDropdown1(true)}
                                    placeholder={`Buscar time...`}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63E300] focus:border-transparent"
                                />

                                {showDropdown1 && searchTerm1 && timesDropdown1.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {timesDropdown1.map((time) => (
                                            <button
                                                key={time.id}
                                                onClick={() => selecionarTime(time, 1)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                                            >
                                                <Image
                                                    src={ImageService.getTeamLogo(time.nome || '')}
                                                    alt={time.nome || ''}
                                                    width={24}
                                                    height={24}
                                                    className="rounded"
                                                />
                                                <div>
                                                    <div className="font-medium">{time.nome}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {time.cidade} • {time.sigla}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Segundo Time
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm2}
                                    onChange={(e) => {
                                        setSearchTerm2(e.target.value)
                                        setShowDropdown2(true)
                                    }}
                                    onFocus={() => setShowDropdown2(true)}
                                    placeholder={`Buscar time...`}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63E300] focus:border-transparent"
                                />

                                {showDropdown2 && searchTerm2 && timesDropdown2.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {timesDropdown2.map((time) => (
                                            <button
                                                key={time.id}
                                                onClick={() => selecionarTime(time, 2)}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                                            >
                                                <Image
                                                    src={ImageService.getTeamLogo(time.nome || '')}
                                                    alt={time.nome || ''}
                                                    width={24}
                                                    height={24}
                                                    className="rounded"
                                                />
                                                <div>
                                                    <div className="font-medium">{time.nome}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {time.cidade} • {time.sigla}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                
                {time1 && time2 && (
                    <div className="mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Link href={getTeamUrl(time1.time)}>
                                <div
                                    className="bg-white rounded-lg overflow-hidden shadow-lg relative"
                                    style={{ backgroundColor: time1.teamColor || '#ffffff' }}
                                >
                                    <div className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div className="text-white">
                                                <h3 className="text-2xl font-extrabold italic leading-[35px] tracking-[-1px] mb-1 md:text-3xl">
                                                    {time1.time.nome?.split(' ')[0]}
                                                </h3>
                                                <h2 className="text-3xl font-extrabold italic leading-[35px] tracking-[-2px] uppercase md:text-4xl">
                                                    {time1.time.nome?.split(' ').slice(1).join(' ')}
                                                </h2>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="text-sm">{time1.time.cidade}</span>
                                                    <span className="text-sm">•</span>
                                                    <span className="text-sm">{time1.time.sigla}</span>
                                                </div>
                                            </div>
                                            <div className="relative w-40 h-40">
                                                <Image
                                                    src={time1.teamLogo}
                                                    fill
                                                    alt="Logo"
                                                    className="object-contain scale-150"
                                                    style={{
                                                        transform: 'scale(1.2)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href={getTeamUrl(time2.time)}>
                                <div
                                    className="bg-white rounded-lg overflow-hidden shadow-lg relative"
                                    style={{ backgroundColor: time2.teamColor || '#ffffff' }}
                                >
                                    <div className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div className="text-white">
                                                <h3 className="text-2xl font-extrabold italic leading-[35px] tracking-[-1px] mb-1 md:text-3xl">
                                                    {time2.time.nome?.split(' ')[0]}
                                                </h3>
                                                <h2 className="text-3xl font-extrabold italic leading-[35px] tracking-[-2px] uppercase md:text-4xl">
                                                    {time2.time.nome?.split(' ').slice(1).join(' ')}
                                                </h2>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <span className="text-sm">{time2.time.cidade}</span>
                                                    <span className="text-sm">•</span>
                                                    <span className="text-sm">{time2.time.sigla}</span>
                                                </div>
                                            </div>
                                            <div className="relative w-40 h-40">
                                                <Image
                                                    src={time2.teamLogo}
                                                    fill
                                                    alt="Logo"
                                                    className="object-contain scale-150"
                                                    style={{
                                                        transform: 'scale(1.2)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

                {time1 && time2 && (
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-20">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className=" px-2 py-2 text-center text-[10px] font-bold text-gray-900 uppercase tracking-wider md:text-lg">
                                            {time1.time.nome?.split(' ')[0]}
                                        </th>
                                        <th className=" px-2 py-2 text-center text-[10px] font-bold text-gray-900 uppercase tracking-wider md:text-lg">
                                            ESTATÍSTICA
                                        </th>
                                        <th className=" px-2 py-2 text-center text-[10px] font-bold text-gray-900 uppercase tracking-wider md:text-lg">
                                            {time2.time.nome?.split(' ')[0]}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {STATS_CONFIG.map((stat, index) => {
                                        const valor1 = obterValorEstatistica(time1.time, stat)
                                        const valor2 = obterValorEstatistica(time2.time, stat)
                                        const formatado1 = formatarValor(valor1, stat)
                                        const formatado2 = formatarValor(valor2, stat)

                                        const melhor1 = valor1 > valor2
                                        const melhor2 = valor2 > valor1
                                        const empate = valor1 === valor2

                                        return (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className={`px-4 py-4 whitespace-nowrap text-center text-lg font-bold ${empate ? 'text-gray-900' : melhor1 ? 'text-green-600' : 'text-black'
                                                    }`}>
                                                    {formatado1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-[11px] font-medium text-gray-900 md:text-base">
                                                    {stat.label}
                                                </td>
                                                <td className={`px-4 py-4 whitespace-nowrap text-center text-lg font-bold ${empate ? 'text-gray-900' : melhor2 ? 'text-green-600' : 'text-black'
                                                    }`}>
                                                    {formatado2}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {(!time1 || !time2) && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            Selecione dois times para compará-los
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}