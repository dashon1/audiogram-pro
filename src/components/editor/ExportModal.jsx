import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Share, Video, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

const exportFormats = [
  { 
    value: "mp4_1080", 
    label: "MP4 1080p", 
    size: "1920x1080", 
    platforms: ["youtube", "linkedin"],
    icon: Video 
  },
  { 
    value: "mp4_720", 
    label: "MP4 720p", 
    size: "1280x720", 
    platforms: ["twitter", "general"],
    icon: Video 
  },
  { 
    value: "mp4_square", 
    label: "MP4 Square", 
    size: "1080x1080", 
    platforms: ["instagram", "facebook"],
    icon: Instagram 
  },
  { 
    value: "mp4_story", 
    label: "MP4 Story", 
    size: "1080x1920", 
    platforms: ["instagram", "tiktok"],
    icon: Instagram 
  },
];

const platformIcons = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Instagram,
  tiktok: Video,
  general: Video
};

export default function ExportModal({ isOpen, onClose, audiogram, styleConfig }) {
  const [selectedFormat, setSelectedFormat] = useState("mp4_1080");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Create a mock download
      const format = exportFormats.find(f => f.value === selectedFormat);
      const filename = `${audiogram.title}_${format.size}.mp4`;
      
      // In a real app, this would be the actual video URL
      const mockVideoUrl = "data:text/plain;charset=utf-8," + encodeURIComponent("Video exported successfully!");
      
      const link = document.createElement('a');
      link.href = mockVideoUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
      onClose();
    }, 3000);
  };

  const selectedFormatData = exportFormats.find(f => f.value === selectedFormat);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-400" />
            Export Audiogram
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-4">
            <Label className="text-slate-300">Export Format</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exportFormats.map((format) => (
                <Card 
                  key={format.value}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedFormat === format.value
                      ? 'bg-purple-500/20 border-purple-500/50'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedFormat(format.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <format.icon className="w-6 h-6 text-purple-400" />
                      <div className="flex-1">
                        <div className="font-medium text-white">{format.label}</div>
                        <div className="text-sm text-slate-400">{format.size}</div>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {format.platforms.map((platform) => {
                        const PlatformIcon = platformIcons[platform];
                        return (
                          <Badge 
                            key={platform} 
                            variant="outline" 
                            className="text-xs border-slate-600 text-slate-300"
                          >
                            <PlatformIcon className="w-3 h-3 mr-1" />
                            {platform}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-slate-300">Export Preview</Label>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">{audiogram.title}</div>
                    <div className="text-sm text-slate-400">
                      {selectedFormatData?.size} • {audiogram.duration}s
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Ready to Export
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex-1"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Video
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}