# Hostel Booking Backend API

A comprehensive backend API for a Ghanaian hostel booking application, built with Django REST Framework and deployed on Render. This API supports user authentication, room management, bookings, payments via Paystack, and more.

## 🌐 Base URLs

- **Production**: `https://test-backend-deploy-svk3.onrender.com`
- **Local Development**: `http://localhost:8000`

## 🔐 Authentication

The API uses JWT (JSON Web Token) authentication with the following specifications:

- **Header Format**: `Authorization: Bearer <access_token>`
- **Token Acquisition**: Use the `/api/login/` endpoint
- **Token Lifespan**:
  - Access token: 5 minutes
  - Refresh token: 24 hours (use `/api/auth/refresh/` to renew)

### User Roles
- **Student**: Can book rooms and manage their bookings
- **Provider**: Can create rooms and manage booking requests

## 📚 API Endpoints

All endpoints are prefixed with `/api/` unless noted otherwise. Use HTTPS for production requests.

### General

Homepage (GET /)
Description: Returns a welcome message.
Authentication: None required.
Response:{"message": "Welcome to the Hostel Booking System!"}





2. Authentication

Register Student (POST /api/register/student/)

Description: Register a new student user.
Request Body:{
  "username": "shalomkafui",
  "email": "shalomkafui@gmail.com",
  "password": "shalomkafui@2005",
  "role": "student",
  "phone_number": "0597771933",
  "date_of_birth": "2005-05-28",
  "program": "Land Economy"
}
```

**Response:** `201 Created` with user details or `400 Bad Request` if invalid

#### Register Provider
```http
POST /api/register/provider/
```

**Request Body:**
```json
{
  "username": "sulemanabdul",
  "password": "sulemanabdul@?provider",
  "business_name": "CanamHostel",
  "contact_person": "Mr.Akabua",
  "email": "sulemanabdul@example.com",
  "phone_number": "0554567890",
  "address": "442 Osu Road, Accra",
  "bank_details": "Fidelity Bank, Acc No: 9599875423"
}
```

**Response:** `201 Created` with user details or `400 Bad Request` if invalid

#### Login
```http
POST /api/login/
```

**Request Body:**
```json
{
  "email": "shalomkafui@gmail.com",
  "password": "shalomkafui@2005"
}
```

**Response:**
```json
{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}
```

#### Password Reset Endpoints

**Request Reset:**
```http
POST /api/password-reset/request/
```

**Verify Token:**
```http
POST /api/password-reset/verify/
```

**Confirm New Password:**
```http
POST /api/password-reset/confirm/
```

### 🏠 Room Management

#### Create Room (Provider Only)
```http
POST /api/rooms/create/
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "room_number": "STH001",
  "hostel_name": "St.Theresa's Hostel",
  "price_per_night": "100.00",
  "max_occupancy": 1,
  "description": "Private single room with AC and kitchenette.",
  "images": ["sth_1.jpg", "sth_2.jpg"],
  "location": "KNUST Campus",
  "facilities": [1, 2, 3, 4]
}
```

#### List Provider's Rooms
```http
GET /api/rooms/mine/
```

**Headers:** `Authorization: Bearer <access_token>` (Provider only)

#### List All Rooms (Public)
```http
GET /api/rooms/
```

No authentication required.

#### Toggle Room Availability
```http
POST /api/rooms/<room_id>/toggle-availability/
```

**Headers:** `Authorization: Bearer <access_token>` (Provider only)

### 📅 Booking Management

#### Create Booking (Student Only)
```http
POST /api/bookings/
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "room_id": 6,
  "check_in_date": "2027-08-01",
  "check_out_date": "2027-08-10"
}
```

#### List Student's Bookings
```http
GET /api/bookings/my/
```

**Headers:** `Authorization: Bearer <access_token>` (Student only)

#### List Booking Requests (Provider)
```http
GET /api/bookings/requests/
```

**Headers:** `Authorization: Bearer <access_token>` (Provider only)

#### Update Booking Status
```http
POST /api/bookings/<booking_id>/status/
```

**Headers:** `Authorization: Bearer <access_token>` (Provider only)

**Request Body:**
```json
{
  "status": "approved"  // or "rejected"
}
```

#### Cancel Booking
```http
POST /api/bookings/<booking_id>/cancel/
```

**Headers:** `Authorization: Bearer <access_token>`

### 💰 Payment (Paystack Integration)

#### Initiate Payment
```http
POST /api/payments/initiate/
```

**Headers:** `Authorization: Bearer <access_token>` (Student only)

**Request Body:**
```json
{
  "booking_id": 29,
  "email": "shalomkafui@gmail.com",
  "amount": 315.00
}
```

**Response:** Paystack payment URL and reference
```json
{
  "authorization_url": "...",
  "reference": "..."
}
```

> **Note:** Redirect users to the `authorization_url` to complete payment.

#### Paystack Webhook
```http
POST /api/webhooks/paystack/
```

Handles Paystack events (e.g., `charge.success`). No authentication required (secured by Paystack's signature).

### 🔧 Utility Endpoints

#### List Facilities
```http
GET /api/facilities/
```

Returns all available facilities (e.g., Wi-Fi, AC). No authentication required.

#### Provider Revenue
```http
GET /api/revenue/
```

**Headers:** `Authorization: Bearer <access_token>` (Provider only)

#### Provider Dashboard Summary
```http
GET /api/dashboard/provider/summary/
```

**Headers:** `Authorization: Bearer <access_token>` (Provider only)

## 🔧 Integration Guidelines

### CORS Configuration
The backend allows requests from:
- `http://localhost:3000` (local development)
- Production frontend URL (configured in Render)

### Required Headers
- **Authentication**: `Authorization: Bearer <access_token>`
- **Content Type**: `Content-Type: application/json` for POST requests

### Paystack Integration
- Use Paystack test keys for development
- Redirect users to `authorization_url` after payment initiation
- Handle payment success/failure via callbacks or booking status polling

### Error Handling

| Status Code | Description |
|-------------|-------------|
| `400 Bad Request` | Invalid input (missing fields, invalid dates) |
| `401 Unauthorized` | Missing or invalid JWT |
| `403 Forbidden` | Insufficient permissions |
| `404 Not Found` | Resource not found |

### Image Handling
Room images are stored on the backend. Fetch image URLs from room responses and display them in your UI.

## 🧪 Testing

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/hostel-booking-backend.git
   cd hostel-booking-backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file with test values (contact backend developer for sample)

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start the server:**
   ```bash
   python manage.py runserver
   ```

6. **Test endpoints:**
   Use Postman or your frontend at `http://localhost:8000/api/`

### Production Testing

1. Use `https://test-backend-deploy-svk3.onrender.com/api/` for API requests
2. Test the complete authentication flow: Register → Login → Use access token
3. Test the booking flow: Create room (provider) → Book room (student) → Initiate payment
4. Verify CORS by making requests from your frontend's production URL

## 📞 Support

For technical issues, missing endpoints, CORS errors, or Paystack setup:

- Contact the backend developer
- Provide your frontend's production URL for CORS configuration
- Include error logs and request details for faster resolution

---

**Built with Django REST Framework | Deployed on Render | Payments by Paystack**
