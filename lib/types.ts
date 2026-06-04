export interface DayTask {
  id: string;
  time: string;
  title: string;
  details: string;
  completed: boolean;
}

export interface DayData {
  project: string;
  week: number;
  month: number;
  dayType: string;
  hours: number;
  tasks: DayTask[];
  focus: string;
}

export interface TrackerState {
  startDate: string;
  dailyProgress: Record<number, {
    day: number;
    tasks: Record<string, boolean>;
    hoursLogged: number;
  }>;
}

export interface WeekStats {
  week: number;
  tasksCompleted: number;
  totalTasks: number;
  hoursLogged: number;
  targetHours: number;
}