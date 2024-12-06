"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Tab = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full bg-[#0F1116] shadow-md border-t flex justify-around py-2 z-50">
      {/* Botão de Times */}
      <Link href="/">
        <div
          className={`flex flex-col items-center ${pathname != "/ranking" ? "text-[#63e300]" : "text-gray-400"
            }`}
        >
          <Image
            src={
              pathname != "/ranking"
                ? "/assets/logo-capacete-verde.png"
                : "/assets/logo-capacete-branco.png"
            }
            alt="capacete"
            width={25}
            height={25}
          />
          <span className="text-sm">Times</span>
        </div>
      </Link>

      {/* Botão de Estatísticas */}
      <Link href="/ranking">
        <div
          className={`flex flex-col items-center ${pathname === "/ranking" ? "text-[#63e300]" : "text-gray-400"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h4v10H3V10zm7-6h4v16h-4V4zm7 8h4v8h-4v-8z"
            />
          </svg>
          <span className="text-sm">Ranking</span>
        </div>
      </Link>
    </div>
  );
};
