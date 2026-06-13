import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Sparkles, 
  Crown, 
  CheckCircle,
  Filter,
  Zap
} from "lucide-react";

const TEMPLATE_CATEGORIES = [
  { id: "all", name: "All Templates", icon: Sparkles },
  { id: "professional", name: "Professional", icon: Crown },
  { id: "creative", name: "Creative", icon: Zap },
  { id: "minimal", name: "Minimal", icon: CheckCircle },
  { id: "bold", name: "Bold", icon: Sparkles },
  { id: "podcast", name: "Podcast", icon: Crown },
  { id: "social", name: "Social Media", icon: Zap }
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      let data = await base44.entities.Template.list();
      
      // If no templates exist, create some default ones
      if (data.length === 0) {
        const defaultTemplates = [
          { name: "Modern Purple", category: "professional", style_config: { background_color: "#1e1b4b", waveform_color: "#8b5cf6", text_color: "#ffffff", font_family: "Inter", template: "modern" }, is_premium: false },
          { name: "Ocean Blue", category: "professional", style_config: { background_color: "#0f172a", waveform_color: "#06b6d4", text_color: "#ffffff", font_family: "Inter", template: "modern" }, is_premium: false },
          { name: "Sunset Orange", category: "creative", style_config: { background_color: "#7c2d12", waveform_color: "#f97316", text_color: "#ffffff", font_family: "Poppins", template: "creative" }, is_premium: false },
          { name: "Forest Green", category: "creative", style_config: { background_color: "#14532d", waveform_color: "#22c55e", text_color: "#ffffff", font_family: "Poppins", template: "creative" }, is_premium: true },
          { name: "Pink Dream", category: "bold", style_config: { background_color: "#831843", waveform_color: "#ec4899", text_color: "#ffffff", font_family: "Montserrat", template: "bold" }, is_premium: true },
          { name: "Minimal Black", category: "minimal", style_config: { background_color: "#000000", waveform_color: "#ffffff", text_color: "#ffffff", font_family: "Inter", template: "minimal" }, is_premium: false }
        ];
        
        await Promise.all(defaultTemplates.map(t => base44.entities.Template.create(t)));
        data = await base44.entities.Template.list();
      }
      
      setTemplates(data);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
    setIsLoading(false);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApplyTemplate = async (template) => {
    // Create a new audiogram with this template
    const audiogram = await base44.entities.Audiogram.create({
      title: `New ${template.name} Audiogram`,
      style_config: template.style_config,
      status: "ready",
      duration: 30,
      waveform_data: Array.from({ length: 100 }, () => Math.random() * 100)
    });

    // Update template usage
    await base44.entities.Template.update(template.id, {
      ...template,
      usage_count: (template.usage_count || 0) + 1
    });

    navigate(createPageUrl("Editor") + "?id=" + audiogram.id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Template Library
              </h1>
              <p className="text-slate-400">Choose a professional template to get started</p>
            </div>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {filteredTemplates.length} Templates
            </Badge>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TEMPLATE_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                  : "border-slate-700 text-slate-300 hover:bg-slate-800"
                }
              >
                <category.icon className="w-4 h-4 mr-2" style={{ opacity: 1 }} />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="bg-slate-900/50 backdrop-blur border-slate-800">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-slate-700 rounded"></div>
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  {/* Template Preview */}
                  <div 
                    className="h-40 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: template.style_config?.background_color }}
                  >
                    {/* Waveform preview */}
                    <div className="flex items-end justify-center gap-1 h-24">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="rounded-sm transition-all duration-300"
                          style={{
                            backgroundColor: template.style_config?.waveform_color,
                            height: `${Math.random() * 60 + 20}%`,
                            width: '4px'
                          }}
                        />
                      ))}
                    </div>
                    
                    {template.is_premium && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Template Info */}
                  <h3 className="font-semibold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {template.category}
                    </Badge>
                    {template.usage_count > 0 && (
                      <span className="text-xs text-slate-400">
                        Used {template.usage_count} times
                      </span>
                    )}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleApplyTemplate(template)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}