import InfoSidebar from '@/components/InfoSidebar'
import OverviewTab from '@/components/OverviewTab'
import ProfileHeader from '@/components/ProfileHeader'
import ProjectsTab from '@/components/ProjectsTab'
import { DUMMY_USER } from '@/mocks/DymmyUser'
import { createFileRoute } from '@tanstack/react-router'
import { Code2, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects'>(
    'overview',
  )

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white pb-20">
      {/* Style block for Font Smoothing & Custom Scrollbar */}
      <style>{`
            body {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }
            /* Custom Scrollbar */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; border: 3px solid transparent; background-clip: content-box; }
            ::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
        `}</style>

      {/* Navigation Top (Simplistic) */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-800">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Code2 size={20} />
            </div>
            DevProfile
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <MessageSquare size={20} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <img
              src={DUMMY_USER.avatar}
              className="w-8 h-8 rounded-full border border-slate-200"
              alt="Avatar"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Header Section */}
        <ProfileHeader user={DUMMY_USER} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 2. Left Sidebar (Chiếm 4 cột trên màn hình lớn) */}
          <div className="lg:col-span-4 space-y-6">
            <InfoSidebar user={DUMMY_USER} />
          </div>

          {/* 3. Main Tabs Content (Chiếm 8 cột trên màn hình lớn) */}
          <div className="lg:col-span-8">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-xl border border-slate-200 p-1 mb-6 inline-flex w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'overview'
                    ? 'bg-slate-100 text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'projects'
                    ? 'bg-slate-100 text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                Dự án{' '}
                <span className="ml-1 px-1.5 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full">
                  {DUMMY_USER.projects.length}
                </span>
              </button>
            </div>

            {/* Tab Content Render */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'overview' ? (
                <OverviewTab user={DUMMY_USER} />
              ) : (
                <ProjectsTab user={DUMMY_USER} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
