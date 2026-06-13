import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Play, Eye } from "lucide-react";

export default function TrendingClips({ audiograms }) {
  const trendingClips = audiograms
    .filter(a => a.view_count > 0)
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5);

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-400" style={{ opacity: 1 }} />
          Trending Clips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trendingClips.map((clip, index) => (
            <div key={clip.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-orange-400" style={{ opacity: 1 }} />
                </div>
                <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 text-white text-xs p-0 flex items-center justify-center">
                  {index + 1}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white text-sm truncate">{clip.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Eye className="w-3 h-3" style={{ opacity: 1 }} />
                    {clip.view_count}
                  </div>
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                    {clip.social_platform || 'Multi'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
          
          {trendingClips.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-3" style={{ opacity: 0.5 }} />
              <p>No trending clips yet</p>
              <p className="text-sm">Create and share audiograms to see trends</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}