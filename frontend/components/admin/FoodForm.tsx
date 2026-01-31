"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

export interface FoodFormData {
  id?: number;
  name: string;
  category: string;
  price: string;
  location: string;
  description: string;
  image: string;
  ingredients?: string[];
}

interface FoodFormProps {
  food?: FoodFormData;
  onSubmit: (data: FoodFormData) => void;
  onCancel: () => void;
}

export default function FoodForm({ food, onSubmit, onCancel }: FoodFormProps) {
  const [formData, setFormData] = useState<FoodFormData>({
    name: "",
    category: "Street Food",
    price: "UGX 5,000",
    location: "Kampala, Uganda",
    description: "",
    image: "",
    ingredients: [],
  });

  const [ingredientInput, setIngredientInput] = useState("");

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || "",
        category: food.category || "Street Food",
        price: food.price || "UGX 5,000",
        location: food.location || "Kampala, Uganda",
        description: food.description || "",
        image: food.image || "",
        ingredients: food.ingredients || [],
      });
    }
  }, [food]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Food Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Enter food name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="Street Food">Street Food</option>
            <option value="Main Course">Main Course</option>
            <option value="Traditional">Traditional</option>
            <option value="Snack">Snack</option>
            <option value="Beverage">Beverage</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Price *
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="UGX 5,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Kampala, Uganda"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Image URL *
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="https://example.com/food-image.jpg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Enter food description..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Ingredients
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIngredient())}
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Add ingredient..."
          />
          <button
            type="button"
            onClick={addIngredient}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
          >
            Add
          </button>
        </div>
        {formData.ingredients && formData.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="hover:text-accent-foreground"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
        >
          <Save className="w-5 h-5" />
          {food ? "Update Food" : "Add Food"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
