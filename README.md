# Referral & Credit System

A full-stack referral and credit system built with Next.js, Express, TypeScript, and MongoDB. Users can register, share referral links, earn credits when referrals make purchases, and track their progress through a comprehensive dashboard.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Referral System**: Unique referral codes and links for each user
- **Credit Rewards**: 2 credits for both referrer and referred user on first purchase
- **Purchase Simulation**: Mock purchase system to test credit awarding
- **Real-time Dashboard**: Track referrals, conversions, and credits earned
- **Responsive Design**: Modern UI with Tailwind CSS and Framer Motion animations
- **Data Integrity**: Transaction-based credit awarding to prevent double-crediting

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Zod** for validation

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd referral-credit-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/referral-system
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   
   **Development mode (recommended):**
   ```bash
   # Terminal 1 - Start the backend server
   npm run server
   
   # Terminal 2 - Start the frontend
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm run build
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📊 System Architecture

### Database Schema

#### Users Collection
```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  name: string,
  referralCode: string (unique),
  referredBy?: ObjectId,
  credits: number,
  hasPurchased: boolean,
  createdAt: Date
}
```

#### Referrals Collection
```typescript
{
  _id: ObjectId,
  referrer: ObjectId (User),
  referred: ObjectId (User),
  status: 'pending' | 'converted',
  creditsAwarded: boolean,
  createdAt: Date,
  convertedAt?: Date
}
```

#### Purchases Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId (User),
  productName: string,
  amount: number,
  isFirstPurchase: boolean,
  createdAt: Date
}
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### User Management
- `GET /api/user/dashboard` - Get dashboard data (protected)

#### Referrals
- `GET /api/referral/my-referrals` - Get user's referrals (protected)

#### Purchases
- `POST /api/purchase/simulate` - Simulate a purchase (protected)

## 🔄 Business Logic Flow

### User Registration with Referral
1. User visits referral link: `https://yourapp.com/register?r=LINA123`
2. System validates referral code during registration
3. Creates referral relationship in database
4. New user gets unique referral code

### Credit Awarding Process
1. Referred user makes first purchase
2. System checks if user was referred and hasn't purchased before
3. **Transaction-based credit awarding**:
   - Award 2 credits to referred user
   - Award 2 credits to referrer
   - Mark referral as 'converted'
   - Set creditsAwarded flag to prevent double-crediting
4. Update user purchase status

### Data Integrity Measures
- **MongoDB Transactions**: Ensures atomic credit awarding
- **Unique Constraints**: Prevents duplicate referral codes
- **Boolean Flags**: Prevents double-crediting (creditsAwarded, hasPurchased)
- **Status Tracking**: Referral status progression (pending → converted)

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Modern Interface**: Clean, professional design with Tailwind CSS
- **Interactive Elements**: Copy/share referral links, real-time feedback
- **Loading States**: Proper loading indicators for all async operations
- **Error Handling**: User-friendly error messages and validation

## 🧪 Testing the System

### Manual Testing Flow
1. **Register User A** without referral code
2. **Copy User A's referral link** from dashboard
3. **Register User B** using User A's referral link
4. **Make purchase as User B** (simulate purchase button)
5. **Verify credits**: Both users should have 2 credits
6. **Make second purchase as User B**: No additional credits awarded

### Key Test Cases
- ✅ User registration with/without referral codes
- ✅ Referral link generation and validation
- ✅ First purchase credit awarding
- ✅ Prevention of double-crediting
- ✅ Dashboard statistics accuracy
- ✅ Concurrent user handling

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Railway/Render (Backend)
1. Create new service from GitHub repository
2. Set environment variables
3. Deploy backend service

### MongoDB Atlas (Database)
1. Create MongoDB Atlas cluster
2. Update MONGODB_URI in environment variables
3. Configure network access and database users

## 📈 Performance Optimizations

- **Efficient Queries**: Indexed fields for fast lookups
- **Minimal API Calls**: Batch data fetching where possible
- **Client-side Caching**: Zustand persist for authentication state
- **Transaction Optimization**: Atomic operations for credit awarding
- **Code Splitting**: Next.js automatic code splitting

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Zod schemas for request validation
- **Environment Variables**: Sensitive data in environment files
- **CORS Configuration**: Proper cross-origin resource sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for FileSure Full Stack Developer Intern Assignment**