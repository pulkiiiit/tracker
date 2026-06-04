'use client'

import { useState, useEffect } from 'react'
import { storage } from '@/lib/storage'
import { getTrackerData } from '@/lib/tracker-data'
import ProgressBar from './ProgressBar'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { DayData } from '@/lib/types'

type DailyProgress = Record<string, boolean>

export default function DailyTracker() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [startDate, setStartDate] = useState<string>('')
  const [dayData, setDayData] = useState<DayData | null>(null)
  const [dayNum, setDayNum] = useState<number>(1)
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>({})
  const [hoursLogged, setHoursLogged] = useState<number>(0)

  useEffect(() => {
    const state = storage.getState()
    setStartDate(state.startDate)
    
    const dayNumber = storage.getDayNumber(state.startDate, currentDate)
    setDayNum(dayNumber)
    
    const data = getTrackerData(dayNumber)
    setDayData(data)
    
    if (state.dailyProgress[dayNumber]) {
      setDailyProgress(state.dailyProgress[dayNumber].tasks || {})
      setHoursLogged(state.dailyProgress[dayNumber].hoursLogged || 0)
    } else {
      setDailyProgress({})
      setHoursLogged(0)
    }
  }, [currentDate])

  const toggleTask = (taskId: string) => {
    storage.toggleTask(dayNum, taskId)
    setDailyProgress(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }))
  }

  const updateHours = (hours: number) => {
    storage.setHoursLogged(dayNum, hours)
    setHoursLogged(hours)
  }

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDate(new Date(e.target.value))
  }

  if (!dayData) return <div className="text-center py-8">Loading...</div>

  const completedTasks = Object.values(dailyProgress).filter(Boolean).length
  const totalTasks = dayData.tasks.length
  const completionPercentage = (completedTasks / totalTasks) * 100

  const isToday = currentDate.toDateString() === new Date().toDateString()

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Day {dayNum} of 90
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              title="Previous day"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className={`px-4 py-2 rounded-lg transition font-medium ${
                isToday
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
              disabled={dayNum >= 90}
              title="Next day"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  storage.setStartDate(e.target.value)
                  setStartDate(e.target.value)
                  setCurrentDate(new Date(e.target.value))
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Daily Target</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dayData.hours}h</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Logged Hours</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{hoursLogged}h</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Done</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}/{totalTasks}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Project</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{dayData.project}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white mb-8">
          <p className="font-medium mb-2">Today's Focus</p>
          <p className="text-sm">{dayData.focus}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tasks ({completedTasks}/{totalTasks})</h2>
        <ProgressBar percentage={completionPercentage} />
      </div>

      <div className="space-y-3">
        {dayData.tasks.map((task: any) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition ${
              dailyProgress[task.id]
                ? 'bg-gray-100 dark:bg-gray-800 border-green-500 opacity-60'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex gap-3">
              <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                dailyProgress[task.id]
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {dailyProgress[task.id] && <span className="text-white text-sm">✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">{task.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{task.time}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{task.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Hours Logged Today
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            min="0"
            max={dayData.hours}
            value={hoursLogged}
            onChange={(e) => updateHours(parseInt(e.target.value) || 0)}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="0"
          />
          <span className="text-2xl font-bold text-gray-600 dark:text-gray-400 py-3">/ {dayData.hours}h</span>
        </div>
        <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min((hoursLogged / dayData.hours) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}