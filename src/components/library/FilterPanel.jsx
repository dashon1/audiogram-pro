import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Calendar, Smartphone } from "lucide-react";

export default function FilterPanel({ filters, onChange }) {
  const handleFilterChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-slate-300">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="uploading">Uploading</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Platform Filter */}
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Platform
          </Label>
          <Select 
            value={filters.platform} 
            onValueChange={(value) => handleFilterChange('platform', value)}
          >
            <SelectTrigger className="border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label className="text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </Label>
          <Select 
            value={filters.dateRange} 
            onValueChange={(value) => handleFilterChange('dateRange', value)}
          >
            <SelectTrigger className="border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}