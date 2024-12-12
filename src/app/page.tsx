import { Lista } from "@/components/Lista";
import { Metadata } from "next";
import { getTimes } from "@/api/api";

export const metadata: Metadata = {
  title: "Times",
};

// Função para buscar dados no servidor com caching ISR
async function fetchTimes() {
  const times = await getTimes();
  return times;
}

export default async function Page() {
  const times = await fetchTimes();

  return (
    <div className="text-[#1414E] z-20">
      <h1 className="fixed inline-block w-full p-2 z-40 text-[53px] bg-[#ECECEC] text-black px-2 font-extrabold italic leading-[55px] pt-24 tracking-[-5px]">
        ESCOLHA SEU TIME
      </h1>
      <Lista times={times} />
    </div>
  );
}
