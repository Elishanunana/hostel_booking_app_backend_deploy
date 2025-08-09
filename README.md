# Hostel Booking Backend API

A comprehensive, production-ready backend API for a Ghanaian hostel booking application built with Django REST Framework. This API provides complete functionality for user authentication, room management, booking systems, Paystack payment integration, and comprehensive dashboard analytics.

## 🌟 Features

- **Multi-Role Authentication System** (Student/Provider/Administrator)
- **Advanced Room Management** with image storage via Cloudinary
- **Comprehensive Booking System** with status tracking and validation
- **Paystack Payment Integration** with secure webhook handling
- **Provider Dashboard & Analytics** with revenue tracking
- **Email-based Password Reset** with secure token validation
- **API Documentation** with Swagger/OpenAPI
- **Production Security** with SSL, CORS, and rate limiting
- **Image Management** via Cloudinary CDN
- **Comprehensive Logging** and error handling

## 🌐 Base URLs

- **Production**: `https://test-backend-deploy-svk3.onrender.com`
- **Local Development**: `http://localhost:8000`
- **API Documentation**: `https://test-backend-deploy-svk3.onrender.com/swagger/`
- **Alternative Docs**: `https://test-backend-deploy-svk3.onrender.com/redoc/`

## 🛠 Tech Stack

- **Backend Framework**: Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (Simple JWT)
- **Image Storage**: Cloudinary
- **Payment Gateway**: Paystack
- **Documentation**: drf-yasg (Swagger/OpenAPI)
- **Deployment**: Render
- **Email Service**: Gmail SMTP
- **Static Files**: WhiteNoise

## 🔐 Authentication

The API uses JWT (JSON Web Token) authentication with refresh token support:

- **Header Format**: `Authorization: Bearer <access_token>`
- **Token Acquisition**: Use the `/api/login/` endpoint
- **Token Lifespan**: Configurable (default: access token expires, use refresh token)
- **Refresh Endpoint**: Available for token renewal

### User Roles & Permissions
- **Student**: Can create bookings, manage their bookings, make payments
- **Provider**: Can create/manage rooms, handle booking requests, view revenue analytics
- **Administrator**: Full system access (via Django admin)

## 📚 Complete API Reference

All endpoints are prefixed with `/api/`. Use HTTPS for production requests.

### 🏠 Homepage

```http
GET /
```
**Description**: Welcome message and API status  
**Authentication**: None  
**Response**:
```json
{
  "message": "Welcome to the Hostel Booking System!"
}
```

---

## 🔑 Authentication Endpoints

### Register Student
```http
POST /api/register/student/
```

**Request Body**:
```json
{
  "username": "joewilli",
  "email": "nunanaelisha2004@gmail.com",
  "password": "joewilli@2005",
  "role": "student",
  "phone_number": "0556661933",
  "date_of_birth": "2004-05-30",
  "program": "Computer Engineering"
}
```

**Success Response** `201 Created`:
```json
{
  "message": "Student registration successful! Welcome to the platform.",
  "user": {
    "id": 1,
    "username": "john_student",
    "email": "john@example.com",
    "role": "student"
  },
  "refresh": "eyJ0eXAiOiJKV1Q...",
  "access": "eyJ0eXAiOiJKV1Q..."
}
```

### Register Provider
```http
POST /api/register/provider/
```

**Request Body**:
```json
{
  "username": "francosamuel",
  "password": "francosamuel@?provider",
  "business_name": "Franco Hostel",
  "contact_person": "John Kwame",
  "email": "francosamuel@gmail.com",
  "phone_number": "0246623460",
  "address": "123 Franco St, Ayeduase",
  "bank_details": "Fidelity Bank, 99003456789"
}
```

**Success Response** `201 Created`:
```json
{
  "message": "Provider registration successful! You can now create room listings.",
  "user": {
    "username": "provider_user",
    "role": "provider",
    "business_name": "Golden Gate Hostel",
    "contact_person": "Mr. Kwame Asante",
    "email": "provider@example.com",
    "phone_number": "0554567890",
    "address": "123 University Road, Kumasi",
    "bank_details": "Fidelity Bank, Acc: 1234567890"
  },
  "refresh": "eyJ0eXAiOiJKV1Q...",
  "access": "eyJ0eXAiOiJKV1Q..."
}
```

### Login
```http
POST /api/login/  (Works for both Student and Provider)
```

**Request Body** (supports both email and username):
```json
{
  "email": "wisdomamedeka@gmail.com", or "username": "wisdomamedeka",
  "password": "wizee@2005"
}
```

**Success Response** `200 OK`:
```json
{
  "message": "Login successful! Welcome back.",
  "user": {
    "id": 1,
    "username": "john_student",
    "email": "john@example.com",
    "role": "student"
  },
  "refresh": "eyJ0eXAiOiJKV1Q...",
  "access": "eyJ0eXAiOiJKV1Q..."
}
```

---

## 🔒 Password Reset System

### Request Password Reset
```http
POST /api/password-reset/request/
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** `200 OK`:
```json
{
  "message": "Password reset link has been sent to your email.",
  "reset_url": "http://frontend.com/reset-password?token=abc123..."
}
```

### Verify Reset Token
```http
POST /api/password-reset/verify/
```

**Request Body**:
```json
{
  "token": "secure_reset_token_here"
}
```

**Response** `200 OK`:
```json
{
  "valid": true,
  "user_email": "user@example.com"
}
```

### Confirm Password Reset
```http
POST /api/password-reset/confirm/
```

**Request Body**:
```json
{
  "token": "secure_reset_token_here",
  "new_password": "new_secure_password123"
}
```

**Response** `200 OK`:
```json
{
  "message": "Password has been successfully reset. You can now login with your new password."
}
```

---

## 🏠 Room Management

### Create Room (Provider Only)
```http
POST /api/rooms/create/
```

**Headers**: `Authorization: Bearer <access_token>`  
**Content-Type**: `multipart/form-data`

**Request Body**:
```json
{
  "room_number": "A101",
  "hostel_name": "Golden Gate Hostel",
  "price_per_night": "150.00",
  "max_occupancy": 2,
  "description": "Spacious double room with modern amenities",
  "location": "KNUST Campus, Kumasi",
  "facilities": [1, 2, 3, 5],
  "image_upload": "file_object_here"
}
```

**Response** `201 Created`:
```json
{
  "id": 1,
  "room_number": "A101",
  "hostel_name": "Golden Gate Hostel",
  "price_per_night": "150.00",
  "max_occupancy": 2,
  "description": "Spacious double room with modern amenities",
  "location": "KNUST Campus, Kumasi",
  "is_available": true,
  "image": "https://res.cloudinary.com/.../image.jpg",
  "facilities": [1, 2, 3, 5],
  "provider": 1
}
```

### List All Rooms (Public)
```http
GET /api/rooms/
```

**Query Parameters**:
- `price_min`: Minimum price filter
- `price_max`: Maximum price filter  
- `location`: Location filter (case-insensitive)
- `hostel_name`: Hostel name filter
- `is_available`: Availability filter (true/false)
- `search`: Search in hostel_name, location, description

**Example**:
```
GET /api/rooms/?price_min=100&price_max=200&location=knust&search=wifi
```

### List Provider's Rooms
```http
GET /api/rooms/mine/
```

**Headers**: `Authorization: Bearer <access_token>` (Provider only)

### Get Room Details
```http
GET /api/rooms/{id}/
```

**Response** `200 OK`:
```json
{
  "id": 1,
  "room_number": "A101",
  "hostel_name": "Golden Gate Hostel",
  "price_per_night": "150.00",
  "max_occupancy": 2,
  "description": "Spacious double room with modern amenities",
  "location": "KNUST Campus, Kumasi",
  "is_available": true,
  "image": "https://res.cloudinary.com/.../image.jpg",
  "facilities": [
    {"id": 1, "name": "Wi-Fi"},
    {"id": 2, "name": "Air Conditioning"}
  ],
  "provider": {
    "business_name": "Golden Gate Hostel",
    "contact_person": "Mr. Kwame Asante"
  }
}
```

### Toggle Room Availability
```http
POST /api/rooms/{room_id}/toggle-availability/
```

**Headers**: `Authorization: Bearer <access_token>` (Provider only)

**Response** `200 OK`:
```json
{
  "id": 1,
  "room_number": "A101",
  "is_available": false
}
```

---

## 🏢 Facility Management

### List All Facilities
```http
GET /api/facilities/
```

**Response** `200 OK`:
```json
[
  {"id": 1, "name": "Wi-Fi"},
  {"id": 2, "name": "Air Conditioning"},
  {"id": 3, "name": "Private Bathroom"},
  {"id": 4, "name": "Kitchen Access"},
  {"id": 5, "name": "Laundry Service"}
]
```

---

## 📅 Booking Management

### Create Booking (Student Only)
```http
POST /api/bookings/
```

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "room_id": 1,
  "check_in_date": "2024-09-01",
  "check_out_date": "2024-09-10"
}
```

**Success Response** `201 Created`:
```json
{
  "id": 1,
  "student": 1,
  "room": {
    "id": 1,
    "room_number": "A101",
    "hostel_name": "Golden Gate Hostel",
    "price_per_night": "150.00"
  },
  "check_in_date": "2024-09-01",
  "check_out_date": "2024-09-10",
  "total_amount": "1350.00",
  "booking_status": "pending",
  "booking_status_display": "Pending",
  "created_at": "2024-08-09T10:30:00Z",
  "student_info": {
    "username": "john_student",
    "email": "john@example.com"
  }
}
```

### List Student's Bookings
```http
GET /api/bookings/my/
```

**Headers**: `Authorization: Bearer <access_token>` (Student only)

### List Booking Requests (Provider)
```http
GET /api/bookings/requests/
```

**Headers**: `Authorization: Bearer <access_token>` (Provider only)

**Response**: List of pending bookings for provider's rooms

### Update Booking Status (Provider)
```http
POST /api/bookings/{booking_id}/status/
```

**Headers**: `Authorization: Bearer <access_token>` (Provider only)

**Request Body**:
```json
{
  "status": "approved"
}
```

**Valid Status Values**: `approved`, `rejected`, `confirmed`

### Cancel Booking (Student)
```http
POST /api/bookings/{booking_id}/cancel/
```

**Headers**: `Authorization: Bearer <access_token>` (Student only)

**Response** `200 OK`: Updated booking with cancelled status

---

## 💰 Payment System (Paystack Integration)

### Initialize Payment
```http
POST /api/payments/initiate/
```

**Headers**: `Authorization: Bearer <access_token>` (Student only)

**Request Body**:
```json
{
  "booking_id": 1,
  "email": "john@example.com",
  "amount": 1350.00
}
```

**Success Response** `200 OK`:
```json
{
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "abc123...",
  "reference": "ref_123456789"
}
```

> **Integration Note**: Redirect users to `authorization_url` to complete payment. Payment confirmation is handled via webhook.

### Paystack Webhook Handler
```http
POST /api/webhooks/paystack/
```

**Security**: 
- Rate limited to 10 requests/minute per IP
- Validates Paystack signature using HMAC-SHA512
- Handles `charge.success` events automatically

**Webhook Flow**:
1. Payment successful on Paystack
2. Webhook updates booking status to `confirmed`
3. Creates payment record
4. Updates room availability if at capacity

---

## 📊 Provider Dashboard & Analytics

### Provider Dashboard Summary
```http
GET /api/dashboard/provider/summary/
```

**Headers**: `Authorization: Bearer <access_token>` (Provider only)

**Response** `200 OK`:
```json
{
  "total_rooms": 5,
  "total_revenue": 15750.00,
  "bookings": {
    "pending": 3,
    "confirmed": 12,
    "cancelled": 2
  }
}
```

### Provider Revenue Details
```http
GET /api/revenue/
```

**Headers**: `Authorization: Bearer <access_token>` (Provider only)

**Response** `200 OK`:
```json
{
  "provider": "Golden Gate Hostel",
  "total_revenue": 15750.00,
  "rooms": [
    {
      "room_id": 1,
      "room_number": "A101",
      "hostel_name": "Golden Gate Hostel",
      "total_earned": 4500.00
    },
    {
      "room_id": 2,
      "room_number": "A102",
      "hostel_name": "Golden Gate Hostel",
      "total_earned": 3000.00
    }
  ]
}
```

---

## 🔧 Error Handling & Status Codes

### Common HTTP Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| `200 OK` | Request successful | Valid GET, PUT, POST operations |
| `201 Created` | Resource created successfully | Successful registration, booking creation |
| `400 Bad Request` | Invalid request data | Missing required fields, invalid format |
| `401 Unauthorized` | Authentication required | Missing or expired JWT token |
| `403 Forbidden` | Insufficient permissions | Wrong user role for operation |
| `404 Not Found` | Resource not found | Invalid booking ID, room ID |
| `429 Too Many Requests` | Rate limit exceeded | Webhook rate limiting |
| `500 Internal Server Error` | Server error | Contact support |

### Error Response Format

```json
{
  "error": "Detailed error message",
  "details": {
    "field_name": ["Specific validation error"]
  }
}
```

### Common Error Examples

**Validation Error** `400 Bad Request`:
```json
{
  "error": "Registration failed. Please check your details.",
  "details": {
    "email": ["This field is required."],
    "password": ["Password must be at least 8 characters long."]
  }
}
```

**Permission Error** `403 Forbidden`:
```json
{
  "error": "You are not authorized to modify this room"
}
```

**Not Found Error** `404 Not Found`:
```json
{
  "error": "Booking not found. Please provide a valid booking ID."
}
```

---

## 🛡 Security Features

### Production Security Measures
- **SSL/TLS Encryption**: All communications encrypted
- **CORS Configuration**: Controlled cross-origin requests
- **Rate Limiting**: Webhook endpoints protected
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt
- **CSRF Protection**: Cross-site request forgery prevention
- **SQL Injection Prevention**: Django ORM protection
- **XSS Protection**: Content security headers

### Security Headers (Production)
- `Secure-SSL-Redirect`: Forces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Strict-Transport-Security`: HSTS enforcement

---

## 🚀 Development Setup

### Prerequisites
- Python 3.8+
- PostgreSQL
- Git

### Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/hostel-booking-backend.git
cd hostel-booking-backend
```

2. **Create virtual environment**:
```bash
python -m venv hostel_env
source hostel_env/bin/activate  # On Windows: hostel_env\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Environment variables**:
Create `.env` file with:
```env
SECRET_KEY=your_secret_key_here
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost/hostel_db
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYSTACK_SECRET_KEY=your_paystack_secret_key
EMAIL_HOST_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

5. **Database setup**:
```bash
python manage.py migrate
python manage.py createsuperuser
```

6. **Load sample data** (optional):
```bash
python manage.py loaddata fixtures/facilities.json
```

7. **Run development server**:
```bash
python manage.py runserver
```

8. **Access the API**:
- API Base: `http://localhost:8000/api/`
- Admin Panel: `http://localhost:8000/admin/`
- API Docs: `http://localhost:8000/swagger/`

---

## 🔗 Integration Guidelines

### Frontend Integration

**CORS Configuration**:
The API accepts requests from:
- `http://localhost:3000` (React development)
- `http://localhost:5173` (Vite development)
- Your production frontend URL

**Required Headers**:
```javascript
// For authenticated requests
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}

// For file uploads
headers: {
  'Authorization': `Bearer ${accessToken}`,
  // Don't set Content-Type for FormData, let browser set it
}
```

**JavaScript Example**:
```javascript
// Login example
const loginUser = async (email, password) => {
  const response = await fetch('https://test-backend-deploy-svk3.onrender.com/api/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  }
  throw new Error('Login failed');
};

// Authenticated request example
const getMyBookings = async () => {
  const token = localStorage.getItem('access_token');
  const response = await fetch('https://test-backend-deploy-svk3.onrender.com/api/bookings/my/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
```

### Payment Integration Flow

1. **Create Booking**: Student creates booking (status: `pending`)
2. **Provider Approval**: Provider approves booking (status: `approved`)
3. **Initialize Payment**: Student initiates payment via `/api/payments/initiate/`
4. **Redirect to Paystack**: Frontend redirects to `authorization_url`
5. **Payment Processing**: User completes payment on Paystack
6. **Webhook Confirmation**: Paystack notifies API via webhook
7. **Booking Confirmation**: API updates booking status to `confirmed`

### Mobile App Integration

The API is fully compatible with mobile applications:
- **Flutter**: Use `http` or `dio` packages
- **React Native**: Use `fetch` or `axios`
- **Native iOS/Android**: Standard HTTP clients

---

## 📱 API Testing

### Testing Tools
- **Postman Collection**: [Available on request]
- **Swagger UI**: `https://test-backend-deploy-svk3.onrender.com/swagger/`
- **ReDoc**: `https://test-backend-deploy-svk3.onrender.com/redoc/`

### Test Data

**Test Provider Account**:
```json
{
  "username": "test_provider",
  "password": "testpass123",
  "business_name": "Test Hostel"
}
```

**Test Student Account**:
```json
{
  "username": "test_student",
  "password": "testpass123",
  "email": "student@test.com"
}
```

### Testing Checklist

- [ ] User registration (student & provider)
- [ ] Login with email/username
- [ ] JWT token authentication
- [ ] Room creation with image upload
- [ ] Room filtering and search
- [ ] Booking creation and validation
- [ ] Booking approval workflow
- [ ] Payment initialization
- [ ] Provider dashboard data
- [ ] Error handling for all endpoints

---

## 📋 Requirements.txt

```txt
asgiref==3.8.1
certifi==2024.7.4
charset-normalizer==3.3.2
cloudinary==1.40.0
coreapi==2.3.3
coreschema==0.0.4
Django==5.1
django-cloudinary-storage==0.3.0
django-cors-headers==4.4.0
django-filter==24.2
django-ratelimit==4.1.0
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.0
dj-database-url==2.2.0
drf-yasg==1.21.7
gunicorn==23.0.0
inflection==0.5.1
itypes==1.2.0
Jinja2==3.1.4
MarkupSafe==2.1.5
packaging==24.1
Pillow==10.4.0
psycopg2-binary==2.9.9
PyJWT==2.9.0
python-decouple==3.8
pytz==2024.1
PyYAML==6.0.1
requests==2.32.3
ruamel.yaml==0.18.6
sqlparse==0.5.1
tzdata==2024.1
uritemplate==4.1.1
urllib3==2.2.2
whitenoise==6.7.0
```

---

## 🆘 Support & Contact

### Getting Help

1. **API Documentation**: Visit `/swagger/` or `/redoc/` endpoints
2. **Issues**: Create GitHub issue with error details
3. **CORS Configuration**: Provide your frontend URL for whitelist
4. **Paystack Setup**: Contact for test/production keys

### Common Issues & Solutions

**CORS Error**:
```javascript
// Ensure your frontend URL is whitelisted
// Contact backend developer to add your domain
```

**Authentication Error**:
```javascript
// Check token format: "Bearer <token>"
// Verify token hasn't expired
// Use refresh token to get new access token
```

**Payment Issues**:
```javascript
// Verify booking is in "approved" status before payment
// Check amount matches booking total_amount exactly
// Ensure email matches student's registered email
```

### Contact Information

- **Repository**: [GitHub Link]
- **Production URL**: `https://test-backend-deploy-svk3.onrender.com`
- **Documentation**: [API Docs](https://test-backend-deploy-svk3.onrender.com/swagger/)
- **Issues**: [GitHub Issues](https://github.com/your-username/hostel-booking-backend/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with Django REST Framework | Deployed on Render | Payments by Paystack**
