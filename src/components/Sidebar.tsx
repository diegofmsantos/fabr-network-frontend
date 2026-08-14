/**
 * Sidebar.tsx — atualizado para D1/D2
 * Substitui: src/components/Sidebar.tsx (frontend de exibição)
 *
 * MUDANÇAS:
 *  - Remove `temporadaAtual = 2025` hardcoded
 *  - Lê temporada + divisao do store para montar o link da Tabela
 *  - Importa TemporadaSelector já existente (que agora tem D1/D2)
 */
"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useTemporadaStore } from '@/stores/temporadaStore'
import { TemporadaSelector } from '@/components/ui/TemporadaSelector'
import { useJanelaRedzone } from '@/hooks/useJanelaRedzone'

interface SidebarProps {
    className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const pathname = usePathname()
    const [activeItem, setActiveItem] = useState('')
    const [expandedItems, setExpandedItems] = useState<string[]>([])

    const temporada = useTemporadaStore((s) => s.temporada)
    const divisao = useTemporadaStore((s) => s.divisao)
    const hasHydrated = useTemporadaStore((s) => s.hasHydrated)
    const { isLive } = useJanelaRedzone()

    // URL base da tabela baseada na liga ativa
    const divSlug = (hasHydrated ? divisao : 'D1').toLowerCase()
    const tempAtual = hasHydrated ? temporada : '2026'
    const tabelaUrl = `/tabela/${divSlug}/${tempAtual}/temporada-regular`

    useEffect(() => {
        if (pathname?.includes('/ranking')) {
            setActiveItem('ranking')
            if (!expandedItems.includes('ranking')) setExpandedItems(prev => [...prev, 'ranking'])
        } else if (pathname?.includes('/compare')) {
            setActiveItem('compare')
            if (!expandedItems.includes('compare')) setExpandedItems(prev => [...prev, 'compare'])
        } else if (pathname?.includes('/noticia')) {
            setActiveItem('noticias')
        } else if (pathname?.includes('/redzone')) {
            setActiveItem('redzone')
        } else if (pathname?.includes('/mercado')) {
            setActiveItem('mercado')
        } else if (pathname?.includes('/tabela')) {
            setActiveItem('tabela')
        } else {
            setActiveItem('equipes')
        }
    }, [pathname])

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        )
    }

    const isRankingExpanded = expandedItems.includes('ranking')
    const isRankingJogadores = pathname === '/ranking'
    const isRankingTimes = pathname?.includes('/ranking/times')
    const isCompareExpanded = expandedItems.includes('compare')
    const isCompareJogadores = pathname === '/compare/jogadores'
    const isCompareTimes = pathname?.includes('/compare/times')

    return (
        <aside className={`hidden xl:flex flex-col w-80 h-[800px] bg-black fixed left-32 top-10 bottom-28 rounded-lg z-40 xl:w-72 xl:left-16 2xl:w-96 2xl:left-32 ${className}`}>
            <div className="flex justify-center items-center">
                <Link href="/">
                    <Image
                        src="/assets/logo-fabr-color.png"
                        alt="FABR Network"
                        width={200}
                        height={100}
                        priority
                        quality={85}
                        className="w-auto h-auto"
                    />
                </Link>
            </div>

            {/* Seletor de liga */}
            <div className="flex justify-center mb-2">
                <TemporadaSelector />
            </div>

            <nav className="flex flex-col px-6 gap-4">
                <Link
                    href="/"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-2 px-6 rounded-lg flex items-center 
            transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'equipes' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Equipes
                </Link>

                <div>
                    <button
                        onClick={() => toggleExpanded('ranking')}
                        className={`w-full text-xl uppercase font-extrabold italic tracking-[-1px] py-2 px-6 rounded-lg flex items-center justify-between
              transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'ranking' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                    >
                        <span>Rankings</span>
                        {isRankingExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {isRankingExpanded && (
                        <div className="ml-6 mt-2 space-y-2">
                            <Link
                                href="/ranking"
                                className={`block text-lg uppercase font-extrabold italic tracking-[-1px] py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-[#373740]
                  ${isRankingJogadores ? 'bg-[#373740] text-[#63E300]' : 'text-gray-300 hover:text-[#63E300]'}`}
                            >
                                Jogadores
                            </Link>
                            <Link
                                href="/ranking/times"
                                className={`block text-lg uppercase font-extrabold italic tracking-[-1px] py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-[#373740]
                  ${isRankingTimes ? 'bg-[#373740] text-[#63E300]' : 'text-gray-300 hover:text-[#63E300]'}`}
                            >
                                Times
                            </Link>
                        </div>
                    )}
                </div>

                <Link
                    href={tabelaUrl}
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-2 px-6 rounded-lg flex items-center 
            transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'tabela' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Tabela
                </Link>

                <div>
                    <button
                        onClick={() => toggleExpanded('compare')}
                        className={`w-full text-xl uppercase font-extrabold italic tracking-[-1px] py-2 px-6 rounded-lg flex items-center justify-between
              transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'compare' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                    >
                        <span>Compare</span>
                        {isCompareExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {isCompareExpanded && (
                        <div className="ml-6 mt-2 space-y-2">
                            <Link
                                href="/compare"
                                className={`block text-lg uppercase font-extrabold italic tracking-[-1px] py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-[#373740]
                  ${isCompareJogadores ? 'bg-[#373740] text-[#63E300]' : 'text-gray-300 hover:text-[#63E300]'}`}
                            >
                                Jogadores
                            </Link>
                            <Link
                                href="/compare/times"
                                className={`block text-lg uppercase font-extrabold italic tracking-[-1px] py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-[#373740]
                  ${isCompareTimes ? 'bg-[#373740] text-[#63E300]' : 'text-gray-300 hover:text-[#63E300]'}`}
                            >
                                Times
                            </Link>
                        </div>
                    )}
                </div>

                <Link
                    href="/noticias"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-2 px-6 rounded-lg flex items-center
            transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'noticias' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Notícias
                </Link>

                <Link
                    href="/redzone"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-2 px-6 rounded-lg flex items-center gap-2
            transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'redzone' ? 'bg-[#373740]' : ''} ${isLive ? 'animate-live-blink' : activeItem === 'redzone' ? 'text-[#63E300]' : 'text-white'}`}
                >
                    {isLive && <span className="w-2.5 h-2.5 rounded-full animate-live-blink-bg" />}
                    Redzone
                </Link>

                <Link
                    href="/mercado"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-2 px-6 rounded-lg flex items-center 
            transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'mercado' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Mercado
                </Link>
            </nav>
        </aside>
    )
}

export default Sidebar