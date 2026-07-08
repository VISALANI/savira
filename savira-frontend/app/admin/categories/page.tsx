"use client";
import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  isActive: boolean;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Kurtis", slug: "kurtis", description: "Everyday ethnic kurtis", productCount: 24, isActive: true },
  { id: "2", name: "Cotton Kurtis", slug: "cotton-kurtis", description: "Breathable cotton kurtis", productCount: 18, isActive: true },
  { id: "3", name: "Festive Wear", slug: "festive-wear", description: "Celebration & occasion wear", productCount: 12, isActive: true },
  { id: "4", name: "Office Wear", slug: "office-wear", description: "Professional ethnic wear", productCount: 8, isActive: true },
  { id: "5", name: "Co-ord Sets", slug: "coord-sets", description: "Matching sets & ensembles", productCount: 10, isActive: true },
  { id: "6", name: "Daily Wear", slug: "daily-wear", description: "Casual everyday wear", productCount: 15, isActive: true },
];

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Category name is required"); return; }
    if (editId) {
      setCategories((prev) => prev.map((c) => c.id === editId
        ? { ...c, name: form.name, slug: slugify(form.name), description: form.description }
        : c
      ));
      toast.success("Category updated");
      setEditId(null);
    } else {
      const newCat: Category = {
        id: Date.now().toString(),
        name: form.name,
        slug: slugify(form.name),
        description: form.description,
        productCount: 0,
        isActive: true,
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success("Category created");
      setShowForm(false);
    }
    setForm({ name: "", description: "" });
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({ name: cat.name, description: cat.description });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  const toggleActive = (id: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl text-charcoal">Categories</h1>
          <p className="font-poppins text-xs text-gray-400 mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: "", description: "" }); }}
          className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus size={16} /> Add Category
        </button>
      </div>

      {/* Add form */}
      {(showForm || editId) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-5">
          <h3 className="font-playfair text-base text-charcoal mb-4">{editId ? "Edit Category" : "New Category"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Category Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field" placeholder="e.g. Festive Wear" autoFocus />
              {form.name && (
                <p className="font-poppins text-[10px] text-gray-400 mt-1">Slug: {slugify(form.name)}</p>
              )}
            </div>
            <div>
              <label className="font-poppins text-xs text-gray-500 mb-1.5 block">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field" placeholder="Short description" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-2">
              <FiCheck size={14} /> {editId ? "Save Changes" : "Create Category"}
            </button>
            <button onClick={() => { setShowForm(false); setEditId(null); setForm({ name: "", description: "" }); }}
              className="btn-outline text-sm flex items-center gap-2">
              <FiX size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-colors ${cat.isActive ? "border-transparent" : "border-gray-100 opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-playfair text-base text-charcoal">{cat.name}</h3>
                <p className="font-poppins text-[10px] text-gray-400 mt-0.5">/{cat.slug}</p>
              </div>
              <button onClick={() => toggleActive(cat.id)}
                className={`font-poppins text-[10px] px-2.5 py-1 rounded-full transition-colors ${cat.isActive ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}>
                {cat.isActive ? "Active" : "Inactive"}
              </button>
            </div>
            <p className="font-poppins text-xs text-gray-500 mb-4">{cat.description || "No description"}</p>
            <div className="flex items-center justify-between">
              <span className="font-poppins text-xs text-gray-400">{cat.productCount} products</span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(cat)}
                  className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                  <FiEdit2 size={13} />
                </button>
                <button onClick={() => handleDelete(cat.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors">
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
