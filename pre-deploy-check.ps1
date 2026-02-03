# Kush Films - Pre-Deployment Check Script (PowerShell)
# Run this before deploying to catch issues early

Write-Host "`n🔍 Running Pre-Deployment Checks..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

$Errors = 0
$Warnings = 0

# Check Node version
Write-Host "`n📦 Checking Node.js version..." -ForegroundColor Yellow
$NodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$NodeVersion -lt 16) {
    Write-Host "❌ Node.js version must be 16 or higher" -ForegroundColor Red
    $Errors++
} else {
    Write-Host "✅ Node.js version OK ($NodeVersion)" -ForegroundColor Green
}

# Check Backend
Write-Host "`n🔧 Checking Backend..." -ForegroundColor Yellow
Push-Location backend

# Check .env file
if (-not (Test-Path .env)) {
    Write-Host "⚠️  No .env file found in backend" -ForegroundColor Yellow
    Write-Host "   Copy .env.example to .env and configure" -ForegroundColor Yellow
    $Warnings++
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
    
    # Check required variables
    $content = Get-Content .env -Raw
    $requiredVars = @("DATABASE_URL", "JWT_SECRET", "JWT_REFRESH_SECRET")
    foreach ($var in $requiredVars) {
        if ($content -notmatch "^$var=") {
            Write-Host "❌ Missing $var in .env" -ForegroundColor Red
            $Errors++
        }
    }
}

# Install dependencies
Write-Host "`n📥 Installing backend dependencies..." -ForegroundColor Yellow
npm install --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    $Errors++
}

# Generate Prisma client
Write-Host "`n🗄️  Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    $Errors++
}

# Build backend
Write-Host "`n🔨 Building backend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Backend build failed" -ForegroundColor Red
    $Errors++
}

Pop-Location

# Check Frontend
Write-Host "`n🎨 Checking Frontend..." -ForegroundColor Yellow
Push-Location frontend

# Check .env.local
if (-not (Test-Path .env.local)) {
    Write-Host "⚠️  No .env.local file found" -ForegroundColor Yellow
    Write-Host "   Copy .env.example to .env.local and configure" -ForegroundColor Yellow
    $Warnings++
} else {
    Write-Host "✅ .env.local exists" -ForegroundColor Green
}

# Install dependencies
Write-Host "`n📥 Installing frontend dependencies..." -ForegroundColor Yellow
npm install --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    $Errors++
}

# Run lint
Write-Host "`n🔍 Running ESLint..." -ForegroundColor Yellow
npm run lint 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ No lint errors" -ForegroundColor Green
} else {
    Write-Host "⚠️  Lint warnings found (non-blocking)" -ForegroundColor Yellow
    $Warnings++
}

# Build frontend
Write-Host "`n🔨 Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    $Errors++
}

Pop-Location

# Summary
Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "📊 Pre-Deployment Check Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Errors: $Errors"
Write-Host "Warnings: $Warnings"

if ($Errors -eq 0) {
    Write-Host "`n✅ All checks passed! Ready to deploy." -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. Push to GitHub: git push origin main"
    Write-Host "2. Deploy backend to Render"
    Write-Host "3. Deploy frontend to Vercel"
    Write-Host "4. Configure environment variables"
    Write-Host "5. Run database migrations"
    exit 0
} else {
    Write-Host "`n❌ $Errors error(s) found. Fix them before deploying." -ForegroundColor Red
    exit 1
}
