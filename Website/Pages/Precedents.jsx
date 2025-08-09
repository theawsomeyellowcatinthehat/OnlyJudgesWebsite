import React, { useState, useEffect } from "react";
import { Precedent } from "@/entities/Precedent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

import PrecedentList from "../components/precedents/PrecedentList";
import PrecedentForm from "../components/precedents/PrecedentForm";

export default function Precedents() {
  const [precedents, setPrecedents] = useState([]);
  const [filteredPrecedents, setFilteredPrecedents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrecedent, setEditingPrecedent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPrecedents();
  }, []);

  useEffect(() => {
    let filtered = precedents;
    if (searchTerm) {
      filtered = precedents.filter(p => 
        p.case_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.citation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.keywords?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.legal_principle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPrecedents(filtered);
  }, [precedents, searchTerm]);

  const loadPrecedents = async () => {
    setIsLoading(true);
    const data = await Precedent.list("-year");
    setPrecedents(data);
    setIsLoading(false);
  };

  const handleSubmit = async (precedentData) => {
    if (editingPrecedent) {
      await Precedent.update(editingPrecedent.id, precedentData);
    } else {
      await Precedent.create(precedentData);
    }
    setShowForm(false);
    setEditingPrecedent(null);
    loadPrecedents();
  };

  const handleEdit = (precedent) => {
    setEditingPrecedent(precedent);
    setShowForm(true);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Precedent Library</h1>
            <p className="text-slate-600">Search and manage legal precedents</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Precedent
          </Button>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200 shadow-lg mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by case name, keywords, citation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200"
            />
          </div>
        </div>

        <PrecedentList 
          precedents={filteredPrecedents}
          isLoading={isLoading}
          onEdit={handleEdit}
        />

        {showForm && (
          <PrecedentForm
            precedent={editingPrecedent}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingPrecedent(null);
            }}
          />
        )}
      </div>
    </div>
  );
}