import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Upload, 
  Palette, 
  Library, 
  Zap,
  Video,
  Mic,
  Sparkles,
  Clock,
  TrendingUp
} from "lucide-react";

const actions = [
  {
    title: "Upload Podcast",
    description: "Start with your audio file",
    icon: Upload,
    href: createPageUrl("Upload"),
    color: "from-purple-500 to-pink-500",
    shortcut: "U"
  },
  {
    title: "Quick Template",
    description: "Use pre-made styles",
    icon: Zap,
    href: createPageUrl("Editor"),
    color: "from-blue-500 to-cyan-500",
    shortcut: "T"
  },
  {
    title: "Browse Library",
    description: "View all your clips",
    icon: Library,
    href: createPageUrl("Library"),
    color: "from-green-500 to-emerald-500",
    shortcut: "L"
  }
];

const quickStats = [
  { label: "Avg. Processing Time", value: "45s", icon: Clock, color: "text-blue-400" },
  { label: "Success Rate", value: "98%", icon: TrendingUp, color: "text-green-400" },
  { label: "Popular Format", value: "Instagram", icon: Video, color: "text-purple-400" }
];

export default function QuickActions() {
  return (
    <Card className="bg-slate-900/50 backdrop-blur border-slate-800 h-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" style={{ opacity: 1 }} />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Button 
              variant="ghost" 
              className="w-full justify-start p-4 h-auto hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
                  <action.icon className="w-5 h-5 text-white" style={{ opacity: 1 }} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-white">{action.title}</div>
                  <div className="text-sm text-slate-400">{action.description}</div>
                </div>
                <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                  {action.shortcut}
                </Badge>
              </div>
            </Button>
          </Link>
        ))}

        {/* Quick Stats */}
        <div className="bg-slate-800/30 rounded-xl p-4 space-y-3 mt-6">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Quick Stats</h3>
          {quickStats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} style={{ opacity: 1 }} />
                <span className="text-slate-400">{stat.label}</span>
              </div>
              <span className="font-semibold text-white">{stat.value}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 mt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" style={{ opacity: 1 }} />
            </div>
            <div>
              <h3 className="font-medium text-white mb-1">AI Enhancement</h3>
              <p className="text-sm text-slate-300 mb-3">Let AI automatically detect the best moments and create perfect clips for social media.</p>
              <Link to={createPageUrl("Upload")}>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Sparkles className="w-4 h-4 mr-2" style={{ opacity: 1 }} />
                  Try AI Mode
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}