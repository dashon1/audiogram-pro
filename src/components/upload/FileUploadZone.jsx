import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileAudio, Upload, Mic, Sparkles, CheckCircle } from "lucide-react";

export default function FileUploadZone({ onFileSelect, dragActive, file }) {
  const [uploadStage, setUploadStage] = useState('idle'); // idle, uploading, complete
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setUploadStage('uploading');
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploadStage('complete');
            setTimeout(() => {
              onFileSelect(e);
              setUploadStage('idle');
              setUploadProgress(0);
            }, 1000);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
  };

  if (uploadStage === 'uploading') {
    return (
      <div className="border-2 border-dashed border-blue-500 bg-blue-500/5 rounded-xl p-12 transition-all duration-200">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 relative">
            <Upload className="w-10 h-10 text-blue-400 animate-pulse" />
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-spin border-t-blue-500"></div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Uploading...</h3>
          <p className="text-slate-400 mb-6">Processing your audio file</p>
          <div className="max-w-xs mx-auto">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-slate-400 mt-2">{uploadProgress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  if (uploadStage === 'complete') {
    return (
      <div className="border-2 border-dashed border-green-500 bg-green-500/5 rounded-xl p-12 transition-all duration-200">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Upload Complete!</h3>
          <p className="text-slate-400">Ready for AI processing</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative border-2 border-dashed rounded-xl p-12 transition-all duration-300 group ${
      dragActive 
        ? "border-purple-500 bg-purple-500/10 scale-105" 
        : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/30"
    }`}>
      <input
        type="file"
        accept="audio/*,.mp3,.wav,.m4a"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="text-center">
        <div className="relative mb-6">
          <div className={`w-20 h-20 mx-auto bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center transition-all duration-300 ${
            dragActive ? 'scale-110' : 'group-hover:scale-105'
          }`}>
            <FileAudio className="w-10 h-10 text-purple-400" />
          </div>
          <div className={`absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center transition-all duration-300 ${
            dragActive ? 'scale-110 rotate-12' : 'group-hover:scale-105'
          }`}>
            <Upload className="w-4 h-4 text-white" />
          </div>
          {dragActive && (
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-500/30 rounded-full animate-ping"></div>
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2 transition-colors">
          {file ? "File Ready" : dragActive ? "Drop it here!" : "Drop your podcast here"}
        </h3>
        <p className="text-slate-400 mb-6">
          {file ? `Selected: ${file.name}` : "Or click to browse files • Supports MP3, WAV, M4A"}
        </p>
        
        <div className="flex justify-center gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="audio/*,.mp3,.wav,.m4a"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-purple-500 transition-all rounded-md px-4 py-2 flex items-center gap-2">
              <Upload className="w-4 h-4" style={{ opacity: 1 }} />
              Browse Files
            </div>
          </label>
          <Button
            type="button" 
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-blue-500 transition-all"
            disabled
          >
            <Mic className="w-4 h-4 mr-2" style={{ opacity: 1 }} />
            Record Live
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>AI Enhanced</span>
          </div>
          <div>•</div>
          <div>Max 100MB</div>
          <div>•</div>
          <div>30s processing</div>
        </div>
      </div>
    </div>
  );
}