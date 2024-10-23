"use client";

import { useParams } from 'next/navigation';
import { BFA } from '../../../data/bfa';
import { Brasileirao } from '../../../data/brasileirao';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Player } from '../../../types/player';  // Importando o tipo Player
import { Team } from '../../../types/team';      // Importando o tipo Team

// Função para buscar o jogador por ID
const findJogador = (times: Team[], jogadorId: number): { jogador: Player, time: Team } | null => {
    for (let time of times) {
        if (time && Array.isArray(time.jogadores)) {
            const jogador = time.jogadores.find((j: Player) => j.id === jogadorId);
            if (jogador) {
                return { jogador, time };
            }
        }
    }
    return null;
};

export default function JogadorPage() {
    const params = useParams();
    const jogadorId = Array.isArray(params.jogador) ? parseInt(params.jogador[0], 10) : parseInt(params.jogador, 10);

    // Busca o jogador no BFA e no Brasileirao
    const jogadorBFA = findJogador(BFA, jogadorId);
    const jogadorBrasileirao = findJogador(Brasileirao, jogadorId);

    // Se encontrou o jogador no BFA ou Brasileirao, usa os dados
    const currentPlayer = jogadorBFA?.jogador || jogadorBrasileirao?.jogador;
    const currentTeam = jogadorBFA?.time || jogadorBrasileirao?.time;

    // Se não encontrar, exibe mensagem de erro
    if (!currentPlayer) {
        return <div>Jogador não encontrado</div>;
    }

    return (
        <div>
            <header className="w-full h-32 bg-[#17181C] flex flex-col justify-center items-center gap-4">
                <Image src={`/assets/logo-fabr-color.png`} width={100} height={100} alt="logo" />
                <div className="flex justify-center items-center gap-4 mb-2">
                    <button className='flex justify-center items-center gap-2 border p-2 bg-white w-20 h-6 font-bold text-xs rounded-lg'>
                        <FontAwesomeIcon icon={faAngleLeft} />
                        Times
                    </button>
                </div>
            </header>
            <div className='p-2 bg-blue-700 h-32 flex flex-col gap-8'>
                <Image src={`/assets/bfa/jogadores-bfa/${currentPlayer.foto}`} width={100} height={100} alt={`${currentPlayer.nome} foto`} />
                <h1 className="text-white font-bold text-2xl">{currentPlayer.nome}</h1>
            </div>
            <div className="p-4">
                <h2 className="text-xl font-bold">Dados do Jogador</h2>
                <p>Posição: {currentPlayer.posicao}</p>
                <p>Idade: {currentPlayer.idade}</p>
                <p>Altura: {currentPlayer.altura}</p>
                <p>Peso: {currentPlayer.peso} kg</p>
                <p>Cidade: {currentPlayer.cidade}</p>
                <p>Nacionalidade: {currentPlayer.nacionalidade}</p>

                <h3 className="text-lg font-bold mt-4">Estatísticas</h3>
                {currentPlayer.estatisticas?.map((estatistica, index) => (
                    <div key={index}>
                        {Object.entries(estatistica).map(([key, value]) => (
                            <p key={key}>{`${key.replace('_', ' ')}: ${value}`}</p>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
