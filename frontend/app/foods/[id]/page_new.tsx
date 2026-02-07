import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodDetailClient from "./FoodDetailClient";

interface Food {
  id: string;
  name: string;
  category: string;
  price: string;
  location?: string;
  description: string;
  image?: string;
  ingredients?: string[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getFood(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/api/foods/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch food');
    }
    
    const data = await response.json();
    return data.food;
  } catch (error) {
    console.error('Error fetching food:', error);
    return null;
  }
}

async function getRelatedFoods(currentId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const response = await fetch(`${baseUrl}/api/foods`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch foods');
    }
    
    const data = await response.json();
    const foods = data.foods || [];
    return foods.filter((f: Food) => f.id !== currentId).slice(0, 3);
  } catch (error) {
    console.error('Error fetching related foods:', error);
    return [];
  }
}

export default async function FoodDetailPage({ params }: PageProps) {
  const { id } = await params;
  const food = await getFood(id);
  const relatedFoods = await getRelatedFoods(id);

  if (!food) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-24 sm:pt-28 lg:pt-32 text-center">
          <UtensilsCrossed className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4">Food not found</h1>
          <Link 
            href="/foods" 
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Foods
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <FoodDetailClient food={food} relatedFoods={relatedFoods} />
      <Footer />
    </div>
  );
}
