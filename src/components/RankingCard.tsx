import Image from "next/image";

type PlayerCardProps = {
    name: string;
    team: string;
    value: number;
    camisa: string;
    teamColor?: string;
    teamLogo?: string;
    isFirst?: boolean;
};

export const RankingCard = ({
    title,
    players,
}: {
    title: string;
    players: PlayerCardProps[];
}) => {
    const normalizeForFilePath = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9-]/g, ""); // Remove caracteres especiais
    };

    const getShirtPath = (team: string, camisa: string): string => {
        // Normaliza o nome do time para ser usado no caminho
        const normalizedTeam = team
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Se existir time e camisa, gera o caminho correto
        if (team && team !== "Time Desconhecido" && camisa) {
            return `/assets/times/camisas/${normalizedTeam}/${camisa}`;
        }

        // Retorna o caminho da camisa padrão caso algo esteja errado
        return "/assets/times/camisas/default-shirt.png";
    };

    // Exemplo de uso no console.log:
    console.log(getShirtPath("Istepôs FA", "camisa-istepos-fa-19.png"));
    // Resultado esperado: /assets/times/camisas/istepos-fa/camisa-istepos-fa-19.png



    return (
        <div className="ranking-card-container">
            <h3 className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
                {title}
            </h3>
            <ul className="bg-[#D9D9D9]/50 text-white shadow-md rounded-lg">
                {players.map((player, index) => {
                    const shirtPath = getShirtPath(player.team, player.camisa);

                    console.log({
                      jogador: player.name,
                      time: player.team,
                      camisa: player.camisa,
                      caminhoGerado: shirtPath,
                    });
                    
                    const teamLogoPath = player.teamLogo || "/assets/times/logos/default-logo.png";

                    console.log({
                        jogador: player.name,
                        time: player.team,
                        camisa: player.camisa,
                        caminhoCamisa: shirtPath,
                        caminhoLogo: teamLogoPath,
                    });

                    return (
                        <li
                            key={index}
                            className={`flex items-center justify-between mb-2 p-3 px-5 rounded-md ${player.isFirst ? "bg-white text-black shadow-lg" : "bg-gray-100 text-black"
                                }`}
                            style={{
                                marginRight: "10px",
                                backgroundColor: player.isFirst ? player.teamColor : undefined,
                            }}
                        >
                            {player.isFirst ? (
                                <div className="flex items-center gap-4 text-white">
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[15px] font-bold">{index + 1}</p>
                                        <h4 className="font-bold flex flex-col leading-tight">
                                            <span className="text-[12px]">{player.name.split(" ")[0]}</span>
                                            <span className="text-2xl ml-1">
                                                {player.name.split(" ").slice(1).join(" ")}
                                            </span>
                                        </h4>
                                        <div className="flex items-center gap-1 min-w-40">
                                            <Image
                                                src={teamLogoPath}
                                                width={40}
                                                height={40}
                                                alt={`Logo do time ${player.team}`}
                                                className="w-auto h-auto"
                                            />
                                            <p className="text-[10px]">{player.team}</p>
                                        </div>
                                        <span className="font-bold text-[40px]">{player.value}</span>
                                    </div>
                                    <Image
                                        src={getShirtPath(player.team, player.camisa)}
                                        width={100}
                                        height={100}
                                        alt={`Camisa do jogador ${player.name}`}
                                        className="w-auto h-auto"
                                    />
                                </div>
                            ) : (
                                <div className="w-full flex justify-between items-center gap-2 ">
                                    <div className="flex items-center">
                                        <span className="font-bold flex items-center gap-3 mr-2">
                                            <div>{index + 1}</div>
                                            <Image
                                                src={teamLogoPath}
                                                width={40}
                                                height={40}
                                                alt={`Logo do time ${player.team}`}
                                                className="w-auto h-auto"
                                            />
                                        </span>
                                        <div className="flex flex-col">
                                            <div className="font-bold">{player.name}</div>
                                            <div className="font-light">{player.team}</div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-lg">{player.value}</span>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
