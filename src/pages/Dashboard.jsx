import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Play, 
  Download, 
  Share, 
  TrendingUp, 
  Users, 
  Eye,
  Plus,
  Sparkles,
  Clock,
  Headphones
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import StatsOverview from "../components/dashboard/StatsOverview";
import RecentAudiograms from "../components/dashboard/RecentAudiograms";
import QuickActions from "../components/dashboard/QuickActions";
import TrendingClips from "../components/dashboard/TrendingClips";

export default function Dashboard() {
  const [audiograms, setAudiograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    loadAudiograms();
  }, []);

  const loadAudiograms = async () => {
    setIsLoading(true);
    const data = await base44.entities.Audiogram.list("-created_date", 50);
    setAudiograms(data);
    setIsLoading(false);
  };

  const totalViews = audiograms.reduce((sum, a) => sum + (a.view_count || 0), 0);
  const totalDownloads = audiograms.reduce((sum, a) => sum + (a.download_count || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/20 via-slate-900/40 to-pink-900/20 border-b border-slate-800">
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 30%, rgba(147, 51, 234, 0.1), transparent 30%), radial-gradient(circle at 75% 70%, rgba(219, 39, 119, 0.1), transparent 30%)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" style={{ opacity: 1 }} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Create Viral Clips
                </h1>
              </div>
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                Transform your podcast moments into stunning audiograms that drive engagement across all social platforms.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("Upload")}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Plus className="w-5 h-5 mr-2" style={{ opacity: 1 }} />
                    Create New Audiogram
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDemoModal(true)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 px-6 py-3 rounded-xl"
                >
                  <Play className="w-5 h-5 mr-2" style={{ opacity: 1 }} />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl absolute -inset-4"></div>
              <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
                <div className="text-center">
                  <Headphones className="w-16 h-16 text-purple-400 mx-auto mb-4" style={{ opacity: 1 }} />
                  <div className="text-2xl font-bold text-white mb-2">{audiograms.length}</div>
                  <div className="text-slate-400">Audiograms Created</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsOverview 
            title="Total Audiograms" 
            value={audiograms.length}
            icon={Headphones}
            trend="+12% this month"
            color="purple"
          />
          <StatsOverview 
            title="Total Views" 
            value={totalViews.toLocaleString()}
            icon={Eye}
            trend="+24% this week"
            color="blue"
          />
          <StatsOverview 
            title="Downloads" 
            value={totalDownloads.toLocaleString()}
            icon={Download}
            trend="+8% this week"
            color="pink"
          />
          <StatsOverview 
            title="Engagement Rate" 
            value="8.4%"
            icon={TrendingUp}
            trend="+2.1% increase"
            color="cyan"
          />
        </div>

        {/* Bento Grid Layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-4">
            <QuickActions />
          </div>

          {/* Recent Audiograms */}
          <div className="lg:col-span-8">
            <RecentAudiograms 
              audiograms={audiograms}
              isLoading={isLoading}
              onRefresh={loadAudiograms}
            />
          </div>

          {/* Trending Clips */}
          <div className="lg:col-span-6">
            <TrendingClips audiograms={audiograms} />
          </div>

          {/* Performance Insights */}
          <div className="lg:col-span-6">
            <Card className="bg-slate-900/50 backdrop-blur border-slate-800 h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" style={{ opacity: 1 }} />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Best Time to Post</span>
                    <Clock className="w-4 h-4 text-slate-400" style={{ opacity: 1 }} />
                  </div>
                  <div className="text-2xl font-bold text-white">2-4 PM</div>
                  <div className="text-sm text-slate-400">Weekdays get 40% more engagement</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Top Performing Platform</span>
                    <Users className="w-4 h-4 text-slate-400" style={{ opacity: 1 }} />
                  </div>
                  <div className="text-2xl font-bold text-white">Instagram</div>
                  <div className="text-sm text-slate-400">65% higher view rates</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="bg-slate-900 border-slate-800 max-w-4xl w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Play className="w-6 h-6 text-purple-400" style={{ opacity: 1 }} />
                  AudiogramPro Demo
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDemoModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-purple-400 mx-auto mb-4" style={{ opacity: 1 }} />
                  <p className="text-slate-300 text-lg mb-2">Welcome to AudiogramPro!</p>
                  <p className="text-slate-400">Transform your podcast into viral clips in 3 easy steps:</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-purple-400 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Upload Audio</h3>
                  <p className="text-sm text-slate-400">Drop your podcast file and let AI analyze the content</p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-blue-400 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Customize Design</h3>
                  <p className="text-sm text-slate-400">Choose templates, colors, and add your brand</p>
                </div>
                
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-green-400 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-white mb-2">Export & Share</h3>
                  <p className="text-sm text-slate-400">Download for all social platforms instantly</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to={createPageUrl("Upload")} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                    <Plus className="w-4 h-4 mr-2" style={{ opacity: 1 }} />
                    Get Started Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setShowDemoModal(false)}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}