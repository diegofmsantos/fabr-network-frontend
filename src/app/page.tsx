import { Lista } from "@/components/Lista"
import { Metadata } from "next"
import { getTimes } from "@/api/api"

export const metadata: Metadata = {
  title: "Times",
}

export default async function Page() {
  const times = await getTimes();

  return (
    <div className="text-[#1414E] z-20 bg-[#ECECEC] container mx-auto">
      <h1 className="fixed inline-block w-full p-2 z-40 text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px] lg:pl-20">
        ESCOLHA SEU TIME
      </h1>
      <Lista times={times} />
    </div>
  )
}
