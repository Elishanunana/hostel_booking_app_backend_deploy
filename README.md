Hostel Booking Backend API Documentation
This is the backend API for the Ghanaian hostel booking app, built with Django REST Framework and deployed on Render. It supports user authentication, room management, bookings, payments via Paystack, and more. This guide provides all the details your frontend team needs to integrate with the API.
Base URL

Production: https://test-backend-deploy-svk3.onrender.com
Local Development: http://localhost:8000 (if running locally)

Authentication

JWT Authentication: Most endpoints require a JSON Web Token (JWT) in the Authorization header as Bearer <access_token>.
Token Acquisition: Use the /api/login/ endpoint to get access and refresh tokens.
Token Lifespan:
Access token: Valid for 5 minutes.
Refresh token: Valid for 24 hours (use /api/auth/refresh/ to get a new access token).


Roles: Two user types—student (books rooms) and provider (manages rooms and bookings).

API Endpoints
All endpoints are prefixed with /api/ unless noted otherwise. Use HTTPS for production requests.
1. General

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


Response: 201 Created with user details or 400 Bad Request if invalid (e.g., duplicate email).


Register Provider (POST /api/register/provider/)

Description: Register a new provider user.
Request Body:{
  "username": "sulemanabdul",
  "password": "sulemanabdul@?provider",
  "business_name": "CanamHostel",
  "contact_person": "Mr.Akabua",
  "email": "sulemanabdul@example.com",
  "phone_number": "0554567890",
  "address": "442 Osu Road, Accra",
  "bank_details": "Fidelity Bank, Acc No: 9599875423"
}


Response: 201 Created with user details or 400 Bad Request if invalid.


Login (POST /api/login/)

Description: Authenticate a user and return JWT tokens.
Request Body:{
  "email": "shalomkafui@gmail.com",
  "password": "shalomkafui@2005"
}


Response:{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}


Errors: 401 Unauthorized if credentials are invalid.


Password Reset Request (POST /api/password-reset/request/)

Description: Request a password reset email.
Request Body:{
  "email": "shalomkafui@gmail.com"
}


Response: 200 OK if email sent, 400 Bad Request if email not found.


Password Reset Verify (POST /api/password-reset/verify/)

Description: Verify the reset token sent via email.
Request Body:{
  "token": "<reset_token>"
}


Response: 200 OK if valid, 400 Bad Request if invalid.


Password Reset Confirm (POST /api/password-reset/confirm/)

Description: Set a new password using a valid reset token.
Request Body:{
  "token": "<reset_token>",
  "password": "newpassword@2025"
}


Response: 200 OK if successful, 400 Bad Request if invalid.



3. Room Management

Create Room (POST /api/rooms/create/)

Description: Create a new room (provider only).
Authentication: JWT required (provider role).
Request Body:{
  "room_number": "STH001",
  "hostel_name": "St.Theresa's Hostel",
  "price_per_night": "100.00",
  "max_occupancy": 1,
  "description": "Private single room with AC and kitchenette.",
  "images": ["sth_1.jpg", "sth_2.jpg"],
  "location": "KNUST Campus",
  "facilities": [1, 2, 3, 4]
}


Response: 201 Created with room details or 403 Forbidden if not a provider.


List My Rooms (GET /api/rooms/mine/)

Description: Get all rooms owned by the provider.
Authentication: JWT required (provider role).
Response: List of rooms or 403 Forbidden if not a provider.


List All Rooms (GET /api/rooms/)

Description: Get all available rooms (public).
Authentication: None required.
Response: List of rooms with details (e.g., hostel name, price, availability).


Toggle Room Availability (POST /api/rooms/<room_id>/toggle-availability/)

Description: Toggle a room’s availability (provider only).
Authentication: JWT required (provider role).
Response: 200 OK with updated room status or 403 Forbidden if not a provider.



4. Booking Management

Create Booking (POST /api/bookings/)

Description: Create a booking (student only).
Authentication: JWT required (student role).
Request Body:{
  "room_id": 6,
  "check_in_date": "2027-08-01",
  "check_out_date": "2027-08-10"
}


Response: 201 Created with booking details or 400 Bad Request if invalid dates/room.


List My Bookings (GET /api/bookings/my/)

Description: Get all bookings for the authenticated student.
Authentication: JWT required (student role).
Response: List of bookings or 403 Forbidden if not a student.


List Booking Requests (GET /api/bookings/requests/)

Description: Get all booking requests for the provider’s rooms.
Authentication: JWT required (provider role).
Response: List of booking requests or 403 Forbidden if not a provider.


Update Booking Status (POST /api/bookings/<booking_id>/status/)

Description: Approve or reject a booking (provider only).
Authentication: JWT required (provider role).
Request Body:{
  "status": "approved"  // or "rejected"
}


Response: 200 OK with updated booking or 403 Forbidden if not a provider.


Cancel Booking (POST /api/bookings/<booking_id>/cancel/)

Description: Cancel a booking (student or provider).
Authentication: JWT required (student or provider).
Response: 200 OK if canceled, 403 Forbidden if unauthorized.



5. Payment

Initiate Payment (POST /api/payments/initiate/)

Description: Start a Paystack payment for a booking.
Authentication: JWT required (student role).
Request Body:{
  "booking_id": 29,
  "email": "shalomkafui@gmail.com",
  "amount": 315.00
}


Response: Paystack payment URL and reference (e.g., {"authorization_url": "...", "reference": "..."}).
Note: Redirect users to the authorization_url to complete payment.


Paystack Webhook (POST /api/webhooks/paystack/)

Description: Handles Paystack events (e.g., charge.success).
Authentication: None (secured by Paystack’s signature).
Note: Contact the backend developer to configure webhook events in Paystack’s dashboard.



6. Other Endpoints

List Facilities (GET /api/facilities/)

Description: Get all available facilities (e.g., Wi-Fi, AC).
Authentication: None required.
Response: List of facilities with IDs and names.


Provider Revenue (GET /api/revenue/)

Description: Get total revenue for the provider.
Authentication: JWT required (provider role).
Response: Revenue summary or 403 Forbidden if not a provider.


Provider Dashboard Summary (GET /api/dashboard/provider/summary/)

Description: Get a summary of provider’s rooms, bookings, and revenue.
Authentication: JWT required (provider role).
Response: Dashboard data or 403 Forbidden if not a provider.



Integration Notes

CORS: The backend allows requests from http://localhost:3000 (local) and the production FRONTEND_URL (set in Render). Ensure your frontend’s production URL is shared with the backend developer.
Headers:
Include Authorization: Bearer <access_token> for authenticated requests.
Use Content-Type: application/json for POST requests.


Paystack:
Use Paystack’s test keys for development (contact backend developer for keys).
After initiating payment, redirect users to the Paystack authorization_url.
Handle payment success/failure via callbacks or by polling the booking status.


Error Handling:
400 Bad Request: Invalid input (e.g., missing fields, invalid dates).
401 Unauthorized: Missing or invalid JWT.
403 Forbidden: User lacks permission (e.g., student accessing provider endpoint).
404 Not Found: Invalid resource ID (e.g., room or booking not found).


Image Handling: Room images (sth_1.jpg, etc.) are stored on the backend. Fetch image URLs from the room response and display them in your UI.

Testing Instructions

Local Testing:
Clone the backend: git clone https://github.com/your-username/hostel-booking-backend.git.
Install dependencies: pip install -r requirements.txt.
Set up .env with test values (contact backend developer for sample .env).
Run migrations: python manage.py migrate.
Start server: python manage.py runserver.
Test endpoints with Postman or your frontend at http://localhost:8000/api/.


Production Testing:
Use https://test-backend-deploy-svk3.onrender.com/api/ for API requests.
Test authentication flow: Register, login, and use the access token.
Test booking flow: Create a room (as provider), book it (as student), initiate payment.
Verify CORS by making requests from your frontend’s production URL.



Contact

For issues (e.g., missing endpoints, CORS errors, Paystack setup), contact the backend developer.
Share your frontend’s production URL to update CORS_ALLOWED_ORIGINS.
