import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scissors, Play, Pause } from "lucide-react";

export default function AudioTrimmer({ audiogram, onTrimChange }) {
  const [trimStart, setTrimStart] = useState(audiogram?.trim_start || 0);
  const [trimEnd, setTrimEnd] = useState(audiogram?.trim_end || audiogram?.duration || 60);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleApply = () => {
    onTrimChange({ trim_start: trimStart, trim_end: trimEnd });
  };

  const duration = audiogram?.duration || 60;
  const trimmedDuration = trimEnd - trimStart;

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Scissors className="w-5 h-5 text-cyan-400" />
          Audio Trimmer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Waveform Timeline */}
        <div className="relative h-24 bg-slate-800/50 rounded-lg overflow-hidden">
          {/* Waveform bars */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 px-2">
            {Array.from({ length: 100 }, (_, i) => {
              const position = (i / 100) * duration;
              const isInRange = position >= trimStart && position <= trimEnd;
              return (
                <div
                  key={i}
                  className={`rounded-sm transition-all ${
                    isInRange ? 'bg-cyan-500/70' : 'bg-slate-600/30'
                  }`}
                  style={{
                    height: `${Math.random() * 60 + 20}%`,
                    width: '2px'
                  }}
                />
              );
            })}
          </div>

          {/* Trim indicators */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-cyan-400"
            style={{ left: `${(trimStart / duration) * 100}%` }}
          />
          <div 
            className="absolute top-0 bottom-0 w-1 bg-cyan-400"
            style={{ left: `${(trimEnd / duration) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Start Time</span>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {trimStart.toFixed(1)}s
              </Badge>
            </div>
            <Slider
              value={[trimStart]}
              onValueChange={([value]) => setTrimStart(Math.min(value, trimEnd - 1))}
              max={duration}
              step={0.1}
              className="flex-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">End Time</span>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {trimEnd.toFixed(1)}s
              </Badge>
            </div>
            <Slider
              value={[trimEnd]}
              onValueChange={([value]) => setTrimEnd(Math.max(value, trimStart + 1))}
              max={duration}
              step={0.1}
              className="flex-1"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Original Duration:</span>
            <span className="text-white">{duration.toFixed(1)}s</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Trimmed Duration:</span>
            <span className="text-cyan-400 font-semibold">{trimmedDuration.toFixed(1)}s</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Removed:</span>
            <span className="text-white">{(duration - trimmedDuration).toFixed(1)}s</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleApply}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white flex-1"
          >
            <Scissors className="w-4 h-4 mr-2" />
            Apply Trim
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setTrimStart(0);
              setTrimEnd(duration);
            }}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}