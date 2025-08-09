import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, ArrowRight, Building2, Scale } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
  on_appeal: "bg-blue-100 text-blue-800 border-blue-200"
};

const courtLevelIcons = {
  district: Building2,
  federal: Scale,
  supreme: Scale
};

const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600", 
  high: "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600"
};

export default function RecentCases({ cases, isLoading }) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            Recent Cases
          </CardTitle>
          <Link to={createPageUrl("Cases")}>
            <Button variant="outline" size="sm" className="hover:bg-slate-50">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {cases.slice(0, 5).map((caseItem) => {
              const CourtIcon = courtLevelIcons[caseItem.court_level];
              return (
                <div key={caseItem.id} className="p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-200 border border-slate-200/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <CourtIcon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{caseItem.case_name}</h3>
                        <p className="text-sm text-slate-600">
                          {caseItem.case_number} • {caseItem.client_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {caseItem.assigned_attorney} • {format(new Date(caseItem.filing_date || caseItem.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <div className="flex gap-2">
                        <Badge className={statusColors[caseItem.status]}>
                          {caseItem.status?.replace('_', ' ')}
                        </Badge>
                        <Badge className={priorityColors[caseItem.priority]} variant="outline">
                          {caseItem.priority}
                        </Badge>
                      </div>
                      <span className="text-xs text-slate-500 capitalize">
                        {caseItem.court_level} court
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {cases.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No cases found</p>
                <p className="text-sm text-slate-500">Start by adding your first case</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}