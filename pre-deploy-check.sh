#!/bin/bash

# Kush Films - Pre-Deployment Check Script
# Run this before deploying to catch issues early

echo "🔍 Running Pre-Deployment Checks..."
echo "=================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check Node version
echo -e "\n📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}❌ Node.js version must be 16 or higher${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ Node.js version OK ($NODE_VERSION)${NC}"
fi

# Check Backend
echo -e "\n🔧 Checking Backend..."
cd backend || exit

# Check .env file
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found in backend${NC}"
    echo "   Copy .env.example to .env and configure"
    ((WARNINGS++))
else
    echo -e "${GREEN}✅ .env file exists${NC}"
    
    # Check required variables
    required_vars=("DATABASE_URL" "JWT_SECRET" "JWT_REFRESH_SECRET")
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env; then
            echo -e "${RED}❌ Missing ${var} in .env${NC}"
            ((ERRORS++))
        fi
    done
fi

# Install dependencies
echo -e "\n📥 Installing backend dependencies..."
npm install --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    ((ERRORS++))
fi

# Generate Prisma client
echo -e "\n🗄️  Generating Prisma client..."
npx prisma generate --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma client${NC}"
    ((ERRORS++))
fi

# Build backend
echo -e "\n🔨 Building backend..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Backend build failed${NC}"
    ((ERRORS++))
fi

# Check Frontend
echo -e "\n🎨 Checking Frontend..."
cd ../frontend || exit

# Check .env.local
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  No .env.local file found${NC}"
    echo "   Copy .env.example to .env.local and configure"
    ((WARNINGS++))
else
    echo -e "${GREEN}✅ .env.local exists${NC}"
fi

# Install dependencies
echo -e "\n📥 Installing frontend dependencies..."
npm install --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    ((ERRORS++))
fi

# Run lint
echo -e "\n🔍 Running ESLint..."
npm run lint
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ No lint errors${NC}"
else
    echo -e "${YELLOW}⚠️  Lint warnings found (non-blocking)${NC}"
    ((WARNINGS++))
fi

# Build frontend
echo -e "\n🔨 Building frontend..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    ((ERRORS++))
fi

# Summary
echo -e "\n=================================="
echo -e "📊 Pre-Deployment Check Summary"
echo -e "=================================="
echo -e "Errors: ${ERRORS}"
echo -e "Warnings: ${WARNINGS}"

if [ $ERRORS -eq 0 ]; then
    echo -e "\n${GREEN}✅ All checks passed! Ready to deploy.${NC}"
    echo -e "\nNext steps:"
    echo -e "1. Push to GitHub: git push origin main"
    echo -e "2. Deploy backend to Render"
    echo -e "3. Deploy frontend to Vercel"
    echo -e "4. Configure environment variables"
    echo -e "5. Run database migrations"
    exit 0
else
    echo -e "\n${RED}❌ ${ERRORS} error(s) found. Fix them before deploying.${NC}"
    exit 1
fi
