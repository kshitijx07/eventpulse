import { useState } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, format, isSameDay, isSameMonth, isToday
} from 'date-fns'

export default function Calendar({ eventDates = [], selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)

  const days = []
  let day = calStart
  while (day <= calEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const hasEvent = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return eventDates.includes(dateStr)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h2 className="font-semibold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
        ))}

        {days.map((d, i) => {
          const inMonth = isSameMonth(d, currentMonth)
          const selected = selectedDate && isSameDay(d, selectedDate)
          const today = isToday(d)
          const eventDay = hasEvent(d)

          return (
            <button
              key={i}
              onClick={() => onDateSelect(d)}
              className={`relative p-2 text-sm rounded-md transition-colors ${
                !inMonth ? 'text-gray-300' :
                selected ? 'bg-indigo-600 text-white' :
                today ? 'bg-indigo-50 text-indigo-700 font-semibold' :
                'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {format(d, 'd')}
              {eventDay && inMonth && (
                <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                  selected ? 'bg-white' : 'bg-indigo-500'
                }`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
