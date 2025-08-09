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
          }}import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Edit, Calendar, DollarSign, User, Building2, Scale } from "lucide-react";
import { format } from "date-fns";
import CaseDeadlines from "./CaseDeadlines";

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
  on_appeal: "bg-blue-100 text-blue-800 border-blue-200"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600"
};

const courtLevelIcons = {
  district: Building2,
  federal: Scale,
  supreme: Scale
};

export default function CaseDetails({ caseData, onClose, onEdit }) {
  if (!caseData) return null;

  const CourtIcon = courtLevelIcons[caseData.court_level];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">
                <CourtIcon className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <span className="text-2xl font-bold">{caseData.case_name}</span>
                <p className="text-sm text-slate-500 font-normal">{caseData.case_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(caseData)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Case
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle>Case Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Client</p>
                      <p className="font-semibold">{caseData.client_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Opposing Party</p>
                      <p className="font-semibold">{caseData.opposing_party || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Assigned Attorney</p>
                      <p className="font-semibold">{caseData.assigned_attorney}</p>
                    </div>
                  </div>
                  {caseData.case_value && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600">Case Value</p>
                        <p className="font-semibold">${caseData.case_value.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Filing Date</p>
                      <p className="font-semibold">
                        {format(new Date(caseData.filing_date || caseData.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-600">Court Location</p>
                      <p className="font-semibold">{caseData.court_location || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {caseData.description && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Description</p>
                    <p className="text-slate-800 bg-slate-50 p-3 rounded-lg">{caseData.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                  <Badge className={statusColors[caseData.status]}>
                    {caseData.status?.replace('_', ' ')}
                  </Badge>
                  <Badge className={priorityColors[caseData.priority]} variant="outline">
                    {caseData.priority} priority
                  </Badge>
                  <Badge variant="outline" className="text-slate-600">
                    {caseData.court_level} court
                  </Badge>
                  {caseData.case_type && (
                    <Badge variant="outline" className="text-slate-600">
                      {caseData.case_type.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Case Deadlines */}
            <CaseDeadlines caseData={caseData} />
          </div>

          {/* Sidebar - Quick Stats and Actions */}
          <div className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Contact Client
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Case Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Case Created</p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(caseData.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  {caseData.filing_date && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Case Filed</p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(caseData.filing_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
        />
      )}
    </Card>
  );
}