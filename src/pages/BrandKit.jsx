import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Palette, 
  Plus, 
  Save, 
  Trash2, 
  Star, 
  Upload,
  CheckCircle
} from "lucide-react";

export default function BrandKitPage() {
  const [brandKits, setBrandKits] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingKit, setEditingKit] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    primary_color: "#8b5cf6",
    secondary_color: "#ec4899",
    accent_color: "#06b6d4",
    font_primary: "Inter",
    font_secondary: "Poppins"
  });

  useEffect(() => {
    loadBrandKits();
  }, []);

  const loadBrandKits = async () => {
    const data = await base44.entities.BrandKit.list();
    setBrandKits(data);
  };

  const handleSave = async () => {
    if (editingKit) {
      await base44.entities.BrandKit.update(editingKit.id, formData);
    } else {
      await base44.entities.BrandKit.create(formData);
    }
    
    setIsCreating(false);
    setEditingKit(null);
    setFormData({
      name: "",
      logo_url: "",
      primary_color: "#8b5cf6",
      secondary_color: "#ec4899",
      accent_color: "#06b6d4",
      font_primary: "Inter",
      font_secondary: "Poppins"
    });
    loadBrandKits();
  };

  const handleDelete = async (kit) => {
    if (window.confirm(`Delete brand kit "${kit.name}"?`)) {
      await base44.entities.BrandKit.delete(kit.id);
      loadBrandKits();
    }
  };

  const handleSetDefault = async (kit) => {
    // Unset all defaults first
    await Promise.all(
      brandKits.map(k => 
        base44.entities.BrandKit.update(k.id, { ...k, is_default: false })
      )
    );
    
    // Set new default
    await base44.entities.BrandKit.update(kit.id, { ...kit, is_default: true });
    loadBrandKits();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-400" />
                Brand Kit Manager
              </h1>
              <p className="text-slate-400">Manage your brand assets and styles</p>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Brand Kit
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create/Edit Form */}
        {(isCreating || editingKit) && (
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                {editingKit ? "Edit Brand Kit" : "Create New Brand Kit"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Kit Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., My Podcast Brand"
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Logo URL</Label>
                  <Input
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    placeholder="https://..."
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Primary Color</Label>
                  <Input
                    type="color"
                    value={formData.primary_color}
                    onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                    className="h-10 border-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Secondary Color</Label>
                  <Input
                    type="color"
                    value={formData.secondary_color}
                    onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                    className="h-10 border-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Accent Color</Label>
                  <Input
                    type="color"
                    value={formData.accent_color}
                    onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                    className="h-10 border-slate-700"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Primary Font</Label>
                  <Select
                    value={formData.font_primary}
                    onValueChange={(value) => setFormData({ ...formData, font_primary: value })}
                  >
                    <SelectTrigger className="border-slate-700 text-white bg-slate-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Secondary Font</Label>
                  <Select
                    value={formData.font_secondary}
                    onValueChange={(value) => setFormData({ ...formData, font_secondary: value })}
                  >
                    <SelectTrigger className="border-slate-700 text-white bg-slate-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={!formData.name}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Brand Kit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingKit(null);
                  }}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brand Kits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandKits.map((kit) => (
            <Card key={kit.id} className="bg-slate-900/50 backdrop-blur border-slate-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-white">{kit.name}</h3>
                  {kit.is_default && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>

                {/* Color Palette */}
                <div className="flex gap-2 mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg border border-slate-700"
                    style={{ backgroundColor: kit.primary_color }}
                  />
                  <div 
                    className="w-12 h-12 rounded-lg border border-slate-700"
                    style={{ backgroundColor: kit.secondary_color }}
                  />
                  <div 
                    className="w-12 h-12 rounded-lg border border-slate-700"
                    style={{ backgroundColor: kit.accent_color }}
                  />
                </div>

                {/* Fonts */}
                <div className="space-y-2 mb-4 text-sm">
                  <div>
                    <span className="text-slate-400">Primary: </span>
                    <span className="text-white">{kit.font_primary}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Secondary: </span>
                    <span className="text-white">{kit.font_secondary}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {!kit.is_default && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(kit)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800 flex-1"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingKit(kit);
                      setFormData(kit);
                      setIsCreating(true);
                    }}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(kit)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {brandKits.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Brand Kits Yet</h3>
            <p className="text-slate-400 mb-6">Create your first brand kit to maintain consistent branding</p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Brand Kit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}