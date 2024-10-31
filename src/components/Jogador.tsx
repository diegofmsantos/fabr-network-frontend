import { Team } from "@/types/team";
import Link from "next/link";

type Props = {
    currentTeam: Team;
    selectedSetor: string;
};

export const Jogador = ({ currentTeam, selectedSetor }: Props) => {
    const jogadoresFiltrados = currentTeam?.jogadores?.filter(
        (jogador) => jogador.setor.toUpperCase() === selectedSetor
    );

    return (
        <div>
            {jogadoresFiltrados?.map((jogador) => (
                <Link
                    href={`/${currentTeam.nome}/${jogador.id}`}
                    key={jogador.id}
                    className="flex h-10 justify-between items-center px-3 py-1 border-b text-sm md:text-base xl:text-lg xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto"
                >
                    <div className="w-5">{jogador.numero}</div>
                    <div className="w-[160px] pl-2 md:w-44 xl:w-52">{jogador.nome}</div>
                    <div className="w-12 flex justify-center items-center xl:mr-8">{jogador.posicao}</div>
                    <div className="w-12 flex justify-center items-center xl:mr-4">{jogador.idade}</div>
                    <div className="w-12 flex justify-center items-center xl:mr-4">{jogador.altura}</div>
                    <div className="w-12 flex justify-center items-center xl:mr-4">{jogador.peso}</div>
                </Link>
            ))}
        </div>
    );
};
