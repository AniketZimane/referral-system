# Quick Installation Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# Minimum required:
# MONGODB_URI=mongodb://localhost:27017/referral-system
# JWT_SECRET=your-secret-key-here
```

### 3. Start the Application
```bash
# Option 1: Start both frontend and backend together
npm run dev:all

# Option 2: Start separately (2 terminals)
# Terminal 1:
npm run server

# Terminal 2:
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing the Referral System

### Step-by-Step Test
1. **Register User A**: Go to http://localhost:3000/register
2. **Get Referral Link**: Login and copy the referral link from dashboard
3. **Register User B**: Use User A's referral link to register
4. **Make Purchase**: Login as User B and click "Buy Product"
5. **Verify Credits**: Check both users' dashboards - both should have 2 credits

## Environment Variables

### Required Variables
```env
MONGODB_URI=mongodb://localhost:27017/referral-system
JWT_SECRET=your-super-secret-jwt-key-here
```

### Optional Variables
```env
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
PORT=5000
```

## Database Setup

### Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# The application will automatically create the database and collections
```

### MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create a new cluster
3. Get connection string
4. Update MONGODB_URI in .env file

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000 5000
```

**MongoDB connection error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- For Atlas: Check network access and credentials

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Production Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Using Vercel (Frontend) + Railway (Backend)
1. **Frontend**: Connect GitHub repo to Vercel
2. **Backend**: Deploy to Railway or Render
3. **Database**: Use MongoDB Atlas
4. **Update environment variables** in deployment platforms

## Development Scripts

```bash
npm run dev          # Start Next.js frontend
npm run server       # Start Express backend
npm run dev:all      # Start both frontend and backend
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Run ESLint
```

## Project Structure
```
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   ├── store/         # Zustand state management
│   ├── types/         # TypeScript interfaces
│   └── utils/         # Utility functions
├── server/
│   ├── models/        # MongoDB models
│   ├── routes/        # Express routes
│   ├── middleware/    # Express middleware
│   └── utils/         # Server utilities
└── docs/              # Documentation
```

## Need Help?

1. Check the [README.md](./README.md) for detailed documentation
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
3. See [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) for architecture overview

## Success Indicators

✅ Frontend loads at http://localhost:3000
✅ Backend API responds at http://localhost:5000/api
✅ User registration works
✅ Referral links are generated
✅ Credits are awarded on first purchase
✅ Dashboard shows correct statistics

**You're ready to go! 🚀**