"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState('');
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const getCurrentYear = () => new Date().getFullYear();
    const temporadaAtual = getCurrentYear().toString();

    useEffect(() => {
        if (pathname?.includes('/ranking')) {
            setActiveItem('ranking');
            if (!expandedItems.includes('ranking')) {
                setExpandedItems(prev => [...prev, 'ranking']);
            }
        } else if (pathname?.includes('/noticia')) {
            setActiveItem('noticias');
        } else if (pathname?.includes('/mercado')) {
            setActiveItem('mercado');
        } else if (pathname?.includes('/compare')) {
            setActiveItem('compare');
        } else if (pathname?.includes('/tabela')) {
            setActiveItem('tabela');
        } else {
            setActiveItem('equipes');
        }
    }, [pathname]);

    const toggleExpanded = (itemId: string) => {
        setExpandedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const isRankingExpanded = expandedItems.includes('ranking');
    const isRankingJogadores = pathname === '/ranking';
    const isRankingTimes = pathname?.includes('/ranking/times');

    return (
        <aside className={`hidden xl:flex flex-col w-80 h-[700px] bg-[#272731] fixed left-32 top-20 bottom-28 rounded-lg z-40 xl:w-72 xl:left-16 2xl:w-96 2xl:left-32 ${className}`}>
            <div className="flex justify-center items-center pt-2">
                <Link href="/">
                    <Image
                        src="/assets/logo-fabr-color.png"
                        alt="FABR Network"
                        width={200}
                        height={100}
                        priority
                        quality={100}
                        className="w-auto h-auto"
                    />
                </Link>
            </div>

            <nav className="flex flex-col px-6 gap-6">
                <Link
                    href="/"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center 
                        transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'equipes' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Equipes
                </Link>

                <div>
                    <button
                        onClick={() => toggleExpanded('ranking')}
                        className={`w-full text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center justify-between
                            transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'ranking' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                    >
                        <span>Rankings</span>
                        {isRankingExpanded ? (
                            <ChevronDown className="w-4 h-4 " />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
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
                    href={`/tabela/${temporadaAtual}/temporada-regular`}
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center 
                        transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'tabela' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Tabela
                </Link>

                <Link
                    href="/compare"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center 
                        transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'compare' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Compare
                </Link>

                <Link
                    href="/mercado"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center 
                        transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'mercado' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Mercado
                </Link>

                <Link
                    href="/noticias"
                    className={`text-xl uppercase font-extrabold italic tracking-[-1px] py-3 px-6 rounded-lg flex items-center 
                        transition-colors duration-300 hover:bg-[#373740] ${activeItem === 'noticias' ? 'bg-[#373740] text-[#63E300]' : 'text-white'}`}
                >
                    Notícias
                </Link>
            </nav>

            <div className="mt-auto p-4 text-gray-400 text-xs text-center">
                <p>© 2025 FABR Network</p>
                <p>Todos os direitos reservados</p>
            </div>
        </aside>
    );
};

export default Sidebar;