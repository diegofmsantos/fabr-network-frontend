import { Metadata } from 'next'
import { AdminSidebar } from '@/components/Admin/AdminSidebar'
import { AdminHeader } from '@/components/Admin/AdminHeader'
import { AdminErrorBoundary } from '@/components/Admin/ErrorBoundary'
import { NotificationContainer } from '@/components/Admin/NotificationContainer'

export const metadata: Metadata = {
  title: {
    default: 'Admin - FABR Network',
    template: '%s | Admin - FABR Network'
  },
  description: 'Painel administrativo do FABR Network',
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="lg:pl-64">
          {/* Header */}
          <AdminHeader />
          
          {/* Page Content */}
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
        
        {/* Sistema de Notificações */}
        <NotificationContainer />
      </div>
    </AdminErrorBoundary>
  )
}