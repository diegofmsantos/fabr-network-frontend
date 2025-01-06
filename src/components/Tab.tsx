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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h4v10H3V10zm7-6h4v16h-4V4zm7 8h4v8h-4v-8z" />
          </svg>
          <span className="text-sm">Ranking</span>
        </div>
      </Link>

      <Link href="/noticias">
        <div className={`flex flex-col items-center ${isNoticiasRoute ? "text-[#63E300]" : "text-gray-400"}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
          <span className="text-sm">Notícias</span>
        </div>
      </Link>
    </div>
  )
}