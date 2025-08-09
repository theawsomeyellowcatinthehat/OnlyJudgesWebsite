import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Scale, Edit, DollarSign, Calendar, User, Eye } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function CaseGrid({ cases, isLoading, onEdit, onView }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((caseItem) => {
        const CourtIcon = courtLevelIcons[caseItem.court_level];
        return (
          <Card key={caseItem.id} className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors">
                    <CourtIcon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-slate-900 mb-1">{caseItem.case_name}</CardTitle>
                    <p className="text-sm text-slate-600">{caseItem.case_number}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView && onView(caseItem)}
                    className="h-8 w-8"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(caseItem)}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="w-4 h-4" />
                  <span>Client: {caseItem.client_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <User className="w-4 h-4" />
                  <span>Attorney: {caseItem.assigned_attorney}</span>
                </div>
                {caseItem.case_value && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4" />
                    <span>${caseItem.case_value.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(caseItem.filing_date || caseItem.created_date), 'MMM d, yyyy')}</span>
                </div>
              </div>

              {caseItem.description && (
                <p className="text-sm text-slate-600 line-clamp-2">{caseItem.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                <Badge className={statusColors[caseItem.status]}>
                  {caseItem.status?.replace('_', ' ')}
                </Badge>
                <Badge className={priorityColors[caseItem.priority]} variant="outline">
                  {caseItem.priority}
                </Badge>
                <Badge variant="outline" className="text-slate-600">
                  {caseItem.court_level}
                </Badge>
                {caseItem.case_type && (
                  <Badge variant="outline" className="text-slate-600">
                    {caseItem.case_type.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {cases.length === 0 && (
        <div className="col-span-full text-center py-12">
          <Scale className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">No cases found</p>
          <p className="text-slate-500">Start by adding your first case</p>
        </div>
      )}
    </div>
  );
}