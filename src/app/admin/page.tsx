"use client"

import { useState } from 'react'
import { StatsCard } from '@/components/Admin/StatsCard'
import { RecentActivity } from '@/components/Admin/RecentActivity'
import { QuickActions } from '@/components/Admin/QuickActions'
import { ChartCard } from '@/components/Admin/ChartCard'
import { useAdminStats } from '@/hooks/useAdminStats'
import { Loading } from '@/components/ui/Loading'
import { Trophy, Calendar, Users, BarChart3, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [selectedTemporada, setSelectedTemporada] = useState('2025')
  const { data: stats, isLoading, error } = useAdminStats(selectedTemporada)

  if (isLoading) return <Loading />
  if (error) return <div className="text-center text-red-600">Erro ao carregar dados</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visão geral dos campeonatos e estatísticas
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedTemporada}
            onChange={(e) => setSelectedTemporada(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="2025">Temporada 2025</option>
            <option value="2024">Temporada 2024</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Campeonatos"
          value={stats?.totalCampeonatos || 0}
          icon={Trophy}
          color="blue"
          change="+2 este mês"
          changeType="positive"
        />
        <StatsCard
          title="Jogos Agendados"
          value={stats?.jogosAgendados || 0}
          icon={Calendar}
          color="green"
          change="Esta semana"
          changeType="neutral"
        />
        <StatsCard
          title="Times Ativos"
          value={stats?.timesAtivos || 0}
          icon={Users}
          color="purple"
          change="30 times"
          changeType="neutral"
        />
        <StatsCard
          title="Jogos Finalizados"
          value={stats?.jogosFinalizados || 0}
          icon={CheckCircle}
          color="emerald"
          change="+15 esta semana"
          changeType="positive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard
          title="Campeonatos por Status"
          data={stats?.campeonatosPorStatus || []}
          type="pie"
        />
        <ChartCard
          title="Jogos por Mês"
          data={stats?.jogosPorMes || []}
          type="line"
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={stats?.recentActivities || []} />
        </div>
      </div>

      {/* Alerts Section */}
      {stats?.alerts && stats.alerts.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Atenção Necessária
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc space-y-1 pl-5">
                  {stats.alerts.map((alert, index) => (
                    <li key={index}>{alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}