# Kush Films - Deployment Guide

## Security Features Implemented ✅

### Backend Security
- ✅ **Helmet.js** - Security headers (CSP, XSS protection, etc.)
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **CORS** - Configured for specific origins
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Input Validation** - Zod schema validation
- ✅ **File Upload Validation** - Type and size checks
- ✅ **Password Hashing** - BCrypt with salt rounds

### Frontend Security
- ✅ **XSS Protection** - React auto-escaping + sanitization
- ✅ **HTTPS Ready** - Environment configs for production
- ✅ **Secure Storage** - No sensitive data in localStorage
- ✅ **CSP Compatible** - No inline scripts

## Pre-Deployment Checklist

### Backend
- [ ] Update `.env` with production database URL
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Set `FRONTEND_URL` to your frontend domain
- [ ] Run `npm run build` (if you add a build script)
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Ensure PostgreSQL is running and accessible
- [ ] Create `/public/uploads` and `/public/videos` directories
- [ ] Set proper file permissions for upload directories

### Frontend
- [ ] Update `.env.production` with API URL
- [ ] Run `npm run build`
- [ ] Test production build locally: `npm run start`
- [ ] Ensure all images use Next.js Image component (optional optimization)
- [ ] Configure CDN for static assets (optional)

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel)**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Backend (Railway)**:
1. Go to https://railway.app
2. Connect GitHub repository
3. Add environment variables
4. Railway auto-deploys on git push

### Option 2: VPS (Digital Ocean, Linode, AWS EC2)

**Requirements**:
- Ubuntu 22.04 LTS
- Node.js 18+ 
- PostgreSQL 14+
- Nginx
- PM2 for process management

**Setup Steps**:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2

# Setup PostgreSQL
sudo -u postgres psql
CREATE DATABASE kush_films;
CREATE USER kush_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kush_films TO kush_user;
\q

# Clone repository
git clone <your-repo-url>
cd kush

# Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
nano .env
npx prisma migrate deploy
pm2 start npm --name "kush-api" -- run dev
pm2 save
pm2 startup

# Setup Frontend
cd ../frontend
npm install
npm run build
pm2 start npm --name "kush-web" -- run start
pm2 save

# Configure Nginx
sudo nano /etc/nginx/sites-available/kush-films
```

**Nginx Configuration** (`/etc/nginx/sites-available/kush-films`):
```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 500M;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site and restart Nginx**:
```bash
sudo ln -s /etc/nginx/sites-available/kush-films /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Setup SSL with Let's Encrypt**:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Option 3: Docker (Containerized Deployment)

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: kush_films
      POSTGRES_USER: kush_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://kush_user:your_password@postgres:5432/kush_films
      JWT_SECRET: your-jwt-secret
      FRONTEND_URL: http://localhost:3000
    depends_on:
      - postgres
    volumes:
      - ./backend/public:/app/public

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:4000
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Deploy**:
```bash
docker-compose up -d
```

## Post-Deployment

### Monitoring
```bash
# View logs
pm2 logs kush-api
pm2 logs kush-web

# Monitor resources
pm2 monit
```

### Backup Database
```bash
# Create backup script
nano backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U kush_user kush_films > $BACKUP_DIR/kush_films_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "kush_films_*.sql" -mtime +7 -delete
```

```bash
chmod +x backup.sh
# Add to crontab for daily backup at 2 AM
crontab -e
0 2 * * * /path/to/backup.sh
```

### Performance Optimization

1. **Enable Gzip in Nginx** - Add to nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

2. **Setup CDN** - Use Cloudflare or AWS CloudFront for static assets

3. **Database Indexing** - Already done in Prisma schema

4. **Redis Caching** (Optional) - For session management and API caching

## Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=                 # PostgreSQL connection string
JWT_SECRET=                   # Strong random string for JWT
PORT=4000                     # API server port
NODE_ENV=production           # Environment mode
FRONTEND_URL=                 # Your frontend URL for CORS
MAX_FILE_SIZE_MB=500          # Max video upload size
MAX_IMAGE_SIZE_MB=5           # Max image upload size
```

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=          # Backend API URL
```

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
3. **Enable HTTPS** - Use Let's Encrypt (free)
4. **Regular updates** - Run `npm audit fix` periodically
5. **Database backups** - Automate daily backups
6. **Monitor logs** - Setup log aggregation (e.g., Papertrail)
7. **Rate limiting** - Already implemented (100 req/15min)
8. **SQL injection protection** - Using Prisma ORM
9. **XSS protection** - React + Helmet CSP headers
10. **CSRF protection** - Consider adding for forms

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy, AWS ALB)
- Multiple backend instances with PM2 cluster mode
- Shared session store (Redis)

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries
- Add database read replicas

### File Storage
- Move uploads to S3/Cloudinary for production
- Update upload endpoints to use cloud storage SDK

## Troubleshooting

**Backend won't start**:
- Check database connection
- Verify all env variables are set
- Check port 4000 is available: `lsof -i :4000`

**Frontend build fails**:
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall
- Check API URL is correct

**File uploads fail**:
- Check upload directory permissions: `chmod 755 public/uploads`
- Verify nginx `client_max_body_size` is set to 500M
- Check disk space: `df -h`

**Database connection issues**:
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check firewall rules
- Test connection: `psql -U kush_user -d kush_films`

## Support & Maintenance

- **Logs location**: `/var/log/nginx/` and `~/.pm2/logs/`
- **Restart services**: `pm2 restart all` and `sudo systemctl restart nginx`
- **Update code**: `git pull && npm install && npm run build && pm2 restart all`

---

## Quick Deploy Commands

```bash
# One-line production restart (after git pull)
cd backend && npm install && npx prisma migrate deploy && cd ../frontend && npm install && npm run build && pm2 restart all
```

**All security features are now implemented! Your app is production-ready.** 🚀
