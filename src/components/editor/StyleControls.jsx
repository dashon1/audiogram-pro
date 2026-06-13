import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Palette, Type, Layout, Sparkles } from "lucide-react";

const colorPresets = [
  { name: "Purple Gradient", bg: "#1e1b4b", wave: "#8b5cf6", text: "#ffffff" },
  { name: "Blue Ocean", bg: "#0f172a", wave: "#06b6d4", text: "#ffffff" },
  { name: "Orange Sunset", bg: "#7c2d12", wave: "#f97316", text: "#ffffff" },
  { name: "Green Forest", bg: "#14532d", wave: "#22c55e", text: "#ffffff" },
  { name: "Pink Dream", bg: "#831843", wave: "#ec4899", text: "#ffffff" },
];

const templates = [
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
  { value: "podcast", label: "Podcast Style" },
];

const fonts = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
];

export default function StyleControls({ styleConfig, onChange }) {
  const handleColorPreset = (preset) => {
    onChange({
      background_color: preset.bg,
      waveform_color: preset.wave,
      text_color: preset.text
    });
  };

  return (
    <div className="space-y-6">
      {/* Color Presets */}
      <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            Color Themes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {colorPresets.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => handleColorPreset(preset)}
                className="justify-start border-slate-700 text-slate-300 hover:bg-slate-800 h-12"
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-slate-600"
                      style={{ backgroundColor: preset.bg }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-slate-600"
                      style={{ backgroundColor: preset.wave }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-slate-600"
                      style={{ backgroundColor: preset.text }}
                    />
                  </div>
                  <span>{preset.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Custom Colors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Background Color</Label>
            <Input
              type="color"
              value={styleConfig.background_color}
              onChange={(e) => onChange({ background_color: e.target.value })}
              className="h-10 border-slate-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Waveform Color</Label>
            <Input
              type="color"
              value={styleConfig.waveform_color}
              onChange={(e) => onChange({ waveform_color: e.target.value })}
              className="h-10 border-slate-700"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-slate-300">Text Color</Label>
            <Input
              type="color"
              value={styleConfig.text_color}
              onChange={(e) => onChange({ text_color: e.target.value })}
              className="h-10 border-slate-700"
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-green-400" />
            Typography
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Font Family</Label>
            <Select
              value={styleConfig.font_family}
              onValueChange={(value) => onChange({ font_family: value })}
            >
              <SelectTrigger className="border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-orange-400" />
            Templates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Template Style</Label>
            <Select
              value={styleConfig.template}
              onValueChange={(value) => onChange({ template: value })}
            >
              <SelectTrigger className="border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.value} value={template.value}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}