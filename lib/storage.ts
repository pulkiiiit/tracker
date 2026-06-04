import { TrackerState, DayData } from './types'

const STORAGE_KEY = 'fullstack-tracker-state'

export const storage = {
  getState: (): TrackerState => {
    if (typeof window === 'undefined') return { startDate: '', dailyProgress: {} }
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return {
        startDate: new Date().toISOString().split('T')[0],
        dailyProgress: {},
      }
    }
    return JSON.parse(stored)
  },

  setState: (state: TrackerState) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },

  toggleTask: (day: number, taskId: string) => {
    const state = storage.getState()
    if (!state.dailyProgress[day]) {
      state.dailyProgress[day] = { day, tasks: {}, hoursLogged: 0 }
    }
    state.dailyProgress[day].tasks[taskId] = !state.dailyProgress[day].tasks[taskId]
    storage.setState(state)
  },

  setHoursLogged: (day: number, hours: number) => {
    const state = storage.getState()
    if (!state.dailyProgress[day]) {
      state.dailyProgress[day] = { day, tasks: {}, hoursLogged: 0 }
    }
    state.dailyProgress[day].hoursLogged = hours
    storage.setState(state)
  },

  setStartDate: (date: string) => {
    const state = storage.getState()
    state.startDate = date
    storage.setState(state)
  },

  getDayNumber: (startDate: string, selectedDate: Date): number => {
    const start = new Date(startDate)
    const diff = selectedDate.getTime() - start.getTime()
    const dayNum = Math.floor(diff / (24 * 60 * 60 * 1000)) + 1
    return Math.max(1, Math.min(dayNum, 90))
  },
}