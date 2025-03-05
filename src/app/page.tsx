// app/page.tsx
import { Lista } from "@/components/Lista"
import { Metadata } from "next"
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { prefetchQueries } from '@/hooks/queries'
import { queryKeys } from '@/hooks/queryKeys'

export const metadata: Metadata = {
  title: "Times",
}

export default async function Page() {
  const queryClient = new QueryClient()

  // Pré-carrega os dados no servidor
  await queryClient.prefetchQuery({
    queryKey: queryKeys.times('2024'), // Corrigido: agora chamando a função com a temporada
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/times?temporada=2024`) // Adicionado parâmetro de temporada
      if (!response.ok) {
        throw new Error('Erro ao buscar times')
      }
      return response.json()
    }
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="text-[#1414E] z-20 bg-[#ECECEC] container mx-auto">
        <h1 className="fixed inline-block w-full p-2 z-40 text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px] lg:pl-20">
          ESCOLHA SEU TIME
        </h1>
        <Lista />
      </div>
    </HydrationBoundary>
  )
}