"use client"

import { useSearchParams } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';
import { StatSelect } from '@/components/StatSelect';
import { useStats } from '@/hooks/useStats';
import { useTeamInfo } from '@/hooks/useTeamInfo';
import { getStatMapping } from '@/utils/statMappings';
import { TeamStatsList } from '@/components/TeamStatsList';

export const dynamic = 'force-dynamic';

export default function TeamStatsPage() {
    // Pega o parâmetro da URL
    const searchParams = useSearchParams();
    const statParam = searchParams.get('stat') || '';

    // Carrega os dados necessários usando hooks customizados
    const { players, times, loading } = useStats();
    const getTeamInfo = useTeamInfo(times);
    const statMapping = getStatMapping(statParam);

    // Mostra loading enquanto carrega os dados
    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bg-[#ECECEC] min-h-screen py-24 px-2">
            <div className="max-w-4xl mx-auto">
                {/* Select para escolher a estatística */}
                <div className="max-w-4xl mx-auto">
                    <StatSelect currentStat={statParam} />
                </div>

                {/* Lista de times com suas estatísticas */}
                <TeamStatsList 
                    players={players}
                    times={times}
                    statMapping={statMapping}
                />
            </div>
        </div>
    );
}