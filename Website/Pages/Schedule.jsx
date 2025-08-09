import React, { useState, useEffect } from "react";
import { Schedule } from "@/entities/Schedule";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import CalendarView from "../components/schedule/CalendarView";
import EventForm from "../components/schedule/EventForm";

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    const data = await Schedule.list();
    setEvents(data);
    setIsLoading(false);
  };

  const handleSubmit = async (eventData) => {
    if (editingEvent) {
      await Schedule.update(editingEvent.id, eventData);
    } else {
      await Schedule.create(eventData);
    }
    setShowForm(false);
    setEditingEvent(null);
    loadEvents();
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };
  
  const handleAddEventOnDate = (date) => {
    setEditingEvent({ date: date.toISOString().split('T')[0] });
    setShowForm(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Firm Schedule</h1>
            <p className="text-slate-600">View and manage all appointments and deadlines</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Event
          </Button>
        </div>

        <CalendarView 
          events={events}
          onEditEvent={handleEdit}
          onAddEvent={handleAddEventOnDate}
        />

        {showForm && (
          <EventForm
            event={editingEvent}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
          />
        )}
      </div>
    </div>
  );
}