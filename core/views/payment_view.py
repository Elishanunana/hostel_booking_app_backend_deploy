import requests
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from core.models import Booking, StudentProfile
import logging

# Set up logging
logger = logging.getLogger(__name__)

class InitializePaystackPayment(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        booking_id = request.data.get("booking_id")
        email = request.data.get("email")
        amount = request.data.get("amount")

        if not all([booking_id, email, amount]):
            return Response({"error": "Missing required fields: booking_id, email, and amount are all required."}, status=400)

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found. Please provide a valid booking ID."}, status=404)

        try:
            student_profile = StudentProfile.objects.get(user=request.user)
            if booking.student != student_profile:
                return Response({"error": "You are not authorized to pay for this booking. Only the booking owner can make payments."}, status=403)
        except StudentProfile.DoesNotExist:
            return Response({"error": "No student profile found. Please complete your profile to make payments."}, status=403)

        if email != student_profile.user.email:
            return Response({"error": "Provided email does not match your account email. Please use the correct email."}, status=400)

        paid_bookings = Booking.objects.filter(
            room=booking.room,
            check_in_date__lt=booking.check_out_date,
            check_out_date__gt=booking.check_in_date,
            payment__status='success',
            booking_status__in=['pending', 'confirmed']
        ).exclude(id=booking.id).count()

        if paid_bookings >= booking.room.max_occupancy:
            return Response({"error": f"Room has reached its maximum occupancy of {booking.room.max_occupancy} for the selected dates."}, status=400)

        try:
            amount = float(amount)
            if abs(amount - float(booking.total_amount)) > 0.01:
                return Response({"error": f"Amount ({amount}) does not match the booking total ({booking.total_amount}). Please provide the exact amount."}, status=400)
        except (ValueError, TypeError):
            return Response({"error": "Invalid amount format. Please provide a valid number."}, status=400)

        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "email": email,
            "amount": int(amount * 100),
            "metadata": {
                "booking_id": booking_id
            }
        }

        response = requests.post("https://api.paystack.co/transaction/initialize", json=data, headers=headers)
        res_data = response.json()

        if response.status_code == 200:
            return Response(res_data["data"], status=200)

        return Response({"error": f"Payment initialization failed: {res_data.get('message', 'Unknown error')}"}, status=400)