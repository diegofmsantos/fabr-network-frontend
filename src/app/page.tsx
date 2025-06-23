import { Lista } from "@/components/Lista"
import { Metadata } from "next"
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/queryKeys'
import { TimesService } from '@/services/times.service'

export const metadata: Metadata = {
  title: "Times",
}

export default async function Page() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: queryKeys.times.list('2024'),
    queryFn: () => TimesService.getTimes('2024')
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="text-[#1414E] z-20 bg-[#ECECEC] lg:mr-40 xl:w-2/3 xl:mx-auto">
        <h1 className="fixed inline-block w-full p-2 z-40 text-[53px] bg-[#ECECEC] text-[#272731] px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px] 
        lg:ml-32 xl:ml-64 xl:pt-10 2xl:ml-96">
          ESCOLHA SEU TIME
        </h1>
        <Lista />
      </div>
    </HydrationBoundary>
  )
}