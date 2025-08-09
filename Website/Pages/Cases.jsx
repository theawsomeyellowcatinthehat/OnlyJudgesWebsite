import React, { useState, useEffect } from "react";
import { Case } from "@/entities/Case";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

import CaseFilters from "../components/cases/CaseFilters";
import CaseGrid from "../components/cases/CaseGrid";
import CaseForm from "../components/cases/CaseForm";
import CaseDetails from "../components/cases/CaseDetails";

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [viewingCase, setViewingCase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    court_level: "all",
    status: "all",
    priority: "all",
    case_type: "all"
  });

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, searchTerm, filters]);

  const loadCases = async () => {
    setIsLoading(true);
    const data = await Case.list("-created_date");
    setCases(data);
    setIsLoading(false);
  };

  const filterCases = () => {
    let filtered = cases;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.case_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.assigned_attorney?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "all") {
        filtered = filtered.filter(c => c[key] === value);
      }
    });

    setFilteredCases(filtered);
  };

  const handleSubmit = async (caseData) => {
    if (editingCase) {
      await Case.update(editingCase.id, caseData);
    } else {
      await Case.create(caseData);
    }
    setShowForm(false);
    setEditingCase(null);
    loadCases();
  };

  const handleEdit = (caseItem) => {
    setEditingCase(caseItem);
    setViewingCase(null);
    setShowForm(true);
  };

  const handleView = (caseItem) => {
    setViewingCase(caseItem);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Case Management</h1>
            <p className="text-slate-600">Track and manage all your legal cases</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Case
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>
            <CaseFilters filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Cases Grid */}
        <CaseGrid 
          cases={filteredCases}
          isLoading={isLoading}
          onEdit={handleEdit}
          onView={handleView}
        />

        {/* Case Form Modal */}
        {showForm && (
          <CaseForm
            case={editingCase}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingCase(null);
            }}
          />
        )}

        {/* Case Details Modal */}
        {viewingCase && (
          <CaseDetails
            caseData={viewingCase}
            onClose={() => setViewingCase(null)}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}