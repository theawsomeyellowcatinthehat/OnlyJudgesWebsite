import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const eventTypeColors = {
  court_hearing: "bg-red-500",
  client_meeting: "bg-blue-500",
  deposition: "bg-purple-500",
  mediation: "bg-green-500",
  deadline: "bg-orange-500",
  internal_meeting: "bg-gray-500",
  other: "bg-slate-500"
};

export default function CalendarView({ events, onEditEvent, onAddEvent }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px">
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold text-slate-600 text-sm py-2">{day}</div>
        ))}
        {days.map(day => {
          const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));
          return (
            <div
              key={day.toString()}
              className={`relative flex flex-col h-24 md:h-32 p-2 border border-slate-200/50 group ${
                isSameMonth(day, monthStart) ? 'bg-white' : 'bg-slate-50'
              }`}
            >
              <time dateTime={format(day, 'yyyy-MM-dd')} className={`font-semibold ${isSameDay(day, new Date()) ? 'text-blue-600' : 'text-slate-700'}`}>
                {format(day, 'd')}
              </time>
              <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onAddEvent(day)}>
                <Plus className="w-4 h-4 text-slate-500"/>
              </Button>
              <div className="mt-1 space-y-1 overflow-y-auto">
                {dayEvents.map(event => (
                  <button key={event.id} onClick={() => onEditEvent(event)} className="w-full text-left">
                    <Badge className={`w-full truncate text-white ${eventTypeColors[event.event_type]}`}>
                      {event.title}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}