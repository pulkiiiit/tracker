'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { getAllWeeksData } from '@/lib/tracker-data'
import ProgressBar from './ProgressBar'

export default function WeeklyView() {
  const [weeks, setWeeks] = useState<any[]>([])
  const [selectedWeek, setSelectedWeek] = useState<number>(1)

  useEffect(() => {
    const state = storage.getState()
    const dayNum = storage.getDayNumber(state.startDate, new Date())
    const currentWeek = Math.ceil(dayNum / 7)
    
    setSelectedWeek(currentWeek)

    // Calculate stats for each week
    const weeksData = []
    for (let week = 1; week <= 13; week++) {
      let completedTasks = 0
      let totalTasks = 0
      let hoursLogged = 0
      let targetHours = 0

      for (let day = (week - 1) * 7 + 1; day <= Math.min(week * 7, 90); day++) {
        const dayOfWeek = (day - 1) % 7
        const hours = dayOfWeek >= 5 ? 8 : 4
        targetHours += hours

        if (state.dailyProgress[day]) {
          const tasks = state.dailyProgress[day].tasks || {}
          completedTasks += Object.values(tasks).filter(Boolean).length
          hoursLogged += state.dailyProgress[day].hoursLogged || 0
        }

        // Count tasks (rough estimate)
        totalTasks += dayOfWeek >= 5 ? 6 : 4
      }

      const month = week <= 5 ? 1 : week <= 10 ? 2 : 3
      let project = 'Multi-Tenant SaaS'
      if (month === 2) project = 'Real-Time Kanban'
      if (month === 3) project = 'AI + Portfolio'

      weeksData.push({
        week,
        month,
        project,
        completedTasks,
        totalTasks,
        hoursLogged,
        targetHours,
        completion: (completedTasks / totalTasks) * 100 || 0,
        hoursCompletion: (hoursLogged / targetHours) * 100 || 0,
      })
    }

    setWeeks(weeksData)
  }, [])

  const currentWeekData = weeks[selectedWeek - 1]

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Weekly Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your progress week by week</p>
      </div>

      {/* Week Selector */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-min">
          {weeks.map(week => (
            <button
              key={week.week}
              onClick={() => setSelectedWeek(week.week)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedWeek === week.week
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Week {week.week}
            </button>
          ))}
        </div>
      </div>

      {currentWeekData && (
        <div className="space-y-6">
          {/* Week Header */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Week {currentWeekData.week} - Month {currentWeekData.month}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{currentWeekData.project}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentWeekData.completedTasks}/{currentWeekData.totalTasks}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">Task Progress</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(currentWeekData.completion)}%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">Hours Logged</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currentWeekData.hoursLogged}/{currentWeekData.targetHours}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400">Hour Progress</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(currentWeekData.hoursCompletion)}%
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-gray-900 dark:text-white">Task Completion</label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(currentWeekData.completion)}%</span>
                </div>
                <ProgressBar percentage={currentWeekData.completion} />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-gray-900 dark:text-white">Hours Target</label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(currentWeekData.hoursCompletion)}%</span>
                </div>
                <ProgressBar percentage={currentWeekData.hoursCompletion} color="green" />
              </div>
            </div>
          </div>

          {/* Days in Week */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Days in This Week</h3>
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => {
                const day = (currentWeekData.week - 1) * 7 + i + 1
                if (day > 90) return null
                const dayOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
                const isWeekend = i >= 5
                return (
                  <div key={day} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Day {day} - {dayOfWeek}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {isWeekend ? '8 hours' : '4 hours'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}