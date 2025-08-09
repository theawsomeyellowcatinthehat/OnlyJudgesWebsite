import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

export default function PrecedentForm({ precedent, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(precedent || {
    case_name: "",
    citation: "",
    court: "",
    year: "",
    legal_principle: "",
    case_summary: "",
    practice_area: "civil",
    keywords: "",
    relevance: "relevant",
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...formData, year: parseInt(formData.year, 10) || undefined };
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{precedent ? 'Edit Precedent' : 'New Precedent'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Case Name" value={formData.case_name} onChange={e => handleChange('case_name', e.target.value)} required />
            <Input placeholder="Citation" value={formData.citation} onChange={e => handleChange('citation', e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input placeholder="Court" value={formData.court} onChange={e => handleChange('court', e.target.value)} required />
            <Input type="number" placeholder="Year" value={formData.year} onChange={e => handleChange('year', e.target.value)} required />
          </div>
          <Input placeholder="Legal Principle" value={formData.legal_principle} onChange={e => handleChange('legal_principle', e.target.value)} required />
          <Textarea placeholder="Case Summary" value={formData.case_summary} onChange={e => handleChange('case_summary', e.target.value)} rows={5} />
          <Textarea placeholder="Notes" value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
          <div className="grid grid-cols-3 gap-4">
            <Select value={formData.practice_area} onValueChange={value => handleChange('practice_area', value)}>
              <SelectTrigger><SelectValue placeholder="Practice Area" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="civil">Civil</SelectItem>
                <SelectItem value="criminal">Criminal</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="constitutional">Constitutional</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formData.relevance} onValueChange={value => handleChange('relevance', value)}>
              <SelectTrigger><SelectValue placeholder="Relevance" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="highly_relevant">Highly Relevant</SelectItem>
                <SelectItem value="relevant">Relevant</SelectItem>
                <SelectItem value="somewhat_relevant">Somewhat Relevant</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Keywords (comma separated)" value={formData.keywords} onChange={e => handleChange('keywords', e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Precedent</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}