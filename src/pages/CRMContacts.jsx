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
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Search,
  Mail,
  Phone,
  Briefcase,
  Star
} from "lucide-react";

export default function CRMContactsPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    is_primary: false,
    linkedin_url: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [contactsData, customersData] = await Promise.all([
      base44.entities.Contact.list("-created_date"),
      base44.entities.Customer.list()
    ]);
    setContacts(contactsData);
    setCustomers(customersData);
  };

  const handleSave = async () => {
    if (editingContact) {
      await base44.entities.Contact.update(editingContact.id, formData);
    } else {
      await base44.entities.Contact.create(formData);
    }
    
    setIsCreating(false);
    setEditingContact(null);
    setFormData({
      customer_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      position: "",
      is_primary: false,
      linkedin_url: "",
      notes: ""
    });
    loadData();
  };

  const handleDelete = async (contact) => {
    if (window.confirm(`Delete contact "${contact.first_name} ${contact.last_name}"?`)) {
      await base44.entities.Contact.delete(contact.id);
      loadData();
    }
  };

  const filteredContacts = contacts.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.company_name || "Unknown";
  };

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
                  <Users className="w-6 h-6 text-purple-400" />
                  CRM Contacts
                </h1>
                <p className="text-slate-400">Manage contact persons</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>

          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {(isCreating || editingContact) && (
          <Card className="bg-slate-900/50 backdrop-blur border-slate-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">
                {editingContact ? "Edit Contact" : "New Contact"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Customer *</Label>
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
                  <Label className="text-slate-300">Position</Label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">First Name *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Last Name *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Email *</Label>
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
                  <Label className="text-slate-300">LinkedIn URL</Label>
                  <Input
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_primary}
                      onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Primary Contact
                  </Label>
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
                  disabled={!formData.first_name || !formData.last_name || !formData.email}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  Save Contact
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingContact(null);
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
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="bg-slate-900/50 backdrop-blur border-slate-800 hover:border-slate-700 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg flex items-center gap-2">
                      {contact.first_name} {contact.last_name}
                      {contact.is_primary && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      )}
                    </h3>
                    {contact.position && (
                      <p className="text-sm text-slate-400 mt-1">{contact.position}</p>
                    )}
                  </div>
                </div>

                {contact.customer_id && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-3">
                    {getCustomerName(contact.customer_id)}
                  </Badge>
                )}

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {contact.email}
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-4 h-4 text-slate-500" />
                      {contact.phone}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingContact(contact);
                      setFormData(contact);
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
                    onClick={() => handleDelete(contact)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No contacts yet</h3>
            <p className="text-slate-400 mb-6">Add your first contact to get started</p>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}