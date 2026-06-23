/**
 * Tab.tsx — atualizado para D1/D2
 * Substitui: src/components/Tab.tsx (frontend de exibição)
 *
 * MUDANÇAS:
 *  - Remove `temporadaAtual = 2025` hardcoded
 *  - Lê temporada + divisao do store
 */
"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Sobre } from "./Sobre"
import { useTemporadaStore } from '@/stores/temporadaStore'

export const Tab = () => {
  const pathname = usePathname()
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  const temporada = useTemporadaStore((s) => s.temporada)
  const divisao = useTemporadaStore((s) => s.divisao)
  const hasHydrated = useTemporadaStore((s) => s.hasHydrated)

  const divSlug = (hasHydrated ? divisao : 'D1').toLowerCase()
  const tempAtual = hasHydrated ? temporada : '2026'
  const tabelaUrl = `/tabela/${divSlug}/${tempAtual}/temporada-regular`

  const isHomeRoute = pathname === "/"
  const isRankingRoute = pathname.includes("/ranking")
  const isTabelaRoute = pathname.includes("/tabela")
  const isCompararRoute = pathname.includes("/compare")
  const isMercadoRoute = pathname.includes("/mercado")
  const isNoticiasRoute = pathname.includes("/noticias")

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-[#272731] border-t border-gray-600 z-50 xl:hidden">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#272731] via-[#272731]/90 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#272731] via-[#272731]/90 to-transparent z-10 pointer-events-none"></div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max px-2 md:justify-between">
              <Link href="/" className="flex-none">
                <div className={`flex flex-col items-center px-3 py-3 ${isHomeRoute ? "text-[#63E300]" : "text-gray-400"}`}>
                  <Image src={isHomeRoute ? "/assets/times.png" : "/assets/times-2.png"} alt="home" width={25} height={25} />
                  <span className="text-[12px] whitespace-nowrap">Home</span>
                </div>
              </Link>
              <Link href="/ranking" className="flex-none">
                <div className={`flex flex-col items-center px-3 py-3 ${isRankingRoute ? "text-[#63E300]" : "text-gray-400"}`}>
                  <Image src={isRankingRoute ? "/assets/rankings.png" : "/assets/rankings-2.png"} alt="ranking" width={25} height={25} />
                  <span className="text-[12px] whitespace-nowrap">Ranking</span>
                </div>
              </Link>
              <Link href={tabelaUrl} className="flex-none">
                <div className={`flex flex-col items-center px-3 py-3 ${isTabelaRoute ? "text-[#63E300]" : "text-gray-400"}`}>
                  <Image src={isTabelaRoute ? "/assets/tabela.png" : "/assets/tabela-2.png"} alt="tabela" width={25} height={25} />
                  <span className="text-[12px] whitespace-nowrap">Tabela</span>
                </div>
              </Link>
              <Link href="/compare" className="flex-none">
                <div className={`flex flex-col items-center px-3 py-3 ${isCompararRoute ? "text-[#63E300]" : "text-gray-400"}`}>
                  <Image src={isCompararRoute ? "/assets/compare.png" : "/assets/compare-2.png"} alt="compare" width={25} height={25} />
                  <span className="text-[12px] whitespace-nowrap">Compare</span>
                </div>
              </Link>
              <Link href="/noticias" className="flex-none">
                <div className={`flex flex-col items-center px-3 py-3 ${isNoticiasRoute ? "text-[#63E300]" : "text-gray-400"}`}>
                  <Image src={isNoticiasRoute ? "/assets/noticias.png" : "/assets/noticias-2.png"} alt="noticias" width={25} height={25} />
                  <span className="text-[12px] whitespace-nowrap">Notícias</span>
                </div>
              </Link>
              <Link href="/mercado" className="flex-none">
                <div className={`flex flex-col items-center px-3 py-3 ${isMercadoRoute ? "text-[#63E300]" : "text-gray-400"}`}>
                  <Image src={isMercadoRoute ? "/assets/mercado.png" : "/assets/mercado-2.png"} alt="mercado" width={25} height={25} />
                  <span className="text-[12px] whitespace-nowrap">Mercado</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}