'use client'
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addnewEmployee, deleteEmployee, getAllEmployee, toggleUserStatus, updateEmployee } from '@/client/employeeClient'
import useCustomSession from '../hooks/useCustomSession'

const DEPARTMENTS = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Support"];

export default function UserManagement() {
  const { token, status } = useCustomSession();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", employeeId: "", department: "", designation: "", status: "Active",
  });
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await getAllEmployee(token);
    setEmployees(data?.users || []);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (status === "authenticated") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [status, loadData]);

  const filtered = employees.filter((e) => {
    const s = search.toLowerCase();
    return !s || e.name?.toLowerCase().includes(s) || e.email?.toLowerCase().includes(s) ||
      e.employeeId?.toLowerCase().includes(s) || e.department?.toLowerCase().includes(s);
  });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", employeeId: "", department: "", designation: "", status: "Active" });
    setDialogOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setForm({
      name: emp.name || "", email: emp.email || "", phone: emp.phone || "",
      employeeId: emp.employeeId || "", department: emp.department || "",
      designation: emp.designation || "", status: emp.status || "Active"
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.employeeId || !form.phone) {
      toast({ title: "Validation Error", description: "Name, Email, Phone, Password, and Employee ID are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateEmployee(editing._id, form, token)
        toast({ title: "Employee Updated", description: `${form.name} has been updated.` });
      } else {
        await addnewEmployee(form, token)
        toast({ title: "Employee Added", description: `${form.name} has been added.` });
      }
      setDialogOpen(false);
      await loadData();
    } catch (err) {
      console.log(err, 'errrs')
      toast({ title: "Error", description: err, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}? This cannot be undo.`)) return;
    try {
      await deleteEmployee(emp._id, token)
      toast({ title: "Employee Deleted", description: `${emp.name} has been removed.` });
      await loadData();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleStatus = async (emp) => {
    await toggleUserStatus(emp._id, token)
    toast({ title: "Status Updated", description: `${emp.name}.` });
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0F766E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button onClick={openNew} className="bg-[#0F766E] hover:bg-[#0d6d66]">
          <Plus className="w-4 h-4 mr-2" /> Add Employee
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">ID</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Department</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Designation</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No employees found.</td></tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{emp.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{emp.email}</td>
                    <td className="px-4 py-3 text-gray-500">{emp.employeeId}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{emp.department || "-"}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{emp.designation || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${emp.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                        }`}>{emp.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleStatus(emp)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Toggle status">
                          {emp.status === "Active" ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Edit">
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(emp)} className="p-1.5 rounded-lg hover:bg-gray-100" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-w-lg bg-white text-black">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Employee" : "Add Employee"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Employee ID *</Label>
                <Input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} className="mt-1.5" />
              </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" />
              </div>
              {!editing &&
              <div>
                <Label>Password *</Label>
                <Input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" />
              </div>
              }
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone *</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Department</Label>
                <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Designation</Label>
                <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="bg-[#0F766E] hover:bg-[#0d6d66]">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editing ? "Update" : "Add Employee"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
