import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function PayrollForm({ employees, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    pay_period_start: "",
    pay_period_end: "",
    gross_pay: "",
    deductions: "",
    net_pay: "",
    pay_date: "",
    payment_method: "direct_deposit"
  });

  useEffect(() => {
    const gross = parseFloat(formData.gross_pay) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    setFormData(prev => ({ ...prev, net_pay: (gross - deductions).toFixed(2) }));
  }, [formData.gross_pay, formData.deductions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeChange = (employeeId) => {
    const selectedEmployee = employees.find(emp => emp.id === employeeId);
    if (selectedEmployee) {
      setFormData(prev => ({
        ...prev,
        employee_id: selectedEmployee.employee_id,
        employee_name: selectedEmployee.full_name,
      }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Payroll Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select onValueChange={handleEmployeeChange}>
              <SelectTrigger><SelectValue placeholder="Select an employee" /></SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pay Period Start</Label>
              <Input type="date" value={formData.pay_period_start} onChange={e => handleChange('pay_period_start', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Pay Period End</Label>
              <Input type="date" value={formData.pay_period_end} onChange={e => handleChange('pay_period_end', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Gross Pay</Label>
              <Input type="number" step="0.01" value={formData.gross_pay} onChange={e => handleChange('gross_pay', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Deductions</Label>
              <Input type="number" step="0.01" value={formData.deductions} onChange={e => handleChange('deductions', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Net Pay</Label>
              <Input type="number" value={formData.net_pay} readOnly className="bg-slate-100" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pay Date</Label>
              <Input type="date" value={formData.pay_date} onChange={e => handleChange('pay_date', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={value => handleChange('payment_method', value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct_deposit">Direct Deposit</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}