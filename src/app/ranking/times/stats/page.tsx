// Em /app/ranking/times/stats/page.tsx
"use client"

import { useSearchParams } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';
import { StatSelect } from '@/components/StatSelect';
import { useStats } from '@/hooks/useStats';
import { useTeamInfo } from '@/hooks/useTeamInfo';
import { getStatMapping } from '@/utils/statMappings';
import { TeamStatsList } from '@/components/TeamStatsList';

export default function TeamStatsPage() {
    const searchParams = useSearchParams();
    const statParam = searchParams.get('stat') || '';
    const { players, times, loading } = useStats();
    const getTeamInfo = useTeamInfo(times);
    const statMapping = getStatMapping(statParam);

    if (loading) return <Loading />;

    return (
        <div className="bg-[#ECECEC] min-h-screen py-24 px-2">
            <div className="max-w-4xl mx-auto">
                <StatSelect currentStat={statParam} />
                <TeamStatsList
                    players={players}
                    times={times}
                    statMapping={statMapping}
                />
            </div>
        </div>
    );
}