"use client"

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useJogadores } from '@/hooks/useJogadores'
import { useTimes } from '@/hooks/useTimes'
import { Jogador, Estatisticas } from '@/types'
import { Loading } from '@/components/ui/Loading'
import { ImageService } from '@/utils/services/ImageService'
import { formatJardas } from '@/utils/services/FormatterService'
import { getPlayerSlug, getTeamSlug } from '@/utils/helpers/formatUrl'
import { CompareFilters } from '@/components/ui/CompareFilters'
import { useTemporada } from '@/hooks/queries'

const POSICOES = [
    { key: 'QB', label: 'QB', setor: 'Ataque' },
    { key: 'RB', label: 'RB', setor: 'Ataque' },
    { key: 'WR', label: 'WR', setor: 'Ataque' },
    { key: 'TE', label: 'TE', setor: 'Ataque' },
    { key: 'OL', label: 'OL', setor: 'Ataque' },
    { key: 'DL', label: 'DL', setor: 'Defesa' },
    { key: 'LB', label: 'LB', setor: 'Defesa' },
    { key: 'DB', label: 'DB', setor: 'Defesa' },
    { key: 'K', label: 'K', setor: 'Special' },
    { key: 'P', label: 'P', setor: 'Special' }
]

interface JogadorSelecionado {
    jogador: Jogador
    time: string
    teamLogo: string
    teamColor?: string
}

interface StatComparison {
    label: string
    categoria: keyof Estatisticas
    statKey: string
    format?: (value: number) => string
}

const STATS_CONFIG: Record<string, StatComparison[]> = {
    'QB': [
        { label: 'PASSES COMPLETOS', categoria: 'passe', statKey: 'passes_completos' },
        { label: 'PASSES TENTADOS', categoria: 'passe', statKey: 'passes_tentados' },
        {
            label: 'PASSES (%)', categoria: 'passe', statKey: 'passes_completos', format: (value) => {
                return value.toString()
            }
        },
        { label: 'JARDAS (TOTAIS)', categoria: 'passe', statKey: 'jardas_de_passe', format: formatJardas },
        { label: 'JARDAS (AVG)', categoria: 'passe', statKey: 'jardas_de_passe', format: (value) => value.toFixed(1) },
        { label: 'TOUCHDOWNS', categoria: 'passe', statKey: 'td_passados' },
        { label: 'INTERCEPTAÇÕES', categoria: 'passe', statKey: 'interceptacoes_sofridas' },
        { label: 'SACKS', categoria: 'passe', statKey: 'sacks_sofridos' },
        { label: 'FUMBLES', categoria: 'passe', statKey: 'fumble_de_passador' }
    ],
    'RB': [
        { label: 'CORRIDAS', categoria: 'corrida', statKey: 'corridas' },
        { label: 'JARDAS (TOTAIS)', categoria: 'corrida', statKey: 'jardas_corridas', format: formatJardas },
        { label: 'JARDAS (AVG)', categoria: 'corrida', statKey: 'jardas_corridas', format: (value) => value.toFixed(1) },
        { label: 'TOUCHDOWNS', categoria: 'corrida', statKey: 'tds_corridos' },
        { label: 'FUMBLES', categoria: 'corrida', statKey: 'fumble_de_corredor' },
        { label: 'RECEPÇÕES', categoria: 'recepcao', statKey: 'recepcoes' },
        { label: 'JARDAS REC.', categoria: 'recepcao', statKey: 'jardas_recebidas', format: formatJardas },
        { label: 'TDS REC.', categoria: 'recepcao', statKey: 'tds_recebidos' }
    ],
    'WR': [
        { label: 'RECEPÇÕES', categoria: 'recepcao', statKey: 'recepcoes' },
        { label: 'ALVOS', categoria: 'recepcao', statKey: 'alvo' },
        { label: 'JARDAS (TOTAIS)', categoria: 'recepcao', statKey: 'jardas_recebidas', format: formatJardas },
        { label: 'JARDAS (AVG)', categoria: 'recepcao', statKey: 'jardas_recebidas', format: (value) => value.toFixed(1) },
        { label: 'TOUCHDOWNS', categoria: 'recepcao', statKey: 'tds_recebidos' },
        { label: 'RETORNOS', categoria: 'retorno', statKey: 'retornos' },
        { label: 'JARDAS RET.', categoria: 'retorno', statKey: 'jardas_retornadas', format: formatJardas },
        { label: 'TDS RET.', categoria: 'retorno', statKey: 'td_retornados' }
    ],
    'TE': [
        { label: 'RECEPÇÕES', categoria: 'recepcao', statKey: 'recepcoes' },
        { label: 'ALVOS', categoria: 'recepcao', statKey: 'alvo' },
        { label: 'JARDAS (TOTAIS)', categoria: 'recepcao', statKey: 'jardas_recebidas', format: formatJardas },
        { label: 'JARDAS (AVG)', categoria: 'recepcao', statKey: 'jardas_recebidas', format: (value) => value.toFixed(1) },
        { label: 'TOUCHDOWNS', categoria: 'recepcao', statKey: 'tds_recebidos' }
    ],
    'DL': [
        { label: 'TACKLES TOTAIS', categoria: 'defesa', statKey: 'tackles_totais' },
        { label: 'TACKLES(LOSS)', categoria: 'defesa', statKey: 'tackles_for_loss' },
        { label: 'SACKS', categoria: 'defesa', statKey: 'sacks_forcado' },
        { label: 'FUMBLE FORCADO', categoria: 'defesa', statKey: 'fumble_forcado' },
        { label: 'INTERCEPTAÇÕES', categoria: 'defesa', statKey: 'interceptacao_forcada' },
        { label: 'PASSES DESV.', categoria: 'defesa', statKey: 'passe_desviado' },
        { label: 'TOUCHDOWNS', categoria: 'defesa', statKey: 'td_defensivo' },
        { label: 'SAFETIES', categoria: 'defesa', statKey: 'safety' }
    ],
    'LB': [
        { label: 'TACKLES TOTAIS', categoria: 'defesa', statKey: 'tackles_totais' },
        { label: 'TACKLES(LOSS)', categoria: 'defesa', statKey: 'tackles_for_loss' },
        { label: 'SACKS', categoria: 'defesa', statKey: 'sacks_forcado' },
        { label: 'FUMBLE FORCADO', categoria: 'defesa', statKey: 'fumble_forcado' },
        { label: 'INTERCEPTAÇÕES', categoria: 'defesa', statKey: 'interceptacao_forcada' },
        { label: 'PASSES DESV.', categoria: 'defesa', statKey: 'passe_desviado' },
        { label: 'TOUCHDOWNS', categoria: 'defesa', statKey: 'td_defensivo' },
        { label: 'SAFETIES', categoria: 'defesa', statKey: 'safety' }
    ],
    'DB': [
        { label: 'TACKLES TOTAIS', categoria: 'defesa', statKey: 'tackles_totais' },
        { label: 'TACKLES(LOSS)', categoria: 'defesa', statKey: 'tackles_for_loss' },
        { label: 'SACKS', categoria: 'defesa', statKey: 'sacks_forcado' },
        { label: 'FUMBLE FORCADO', categoria: 'defesa', statKey: 'fumble_forcado' },
        { label: 'INTERCEPTAÇÕES', categoria: 'defesa', statKey: 'interceptacao_forcada' },
        { label: 'PASSES DESV.', categoria: 'defesa', statKey: 'passe_desviado' },
        { label: 'TOUCHDOWNS', categoria: 'defesa', statKey: 'td_defensivo' },
        { label: 'SAFETIES', categoria: 'defesa', statKey: 'safety' }
    ],
    'K': [
        { label: 'FG BOM', categoria: 'kicker', statKey: 'fg_bons' },
        { label: 'FG TENTADOS', categoria: 'kicker', statKey: 'tentativas_de_fg' },
        { label: 'FG(%)', categoria: 'kicker', statKey: 'fg_bons', format: (value) => value.toString() },
        { label: 'MAIS LONGO', categoria: 'kicker', statKey: 'fg_mais_longo' },
        { label: 'XP BOM', categoria: 'kicker', statKey: 'xp_bons' },
        { label: 'XP TENTADOS', categoria: 'kicker', statKey: 'tentativas_de_xp' },
        { label: 'XP(%)', categoria: 'kicker', statKey: 'xp_bons', format: (value) => value.toString() }
    ],
    'P': [
        { label: 'PUNTS', categoria: 'punter', statKey: 'punts' },
        { label: 'JARDAS', categoria: 'punter', statKey: 'jardas_de_punt', format: formatJardas },
        { label: 'JARDAS(AVG)', categoria: 'punter', statKey: 'jardas_de_punt', format: (value) => value.toFixed(1) }
    ]
}

export default function CompararJogadoresPage() {
    const [posicaoSelecionada, setPosicaoSelecionada] = useState<string>('')
    const [jogador1, setJogador1] = useState<JogadorSelecionado | null>(null)
    const [jogador2, setJogador2] = useState<JogadorSelecionado | null>(null)
    const [searchTerm1, setSearchTerm1] = useState('')
    const [searchTerm2, setSearchTerm2] = useState('')
    const [showDropdown1, setShowDropdown1] = useState(false)
    const [showDropdown2, setShowDropdown2] = useState(false)

    const temporada = useTemporada()
    const { data: jogadores = [], isLoading: loadingJogadores } = useJogadores(temporada)
    const { data: times = [], isLoading: loadingTimes } = useTimes(temporada)

    useEffect(() => {
        document.title = "FABR Network - Comparar Jogadores"
    }, [])

    const handleFilterChange = (filter: 'jogadores' | 'times') => {
    }

    const jogadoresFiltrados = useMemo(() => {
        if (!posicaoSelecionada) return []

        return jogadores.filter(jogador =>
            jogador.posicao === posicaoSelecionada
        )
    }, [jogadores, posicaoSelecionada])

    const jogadoresDropdown1 = useMemo(() => {
        return jogadoresFiltrados.filter(jogador =>
            jogador.nome.toLowerCase().includes(searchTerm1.toLowerCase()) &&
            jogador.id !== jogador2?.jogador.id
        ).slice(0, 10)
    }, [jogadoresFiltrados, searchTerm1, jogador2])

    const jogadoresDropdown2 = useMemo(() => {
        return jogadoresFiltrados.filter(jogador =>
            jogador.nome.toLowerCase().includes(searchTerm2.toLowerCase()) &&
            jogador.id !== jogador1?.jogador.id
        ).slice(0, 10)
    }, [jogadoresFiltrados, searchTerm2, jogador1])

    const selecionarJogador = (jogador: Jogador, position: 1 | 2) => {
        const time = times.find(t => t.id === jogador.timeId)
        const jogadorSelecionado: JogadorSelecionado = {
            jogador,
            time: time?.nome || 'Time Desconhecido',
            teamLogo: ImageService.getTeamLogo(time?.nome || ''),
            teamColor: time?.cor
        }

        if (position === 1) {
            setJogador1(jogadorSelecionado)
            setSearchTerm1(jogador.nome)
            setShowDropdown1(false)
        } else {
            setJogador2(jogadorSelecionado)
            setSearchTerm2(jogador.nome)
            setShowDropdown2(false)
        }
    }

    const resetComparacao = () => {
        console.log('Reset comparação')
        setJogador1(null)
        setJogador2(null)
        setSearchTerm1('')
        setSearchTerm2('')
    }

    const obterValorEstatistica = (jogador: Jogador, stat: StatComparison) => {
        const categoria = jogador.estatisticas?.[stat.categoria]
        if (!categoria) return 0

        const valor = (categoria as any)[stat.statKey] || 0
        return typeof valor === 'number' ? valor : 0
    }

    const formatarValor = (valor: number, stat: StatComparison, jogador?: Jogador) => {
        if (stat.label.includes('(%)')) {
            if (stat.categoria === 'passe' && stat.statKey === 'passes_completos') {
                const tentativas = jogador?.estatisticas?.passe?.passes_tentados || 0
                const completos = valor
                return tentativas > 0 ? `${Math.round((completos / tentativas) * 100)}%` : '0%'
            }
            if (stat.categoria === 'kicker') {
                if (stat.statKey === 'fg_bons') {
                    const tentativas = jogador?.estatisticas?.kicker?.tentativas_de_fg || 0
                    return tentativas > 0 ? `${Math.round((valor / tentativas) * 100)}%` : '0%'
                }
                if (stat.statKey === 'xp_bons') {
                    const tentativas = jogador?.estatisticas?.kicker?.tentativas_de_xp || 0
                    return tentativas > 0 ? `${Math.round((valor / tentativas) * 100)}%` : '0%'
                }
            }
        }

        if (stat.label.includes('(AVG)')) {
            if (stat.categoria === 'passe') {
                const tentativas = jogador?.estatisticas?.passe?.passes_tentados || 0
                return tentativas > 0 ? (valor / tentativas).toFixed(1) : '0.0'
            }
            if (stat.categoria === 'corrida') {
                const corridas = jogador?.estatisticas?.corrida?.corridas || 0
                return corridas > 0 ? (valor / corridas).toFixed(1) : '0.0'
            }
            if (stat.categoria === 'recepcao') {
                const recepcoes = jogador?.estatisticas?.recepcao?.recepcoes || 0
                return recepcoes > 0 ? (valor / recepcoes).toFixed(1) : '0.0'
            }
            if (stat.categoria === 'punter') {
                const punts = jogador?.estatisticas?.punter?.punts || 0
                return punts > 0 ? (valor / punts).toFixed(1) : '0.0'
            }
        }

        if (stat.format) {
            return stat.format(valor)
        }

        return valor.toString()
    }

    const statsParaComparacao = useMemo(() => {
        if (!posicaoSelecionada) return []
        return STATS_CONFIG[posicaoSelecionada] || []
    }, [posicaoSelecionada])

    if (loadingJogadores || loadingTimes) {
        return <Loading />
    }

    const getPlayerUrl = (jogador: Jogador, timeNome: string) => {
        const teamSlug = getTeamSlug(timeNome)
        const playerSlug = getPlayerSlug(jogador.nome)
        return `/${teamSlug}/${playerSlug}`
    }

    return (
        <div className="min-h-screen bg-[#ECECEC]">
            <CompareFilters
                currentFilter="jogadores"
                onFilterChange={handleFilterChange}
            />

            <div className="px-4 py-8 md:py-5 xl:mt-4 xl:w-[1100px] xl:ml-60 2xl:ml-[600px] ">
                <div className="mb-8 xl:ml-32">
                    <h2 className="text-xl font-bold mb-4">Selecione a Posição</h2>
                    <div className="flex flex-wrap gap-2 md:justify-around">
                        {POSICOES.map((posicao) => (
                            <button
                                key={posicao.key}
                                onClick={() => {
                                    setPosicaoSelecionada(posicao.key)
                                    resetComparacao()
                                }}
                                className={`px-4 py-2 rounded-lg bg-black font-medium lg:w-20 xl:text-lg transition-colors ${posicaoSelecionada === posicao.key
                                    ? ' text-[#63E300]'
                                    : '  text-white border border-gray-300 hover:opacity-70'
                                    }`}
                            >
                                {posicao.label}
                            </button>
                        ))}
                    </div>
                    {posicaoSelecionada && (
                        <div className="mt-2 text-sm text-black">
                            Posição selecionada: {posicaoSelecionada} | Jogadores disponíveis: {jogadoresFiltrados.length}
                        </div>
                    )}
                </div>

                {posicaoSelecionada && (
                    <div className="mb-8 xl:ml-32">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-black mb-2">
                                    Primeiro Jogador
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm1}
                                    onChange={(e) => {
                                        setSearchTerm1(e.target.value)
                                        setShowDropdown1(true)
                                    }}
                                    onFocus={() => setShowDropdown1(true)}
                                    placeholder={`Buscar ${posicaoSelecionada}...`}
                                    className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-[#63E300] focus:border-transparent"
                                />

                                {showDropdown1 && searchTerm1 && jogadoresDropdown1.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-black rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {jogadoresDropdown1.map((jogador) => {
                                            const time = times.find(t => t.id === jogador.timeId)
                                            return (
                                                <button
                                                    key={jogador.id}
                                                    onClick={() => selecionarJogador(jogador, 1)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <Image
                                                        src={ImageService.getTeamLogo(time?.nome || '')}
                                                        alt={time?.nome || ''}
                                                        width={24}
                                                        height={24}
                                                        className="rounded"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{jogador.nome}</div>
                                                        <div className="text-sm text-black">
                                                            #{jogador.numero} • {time?.nome}
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-black mb-2">
                                    Segundo Jogador
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm2}
                                    onChange={(e) => {
                                        setSearchTerm2(e.target.value)
                                        setShowDropdown2(true)
                                    }}
                                    onFocus={() => setShowDropdown2(true)}
                                    placeholder={`Buscar ${posicaoSelecionada}...`}
                                    className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-[#63E300] focus:border-transparent"
                                />

                                {showDropdown2 && searchTerm2 && jogadoresDropdown2.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-black rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {jogadoresDropdown2.map((jogador) => {
                                            const time = times.find(t => t.id === jogador.timeId)
                                            return (
                                                <button
                                                    key={jogador.id}
                                                    onClick={() => selecionarJogador(jogador, 2)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                                                >
                                                    <Image
                                                        src={ImageService.getTeamLogo(time?.nome || '')}
                                                        alt={time?.nome || ''}
                                                        width={24}
                                                        height={24}
                                                        className="rounded"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{jogador.nome}</div>
                                                        <div className="text-sm text-black">
                                                            #{jogador.numero} • {time?.nome}
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {jogador1 && jogador2 && (
                    <div className="mb-8 xl:ml-32">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Link href={getPlayerUrl(jogador1.jogador, jogador1.time)}>
                                <div
                                    className="bg-white rounded-lg overflow-hidden shadow-lg relative"
                                    style={{ backgroundColor: jogador1.teamColor || '#ffffff' }}
                                >
                                    <div className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div className="text-white">
                                                <h3 className="text-2xl font-extrabold italic leading-[35px] tracking-[-1px] mb-1 md:text-3xl">
                                                    {jogador1.jogador.nome.split(' ')[0]}
                                                </h3>
                                                <h2 className="text-3xl font-extrabold italic leading-[35px] tracking-[-2px] uppercase md:text-4xl">
                                                    {jogador1.jogador.nome.split(' ').slice(1).join(' ')}
                                                </h2>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Image
                                                        src={jogador1.teamLogo}
                                                        alt={jogador1.time}
                                                        width={32}
                                                        height={32}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">{jogador1.time}</span>
                                                </div>
                                            </div>
                                            <div className="relative w-40 h-40 ">
                                                <Image
                                                    src={ImageService.getPlayerShirt(jogador1.time, jogador1.jogador.camisa || '')}
                                                    fill
                                                    alt="Camisa"
                                                    className="object-contain scale-150"
                                                    style={{
                                                        transform: 'scale(1.4) translateX(15px)'
                                                    }}
                                                    onError={(e) => ImageService.handlePlayerShirtError(e, jogador1.time, jogador1.jogador.camisa || '')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href={getPlayerUrl(jogador2.jogador, jogador2.time)}>
                                <div
                                    className="bg-white rounded-lg overflow-hidden shadow-lg relative"
                                    style={{ backgroundColor: jogador2.teamColor || '#ffffff' }}
                                >
                                    <div className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div className="text-white">
                                                <h3 className="text-2xl font-extrabold italic leading-[35px] tracking-[-1px] mb-1 md:text-3xl">
                                                    {jogador2.jogador.nome.split(' ')[0]}
                                                </h3>
                                                <h2 className="text-3xl font-extrabold italic leading-[35px] tracking-[-2px] uppercase md:text-4xl">
                                                    {jogador2.jogador.nome.split(' ').slice(1).join(' ')}
                                                </h2>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Image
                                                        src={jogador2.teamLogo}
                                                        alt={jogador2.time}
                                                        width={32}
                                                        height={32}
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm">{jogador2.time}</span>
                                                </div>
                                            </div>
                                            <div className="relative w-40 h-40 ">
                                                <Image
                                                    src={ImageService.getPlayerShirt(jogador2.time, jogador2.jogador.camisa || '')}
                                                    fill
                                                    alt="Camisa"
                                                    className="object-contain scale-150"
                                                    style={{
                                                        transform: 'scale(1.4) translateX(15px) '
                                                    }}
                                                    onError={(e) => ImageService.handlePlayerShirtError(e, jogador2.time, jogador2.jogador.camisa || '')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                )}

                {jogador1 && jogador2 && (
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-20 xl:ml-32">
                        <div className="overflow-x-auto">
                            <div className="w-full">
                                <div className="bg-gray-50 p-2">
                                    <div className='flex justify-between lg:justify-around'>
                                        <div className=" px-2 py-2 text-center text-[10px] font-bold italic text-black uppercase tracking-wider md:text-lg">
                                            {jogador1.jogador.nome}
                                        </div>
                                        <div className=" px-2 py-2 text-center text-[10px] font-bold italic text-black uppercase tracking-wider md:text-lg">
                                            ESTATÍSTICA
                                        </div>
                                        <div className=" px-2 py-2 text-center text-[10px] font-bold italic text-black uppercase tracking-wider md:text-lg">
                                            {jogador2.jogador.nome}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white divide-y divide-black">
                                    {statsParaComparacao.map((stat, index) => {
                                        const valor1 = obterValorEstatistica(jogador1.jogador, stat)
                                        const valor2 = obterValorEstatistica(jogador2.jogador, stat)
                                        const formatado1 = formatarValor(valor1, stat, jogador1.jogador)
                                        const formatado2 = formatarValor(valor2, stat, jogador2.jogador)

                                        const melhor1 = valor1 > valor2
                                        const melhor2 = valor2 > valor1
                                        const empate = valor1 === valor2

                                        return (
                                            <div key={index} className={`flex justify-between items-center py-3 px-4 lg:justify-around ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                <div className={`text-2xl font-bold italic md:text-3xl tracking-[-1px] ${empate ? 'text-black' : melhor1 ? 'text-[#63E300]' : 'text-black'
                                                    }`}>
                                                    {formatado1}
                                                </div>
                                                <div className="text-sm font-semibold text-black uppercase italic tracking-[-1px] md:text-lg lg:text-center lg:min-w-[300px]">
                                                    {stat.label}
                                                </div>
                                                <div className={`text-2xl font-bold italic md:text-3xl tracking-[-1px] ${empate ? 'text-black' : melhor2 ? 'text-[#63E300]' : 'text-black'
                                                    }`}>
                                                    {formatado2}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!posicaoSelecionada && (
                    <div className="text-center py-12">
                        <div className="text-black text-lg">
                            Selecione uma posição para começar a comparação
                        </div>
                    </div>
                )}

                {posicaoSelecionada && (!jogador1 || !jogador2) && (
                    <div className="text-center py-12">
                        <div className="text-black text-lg">
                            Selecione dois jogadores para compará-los
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}