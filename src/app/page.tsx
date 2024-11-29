import { Lista } from "@/components/Lista"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: 'Times'
}

export default function Page() {

  return (
    <div className="text-[#1414E]">
      <h1 className="text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px]">
        ESCOLHA SEU TIME
      </h1>
      <Lista />
    </div>
  )
}