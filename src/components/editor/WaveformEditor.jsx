import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function WaveformEditor({ 
  audiogram, 
  styleConfig, 
  isPlaying, 
  currentTime, 
  onPlay, 
  onTimeChange 
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const drawWaveform = () => {
      const canvas = canvasRef.current;
      if (!canvas || !audiogram?.waveform_data) return;

      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      
      ctx.clearRect(0, 0, width, height);
      
      // Background
      ctx.fillStyle = styleConfig.background_color;
      ctx.fillRect(0, 0, width, height);
      
      // Waveform
      const waveformData = audiogram.waveform_data || [];
      const barWidth = width / waveformData.length;
      const centerY = height / 2;
      
      waveformData.forEach((value, index) => {
        const barHeight = (value / 100) * (height * 0.8);
        const x = index * barWidth;
        
        // Progress indicator
        const progress = currentTime / (audiogram.duration || 60);
        const isActive = index < progress * waveformData.length;
        
        ctx.fillStyle = isActive 
          ? styleConfig.waveform_color 
          : styleConfig.waveform_color + '40';
        
        ctx.fillRect(x, centerY - barHeight / 2, barWidth - 1, barHeight);
      });
      
      // Title overlay
      ctx.fillStyle = styleConfig.text_color;
      ctx.font = `bold 24px ${styleConfig.font_family}`;
      ctx.textAlign = 'center';
      ctx.fillText(audiogram.title, width / 2, height - 40);
    };

    drawWaveform();
  }, [audiogram, styleConfig, currentTime]);

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
      <CardContent className="p-6">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg cursor-pointer"
            onClick={onPlay}
          />
          
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur">
                <Play className="w-8 h-8 text-slate-900 ml-1" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}