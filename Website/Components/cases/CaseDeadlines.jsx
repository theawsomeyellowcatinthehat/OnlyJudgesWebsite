import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import { format, isAfter, differenceInDays } from "date-fns";
import { CaseDeadline, Schedule } from "@/entities/all";
import DeadlineForm from "./DeadlineForm";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800", 
  completed: "bg-green-100 text-green-800",
  missed: "bg-red-100 text-red-800"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600"
};

export default function CaseDeadlines({ caseData }) {
  const [deadlines, setDeadlines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (caseData?.id) {
      loadDeadlines();
    }
  }, [caseData]);

  const loadDeadlines = async () => {
    setIsLoading(true);
    const data = await CaseDeadline.filter({ case_id: caseData.id }, "-due_date");
    setDeadlines(data);
    setIsLoading(false);
  };

  const handleSubmit = async (deadlineData) => {
    // Create the deadline
    const deadline = {
      ...deadlineData,
      case_id: caseData.id,
      case_number: caseData.case_number,
      case_name: caseData.case_name
    };

    let savedDeadline;
    if (editingDeadline) {
      await CaseDeadline.update(editingDeadline.id, deadline);
      savedDeadline = { ...editingDeadline, ...deadline };
      
      // Update corresponding schedule entry if it exists
      if (editingDeadline.schedule_id) {
        await Schedule.update(editingDeadline.schedule_id, {
          title: `DEADLINE: ${deadline.title}`,
          event_type: "deadline",
          date: deadline.due_date,
          start_time: deadline.due_time || "23:59",
          end_time: deadline.due_time || "23:59",
          case_number: deadline.case_number,
          assigned_attorney: deadline.assigned_attorney,
          description: `Case deadline for ${deadline.case_name}. ${deadline.notes || ''}`,
          priority: deadline.priority,
          status: deadline.status === "completed" ? "completed" : "scheduled"
        });
      }
    } else {
      savedDeadline = await CaseDeadline.create(deadline);
      
      // Automatically create a schedule entry for this deadline
      const scheduleEntry = await Schedule.create({
        title: `DEADLINE: ${deadline.title}`,
        event_type: "deadline",
        date: deadline.due_date,
        start_time: deadline.due_time || "23:59",
        end_time: deadline.due_time || "23:59",
        case_number: deadline.case_number,
        assigned_attorney: deadline.assigned_attorney,
        description: `Case deadline for ${deadline.case_name}. ${deadline.notes || ''}`,
        priority: deadline.priority,
        status: "scheduled"
      });

      // Update the deadline with the schedule reference
      await CaseDeadline.update(savedDeadline.id, { 
        schedule_id: scheduleEntry.id 
      });
    }

    setShowForm(false);
    setEditingDeadline(null);
    loadDeadlines();
  };

  const handleStatusChange = async (deadline, newStatus) => {
    await CaseDeadline.update(deadline.id, { status: newStatus });
    
    // Update the corresponding schedule entry
    if (deadline.schedule_id) {
      await Schedule.update(deadline.schedule_id, {
        status: newStatus === "completed" ? "completed" : "scheduled"
      });
    }
    
    loadDeadlines();
  };

  const getDeadlineUrgency = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline.due_date);
    const daysUntil = differenceInDays(dueDate, today);
    
    if (deadline.status === 'completed') return 'completed';
    if (isAfter(today, dueDate)) return 'overdue';
    if (daysUntil <= 1) return 'urgent';
    if (daysUntil <= 3) return 'soon';
    if (daysUntil <= 7) return 'upcoming';
    return 'future';
  };

  if (!caseData) return null;

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            Case Deadlines
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowForm(true)}
            className="hover:bg-slate-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Deadline
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-100 h-20 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {deadlines.map((deadline) => {
              const urgency = getDeadlineUrgency(deadline);
              return (
                <div key={deadline.id} className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  urgency === 'overdue' ? 'bg-red-50 border-red-200' :
                  urgency === 'urgent' ? 'bg-orange-50 border-orange-200' :
                  urgency === 'soon' ? 'bg-yellow-50 border-yellow-200' :
                  urgency === 'completed' ? 'bg-green-50 border-green-200' :
                  'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{deadline.title}</h4>
                      <p className="text-sm text-slate-600 capitalize">
                        {deadline.deadline_type?.replace('_', ' ')} deadline
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {urgency === 'overdue' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {urgency === 'urgent' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      {deadline.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingDeadline(deadline);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(deadline.due_date), 'MMM d, yyyy')}</span>
                        {deadline.due_time && <span>at {deadline.due_time}</span>}
                      </div>
                      <span>•</span>
                      <span>{deadline.assigned_attorney}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className={statusColors[deadline.status]}>
                        {deadline.status?.replace('_', ' ')}
                      </Badge>
                      <Badge className={priorityColors[deadline.priority]} variant="outline">
                        {deadline.priority}
                      </Badge>
                    </div>
                  </div>

                  {deadline.notes && (
                    <p className="text-sm text-slate-600 mt-2 italic">{deadline.notes}</p>
                  )}

                  {deadline.status !== 'completed' && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(deadline, 'in_progress')}
                        disabled={deadline.status === 'in_progress'}
                      >
                        Mark In Progress
                      </Button>
                      <Button
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(deadline, 'completed')}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
            
            {deadlines.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600">No deadlines set for this case</p>
                <p className="text-sm text-slate-500">Add deadlines to track important dates</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {showForm && (
        <DeadlineForm
          deadline={editingDeadline}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingDeadline(null);
          }}
        />
      )}
    </Card>
  );
}