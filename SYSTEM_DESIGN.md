# System Design Documentation

## Overview
The Referral & Credit System is designed as a scalable, full-stack application that manages user referrals and credit rewards in a digital product platform. The system ensures data integrity, prevents double-crediting, and provides real-time analytics through a modern web interface.

## Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │    │   (Express)     │    │   (MongoDB)     │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Pages       │ │    │ │ Routes      │ │    │ │ Users       │ │
│ │ - Home      │ │    │ │ - Auth      │ │    │ │ - Referrals │ │
│ │ - Login     │ │    │ │ - User      │ │    │ │ - Purchases │ │
│ │ - Register  │ │    │ │ - Referral  │ │    │ │             │ │
│ │ - Dashboard │ │    │ │ - Purchase  │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │                 │
│ │ Components  │ │    │ │ Middleware  │ │    │                 │
│ │ - Dashboard │ │    │ │ - Auth      │ │    │                 │
│ │ - Forms     │ │    │ │ - CORS      │ │    │                 │
│ └─────────────┘ │    │ │ - Validation│ │    │                 │
│                 │    │ └─────────────┘ │    │                 │
│ ┌─────────────┐ │    │                 │    │                 │
│ │ State Mgmt  │ │    │ ┌─────────────┐ │    │                 │
│ │ - Zustand   │ │    │ │ Models      │ │    │                 │
│ │ - Auth Store│ │    │ │ - User      │ │    │                 │
│ └─────────────┘ │    │ │ - Referral  │ │    │                 │
└─────────────────┘    │ │ - Purchase  │ │    │                 │
                       │ └─────────────┘ │    │                 │
                       └─────────────────┘    └─────────────────┘
```

## Data Flow Diagram

### User Registration with Referral
```
User clicks referral link
         ↓
Frontend extracts referral code from URL
         ↓
User fills registration form
         ↓
Frontend sends registration request with referral code
         ↓
Backend validates referral code
         ↓
Backend creates user with referredBy field
         ↓
Backend creates referral relationship
         ↓
Backend returns JWT token and user data
         ↓
Frontend stores auth state and redirects to dashboard
```

### Purchase and Credit Awarding
```
User clicks "Buy Product" button
         ↓
Frontend sends purchase request
         ↓
Backend starts MongoDB transaction
         ↓
Backend checks if first purchase
         ↓
If first purchase:
  ├── Award 2 credits to user
  ├── Check if user was referred
  ├── If referred:
  │   ├── Award 2 credits to referrer
  │   ├── Mark referral as converted
  │   └── Set creditsAwarded flag
  └── Mark user as hasPurchased
         ↓
Backend commits transaction
         ↓
Backend returns purchase confirmation
         ↓
Frontend updates UI and shows success message
```

## Database Schema Design

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  referralCode: String (unique, required),
  referredBy: ObjectId (optional, ref: 'User'),
  credits: Number (default: 0),
  hasPurchased: Boolean (default: false),
  createdAt: Date (default: Date.now)
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ referralCode: 1 }, { unique: true })
db.users.createIndex({ referredBy: 1 })
```

### Referrals Collection
```javascript
{
  _id: ObjectId,
  referrer: ObjectId (required, ref: 'User'),
  referred: ObjectId (required, ref: 'User'),
  status: String (enum: ['pending', 'converted'], default: 'pending'),
  creditsAwarded: Boolean (default: false),
  createdAt: Date (default: Date.now),
  convertedAt: Date (optional)
}

// Indexes
db.referrals.createIndex({ referrer: 1 })
db.referrals.createIndex({ referred: 1 })
db.referrals.createIndex({ referrer: 1, referred: 1 }, { unique: true })
```

### Purchases Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, ref: 'User'),
  productName: String (required),
  amount: Number (required),
  isFirstPurchase: Boolean (default: false),
  createdAt: Date (default: Date.now)
}

// Indexes
db.purchases.createIndex({ userId: 1 })
db.purchases.createIndex({ createdAt: -1 })
```

## API Design

### RESTful Endpoints

#### Authentication Endpoints
```
POST /api/auth/register
Body: { email, password, name, referralCode? }
Response: { token, user }

POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### User Endpoints
```
GET /api/user/dashboard
Headers: { Authorization: "Bearer <token>" }
Response: { user, stats: { totalReferrals, convertedReferrals, totalCreditsEarned, referralLink } }
```

#### Referral Endpoints
```
GET /api/referral/my-referrals
Headers: { Authorization: "Bearer <token>" }
Response: [{ referrer, referred, status, createdAt, convertedAt }]
```

#### Purchase Endpoints
```
POST /api/purchase/simulate
Headers: { Authorization: "Bearer <token>" }
Body: { productName, amount }
Response: { success, purchase, creditsEarned, totalCredits }
```

## Security Considerations

### Authentication & Authorization
- JWT tokens with 7-day expiration
- Password hashing with bcryptjs (12 salt rounds)
- Protected routes with middleware authentication
- Token validation on every protected request

### Data Validation
- Zod schemas for request validation
- Email format validation
- Password strength requirements (minimum 6 characters)
- Input sanitization to prevent injection attacks

### Environment Security
- Sensitive data in environment variables
- JWT secret key protection
- Database connection string security
- CORS configuration for cross-origin requests

## Scalability Considerations

### Database Optimization
- Proper indexing on frequently queried fields
- Compound indexes for complex queries
- Connection pooling for database connections
- Transaction-based operations for data consistency

### Application Architecture
- Modular code structure for maintainability
- Separation of concerns (routes, models, middleware)
- Stateless backend design for horizontal scaling
- Client-side state management with Zustand

### Performance Optimization
- Efficient database queries with population
- Minimal API calls with batch data fetching
- Code splitting with Next.js
- Image optimization and lazy loading

## Error Handling Strategy

### Backend Error Handling
```javascript
// Global error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Validation error handling
if (error instanceof z.ZodError) {
  return res.status(400).json({ error: error.errors[0].message });
}
```

### Frontend Error Handling
```javascript
// API client error handling
try {
  const response = await apiClient.post('/endpoint', data);
} catch (error) {
  setError(error.message);
  // Show user-friendly error message
}
```

## Data Integrity Measures

### Transaction Management
```javascript
// MongoDB transaction for credit awarding
const session = await mongoose.startSession();
session.startTransaction();

try {
  // Perform multiple operations
  await user.save({ session });
  await referral.save({ session });
  await referrer.save({ session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### Duplicate Prevention
- Unique constraints on email and referral codes
- Boolean flags to prevent double-crediting
- Status tracking for referral progression
- First purchase validation

## Monitoring & Analytics

### Key Metrics to Track
- User registration rate
- Referral conversion rate
- Average credits per user
- Purchase completion rate
- System response times

### Logging Strategy
- Request/response logging
- Error logging with stack traces
- Database operation logging
- Authentication attempt logging

## Future Enhancements

### Potential Features
- Email notifications for referral events
- Credit redemption system
- Referral leaderboards
- Advanced analytics dashboard
- Mobile app development
- Social media integration

### Technical Improvements
- Redis caching for frequently accessed data
- Rate limiting for API endpoints
- Automated testing suite
- CI/CD pipeline setup
- Docker containerization
- Microservices architecture

## Deployment Architecture

### Production Environment
```
Internet → Load Balancer → Frontend (Vercel)
                       → Backend (Railway/Render)
                       → Database (MongoDB Atlas)
```

### Environment Configuration
- Development: Local MongoDB, local servers
- Staging: Cloud database, deployed services
- Production: Full cloud infrastructure with monitoring

This system design ensures scalability, maintainability, and security while providing a smooth user experience for the referral and credit system.