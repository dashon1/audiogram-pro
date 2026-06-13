import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Subtitles, Sparkles, Plus, Trash2 } from "lucide-react";

export default function CaptionsEditor({ audiogram, onCaptionsChange }) {
  const [captions, setCaptions] = useState(audiogram?.captions || []);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI caption generation
    setTimeout(() => {
      const mockCaptions = [
        { text: "Welcome to our podcast!", start_time: 0, end_time: 2 },
        { text: "Today we're discussing AI", start_time: 2, end_time: 4 },
        { text: "and the future of technology", start_time: 4, end_time: 6.5 },
        { text: "Let's dive right in...", start_time: 6.5, end_time: 9 }
      ];
      
      setCaptions(mockCaptions);
      onCaptionsChange(mockCaptions);
      setIsGenerating(false);
    }, 2000);
  };

  const handleAdd = () => {
    const newCaption = {
      text: "New caption",
      start_time: captions.length > 0 ? captions[captions.length - 1].end_time : 0,
      end_time: (captions.length > 0 ? captions[captions.length - 1].end_time : 0) + 2
    };
    const updated = [...captions, newCaption];
    setCaptions(updated);
    onCaptionsChange(updated);
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...captions];
    updated[index] = { ...updated[index], [field]: value };
    setCaptions(updated);
    onCaptionsChange(updated);
  };

  const handleDelete = (index) => {
    const updated = captions.filter((_, i) => i !== index);
    setCaptions(updated);
    onCaptionsChange(updated);
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Subtitles className="w-5 h-5 text-purple-400" />
            Captions
          </CardTitle>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Generate
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {captions.length === 0 ? (
          <div className="text-center py-8">
            <Subtitles className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No captions yet</p>
            <Button
              size="sm"
              onClick={handleGenerate}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {captions.map((caption, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {caption.start_time.toFixed(1)}s - {caption.end_time.toFixed(1)}s
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={caption.text}
                    onChange={(e) => handleUpdate(index, 'text', e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white resize-none"
                    rows={2}
                  />
                </div>
              ))}
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleAdd}
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Caption
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}