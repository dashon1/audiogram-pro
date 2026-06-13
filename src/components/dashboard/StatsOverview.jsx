import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const colorSchemes = {
  purple: {
    bg: "from-purple-500/10 to-purple-600/5",
    icon: "bg-purple-500/20 text-purple-400",
    text: "text-purple-300"
  },
  blue: {
    bg: "from-blue-500/10 to-blue-600/5", 
    icon: "bg-blue-500/20 text-blue-400",
    text: "text-blue-300"
  },
  pink: {
    bg: "from-pink-500/10 to-pink-600/5",
    icon: "bg-pink-500/20 text-pink-400", 
    text: "text-pink-300"
  },
  cyan: {
    bg: "from-cyan-500/10 to-cyan-600/5",
    icon: "bg-cyan-500/20 text-cyan-400",
    text: "text-cyan-300"
  }
};

export default function StatsOverview({ title, value, icon: Icon, trend, color = 'purple' }) {
  const scheme = colorSchemes[color];
  
  return (
    <Card className={`bg-gradient-to-br ${scheme.bg} backdrop-blur border-slate-800 hover:border-slate-700 transition-all duration-200`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <div className="text-3xl font-bold text-white">{value}</div>
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className={`w-3 h-3 ${scheme.text}`} />
                <span className={scheme.text}>{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${scheme.icon}`}>
            <Icon className="w-6 h-6" style={{ opacity: 1 }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}