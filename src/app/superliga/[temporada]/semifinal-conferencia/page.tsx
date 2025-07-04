"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const semifinalData = {
  SUDESTE: {
    nome: "CONFERÊNCIA SUDESTE",
    cor: "bg-red-600",
    jogos: [
      {
        id: 1,
        time1: "1º melhor 1º",
        time2: "Wildcard",
        descricao: "1º melhor 1º × Wildcard"
      },
      {
        id: 2,
        time1: "2º melhor 1º", 
        time2: "Wildcard",
        descricao: "2º melhor 1º × Wildcard"
      }
    ]
  },
  SUL: {
    nome: "CONFERÊNCIA SUL",
    cor: "bg-cyan-500",
    jogos: [
      {
        id: 1,
        time1: "1º Araucária",
        time2: "Wildcard",
        descricao: "1º Araucária × Wildcard"
      },
      {
        id: 2,
        time1: "1º Pampa",
        time2: "Wildcard", 
        descricao: "1º Pampa × Wildcard"
      }
    ]
  },
  NORDESTE: {
    nome: "CONFERÊNCIA NORDESTE",
    cor: "bg-orange-500", 
    jogos: [
      {
        id: 1,
        time1: "1º Atlântico",
        time2: "3º ou Wildcard",
        descricao: "1º Atlântico × 3º ou Wildcard"
      },
      {
        id: 2,
        time1: "2º Atlântico",
        time2: "3º ou Wildcard",
        descricao: "2º Atlântico × 3º ou Wildcard"
      }
    ]
  },
  CENTRO_NORTE: {
    nome: "CONFERÊNCIA CENTRO-NORTE",
    cor: "bg-green-600",
    jogos: [
      {
        id: 1,
        time1: "1º Cerrado",
        time2: "2º Cerrado",
        descricao: "1º Cerrado × 2º Cerrado"
      },
      {
        id: 2,
        time1: "1º Amazônia",
        time2: "2º Amazônia",
        descricao: "1º Amazônia × 2º Amazônia"
      }
    ]
  }
}

export default function SemifinalConferenciaPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const conferencias = Object.values(semifinalData)

  return (
    <div>
      <div className="xl:ml-80 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[900px] md:h-14 md:pt-2 xl:ml-[100px] fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-2">
            <button className="p-1 hover:bg-gray-100 rounded-md">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[16px] min-[375px]:text-xl min-[375px]:h-16 min-[375px]:pt-4 min-[425px]:text-[23px] font-extrabold italic leading-[55px] 
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">SEMIFINAIS DE CONFERÊNCIA</h1>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-44 h-full mb-24 ml-3">
          <div className="flex flex-col gap-8 min-[375px]:ml-4 min-[425px]:ml-2">
            {conferencias.map((conferencia, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 
              xl:ml-20 overflow-hidden">
                <div className={`${conferencia.cor} text-white px-6 py-4 md:text-xl`}>
                  <h2 className="text-lg font-bold">{conferencia.nome}</h2>
                </div>

                <div className="p-3 space-y-4">
                  {conferencia.jogos.map((jogo, jogoIndex) => (
                    <div key={jogo.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2 text-[12px] md:text-xl">
                          <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">
                            {jogo.time1}
                          </div>
                          <span className="text-gray-400 font-bold">×</span>
                          <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">
                            {jogo.time2}
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-2 text-sm text-gray-600 md:text-md">
                        {jogo.descricao}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}