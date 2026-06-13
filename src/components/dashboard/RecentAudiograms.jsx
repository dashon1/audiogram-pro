import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Download, 
  Share, 
  MoreHorizontal, 
  Eye, 
  Clock,
  AudioWaveform // Changed from Waveform to AudioWaveform
} from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  uploading: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/20 text-blue-400 border-blue-500/30", 
  ready: "bg-green-500/20 text-green-400 border-green-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30"
};

export default function RecentAudiograms({ audiograms, isLoading, onRefresh }) {
  const recentAudiograms = audiograms.slice(0, 6);

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <AudioWaveform className="w-5 h-5 text-purple-400" style={{ opacity: 1 }} />
          Recent Audiograms
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAudiograms.map((audiogram) => (
            <div key={audiogram.id} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-purple-400" style={{ opacity: 1 }} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{audiogram.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" style={{ opacity: 1 }} />
                        {format(new Date(audiogram.created_date), "MMM d")}
                      </span>
                      {audiogram.duration && (
                        <span>{Math.floor(audiogram.duration / 60)}:{(audiogram.duration % 60).toString().padStart(2, '0')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge className={statusColors[audiogram.status] || statusColors.ready}>
                  {audiogram.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" style={{ opacity: 1 }} />
                    {audiogram.view_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" style={{ opacity: 1 }} />
                    {audiogram.download_count || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                    <Share className="w-4 h-4" style={{ opacity: 1 }} />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                    <MoreHorizontal className="w-4 h-4" style={{ opacity: 1 }} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}