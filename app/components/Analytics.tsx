'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Analytics() {
  const [progressData, setProgressData] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [taskCompletionData, setTaskCompletionData] = useState<any[]>([])

  useEffect(() => {
    const state = storage.getState()
    const startDate = new Date(state.startDate)

    // Generate data for last 30 days
    const data = []
    let cumulativeHours = 0
    let cumulativeTasks = 0

    for (let i = 0; i < 30; i++) {
      const currentDay = i + 1
      const dayData = state.dailyProgress[currentDay] || { hoursLogged: 0, tasks: {} }
      
      cumulativeHours += dayData.hoursLogged || 0
      cumulativeTasks += Object.values(dayData.tasks || {}).filter(Boolean).length

      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      data.push({
        day: currentDay,
        date: `Day ${currentDay}`,
        hours: dayData.hoursLogged || 0,
        cumulativeHours,
        cumulativeTasks,
        tasksDone: Object.values(dayData.tasks || {}).filter(Boolean).length,
      })
    }

    setProgressData(data)

    // Calculate overall stats
    let totalHours = 0
    let totalTasks = 0
    let daysActive = 0

    for (let day = 1; day <= 90; day++) {
      const dayData = state.dailyProgress[day]
      if (dayData) {
        totalHours += dayData.hoursLogged || 0
        totalTasks += Object.values(dayData.tasks || {}).filter(Boolean).length
        if ((dayData.hoursLogged || 0) > 0) daysActive++
      }
    }

    setStats({
      totalHours,
      totalTasks,
      daysActive,
      hoursPercentage: (totalHours / 260) * 100,
      averageHoursPerDay: daysActive > 0 ? (totalHours / daysActive).toFixed(1) : '0',
    })

    // Task completion data
    setTaskCompletionData([
      { name: 'Completed', value: totalTasks, fill: '#10b981' },
      { name: 'Remaining', value: Math.max(0, 1000 - totalTasks), fill: '#e5e7eb' },
    ])
  }, [])

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics & Progress</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your journey visualized</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Hours</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalHours || 0}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">/ 260 hours</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">{Math.round(stats?.hoursPercentage || 0)}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Days Active</p>
          <p className="text-3xl font-bold text-green-600">{stats?.daysActive || 0}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">/ 90 days</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Hours/Day</p>
          <p className="text-3xl font-bold text-purple-600">{stats?.averageHoursPerDay || 0}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">when active</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tasks Done</p>
          <p className="text-3xl font-bold text-orange-600">{stats?.totalTasks || 0}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">total</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cumulative Hours Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Progress Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="cumulativeHours"
                stroke="#3b82f6"
                name="Cumulative Hours"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Hours Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Daily Hours Logged</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="hours" fill="#10b981" name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Overall Performance</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-gray-900 dark:text-white">90-Day Goal (260 hours)</label>
              <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(stats?.hoursPercentage || 0)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(stats?.hoursPercentage || 0, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats?.totalHours || 0} / 260 hours
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-gray-900 dark:text-white">Consistency Score</label>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats?.daysActive || 0} / 90 days active
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(((stats?.daysActive || 0) / 90) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}