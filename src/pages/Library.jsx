
import React, { useState, useEffect } from "react";
import { Audiogram } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Grid,
  List,
  Play,
  Download,
  Share,
  Edit,
  Trash2,
  Eye,
  Clock,
  Plus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

import LibraryGrid from "../components/library/LibraryGrid";
import LibraryList from "../components/library/LibraryList";
import FilterPanel from "../components/library/FilterPanel";

export default function LibraryPage() {
  const navigate = useNavigate();
  const [audiograms, setAudiograms] = useState([]);
  const [filteredAudiograms, setFilteredAudiograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    platform: "all",
    dateRange: "all"
  });

  useEffect(() => {
    loadAudiograms();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = audiograms;

      // Search filter
      if (searchQuery) {
        filtered = filtered.filter(audiogram =>
          audiogram.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Status filter
      if (filters.status !== "all") {
        filtered = filtered.filter(audiogram => audiogram.status === filters.status);
      }

      // Platform filter
      if (filters.platform !== "all") {
        filtered = filtered.filter(audiogram => audiogram.social_platform === filters.platform);
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const now = new Date();
        const cutoffDate = new Date();

        switch (filters.dateRange) {
          case "today":
            cutoffDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case "month":
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
        }

        if (filters.dateRange !== "all") {
          filtered = filtered.filter(audiogram =>
            new Date(audiogram.created_date) >= cutoffDate
          );
        }
      }

      setFilteredAudiograms(filtered);
    };

    applyFilters();
  }, [audiograms, searchQuery, filters]); // Dependencies for this useEffect

  const loadAudiograms = async () => {
    setIsLoading(true);
    try {
      const data = await Audiogram.list("-created_date");
      setAudiograms(data);
    } catch (error) {
      console.error("Error loading audiograms:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (audiogram) => {
    navigate(createPageUrl("Editor") + "?id=" + audiogram.id);
  };

  const handleShare = async (audiogram) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: audiogram.title,
          text: `Check out this audiogram: ${audiogram.title}`,
          url: audiogram.video_url || window.location.href
        });
      } catch (error) {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback: copy to clipboard
      const url = audiogram.video_url || window.location.href;
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  const handleDownload = (audiogram) => {
    if (audiogram.video_url) {
      const link = document.createElement('a');
      link.href = audiogram.video_url;
      link.download = `${audiogram.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download count
      Audiogram.update(audiogram.id, {
        ...audiogram,
        download_count: (audiogram.download_count || 0) + 1
      });
    }
  };

  const handleDelete = async (audiogram) => {
    if (window.confirm(`Are you sure you want to delete "${audiogram.title}"?`)) {
      try {
        await Audiogram.delete(audiogram.id);
        loadAudiograms();
      } catch (error) {
        console.error("Error deleting audiogram:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Your Library</h1>
              <p className="text-slate-400">
                {filteredAudiograms.length} of {audiograms.length} audiograms
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link to={createPageUrl("Upload")}>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New Audiogram
                </Button>
              </Link>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search audiograms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={`border-slate-700 text-slate-300 hover:bg-slate-800 ${
                  showFilters ? 'bg-slate-800' : ''
                }`}
              >
                <Filter className="w-4 h-4" />
              </Button>

              <div className="flex border border-slate-700 rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={`text-slate-300 hover:bg-slate-800 rounded-none ${
                    viewMode === "grid" ? 'bg-slate-800' : ''
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={`text-slate-300 hover:bg-slate-800 rounded-none ${
                    viewMode === "list" ? 'bg-slate-800' : ''
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="bg-slate-900/50 backdrop-blur border-slate-800">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                        <div className="h-20 bg-slate-700 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : viewMode === "grid" ? (
              <LibraryGrid
                audiograms={filteredAudiograms}
                onEdit={handleEdit}
                onShare={handleShare}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            ) : (
              <LibraryList
                audiograms={filteredAudiograms}
                onEdit={handleEdit}
                onShare={handleShare}
                onDownload={handleDownload}
                onDelete={handleDelete}
              />
            )}

            {!isLoading && filteredAudiograms.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No audiograms found</h3>
                <p className="text-slate-400 mb-6">
                  {searchQuery || Object.values(filters).some(f => f !== "all")
                    ? "Try adjusting your search or filters"
                    : "Create your first audiogram to get started"
                  }
                </p>
                <Link to={createPageUrl("Upload")}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Audiogram
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
