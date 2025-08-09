import React, { useState, useEffect } from "react";
import { PayrollRecord, Employee } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import PayrollTable from "../components/payroll/PayrollTable";
import PayrollForm from "../components/payroll/PayrollForm";
import PayrollStats from "../components/payroll/PayrollStats";

export default function Payroll() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [recordsData, employeesData] = await Promise.all([
      PayrollRecord.list("-pay_date"),
      Employee.list("full_name")
    ]);
    setRecords(recordsData);
    setEmployees(employeesData);
    setIsLoading(false);
  };

  const handleSubmit = async (payrollData) => {
    await PayrollRecord.create(payrollData);
    setShowForm(false);
    loadData();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Payroll</h1>
            <p className="text-slate-600">Track and manage employee compensation</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Payroll Record
          </Button>
        </div>

        <PayrollStats records={records} isLoading={isLoading} />

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg">
          <PayrollTable 
            records={records}
            isLoading={isLoading}
          />
        </div>

        {showForm && (
          <PayrollForm
            employees={employees}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
}