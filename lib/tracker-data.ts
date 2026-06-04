import { DayData } from './types'

// Days 1-21 (Month 1) - Detailed breakdown
const detailedDays: Record<number, DayData> = {
  1: {
    project: 'Multi-Tenant SaaS',
    week: 1,
    month: 1,
    dayType: 'Monday',
    hours: 4,
    tasks: [
      {
        id: '1-1',
        time: '0:00-0:30',
        title: 'Create GitHub repo',
        details: 'Repository: saas-project-management. Initialize with .gitignore, README, MIT license. Create initial commit.',
        completed: false,
      },
      {
        id: '1-2',
        time: '0:30-1:00',
        title: 'Set up Next.js 15',
        details: 'npx create-next-app@latest saas-pm --typescript --tailwind --app. Enable App Router, TypeScript, ESLint.',
        completed: false,
      },
      {
        id: '1-3',
        time: '1:00-2:00',
        title: 'Initialize Prisma + PostgreSQL',
        details: 'npm install @prisma/client. Create Neon database. Copy connection string to .env.local. Create first schema.',
        completed: false,
      },
      {
        id: '1-4',
        time: '2:00-2:30',
        title: 'Set up Tailwind + shadcn/ui',
        details: 'npx shadcn-ui@latest init. Choose dark mode (system), CSS variables.',
        completed: false,
      },
      {
        id: '1-5',
        time: '3:00-4:00',
        title: 'Social Media - First Post',
        details: 'Create LinkedIn + Twitter post about starting the 90-day challenge. Share with your network. Follow 10 fullstack developers.',
        completed: false,
      },
    ],
    focus: 'Lay the foundation. Get your first commit and your first social media post out. Momentum starts today.',
  },
  2: {
    project: 'Multi-Tenant SaaS',
    week: 1,
    month: 1,
    dayType: 'Tuesday',
    hours: 4,
    tasks: [
      {
        id: '2-1',
        time: '0:00-1:00',
        title: 'Design database schema',
        details: 'Create Prisma schema with User, Organization, OrganizationUser (many:many), Project, Task models.',
        completed: false,
      },
      {
        id: '2-2',
        time: '1:00-2:00',
        title: 'Push schema to database',
        details: 'npx prisma migrate dev --name init. Test locally. Verify tables created in Neon dashboard.',
        completed: false,
      },
      {
        id: '2-3',
        time: '2:00-3:00',
        title: 'Create architecture diagram',
        details: 'Use Excalidraw. Draw User → Org → Project → Task relationships. Export as PNG to /docs/architecture.png',
        completed: false,
      },
      {
        id: '2-4',
        time: '3:00-4:00',
        title: 'Set up environment variables',
        details: 'Create .env.local with DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET. Document in README.',
        completed: false,
      },
    ],
    focus: 'Multi-tenancy foundation. Understanding org isolation is crucial. Take time to think through the schema.',
  },
  3: {
    project: 'Multi-Tenant SaaS',
    week: 1,
    month: 1,
    dayType: 'Wednesday',
    hours: 4,
    tasks: [
      {
        id: '3-1',
        time: '0:00-1:30',
        title: 'Install NextAuth.js v5',
        details: 'npm install next-auth@beta. Create app/api/auth/[...nextauth]/route.ts. Set up credentials provider.',
        completed: false,
      },
      {
        id: '3-2',
        time: '1:30-2:30',
        title: 'Create auth middleware',
        details: 'Create lib/auth.ts with getSession() helper. Create middleware for protected routes.',
        completed: false,
      },
      {
        id: '3-3',
        time: '2:30-3:30',
        title: 'Password hashing with bcryptjs',
        details: 'npm install bcryptjs. Create lib/password.ts with hashPassword() and verifyPassword() functions.',
        completed: false,
      },
      {
        id: '3-4',
        time: '3:30-4:00',
        title: 'Test auth flow locally',
        details: 'Sign up form → user created in DB. Login form → session created. Check /api/auth/session',
        completed: false,
      },
    ],
    focus: 'Authentication is critical. Get this right. Test thoroughly before moving on.',
  },
  // Add more days...for brevity showing just 3
}

function generateDayData(dayNum: number): DayData {
  if (detailedDays[dayNum]) {
    return detailedDays[dayNum]
  }

  const weekNum = Math.ceil(dayNum / 7)
  const monthNum = weekNum <= 5 ? 1 : weekNum <= 10 ? 2 : 3
  const dayOfWeek = (dayNum - 1) % 7
  const dayTypes = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  let project = 'Multi-Tenant SaaS'
  if (monthNum === 2) project = 'Real-Time Kanban Board'
  if (monthNum === 3) project = 'AI Integration + Portfolio'

  const hours = dayOfWeek >= 5 ? 8 : 4
  const taskCount = dayOfWeek >= 5 ? 6 : 4

  const tasks = Array.from({ length: taskCount }, (_, i) => ({
    id: `${dayNum}-${i + 1}`,
    time: `${i}:00-${i + 1}:00`,
    title: `Development Task ${i + 1}`,
    details: `Check the detailed breakdown document for Day ${dayNum} specifics. Focus on quality code and testing.`,
    completed: false,
  }))

  return {
    project,
    week: weekNum,
    month: monthNum,
    dayType: dayTypes[dayOfWeek],
    hours,
    tasks,
    focus: `Day ${dayNum} of your 90-day journey. Consistency wins. You're building something unrejectable.`,
  }
}

export const getTrackerData = (dayNum: number): DayData => {
  return generateDayData(Math.max(1, Math.min(dayNum, 90)))
}

export const getAllWeeksData = () => {
  const weeks: Record<number, any> = {}
  for (let week = 1; week <= 13; week++) {
    const startDay = (week - 1) * 7 + 1
    const endDay = Math.min(week * 7, 90)
    
    let completedTasks = 0
    let totalTasks = 0
    let hoursLogged = 0
    let targetHours = 0

    weeks[week] = {
      week,
      completedTasks,
      totalTasks,
      hoursLogged,
      targetHours,
      startDay,
      endDay,
    }
  }
  return weeks
}