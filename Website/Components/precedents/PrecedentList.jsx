import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const relevanceColors = {
  highly_relevant: "bg-green-100 text-green-800",
  relevant: "bg-blue-100 text-blue-800",
  somewhat_relevant: "bg-yellow-100 text-yellow-800"
};

export default function PrecedentList({ precedents, isLoading, onEdit }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {precedents.map((precedent) => (
        <Card key={precedent.id} className="bg-white/70 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">{precedent.case_name}</CardTitle>
                <p className="text-sm text-slate-500 font-mono">{precedent.citation}</p>
              </div>
              <Button
                variant="ghost" size="icon" onClick={() => onEdit(precedent)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-slate-800">Legal Principle</h4>
              <p className="text-slate-600">{precedent.legal_principle}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Summary</h4>
              <p className="text-slate-600 line-clamp-3">{precedent.case_summary}</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            <Badge className={relevanceColors[precedent.relevance]}>{precedent.relevance?.replace('_', ' ')}</Badge>
            <Badge variant="outline">{precedent.practice_area?.replace('_', ' ')}</Badge>
            <Badge variant="outline">{precedent.court}</Badge>
            <Badge variant="outline">{precedent.year}</Badge>
          </CardFooter>
        </Card>
      ))}
      {precedents.length === 0 && (
         <div className="col-span-full text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">No precedents found</p>
          <p className="text-slate-500">Start by adding your first precedent to the library</p>
        </div>
      )}
    </div>
  );
}