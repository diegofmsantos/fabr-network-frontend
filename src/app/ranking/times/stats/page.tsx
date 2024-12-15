"use client";

export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loading } from '@/components/ui/Loading';
import { StatSelect } from '@/components/StatSelect';
import { useStats } from '@/hooks/useStats';
import { useTeamInfo } from '@/hooks/useTeamInfo';
import { getStatMapping } from '@/utils/statMappings';
import { TeamStatsList } from '@/components/TeamStatsList';

function TeamStatsContent() {
    const searchParams = useSearchParams();
    const statParam = searchParams.get('stat') || '';
    const { players, times, loading } = useStats();
    const getTeamInfo = useTeamInfo(times);
    const statMapping = getStatMapping(statParam);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <StatSelect currentStat={statParam} />
            <TeamStatsList 
                players={players}
                times={times}
                statMapping={statMapping}
            />
        </div>
    );
}

export default function TeamStatsPage() {
    return (
        <div className="bg-[#ECECEC] min-h-screen py-24 px-2">
            <Suspense fallback={<Loading />}>
                <TeamStatsContent />
            </Suspense>
        </div>
    );
}