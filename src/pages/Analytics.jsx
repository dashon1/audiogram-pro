import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Eye, 
  Download, 
  Share2, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const [audiograms, setAudiograms] = useState([]);
  const [timeRange, setTimeRange] = useState("week"); // week, month, year
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setIsLoading(true);
    const data = await base44.entities.Audiogram.list("-created_date");
    setAudiograms(data);
    setIsLoading(false);
  };

  // Calculate metrics
  const totalViews = audiograms.reduce((sum, a) => sum + (a.view_count || 0), 0);
  const totalDownloads = audiograms.reduce((sum, a) => sum + (a.download_count || 0), 0);
  const avgEngagement = audiograms.length > 0 
    ? ((totalViews + totalDownloads) / audiograms.length / 10).toFixed(1)
    : 0;

  // Platform distribution
  const platformData = audiograms.reduce((acc, a) => {
    const platform = a.social_platform || 'unspecified';
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(platformData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Weekly performance (mock data based on created dates)
  const weekData = [
    { day: 'Mon', views: 245, downloads: 45 },
    { day: 'Tue', views: 312, downloads: 58 },
    { day: 'Wed', views: 289, downloads: 52 },
    { day: 'Thu', views: 401, downloads: 71 },
    { day: 'Fri', views: 378, downloads: 65 },
    { day: 'Sat', views: 298, downloads: 48 },
    { day: 'Sun', views: 267, downloads: 41 }
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-400" />
                Analytics Dashboard
              </h1>
              <p className="text-slate-400">Track your audiogram performance</p>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                    : "border-slate-700 text-slate-300"
                  }
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-white">{totalViews.toLocaleString()}</p>
                  <p className="text-sm text-green-400 mt-1">+24% vs last {timeRange}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Downloads</p>
                  <p className="text-3xl font-bold text-white">{totalDownloads}</p>
                  <p className="text-sm text-green-400 mt-1">+18% vs last {timeRange}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Avg Engagement</p>
                  <p className="text-3xl font-bold text-white">{avgEngagement}%</p>
                  <p className="text-sm text-green-400 mt-1">+2.1% increase</p>
                </div>
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Clips</p>
                  <p className="text-3xl font-bold text-white">{audiograms.length}</p>
                  <p className="text-sm text-green-400 mt-1">+12% this month</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Weekly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="views" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="downloads" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-pink-400" />
                Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px'
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Clips */}
        <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Top Performing Clips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {audiograms
                .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                .slice(0, 5)
                .map((audiogram, index) => (
                  <div key={audiogram.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{audiogram.title}</p>
                        <p className="text-sm text-slate-400">
                          {audiogram.social_platform && (
                            <Badge variant="outline" className="border-slate-600 text-slate-300 mr-2">
                              {audiogram.social_platform}
                            </Badge>
                          )}
                          {audiogram.duration}s duration
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-slate-400">Views</p>
                        <p className="font-semibold text-white">{(audiogram.view_count || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400">Downloads</p>
                        <p className="font-semibold text-white">{audiogram.download_count || 0}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}