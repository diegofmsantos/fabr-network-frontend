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
                    className="flex h-10 justify-between items-center px-3 py-1 border-b text-sm"
                >
                    <div className="w-5">{jogador.numero}</div>
                    <div className="w-[160px] pl-2">{jogador.nome}</div>
                    <div className="w-12 flex justify-center items-center">{jogador.posicao}</div>
                    <div className="w-12 flex justify-center items-center">{jogador.idade}</div>
                    <div className="w-12 flex justify-center items-center">{jogador.altura}</div>
                    <div className="w-12 flex justify-center items-center">{jogador.peso}</div>
                </Link>
            ))}
        </div>
    );
};
