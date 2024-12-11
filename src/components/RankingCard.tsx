
import Image from "next/image";
import Link from "next/link";

interface PlayerCardProps {
  id: number
  name: string;
  team: string;
  value: string;
  camisa: string;
  teamColor?: string;
  teamLogo?: string;
  isFirst?: boolean;
}

interface RankingCardProps {
  title: string;
  category: string
  players: PlayerCardProps[];
}

export const RankingCard: React.FC<RankingCardProps> = ({ title, category, players }) => {
  const normalizeForFilePath = (input: string): string => {
    return input
      .toLowerCase()
      .replace(/\s+/g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9-]/g, "");
  };

  const getShirtPath = (team: string, camisa: string): string => {
    const normalizedTeam = normalizeForFilePath(team);
    return team && team !== "time-desconhecido" && camisa
      ? `/assets/times/camisas/${normalizedTeam}/${camisa}`
      : "/assets/times/camisas/camisa-default.png";
  };

  return (
    <div className="ranking-card-container px-3">
      <h3 className="inline-block text-sm font-bold mb-2 bg-black text-white p-2 rounded-xl">{title}</h3>
      <ul className="flex flex-col text-white h-full">
        {players.map((player, index) => {
          const teamLogoPath = player.teamLogo || "/assets/times/logos/default-logo.png";

          return (
            <li
              key={index}
              className={`flex items-center justify-center p-2 px-4 border-b border-b-[#D9D9D9] rounded-md ${player.isFirst ? "bg-gray-100 text-black shadow-lg" : "bg-white text-black"
                }`}
              style={{
                backgroundColor: player.isFirst ? player.teamColor : undefined,
              }}
            >
              <Link
                href={`/${normalizeForFilePath(player.team)}/${player.id}`}
                className="w-full"
              >
                {player.isFirst ? (
                  <div className="flex justify-between items-center w-full text-white">
                    <div className="flex flex-col justify-center">
                      <p className="text-[25px] font-bold">{index + 1}</p>
                      <h4 className="font-bold flex flex-col leading-tight">
                        <span className="text-[12px]">{player.name.split(" ")[0]}</span>
                        <span className="text-2xl">{player.name.split(" ").slice(1).join(" ")}</span>
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
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-auto flex justify-between items-center gap-2">
                    <div className="flex items-center">
                      <span className="font-bold flex items-center gap-2">
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
                        <div className="font-bold text-[14px]">{player.name}</div>
                        <div className="font-light text-[14px]">{player.team}</div>
                      </div>
                    </div>
                    <span className="font-bold text-lg">{player.value}</span>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      {players.length > 0 && (
        <Link
          href={`/ranking/stats?stat=${normalizeForFilePath(category)}-${normalizeForFilePath(title)}`}
          className="block text-center border border-gray-400 bg-white text-[17px] text-black font-bold py-1 mt-4 rounded-md hover:bg-[#C1C2C3]"
        >
          Ver Mais
        </Link>
      )}
    </div>
  );
};