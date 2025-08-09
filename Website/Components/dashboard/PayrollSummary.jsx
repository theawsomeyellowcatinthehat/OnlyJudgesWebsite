import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function PayrollSummary({ payroll, isLoading }) {
  const currentMonthPayroll = payroll.filter(record => {
    const recordDate = new Date(record.pay_date);
    const currentDate = new Date();
    return recordDate.getMonth() === currentDate.getMonth() && 
           recordDate.getFullYear() === currentDate.getFullYear();
  });

  const totalPaid = currentMonthPayroll.reduce((sum, record) => sum + (record.net_pay || 0), 0);
  const avgPay = totalPaid / (currentMonthPayroll.length || 1);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-slate-600" />
          Payroll Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-700 mb-1">Total Paid This Month</p>
              <p className="text-2xl font-bold text-green-800">
                ${totalPaid.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">
                  {currentMonthPayroll.length} payments
                </span>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm text-slate-600 mb-1">Average Payment</p>
              <p className="text-xl font-semibold text-slate-800">
                ${avgPay.toLocaleString()}
              </p>
            </div>

            {payroll.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Last payment: {format(new Date(payroll[0]?.pay_date || new Date()), 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}