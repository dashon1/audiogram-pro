import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Download, 
  Share, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  MoreHorizontal,
  Copy,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const statusColors = {
  uploading: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30"
};

export default function LibraryGrid({ audiograms, onEdit, onShare, onDownload, onDelete }) {
  const handleDuplicate = async (audiogram) => {
    // In a real app, this would create a copy
    console.log('Duplicating audiogram:', audiogram.title);
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {audiograms.map((audiogram) => (
          <Card 
            key={audiogram.id} 
            className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1 truncate group-hover:text-purple-200 transition-colors">
                    {audiogram.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(audiogram.created_date), "MMM d")}</span>
                    {audiogram.duration && (
                      <span>• {audiogram.duration}s</span>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem 
                      onClick={() => onEdit(audiogram)}
                      className="text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDuplicate(audiogram)}
                      className="text-slate-300 hover:bg-slate-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem 
                      onClick={() => onShare(audiogram)}
                      className="text-slate-300 hover:bg-slate-700"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDownload(audiogram)}
                      className="text-slate-300 hover:bg-slate-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem 
                      onClick={() => onDelete(audiogram)}
                      className="text-red-400 hover:bg-slate-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Enhanced Waveform Preview */}
              <div className="h-24 bg-slate-800/50 rounded-lg mb-4 relative overflow-hidden group-hover:bg-slate-800/70 transition-colors">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(audiogram)}
                    className="w-12 h-12 rounded-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 hover:text-purple-300 transition-all duration-300 hover:scale-110"
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
                
                {/* Animated waveform bars */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 p-2">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="bg-purple-500/30 rounded-sm transition-all duration-300 group-hover:bg-purple-500/50"
                      style={{
                        height: `${Math.random() * 40 + 10}%`,
                        width: '3px',
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Status & Stats */}
              <div className="flex items-center justify-between mb-4">
                <Badge className={statusColors[audiogram.status] || statusColors.ready}>
                  {audiogram.status}
                </Badge>
                
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                        <Eye className="w-3 h-3" />
                        {audiogram.view_count || 0}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total views</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="flex items-center gap-1 hover:text-slate-300 transition-colors">
                        <Download className="w-3 h-3" />
                        {audiogram.download_count || 0}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Downloads</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Platform */}
              {audiogram.social_platform && (
                <Badge variant="outline" className="border-slate-600 text-slate-300 mb-4 hover:border-slate-500 transition-colors">
                  {audiogram.social_platform}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Badge>
              )}

              {/* Enhanced Actions */}
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={() => onEdit(audiogram)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit audiogram (E)</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDownload(audiogram)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download (D)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}