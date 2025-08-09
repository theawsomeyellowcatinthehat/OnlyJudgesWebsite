import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, Briefcase, Building, BadgeCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  active: "bg-green-100 text-green-800",
  on_leave: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800"
};

const positionColors = {
  partner: "bg-amber-100 text-amber-800 border-amber-200",
  senior_attorney: "bg-blue-100 text-blue-800 border-blue-200",
  associate: "bg-sky-100 text-sky-800 border-sky-200",
  paralegal: "bg-indigo-100 text-indigo-800 border-indigo-200",
  default: "bg-slate-100 text-slate-800 border-slate-200"
};

export default function EmployeeGrid({ employees, isLoading, onEdit }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee) => {
        const fallback = employee.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
        const positionColor = positionColors[employee.position] || positionColors.default;
        return (
          <Card key={employee.id} className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="relative pb-4">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(employee)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit className="w-4 h-4 text-slate-500" />
                </Button>
              </div>
              <div className="flex flex-col items-center text-center pt-4">
                <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-900 text-white font-bold text-2xl">{fallback}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-slate-900">{employee.full_name}</h3>
                <p className="text-amber-600 font-medium">{employee.position?.replace(/_/g, ' ')}</p>
                <Badge className={`${statusColors[employee.status]} mt-2`}>
                  {employee.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${employee.email}`} className="truncate hover:text-slate-900">{employee.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="truncate">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Building className="w-4 h-4 text-slate-400" />
                <span className="truncate">{employee.department?.replace(/_/g, ' ')}</span>
              </div>
              {employee.bar_admission && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <BadgeCheck className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{employee.bar_admission}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}