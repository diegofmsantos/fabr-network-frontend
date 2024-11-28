import Image from "next/image";

type PlayerCardProps = {
    name: string;
    team: string;
    value: number;
    camisa: string;
    teamColor?: string;
    teamLogo?: string;
    isFirst?: boolean; // Propriedade para identificar o primeiro item
};

export const RankingCard = ({ title, players }: { title: string; players: PlayerCardProps[] }) => {
    const normalizeTeamName = (teamName: string): string => {
        // Normaliza o nome do time para garantir compatibilidade com os arquivos
        return teamName.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    return (
        <div className="p-4">
            <h3 className="text-xl font-bold mb-4 bg-black text-white w-full p-2 rounded-xl">{title}</h3>
            <ul className="bg-[#D9D9D9]/50 text-white shadow-md rounded-lg">
                {players.map((player, index) => {
                    // Normaliza o caminho das logos
                    const teamLogoPath = player.team
                        ? `/assets/times/logos/${normalizeTeamName(player.team)}.png`
                        : "/default-logo.png";

                    // O caminho da camisa não aplica a normalização completa
                    const shirtPath = player.camisa
                        ? `/assets/times/camisas/${player.team}/${player.camisa}` // Sem aplicar `.toLowerCase()` ou `.replace()`
                        : "/default-shirt.png";

                    console.log(`Jogador: ${player.name}`);
                    console.log(`Time: ${player.team || "Desconhecido"}`);
                    console.log(`Caminho da camisa: ${shirtPath}`);
                    console.log(`Caminho do logo: ${teamLogoPath}`);

                    return (
                        <li
                            key={index}
                            className={`flex items-center justify-between mb-2 p-2 rounded-md px-5 ${
                                player.isFirst ? "bg-white text-black shadow-lg" : "bg-gray-100 text-black"
                            }`}
                            style={player.isFirst ? { backgroundColor: player.teamColor } : {}}
                        >
                            {/* Caso seja o primeiro item */}
                            {player.isFirst ? (
                                <div className="flex items-center gap-4 text-white">
                                    <div className="flex flex-col justify-center">
                                        <p className="text-2xl font-bold">{index + 1}</p>
                                        <h4 className="font-bold flex flex-col">
                                            <span className="text-3xl">{player.name.split(" ")[0]}</span> {/* Primeiro nome maior */}
                                            <span className="text-lg ml-1">{player.name.split(" ").slice(1).join(" ")}</span> {/* Restante do nome menor */}
                                        </h4>
                                        <div className="flex items-center">
                                            <Image
                                                src={teamLogoPath}
                                                width={40}
                                                height={40}
                                                alt={`Logo do time ${player.team}`}
                                                className="w-auto h-auto"
                                            />
                                            <p className="text-xs">{player.team}</p>
                                        </div>
                                        <span className="font-bold text-3xl">{player.value}</span>
                                    </div>
                                    <Image
                                        src={shirtPath}
                                        width={100}
                                        height={100}
                                        alt={`Camisa do jogador ${player.name}`}
                                        className="w-auto h-auto"
                                    />
                                </div>
                            ) : (
                                // Para os demais itens
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={teamLogoPath}
                                        width={40}
                                        height={40}
                                        alt={`Logo do time ${player.team}`}
                                        className="w-auto h-auto"
                                    />
                                    <span>
                                        {index + 1}. {player.name}
                                    </span>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
