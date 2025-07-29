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
            return Response({"error": "Missing required fields."}, status=400)

        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found."}, status=404)

        # Ensure the authenticated user is the student who made the booking
        try:
            student_profile = StudentProfile.objects.get(user=request.user)
            if booking.student != student_profile:
                return Response({"error": "You are not authorized to pay for this booking."}, status=403)
        except StudentProfile.DoesNotExist:
            return Response({"error": "No student profile found for authenticated user."}, status=403)

        # Validate email matches the student's email
        if email != student_profile.user.email:
            return Response({"error": "Provided email does not match the student's email."}, status=400)

        # Check room capacity based on fully paid bookings
        paid_bookings = Booking.objects.filter(
            room=booking.room,
            check_in_date__lt=booking.check_out_date,
            check_out_date__gt=booking.check_in_date,
            payment__status='success',
            booking_status__in=['pending', 'confirmed']
        ).exclude(id=booking.id).count()

        logger.info(f"Checking capacity for room {booking.room.id}: {paid_bookings}/{booking.room.max_occupancy} paid bookings")

        if paid_bookings >= booking.room.max_occupancy:
            return Response({"error": "This room has reached its maximum occupancy for the selected dates based on fully paid bookings."}, status=400)

        # Validate full payment amount
        try:
            amount = float(amount)
            if abs(amount - float(booking.total_amount)) > 0.01:  # Allow small float differences
                return Response({"error": "Amount must match the booking's total amount."}, status=400)
        except (ValueError, TypeError):
            return Response({"error": "Invalid amount."}, status=400)

        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "email": email,
            "amount": int(amount * 100),  # Convert to pesewas
            "metadata": {
                "booking_id": booking_id
            }
        }

        response = requests.post("https://api.paystack.co/transaction/initialize", json=data, headers=headers)
        res_data = response.json()

        if response.status_code == 200:
            return Response(res_data["data"], status=200)

        return Response({"error": res_data.get("message")}, status=400)