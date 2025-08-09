import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PayrollStats({ records, isLoading }) {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const lastMonthRecords = records.filter(r => new Date(r.pay_date) > lastMonth);

  const totalPaid = lastMonthRecords.reduce((sum, r) => sum + (r.net_pay || 0), 0);
  const totalRecords = lastMonthRecords.length;
  const uniqueEmployees = new Set(lastMonthRecords.map(r => r.employee_id)).size;

  const stats = [
    { title: "Paid (Last 30 days)", value: `$${totalPaid.toLocaleString()}`, icon: DollarSign },
    { title: "Payments Made", value: totalRecords, icon: FileText },
    { title: "Employees Paid", value: uniqueEmployees, icon: Users }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}