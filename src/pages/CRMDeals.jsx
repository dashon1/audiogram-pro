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
import { 
  DollarSign, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Search,
  TrendingUp,
  Calendar
} from "lucide-react";

export default function CRMDealsPage() {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: "",
    title: "",
    value: 0,
    stage: "prospecting",
    probability: 10,
    close_date: "",
    owner: "",
    source: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [dealsData, customersData] = await Promise.all([
      base44.entities.Deal.list("-created_date"),
      base44.entities.Customer.list()
    ]);
    setDeals(dealsData);
    setCustomers(customersData);
  };

  const handleSave = async () => {
    if (editingDeal) {
      await base44.entities.Deal.update(editingDeal.id, formData);
    } else {
      await base44.entities.Deal.create(formData);
    }
    
    setIsCreating(false);
    setEditingDeal(null);
    setFormData({
      customer_id: "",
      title: "",
      value: 0,
      stage: "prospecting",
      probability: 10,
      close_date: "",
      owner: "",
      source: "",
      notes: ""
    });
    loadData();
  };

  const handleDelete = async (deal) => {
    if (window.confirm(`Delete deal "${deal.title}"?`)) {
      await base44.entities.Deal.delete(deal.id);
      loadData();
    }
  };

  const filteredDeals = deals.filter(d =>
    d.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.company_name || "Unknown";
  };

  const stageColors = {
    prospecting: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    qualification: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    proposal: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    negotiation: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    closed_won: "bg-green-500/20 text-green-300 border-green-500/30",
    closed_lost: "bg-red-500/20 text-red-300 border-red-500/30"
  };

  const totalValue = filteredDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const wonDeals = filteredDeals.filter(d => d.stage === 'closed_won').length;

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
                  <DollarSign className="w-6 h-6 text-green-400" />
                  CRM Deals
                </h1>
                <p className="text-slate-400">Track sales pipeline • ${(totalValue / 1000).toFixed(1)}k total • {wonDeals} won</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {(isCreating || editingDeal) && (
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                {editingDeal ? "Edit Deal" : "New Deal"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Deal Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Customer</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                  >
                    <SelectTrigger className="border-slate-700 text-white bg-slate-800/50">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Deal Value *</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Stage</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => setFormData({ ...formData, stage: value })}
                  >
                    <SelectTrigger className="border-slate-700 text-white bg-slate-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prospecting">Prospecting</SelectItem>
                      <SelectItem value="qualification">Qualification</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed_won">Closed Won</SelectItem>
                      <SelectItem value="closed_lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Probability (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Expected Close Date</Label>
                  <Input
                    type="date"
                    value={formData.close_date}
                    onChange={(e) => setFormData({ ...formData, close_date: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Owner Email</Label>
                  <Input
                    type="email"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Source</Label>
                  <Input
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={!formData.title || formData.value <= 0}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  Save Deal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingDeal(null);
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
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{deal.title}</h3>
                    <p className="text-2xl font-bold text-green-400 mt-2">
                      ${(deal.value || 0).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={stageColors[deal.stage]}>
                    {deal.stage.replace('_', ' ')}
                  </Badge>
                </div>

                {deal.customer_id && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-3">
                    {getCustomerName(deal.customer_id)}
                  </Badge>
                )}

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Probability:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-white">{deal.probability}%</span>
                    </div>
                  </div>
                  {deal.close_date && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Close: {new Date(deal.close_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingDeal(deal);
                      setFormData(deal);
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
                    onClick={() => handleDelete(deal)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDeals.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No deals yet</h3>
            <p className="text-slate-400 mb-6">Add your first deal to start tracking your pipeline</p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}