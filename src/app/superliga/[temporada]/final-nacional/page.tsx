"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const finalNacionalData = {
  nome: "FINAL",
  time1: "Campeão do Sudeste ou Sul",
  time2: "Campeão do Nordeste ou Centro-Oeste",
  descricao: "Campeão do Sudeste ou Sul × Campeão do Nordeste ou Centro-Oeste"
}

export default function FinalNacionalPage() {
  const params = useParams()
  const temporada = params.temporada as string

  return (
    <div>
      <div className="xl:ml-80 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[900px] md:h-14 md:pt-2 xl:ml-[100px] fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-2">
            <button className="p-1 hover:bg-gray-100 rounded-md">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[16px] min-[375px]:text-xl min-[375px]:h-16 min-[375px]:pt-4 min-[425px]:text-[23px] font-extrabold italic leading-[55px] 
            tracking-[-2px] text-gray-900 md:pt-0 md:h-10 md:text-3xl xl:text-4xl">FINAL NACIONAL</h1>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-44 h-full mb-24 ml-3">
          <div className="flex flex-col gap-5 min-[375px]:ml-4 min-[425px]:ml-2">
            <div className="bg-white rounded-lg shadow-sm border min-[375px]:w-80 min-[425px]:w-96 md:min-w-[720px] lg:min-w-[900px] lg:ml-10 xl:ml-20 overflow-hidden">
              <div className="bg-black text-white px-6 py-4 md:text-xl">
                <h2 className="text-lg font-bold text-center">{finalNacionalData.nome}</h2>
              </div>

              <div className="p-3 md:p-6">
                <div className="border-2 border-yellow-400 rounded-lg p-4 md:p-6 bg-gradient-to-r from-yellow-50 to-amber-50">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 text-[12px] md:text-xl md:gap-6">
                      <div className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-gray-800 text-center shadow-md border-2 border-yellow-300">
                        {finalNacionalData.time1}
                      </div>
                      <div className="text-yellow-600 font-bold text-lg md:text-3xl">
                        ×
                      </div>
                      <div className="bg-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-gray-800 text-center shadow-md border-2 border-yellow-300">
                        {finalNacionalData.time2}
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-700 font-medium md:text-lg md:mt-4">
                    {finalNacionalData.descricao}
                  </div>

                  {/* Destaque */}
                  <div className="text-center mt-4 md:mt-6">
                    <div className="inline-flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm md:gap-2 md:px-6 md:py-2 md:text-lg">
                      🏆 GRANDE DECISÃO NACIONAL 🏆
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}