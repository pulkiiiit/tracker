interface ProgressBarProps {
  percentage: number
  color?: 'blue' | 'green' | 'red'
}

export default function ProgressBar({ percentage, color = 'blue' }: ProgressBarProps) {
  const colorMap = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
  }

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className={`${colorMap[color]} h-3 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}