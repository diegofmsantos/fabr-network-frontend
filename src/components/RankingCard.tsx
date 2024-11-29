import Image from "next/image";

type PlayerCardProps = {
    name: string;
    team: string;
    value: string | number;
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
            .replace(/[^a-z0-9-]/g, "");
    };

    const getShirtPath = (team: string, camisa: string): string => {
        // Normaliza o nome do time para ser usado no caminho
        const normalizedTeam = team
            .toLowerCase()
            .replace(/\s+/g, "-")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        // Se existir time e camisa, gera o caminho correto
        if (team && team !== "time-desconhecido" && camisa) {
            return `/assets/times/camisas/${normalizedTeam}/${camisa}`;
        }

        return "/assets/times/camisas/default-shirt.png";
    };

    return (
        <div className="ranking-card-container">
            <h3 className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">
                {title}
            </h3>
            <ul className="bg-[#D9D9D9]/50 text-white h-full shadow-md rounded-lg">
                {players.map((player, index) => {
                    const shirtPath = getShirtPath(player.team, player.camisa);
                    const teamLogoPath = player.teamLogo || "/assets/times/logos/default-logo.png";

                    return (
                        <li
                            key={index}
                            className={`flex items-center justify-center mb-2 p-2 px-4 rounded-md ${player.isFirst ? "bg-white text-black shadow-lg" :
                                "bg-gray-100 text-black"
                                }`}
                            style={{
                                marginRight: "10px",
                                backgroundColor: player.isFirst ? player.teamColor : undefined,
                            }}
                        >
                            {player.isFirst ? (
                                <div className="flex justify-between items-center w-full text-white">
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[15px] font-bold">{index + 1}</p>
                                        <h4 className="font-bold flex flex-col leading-tight">
                                            <span className="text-[12px]">{player.name.split(" ")[0]}</span>
                                            <span className="text-2xl">
                                                {player.name.split(" ").slice(1).join(" ")}
                                            </span>
                                        </h4>
                                        <div className="flex items-center gap-1 min-w-32">
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
                                        alt={`Camisa`}
                                        className="w-auto h-auto"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-auto flex justify-between items-center gap-2 ">
                                    <div className="flex items-center">
                                        <span className="font-bold flex items-center gap-3">
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
