'use client'

import { useState, useEffect } from 'react'
import DailyTracker from './components/DailyTracker'
import WeeklyView from './components/WeeklyView'
import Analytics from './components/Analytics'
import Sidebar from './components/Sidebar'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'analytics'>('daily')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {activeTab === 'daily' && <DailyTracker />}
          {activeTab === 'weekly' && <WeeklyView />}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </main>
    </div>
  )
}