# Kush Films - Frontend

Modern Next.js 15 frontend with Tailwind CSS, based on the Lovable demo.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ installed
- Backend API running on http://localhost:4000

### Installation

```bash
# Install dependencies
npm install

# Create environment file
copy .env.example .env.local

# Edit .env.local with your values
notepad .env.local

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   ├── movies/
│   │   ├── page.tsx       # Movies listing
│   │   └── [id]/page.tsx  # Movie detail
│   ├── foods/
│   │   ├── page.tsx       # Foods listing
│   │   └── [id]/page.tsx  # Food detail
│   ├── login/page.tsx     # Login/Register
│   └── watchlist/page.tsx # Watchlist
├── components/            # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── MovieCard.tsx
│   ├── FoodCard.tsx
│   └── SectionHeader.tsx
├── data/
│   └── mockData.ts        # Sample data
├── lib/
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind configuration
└── next.config.ts         # Next.js configuration
```

## 🎨 Design System

### Colors
- **Primary**: Green (#22C55E) - Kush Films brand
- **Accent**: Gold (#F59E0B) - Kush Foods
- **Background**: Dark (#1A1F2E)
- **Foreground**: Light text (#F8FAFC)

### Typography
- **Headings**: System serif font stack
- **Body**: Inter (sans-serif)

### Components
All components use Tailwind CSS utility classes with custom design tokens.

## 📄 Pages

### Home (/)
- Hero section with animated background
- Trending movies grid
- Featured foods
- CTA section

### Movies (/movies)
- Search and filter
- Trending section
- Popular section
- Movie cards with ratings

### Movie Detail (/movies/[id])
- Hero with backdrop
- Movie information
- Rating and metadata
- Related movies

### Foods (/foods)
- Search functionality
- Food cards grid
- Category badges
- Pricing

### Food Detail (/foods/[id])
- Hero image
- Description
- Ingredients section
- Related foods

### Login (/login)
- Toggle between sign in/sign up
- Email/password fields
- Split screen design

### Watchlist (/watchlist)
- Empty state (requires auth)
- Will show saved movies/foods

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Tailwind
Custom theme extends in `tailwind.config.ts`:
- Colors
- Animations (fade-in, fade-in-up, float)
- Utilities (gradients, glass effects, glows)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Build for Production
```bash
npm run build
npm start
```

## 📦 Dependencies

### Core
- **Next.js 15** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **lucide-react** - Icon library
- **clsx** + **tailwind-merge** - Class name utilities

### State & Data
- **axios** - HTTP client (ready for backend integration)
- **zustand** - State management (ready to use)

## 🎯 Next Steps

1. **Connect to Backend API**
   - Update API calls in components
   - Add axios interceptors
   - Handle authentication

2. **Add Authentication**
   - Integrate JWT tokens
   - Protected routes
   - User profile

3. **Implement State Management**
   - Zustand stores for user, movies, foods
   - Persist watchlist
   - Cart functionality

4. **Add More Features**
   - Video player integration
   - Payment processing (Stripe)
   - Admin dashboard
   - User profiles

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Styles not loading
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Images not loading
- Check `next.config.ts` image domains
- Verify image URLs are accessible

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Built with ❤️ for Kush Films Uganda 🇺🇬**
