export interface Movie {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  year: number;
  category: string;
  duration: string;
  description?: string;
  videoUrl?: string;
}

export interface Food {
  id: number;
  name: string;
  image: string;
  category: string;
  description: string;
  price: string;
  location?: string;
  ingredients?: string[];
}

export const trendingMovies: Movie[] = [
  {
    id: 1,
    title: "The Last Kingdom",
    posterPath: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop",
    rating: 8.5,
    year: 2024,
    category: "Action",
    duration: "145 min",
    description: "An epic tale of kingdoms and power."
  },
  {
    id: 2,
    title: "Desert Storm",
    posterPath: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&h=750&fit=crop",
    rating: 7.8,
    year: 2023,
    category: "Drama",
    duration: "132 min",
    description: "A gripping story set in the desert."
  },
  {
    id: 3,
    title: "Night Shadows",
    posterPath: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&h=750&fit=crop",
    rating: 8.2,
    year: 2023,
    category: "Thriller",
    duration: "118 min",
    description: "Mysterious events unfold in the darkness."
  },
  {
    id: 4,
    title: "Ocean's Heart",
    posterPath: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop",
    rating: 7.5,
    year: 2024,
    category: "Adventure",
    duration: "128 min",
    description: "A deep sea adventure of discovery."
  },
  {
    id: 5,
    title: "Mountain Peak",
    posterPath: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=750&fit=crop",
    rating: 8.9,
    year: 2023,
    category: "Adventure",
    duration: "140 min",
    description: "The ultimate mountaineering challenge."
  },
  {
    id: 6,
    title: "City Lights",
    posterPath: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&h=750&fit=crop",
    rating: 7.2,
    year: 2024,
    category: "Drama",
    duration: "112 min",
    description: "Life and love in the big city."
  }
];

export const popularMovies: Movie[] = [
  {
    id: 7,
    title: "Forest Tale",
    posterPath: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=750&fit=crop",
    rating: 8.0,
    year: 2023,
    category: "Fantasy",
    duration: "135 min",
    description: "Magic and mystery in an enchanted forest."
  },
  {
    id: 8,
    title: "Urban Legend",
    posterPath: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=500&h=750&fit=crop",
    rating: 7.6,
    year: 2024,
    category: "Horror",
    duration: "105 min",
    description: "When urban myths become terrifyingly real."
  },
  {
    id: 9,
    title: "River's End",
    posterPath: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&h=750&fit=crop",
    rating: 8.3,
    year: 2023,
    category: "Drama",
    duration: "122 min",
    description: "A journey to where the river meets destiny."
  },
  {
    id: 10,
    title: "Sky High",
    posterPath: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&h=750&fit=crop",
    rating: 7.9,
    year: 2024,
    category: "Action",
    duration: "115 min",
    description: "High-altitude action and adventure."
  }
];

export const foods: Food[] = [
  {
    id: 1,
    name: "Rolex (Rolled Eggs)",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=600&fit=crop",
    category: "Street Food",
    description: "A popular Ugandan street food of eggs and vegetables rolled in chapati",
    price: "UGX 3,000",
    location: "Kampala, Uganda",
    ingredients: ["Eggs", "Chapati", "Tomatoes", "Onions", "Cabbage"]
  },
  {
    id: 2,
    name: "Matooke",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
    category: "Traditional",
    description: "Steamed green bananas, a staple food in Uganda served with groundnut sauce",
    price: "UGX 5,000",
    location: "Kampala, Uganda",
    ingredients: ["Green Bananas", "Groundnut Sauce"]
  },
  {
    id: 3,
    name: "Luwombo",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    category: "Traditional",
    description: "Steamed meat or chicken wrapped in banana leaves with vegetables",
    price: "UGX 15,000",
    location: "Kampala, Uganda",
    ingredients: ["Chicken", "Banana Leaves", "Groundnut Paste", "Vegetables"]
  },
  {
    id: 4,
    name: "Muchomo (Grilled Meat)",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    category: "BBQ",
    description: "Delicious grilled meat served with fresh tomatoes and onions",
    price: "UGX 10,000",
    location: "Kampala, Uganda",
    ingredients: ["Beef", "Salt", "Tomatoes", "Onions"]
  },
  {
    id: 5,
    name: "Kikomando",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
    category: "Street Food",
    description: "Chapati with beans, a quick and filling Ugandan meal",
    price: "UGX 2,500",
    location: "Kampala, Uganda",
    ingredients: ["Chapati", "Beans"]
  }
];
