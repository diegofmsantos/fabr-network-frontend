import { Lista } from "@/components/Lista"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: 'Times'
}

export default function Page() {

  return (
    <div className="text-[#1414E]">
      <header className="w-full h-28 rounded-b-xl bg-black flex justify-center items-center px-2 fixed z-50">
        <Image
          src="/assets/logo-fabr-color.png"
          width={130}
          height={130}
          alt="logo-fabr"
          quality={100}
          className="w-auto h-auto"
        />
      </header>
      <h1 className="text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-32 tracking-[-5px]">
        ESCOLHA SEU TIME
      </h1>
      <Lista />
    </div>
  )
}