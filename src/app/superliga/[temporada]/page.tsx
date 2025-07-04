"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const configuracaoSuperliga = {
  SUDESTE: {
    nome: "CONFERÊNCIA SUDESTE",
    cor: "bg-red-600",
    regionais: [
      {
        nome: "Regional Serramar",
        times: [
          { pos: "1º", time: "Locomotiva FA", icone: "⚡", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "2º", time: "Flamengo Imperadores", icone: "👁️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "3º", time: "Vasco Almirantes", icone: "🛡️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "4º", time: "Tritões FA", icone: "🔱", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 }
        ]
      },
      {
        nome: "Regional Canastra",
        times: [
          { pos: "1º", time: "Rio Preto Weilers", icone: "🐺", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "2º", time: "Galo FA", icone: "🐓", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "3º", time: "Spartans FA", icone: "🍇", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "4º", time: "Moura Lacerda Dragons", icone: "🐉", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 }
        ]
      },
      {
        nome: "Regional Cantareira",
        times: [
          { pos: "1º", time: "Guarulhos Rhynos", icone: "🦏", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "2º", time: "Cruzeiro FA", icone: "🌟", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "3º", time: "Corinthians Steamrollers", icone: "⚙️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "4º", time: "Ocelots FA", icone: "🐆", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 }
        ]
      }
    ]
  },
  SUL: {
    nome: "CONFERÊNCIA SUL",
    cor: "bg-cyan-500",
    regionais: [
      {
        nome: "Regional Pampa",
        times: [
          { pos: "1º", time: "Timbó Rex", icone: "🦖", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "2º", time: "Santa Maria Soldiers", icone: "🎖️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "3º", time: "Bravos FA", icone: "🛡️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "4º", time: "Juventude FA", icone: "⚽", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 }
        ]
      },
      {
        nome: "Regional Araucária",
        times: [
          { pos: "1º", time: "Coritiba Crocodiles", icone: "🐊", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "2º", time: "Brown Spiders", icone: "🕷️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "3º", time: "Calvary Cavaliers", icone: "⚔️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "4º", time: "Istepôs FA", icone: "🏔️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 }
        ]
      }
    ]
  },
  NORDESTE: {
    nome: "CONFERÊNCIA NORDESTE",
    cor: "bg-orange-500",
    regionais: [
      {
        nome: "Regional Atlântico",
        times: [
          { pos: "1º", time: "Recife Mariners", icone: "🌊", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "2º", time: "Fortaleza Tritões", icone: "🔱", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "3º", time: "João Pessoa Espectros", icone: "👻", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "4º", time: "Cavalaria 2 de Julho", icone: "🐎", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "5º", time: "Caruaru Wolves", icone: "🐺", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "6º", time: "Ceará Sabres", icone: "⚔️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 }
        ]
      }
    ]
  },
  CENTRO_NORTE: {
    nome: "CONFERÊNCIA CENTRO-NORTE",
    cor: "bg-green-600",
    regionais: [
      {
        nome: "Regional Cerrado",
        times: [
          { pos: "1º", time: "Rondonópolis Hawks", icone: "🦅", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "2º", time: "Cuiabá Arsenal", icone: "🔫", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "3º", time: "Tubarões do Cerrado", icone: "🦈", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 }
        ]
      },
      {
        nome: "Regional Amazônia",
        times: [
          { pos: "1º", time: "Manaus FA", icone: "🌳", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "2º", time: "Manaus Cavaliers", icone: "🤠", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 },
          { pos: "3º", time: "Porto Velho Miners", icone: "⛏️", jogos: 4, vitorias: 0, pontos: 210, pontosContra: 110, saldo: 100 }
        ]
      }
    ]
  }
}

const jogosTemplate = [
  { time1: "LOC", placar1: 28, time2: "VAS", placar2: 12, status: "Finalizado" },
  { time1: "LOC", placar1: 28, time2: "VAS", placar2: 12, status: "Finalizado" },
  { time1: "LOC", placar1: 28, time2: "VAS", placar2: 12, status: "Finalizado" },
  { time1: "LOC", placar1: 28, time2: "VAS", placar2: 12, status: "Finalizado" }
]

export default function TemporadaRegularPage() {
  const params = useParams()
  const temporada = params.temporada as string
  const [rodadasConferencias, setRodadasConferencias] = useState<Record<string, number>>({
    SUDESTE: 1,
    SUL: 1,
    NORDESTE: 1,
    CENTRO_NORTE: 1
  })

  const setRodadaConferencia = (conferencia: string, rodada: number) => {
    setRodadasConferencias(prev => ({
      ...prev,
      [conferencia]: rodada
    }))
  }

  const conferencias = Object.entries(configuracaoSuperliga)

  return (
    <div className="min-h-screen">
      <div className="xl:ml-80 2xl:ml-[550px] absolute">
        <div className="w-full border-black bg-[#ECECEC] border-b mt-20 px-6 xl:w-[680px] md:h-14 md:pt-2 xl:ml-40 fixed z-50 xl:h-28 xl:pt-12 xl:mt-0">
          <div className="flex items-center justify-between gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-[22px] font-extrabold italic leading-[55px] tracking-[-2px] text-gray-900 md:text-3xl xl:text-4xl">TEMPORADA <span className='ml-2'>REGULAR</span></h1>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 pt-44 md:ml-8 lg:ml-36 ">
          {conferencias.map(([conferenciaKey, conferencia]) => (
            <div key={conferenciaKey} className="flex flex-col items-center gap-8 xl:flex-row xl:items-start xl:mb-16">
              <div className="max-w-2xl space-y-10">
                {conferencia.regionais.map((regional, regIndex) => (
                  <div key={regIndex} className="">
                    <div className={`text-white py-1 flex flex-col items-start gap-1`}>
                      <span className={`${conferencia.cor} text-xs font-medium bg-black  px-2 py-1 rounded`}>
                        {conferencia.nome}
                      </span>
                      <h3 className="font-extrabold italic leading-[55px] tracking-[-2px] uppercase text-2xl text-black">{regional.nome}</h3>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden p-6">
                      <div className="grid grid-cols-8 gap-3 pb-4 border-b  text-gray-500">
                        <div>#</div>
                        <div className="col-span-2 font-bold">TIME</div>
                        <div className="text-center font-bold">V</div>
                        <div className="text-center font-bold">D</div>
                        <div className="text-center font-bold">P+</div>
                        <div className="text-center font-bold">P-</div>
                        <div className="text-center font-bold">S</div>
                      </div>

                      <div className="space-y-4 mt-4">
                        {regional.times.map((time, timeIndex) => (
                          <div key={timeIndex} className="grid grid-cols-8 py-2 md:items-baseline">
                            <div className=" text-gray-600 ">{time.pos}</div>
                            <div className="col-span-2 flex  items-center">
                              <span className="text-sm hidden md:block md:-ml-8 md:mr-4">{time.icone}</span>
                              <span className="text-[12px]  text-gray-900 text-wrap md:text-[15px]">{time.time}</span>
                            </div>
                            <div className="text-center text-sm md:text-base">{time.jogos}</div>
                            <div className="text-center text-sm md:text-base">{time.vitorias}</div>
                            <div className="text-center text-sm md:text-base">{time.pontos}</div>
                            <div className="text-center text-sm md:text-base">{time.pontosContra}</div>
                            <div className="text-center text-sm md:text-base">{time.saldo}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-80 mb-10 xl:mt-24">
                <div className="bg-white rounded-lg shadow-sm border sticky top-6">
                  <div className=" space-y-3">
                    <div className={`${conferencia.cor} text-white px-2 py-3 rounded-lg flex items-center justify-between`}>
                      <button
                        onClick={() => setRodadaConferencia(conferenciaKey, Math.max(1, rodadasConferencias[conferenciaKey] - 1))}
                        className="p-1 hover:bg-black hover:bg-opacity-20 rounded"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold">{rodadasConferencias[conferenciaKey]}ª Rodada</span>
                      <button
                        onClick={() => setRodadaConferencia(conferenciaKey, Math.min(4, rodadasConferencias[conferenciaKey] + 1))}
                        className="p-1 hover:bg-black hover:bg-opacity-20 rounded"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 mt-4">
                      {jogosTemplate.map((jogo, index) => (
                        <div key={index} className="flex flex-col items-center justify-between py-2 border-b">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">⚡</span>
                            <span className="font-medium">{jogo.time1} {jogo.placar1} x {jogo.placar2} {jogo.time2}</span>
                            <span className="text-xl">🛡️</span>
                          </div>
                          <span className="text-xs text-green-600 font-medium">{jogo.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}