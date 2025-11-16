# API Documentation

## Base URL
```
https://referral-system-amber.vercel.app/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "referralCode": "LINA123" // optional
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "referralCode": "JOHN123",
    "credits": 0
  }
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "referralCode": "JOHN123",
    "credits": 2
  }
}
```

### User Management

#### Get Dashboard Data
```http
GET /user/dashboard
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "user@example.com",
    "referralCode": "JOHN123",
    "credits": 4
  },
  "stats": {
    "totalReferrals": 3,
    "convertedReferrals": 2,
    "totalCreditsEarned": 4,
    "referralLink": "https://referral-system-amber.vercel.app/register?r=JOHN123"
  }
}
```

### Referrals

#### Get My Referrals
```http
GET /referral/my-referrals
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "referral_id",
    "referrer": "referrer_id",
    "referred": {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "status": "converted",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "convertedAt": "2024-01-16T14:20:00.000Z"
  }
]
```

### Purchases

#### Simulate Purchase
```http
POST /purchase/simulate
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productName": "Digital Course Bundle",
  "amount": 99.99
}
```

**Response:**
```json
{
  "success": true,
  "purchase": {
    "id": "purchase_id",
    "productName": "Digital Course Bundle",
    "amount": 99.99,
    "isFirstPurchase": true
  },
  "creditsEarned": 2,
  "totalCredits": 2
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created (for registration)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (token expired)
- `404` - Not Found
- `500` - Internal Server Error

## Postman Collection

You can import this collection into Postman for testing:

```json
{
  "info": {
    "name": "Referral Credit System API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"name\": \"Test User\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "User",
      "item": [
        {
          "name": "Get Dashboard",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/user/dashboard",
              "host": ["{{baseUrl}}"],
              "path": ["user", "dashboard"]
            }
          }
        }
      ]
    },
    {
      "name": "Purchase",
      "item": [
        {
          "name": "Simulate Purchase",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productName\": \"Digital Course Bundle\",\n  \"amount\": 99.99\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/purchase/simulate",
              "host": ["{{baseUrl}}"],
              "path": ["purchase", "simulate"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": "your_jwt_token_here"
    }
  ]
}
```

## Testing Flow

1. **Register a user** without referral code
2. **Login** to get the JWT token
3. **Get dashboard data** to see the referral link
4. **Register another user** with the first user's referral code
5. **Login as the second user** and **simulate a purchase**
6. **Check both users' dashboards** to verify credit awarding

## Rate Limiting

Currently, there are no rate limits implemented, but in production, consider implementing:
- 5 requests per minute for registration
- 10 requests per minute for login attempts
- 100 requests per minute for authenticated endpoints
