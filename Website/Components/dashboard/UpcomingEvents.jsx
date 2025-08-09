import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const eventTypeColors = {
  court_hearing: "bg-red-100 text-red-800",
  client_meeting: "bg-blue-100 text-blue-800", 
  deposition: "bg-purple-100 text-purple-800",
  mediation: "bg-green-100 text-green-800",
  deadline: "bg-orange-100 text-orange-800",
  internal_meeting: "bg-gray-100 text-gray-800",
  other: "bg-slate-100 text-slate-800"
};

export default function UpcomingEvents({ schedule, isLoading }) {
  const upcomingEvents = schedule
    .filter(event => new Date(event.date) >= new Date())
    .slice(0, 5);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-3 rounded-lg bg-slate-50/50 border border-slate-200/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900 text-sm">{event.title}</h4>
                  <Badge className={eventTypeColors[event.event_type]} variant="secondary">
                    {event.event_type?.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="w-3 h-3" />
                    <span>{event.start_time} - {event.end_time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">No upcoming events</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}