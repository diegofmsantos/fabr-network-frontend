"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Tab = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full bg-[#0F1116] shadow-md border-t flex justify-around py-2 z-50">
        {/* Botão de Times */}
      <Link href="/">
        <div
          className={`flex flex-col items-center ${
            pathname != "/ranking" ? "text-green-500" : "text-gray-500"
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
              d="M12 2l8.485 7.485a2 2 0 01.515 2.574L12 22l-9-9 2.485-3.06 7.485-7.94z"
            />
          </svg>
          <span className="text-sm">Times</span>
        </div>
      </Link>
      
      {/* Botão de Estatísticas */}
      <Link href="/ranking">
        <div
          className={`flex flex-col items-center ${
            pathname === "/ranking" ? "text-green-500" : "text-gray-500"
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
          <span className="text-sm">Estatísticas</span>
        </div>
      </Link>
    </div>
  );
};
