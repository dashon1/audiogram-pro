import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Flag, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Search,
  Code,
  Users,
  Activity,
  Percent
} from "lucide-react";

export default function FeatureFlagsPage() {
  const navigate = useNavigate();
  const [flags, setFlags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingFlag, setEditingFlag] = useState(null);
  const [formData, setFormData] = useState({
    flag_key: "",
    name: "",
    description: "",
    enabled: false,
    environment: "development",
    rollout_percentage: 0,
    target_users: [],
    tags: []
  });

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    const data = await base44.entities.FeatureFlag.list("-created_date");
    setFlags(data);
  };

  const handleSave = async () => {
    if (editingFlag) {
      await base44.entities.FeatureFlag.update(editingFlag.id, formData);
    } else {
      await base44.entities.FeatureFlag.create(formData);
    }
    
    setIsCreating(false);
    setEditingFlag(null);
    setFormData({
      flag_key: "",
      name: "",
      description: "",
      enabled: false,
      environment: "development",
      rollout_percentage: 0,
      target_users: [],
      tags: []
    });
    loadFlags();
  };

  const handleToggle = async (flag) => {
    await base44.entities.FeatureFlag.update(flag.id, {
      ...flag,
      enabled: !flag.enabled
    });
    loadFlags();
  };

  const handleDelete = async (flag) => {
    if (window.confirm(`Delete feature flag "${flag.name}"?`)) {
      await base44.entities.FeatureFlag.delete(flag.id);
      loadFlags();
    }
  };

  const filteredFlags = flags.filter(f =>
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.flag_key?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const envColors = {
    development: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    staging: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    production: "bg-green-500/20 text-green-300 border-green-500/30"
  };

  const activeFlags = flags.filter(f => f.enabled).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(createPageUrl("AdminDashboard"))}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Flag className="w-6 h-6 text-orange-400" />
                  Feature Flags
                </h1>
                <p className="text-slate-400">Control feature rollouts • {activeFlags} active</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Flag
            </Button>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search feature flags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {(isCreating || editingFlag) && (
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                {editingFlag ? "Edit Feature Flag" : "New Feature Flag"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Flag Key *</Label>
                  <Input
                    value={formData.flag_key}
                    onChange={(e) => setFormData({ ...formData, flag_key: e.target.value })}
                    placeholder="e.g., new_dashboard"
                    className="bg-slate-800/50 border-slate-700 text-white font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Display Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Environment</Label>
                  <Select
                    value={formData.environment}
                    onValueChange={(value) => setFormData({ ...formData, environment: value })}
                  >
                    <SelectTrigger className="border-slate-700 text-white bg-slate-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="staging">Staging</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    Enabled
                    <Switch
                      checked={formData.enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                    />
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300 flex items-center justify-between">
                  <span>Rollout Percentage</span>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {formData.rollout_percentage}%
                  </Badge>
                </Label>
                <Slider
                  value={[formData.rollout_percentage]}
                  onValueChange={([value]) => setFormData({ ...formData, rollout_percentage: value })}
                  max={100}
                  step={5}
                  className="flex-1"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={!formData.flag_key || !formData.name}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Save Flag
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingFlag(null);
                  }}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlags.map((flag) => (
            <Card key={flag.id} className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white">{flag.name}</h3>
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => handleToggle(flag)}
                      />
                    </div>
                    <code className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                      {flag.flag_key}
                    </code>
                  </div>
                </div>

                <Badge className={envColors[flag.environment]}>
                  {flag.environment}
                </Badge>

                {flag.description && (
                  <p className="text-sm text-slate-400 mt-3 mb-4">{flag.description}</p>
                )}

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        Rollout
                      </span>
                      <span className="text-white">{flag.rollout_percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                        style={{ width: `${flag.rollout_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingFlag(flag);
                      setFormData(flag);
                      setIsCreating(true);
                    }}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(flag)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFlags.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <Flag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No feature flags yet</h3>
            <p className="text-slate-400 mb-6">Create your first feature flag to control rollouts</p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Flag
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}