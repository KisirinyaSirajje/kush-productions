"use client";

import { useState } from "react";
import { foods as initialFoods, type Food } from "@/data/mockData";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import Modal from "@/components/admin/Modal";
import FoodForm, { FoodFormData } from "@/components/admin/FoodForm";

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>(initialFoods);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodFormData | undefined>();

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFood = () => {
    setEditingFood(undefined);
    setIsModalOpen(true);
  };

  const handleEditFood = (food: Food) => {
    setEditingFood({
      id: food.id,
      name: food.name,
      category: food.category,
      price: food.price,
      location: food.location || "Kampala, Uganda",
      description: food.description,
      image: food.image,
      ingredients: food.ingredients || [],
    });
    setIsModalOpen(true);
  };

  const handleDeleteFood = (id: number) => {
    if (confirm("Are you sure you want to delete this food item?")) {
      setFoods(foods.filter((f) => f.id !== id));
    }
  };

  const handleSubmitFood = (data: FoodFormData) => {
    if (editingFood && editingFood.id) {
      // Update existing food
      setFoods(foods.map((f) => (f.id === editingFood.id ? { 
        ...f, 
        ...data,
        location: data.location || "Kampala, Uganda",
        ingredients: data.ingredients || []
      } : f)));
    } else {
      // Add new food
      const newFood: Food = {
        ...data,
        id: Math.max(...foods.map((f) => f.id), 0) + 1,
        location: data.location || "Kampala, Uganda",
        ingredients: data.ingredients || []
      };
      setFoods([newFood, ...foods]);
    }
    setIsModalOpen(false);
    setEditingFood(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Foods Management</h1>
          <p className="text-muted-foreground">Manage Ugandan cuisine offerings</p>
        </div>
        <button 
          onClick={handleAddFood}
          className="flex items-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Food
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-4 rounded-xl border border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Total Foods</p>
          <p className="text-2xl font-bold text-foreground">{foods.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Categories</p>
          <p className="text-2xl font-bold text-accent">4</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Avg Price</p>
          <p className="text-2xl font-bold text-foreground">UGX 7,000</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-green-500">1,234</p>
        </div>
      </div>

      {/* Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => (
          <div key={food.id} className="glass-card rounded-xl border border-border/50 overflow-hidden card-hover">
            <div className="relative aspect-[4/3]">
              <img
                src={food.image}
                alt={food.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 bg-accent/90 text-accent-foreground text-xs font-semibold rounded-full">
                {food.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">{food.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{food.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-accent">{food.price}</span>
                <span className="text-sm text-muted-foreground">{food.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/foods/${food.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
                <button 
                  onClick={() => handleEditFood(food)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteFood(food.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFood(undefined);
        }}
        title={editingFood ? "Edit Food" : "Add New Food"}
      >
        <FoodForm
          food={editingFood}
          onSubmit={handleSubmitFood}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingFood(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
