"use client";

import { useState, useEffect } from "react";
import { Save, Upload, X } from "lucide-react";
import { apiClient } from "@/lib/api/client";

export interface FoodFormData {
  id?: string;
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      if (food.image) {
        setImagePreview(food.image);
      }
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update form with uploaded URL
      setFormData((prev) => ({
        ...prev,
        image: response.data.url,
      }));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setUploadError(err.response?.data?.error || 'Failed to upload image');
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: '' }));
    setUploadError(null);
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
            Food Image *
          </label>
          
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-64 h-48 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex items-center justify-center w-full h-32 px-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Uploading...' : 'Click to upload food image'}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}
            </div>
          )}
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
