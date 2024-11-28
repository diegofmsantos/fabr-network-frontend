import RankingGroup from "@/components/RankingGroup";
import { getJogadores } from "@/api/api";
import { PasseKeys } from "../../components/RankingGroup"; // Certifique-se de importar PasseKeys corretamente

export default async function Page() {
    // Recuperar jogadores do banco de dados
    const players = await getJogadores();

    // Definir as estatísticas de passe
    const statsPasse: { title: string; key: PasseKeys }[] = [
        { title: "Jardas", key: "jardas_de_passe" },
        { title: "Passes(%)", key: "passes_tentados" },
        { title: "Jardas(AVG)", key: "jardas_de_passe" },
        { title: "Touchdowns", key: "td_passados" },
        { title: "Passes Completos", key: "passes_completos" },
        { title: "Passes Tentados", key: "passes_tentados" },
        { title: "Interceptações", key: "interceptacoes_sofridas" },
        { title: "Sacks", key: "sacks_sofridos" },
        { title: "Fumbles", key: "fumble_de_passador" },
        // Adicione outras estatísticas de passe, se necessário
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center mb-8">Ranking de Estatísticas</h1>
            <RankingGroup title="Passe" stats={statsPasse} players={players} />
        </div>
    );
}
