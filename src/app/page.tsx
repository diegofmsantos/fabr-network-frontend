import { Lista } from "@/components/Lista"
import { Metadata } from "next"

export const metadata: Metadata ={
  title: 'Times'
}

export default function Page() {

  return (
    <div className="text-[#1414E]">
      <Lista />
    </div>
  )
}