"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const finalData = {
  SUDESTE: {
    nome: "CONFERÊNCIA SUDESTE",
    cor: "bg-red-600",
    jogo: {
      time1: "Semifinal1",
      time2: "Semifinal2",
      descricao: "Semifinal1 × Semifinal2"
    }
  },
  SUL: {
    nome: "CONFERÊNCIA SUL", 
    cor: "bg-cyan-500",
    jogo: {
      time1: "Semifinal1",
      time2: "Semifinal2",
      descricao: "Semifinal1 × Semifinal2"
    }
  },
  NORDESTE: {
    nome: "CONFERÊNCIA NORDESTE",
    cor: "bg-orange-500",
    jogo: {
      time1: "Semifinal1",
      time2: "Semifinal2", 
      descricao: "Semifinal1 × Semifinal2"
    }
  },
  CENTRO_NORTE: {
    nome: "CONFERÊNCIA CENTRO-NORTE",
    cor: "bg-green-600",
    jogo: {
      time1: "Semifinal1",
      time2: "Semifinal2",
      descricao: "Semifinal1 × Semifinal2"
    }
  }
}

export default function FinalConferenciaPage() {
  const params = useParams()
  const temporada = params.temporada as string

  const conferencias = Object.values(finalData)

  return (
    <div>
      <div className="xl:ml-80 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[900px] md:h-14 md:pt-2 xl:ml-[100px] fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-2">
            <button className="p-1 hover:bg-gray-100 rounded-md">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[16px] min-[375px]:text-xl min-[375px]:h-16 min-[375px]:pt-4 min-[425px]:text-[23px] font-extrabold italic leading-[55px] 
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">FINAIS DE CONFERÊNCIA</h1>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-44 h-full mb-24 ml-3">
          <div className="flex flex-col gap-8 min-[375px]:ml-4 min-[425px]:ml-2">
            {conferencias.map((conferencia, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] 
              lg:ml-10 xl:ml-20 overflow-hidden">
                <div className={`${conferencia.cor} text-white px-6 py-4 md:text-xl`}>
                  <h2 className="text-lg font-bold">{conferencia.nome}</h2>
                </div>

                <div className="p-3">
                  <div className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 text-[12px] md:text-xl">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">
                          {conferencia.jogo.time1}
                        </div>
                        <span className="text-gray-400 font-bold">×</span>
                        <div className="bg-gray-100 px-4 py-2 rounded-lg font-medium text-gray-700">
                          {conferencia.jogo.time2}
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-600 md:text-md">
                      {conferencia.jogo.descricao}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}