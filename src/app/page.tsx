import { Lista } from "@/components/Lista"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Times'
}

export default function Page() {

  return (
    <div className="text-[#1414E] z-20">
      <h1 className="fixed inline-block w-full p-2 z-40 text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px]">
        ESCOLHA SEU TIME
      </h1>
      <Lista />
    </div>
  )
}