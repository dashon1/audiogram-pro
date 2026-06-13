import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  DollarSign, 
  Flag,
  Building2,
  TrendingUp,
  Activity,
  Zap,
  Settings,
  Database
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    contacts: 0,
    deals: 0,
    activities: 0,
    flags: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [customers, contacts, deals, activities, flags] = await Promise.all([
        base44.entities.Customer.list(),
        base44.entities.Contact.list(),
        base44.entities.Deal.list(),
        base44.entities.Activity.list(),
        base44.entities.FeatureFlag.list()
      ]);

      const totalRevenue = deals
        .filter(d => d.stage === 'closed_won')
        .reduce((sum, d) => sum + (d.value || 0), 0);

      setStats({
        customers: customers.length,
        contacts: contacts.length,
        deals: deals.length,
        activities: activities.length,
        flags: flags.length,
        revenue: totalRevenue
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
    setIsLoading(false);
  };

  const adminSections = [
    {
      title: "CRM Customers",
      description: "Manage customer accounts",
      icon: Building2,
      url: createPageUrl("CRMCustomers"),
      count: stats.customers,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "CRM Contacts",
      description: "Manage contact persons",
      icon: Users,
      url: createPageUrl("CRMContacts"),
      count: stats.contacts,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "CRM Deals",
      description: "Track sales pipeline",
      icon: DollarSign,
      url: createPageUrl("CRMDeals"),
      count: stats.deals,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Feature Flags",
      description: "Control feature rollouts",
      icon: Flag,
      url: createPageUrl("FeatureFlags"),
      count: stats.flags,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-400" />
                Admin Dashboard
              </h1>
              <p className="text-slate-400 mt-1">Nexus CRM & Feature Flags Management</p>
            </div>
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Admin Access
            </Badge>
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
                  <p className="text-sm text-slate-400 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-white">
                    ${(stats.revenue / 1000).toFixed(1)}k
                  </p>
                  <p className="text-sm text-green-400 mt-1">+23% this month</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Active Customers</p>
                  <p className="text-3xl font-bold text-white">{stats.customers}</p>
                  <p className="text-sm text-blue-400 mt-1">+12 this week</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Open Deals</p>
                  <p className="text-3xl font-bold text-white">{stats.deals}</p>
                  <p className="text-sm text-purple-400 mt-1">Pipeline value: $125k</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Feature Flags</p>
                  <p className="text-3xl font-bold text-white">{stats.flags}</p>
                  <p className="text-sm text-orange-400 mt-1">3 active rollouts</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Flag className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Admin Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminSections.map((section) => (
              <Link key={section.title} to={section.url}>
                <Card className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${section.color} bg-opacity-20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <section.icon className="w-7 h-7 text-white" />
                      </div>
                      <Badge className="bg-slate-800 text-white border-slate-700">
                        {section.count} items
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-slate-400">{section.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to={createPageUrl("CRMCustomers")}>
                <Button className="w-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30">
                  <Building2 className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </Link>
              <Link to={createPageUrl("CRMDeals")}>
                <Button className="w-full bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Create Deal
                </Button>
              </Link>
              <Link to={createPageUrl("CRMContacts")}>
                <Button className="w-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30">
                  <Users className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </Link>
              <Link to={createPageUrl("FeatureFlags")}>
                <Button className="w-full bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 border border-orange-500/30">
                  <Flag className="w-4 h-4 mr-2" />
                  New Flag
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-slate-900/50 backdrop-blur border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">CRM Database</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Database className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Feature Flag Service</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Flag className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">API Gateway</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}