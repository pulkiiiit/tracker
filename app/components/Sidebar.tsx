'use client'

import { Calendar, BarChart3, ListTodo, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: 'daily' | 'weekly' | 'analytics') => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [open, setOpen] = useState(false)

  const navItems = [
    { id: 'daily', label: 'Daily Tracker', icon: ListTodo },
    { id: 'weekly', label: 'Weekly View', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform md:translate-x-0 z-40 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Logo */}
          <div className="mb-8 mt-4 md:mt-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              90-Day<span className="text-blue-600">Track</span>
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Fullstack Developer Bootcamp</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as 'daily' | 'weekly' | 'analytics')
                    setOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-4 text-white text-sm">
              <p className="font-bold mb-2">90 Days to Success</p>
              <p className="text-xs opacity-90">Build 3 projects. Ship to production. Get hired.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}