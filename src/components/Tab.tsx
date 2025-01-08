"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const Tab = () => {
  const pathname = usePathname()
  const isRankingRoute = pathname.startsWith('/ranking')
  const isNoticiasRoute = pathname.startsWith('/noticias')

  return (
    <div className="fixed bottom-0 w-full bg-[#272731] shadow-md border-t flex justify-around py-2 z-50">
      <Link href="/">
        <div className={`flex flex-col items-center ${!isRankingRoute && !isNoticiasRoute ? "text-[#63E300]" : "text-gray-400"}`}>
          <Image
            src={!isRankingRoute && !isNoticiasRoute ? "/assets/logo-capacete-verde.png" : "/assets/logo-capacete-branco.png"}
            alt="capacete"
            width={25}
            height={25}
          />
          <span className="text-sm">Times</span>
        </div>
      </Link>

      <Link href="/ranking">
        <div className={`flex flex-col items-center ${isRankingRoute ? "text-[#63E300]" : "text-gray-400"}`}>
          <Image
            src={isRankingRoute ? "/assets/ranking2.png" : "/assets/ranking.png"}
            alt="ranking"
            width={25}
            height={25}
          />
          <span className="text-sm">Ranking</span>
        </div>
      </Link>

      <Link href="/noticias">
        <div className={`flex flex-col items-center ${isNoticiasRoute ? "text-[#63E300]" : "text-gray-400"}`}>
          <Image
            src={isNoticiasRoute ? "/assets/news2.png" : "/assets/news.png"}
            alt="capacete"
            width={25}
            height={25}
          />
          <span className="text-sm">Notícias</span>
        </div>
      </Link>
    </div>
  )
}