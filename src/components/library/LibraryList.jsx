import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Share, Edit, Trash2, Eye, Clock } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  uploading: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30", 
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30"
};

export default function LibraryList({ audiograms, onEdit, onShare, onDownload, onDelete }) {
  return (
    <div className="space-y-4">
      {audiograms.map((audiogram) => (
        <Card 
          key={audiogram.id} 
          className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700 transition-all duration-200"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {/* Play Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(audiogram)}
                className="border-slate-700 text-purple-400 hover:bg-purple-500/20 flex-shrink-0"
              >
                <Play className="w-4 h-4" />
              </Button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white mb-1 truncate">{audiogram.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(audiogram.created_date), "MMM d, yyyy")}
                  </span>
                  {audiogram.duration && <span>{audiogram.duration}s</span>}
                  {audiogram.social_platform && (
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {audiogram.social_platform}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex-shrink-0">
                <Badge className={statusColors[audiogram.status] || statusColors.ready}>
                  {audiogram.status}
                </Badge>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-slate-400 flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {audiogram.view_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {audiogram.download_count || 0}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(audiogram)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onShare(audiogram)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Share className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownload(audiogram)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(audiogram)}
                  className="border-slate-700 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}