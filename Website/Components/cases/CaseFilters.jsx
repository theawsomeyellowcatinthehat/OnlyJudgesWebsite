import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CaseFilters({ filters, onFilterChange }) {
  const handleFilterChange = (key, value) => {
    onFilterChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={filters.court_level} onValueChange={(value) => handleFilterChange('court_level', value)}>
        <SelectTrigger className="w-32 bg-white">
          <SelectValue placeholder="Court Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Courts</SelectItem>
          <SelectItem value="district">District</SelectItem>
          <SelectItem value="federal">Federal</SelectItem>
          <SelectItem value="supreme">Supreme</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
        <SelectTrigger className="w-32 bg-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
          <SelectItem value="on_appeal">On Appeal</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
        <SelectTrigger className="w-32 bg-white">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.case_type} onValueChange={(value) => handleFilterChange('case_type', value)}>
        <SelectTrigger className="w-40 bg-white">
          <SelectValue placeholder="Case Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="civil">Civil</SelectItem>
          <SelectItem value="criminal">Criminal</SelectItem>
          <SelectItem value="corporate">Corporate</SelectItem>
          <SelectItem value="family">Family</SelectItem>
          <SelectItem value="immigration">Immigration</SelectItem>
          <SelectItem value="intellectual_property">IP</SelectItem>
          <SelectItem value="labor">Labor</SelectItem>
          <SelectItem value="tax">Tax</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}