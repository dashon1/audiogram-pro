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
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Search,
  DollarSign,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { format } from "date-fns";

export default function CRMCustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    country: "",
    status: "lead",
    notes: ""
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    const data = await base44.entities.Customer.list("-created_date");
    setCustomers(data);
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (editingCustomer) {
      await base44.entities.Customer.update(editingCustomer.id, formData);
    } else {
      await base44.entities.Customer.create(formData);
    }
    
    setIsCreating(false);
    setEditingCustomer(null);
    setFormData({
      company_name: "",
      industry: "",
      website: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      country: "",
      status: "lead",
      notes: ""
    });
    loadCustomers();
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Delete customer "${customer.company_name}"?`)) {
      await base44.entities.Customer.delete(customer.id);
      loadCustomers();
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    lead: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    qualified: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    customer: "bg-green-500/20 text-green-300 border-green-500/30",
    churned: "bg-red-500/20 text-red-300 border-red-500/30"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
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
                  <Building2 className="w-6 h-6 text-blue-400" />
                  CRM Customers
                </h1>
                <p className="text-slate-400">Manage customer accounts</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create/Edit Form */}
        {(isCreating || editingCustomer) && (
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                {editingCustomer ? "Edit Customer" : "New Customer"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Company Name *</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Industry</Label>
                  <Input
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="border-slate-700 text-white bg-slate-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="churned">Churned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Country</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  disabled={!formData.company_name}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  Save Customer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCustomer(null);
                  }}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Customers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-white text-lg">{customer.company_name}</h3>
                  <Badge className={statusColors[customer.status]}>
                    {customer.status}
                  </Badge>
                </div>

                {customer.industry && (
                  <p className="text-sm text-slate-400 mb-3">{customer.industry}</p>
                )}

                <div className="space-y-2 text-sm mb-4">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-slate-500" />
                      {customer.email}
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {customer.phone}
                    </div>
                  )}
                  {customer.website && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Globe className="w-4 h-4 text-slate-500" />
                      {customer.website}
                    </div>
                  )}
                </div>

                {customer.revenue > 0 && (
                  <div className="flex items-center gap-2 text-sm text-green-400 mb-4">
                    <DollarSign className="w-4 h-4" />
                    ${customer.revenue.toLocaleString()} revenue
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingCustomer(customer);
                      setFormData(customer);
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
                    onClick={() => handleDelete(customer)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No customers yet</h3>
            <p className="text-slate-400 mb-6">Add your first customer to get started</p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}