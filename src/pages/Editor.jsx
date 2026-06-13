import React, { useState, useEffect, useCallback } from "react";
import { Audiogram } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Download, 
  Share, 
  Palette, 
  Type,
  Sparkles,
  Save,
  Eye,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import WaveformEditor from "../components/editor/WaveformEditor";
import StyleControls from "../components/editor/StyleControls";
import ExportModal from "../components/editor/ExportModal";
import AudioTrimmer from "../components/editor/AudioTrimmer";
import CaptionsEditor from "../components/editor/CaptionsEditor";

export default function EditorPage() {
  const navigate = useNavigate();
  const [audiogram, setAudiogram] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [styleConfig, setStyleConfig] = useState({
    background_color: "#1e1b4b",
    waveform_color: "#8b5cf6",
    text_color: "#ffffff",
    font_family: "Inter",
    template: "modern"
  });

  const handleSave = useCallback(async () => {
    if (audiogram) {
      try {
        await Audiogram.update(audiogram.id, {
          ...audiogram,
          style_config: styleConfig
        });
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
      } catch (error) {
        console.error("Error saving audiogram:", error);
      }
    }
  }, [audiogram, styleConfig]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && audiogram) {
      const saveTimeout = setTimeout(async () => {
        try {
          await Audiogram.update(audiogram.id, {
            ...audiogram,
            style_config: styleConfig
          });
          setHasUnsavedChanges(false);
          setLastSaved(new Date());
        } catch (error) {
          console.error("Auto-save failed:", error);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(saveTimeout);
    }
  }, [hasUnsavedChanges, audiogram, styleConfig]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case ' ':
            e.preventDefault();
            setIsPlaying(!isPlaying);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, handleSave]);

  useEffect(() => {
    const loadAudiogram = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      
      if (id) {
        try {
          const audiogramData = await Audiogram.list();
          const targetAudiogram = audiogramData.find(a => a.id === id);
          if (targetAudiogram) {
            setAudiogram(targetAudiogram);
            setStyleConfig(targetAudiogram.style_config || {
              background_color: "#1e1b4b",
              waveform_color: "#8b5cf6",
              text_color: "#ffffff",
              font_family: "Inter",
              template: "modern"
            });
          }
        } catch (error) {
          console.error("Error loading audiogram:", error);
        }
      }
      setIsLoading(false);
    };

    loadAudiogram();
  }, []);

  const handleStyleChange = (newStyle) => {
    setStyleConfig({ ...styleConfig, ...newStyle });
    setHasUnsavedChanges(true);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleShare = () => {
    if (navigator.share && audiogram) {
      navigator.share({
        title: audiogram.title,
        text: `Check out this audiogram: ${audiogram.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse mb-4 mx-auto"></div>
          <p className="text-slate-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!audiogram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 backdrop-blur border-slate-800 p-8 text-center max-w-md">
          <CardContent>
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Audiogram Not Found</h2>
            <p className="text-slate-400 mb-6">The audiogram you're looking for doesn't exist or has been deleted.</p>
            <Button 
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Enhanced Header with Auto-save Status */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(createPageUrl("Dashboard"))}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">{audiogram.title}</h1>
                  {hasUnsavedChanges && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                      Unsaved
                    </Badge>
                  )}
                  {lastSaved && !hasUnsavedChanges && (
                    <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                      Saved
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>Customize your audiogram</span>
                  <span>•</span>
                  <span>Press Ctrl+S to save</span>
                  <span>•</span>
                  <span>Space to play/pause</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={handleShare}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all"
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline"
                onClick={handleExport}
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 transition-all"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            <WaveformEditor 
              audiogram={audiogram}
              styleConfig={styleConfig}
              isPlaying={isPlaying}
              currentTime={currentTime}
              onPlay={() => setIsPlaying(!isPlaying)}
              onTimeChange={setCurrentTime}
            />
            
            {/* Timeline Controls */}
            <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1">
                    <Slider
                      value={[currentTime]}
                      onValueChange={([value]) => setCurrentTime(value)}
                      max={audiogram.duration || 60}
                      step={0.1}
                      className="flex-1"
                    />
                  </div>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {Math.floor(currentTime)}s / {audiogram.duration}s
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Style Controls */}
          <div className="space-y-6">
            <StyleControls 
              styleConfig={styleConfig}
              onChange={handleStyleChange}
            />
            
            <AudioTrimmer
              audiogram={audiogram}
              onTrimChange={async (trimData) => {
                await Audiogram.update(audiogram.id, {
                  ...audiogram,
                  ...trimData
                });
                setAudiogram({ ...audiogram, ...trimData });
              }}
            />
            
            <CaptionsEditor
              audiogram={audiogram}
              onCaptionsChange={async (captions) => {
                await Audiogram.update(audiogram.id, {
                  ...audiogram,
                  captions
                });
                setAudiogram({ ...audiogram, captions });
              }}
            />
          </div>
        </div>
      </div>

      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        audiogram={audiogram}
        styleConfig={styleConfig}
      />
    </div>
  );
}