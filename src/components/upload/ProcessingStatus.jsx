
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Brain, AudioWaveform, Sparkles } from "lucide-react";

const stepIcons = {
  'Uploading audio file...': Loader2,
  'AI analyzing audio content...': Brain,
  'Generating waveform visualization...': AudioWaveform,
  'Creating audiogram...': Sparkles,
  'Complete!': Sparkles
};

export default function ProcessingStatus({ step, progress }) {
  const StepIcon = stepIcons[step] || Loader2;
  
  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
      <CardContent className="p-8">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <StepIcon className={`w-10 h-10 text-purple-400 ${step !== 'Complete!' ? 'animate-spin' : ''}`} />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-500/20 rounded-full animate-pulse"></div>
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Processing Your Podcast</h3>
          <p className="text-purple-400 mb-6">{step}</p>
          
          <div className="max-w-md mx-auto">
            <Progress value={progress} className="h-2 mb-2" />
            <p className="text-sm text-slate-400">{progress}% complete</p>
          </div>
          
          <div className="mt-8 text-sm text-slate-400 space-y-2">
            <p>✨ AI is analyzing your content for the best clips</p>
            <p>🎵 Generating beautiful waveform visualizations</p>
            <p>🚀 Creating shareable audiogram ready for social media</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
