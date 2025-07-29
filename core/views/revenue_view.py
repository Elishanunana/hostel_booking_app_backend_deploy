from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from core.models import Room, Booking, Payment, ProviderProfile
from django.db.models import Sum

class ProviderRevenueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Ensure the user is a provider
        if request.user.role != 'provider':
            return Response({"error": "Only providers can access this endpoint."}, status=403)

        try:
            provider = ProviderProfile.objects.get(user=request.user)
        except ProviderProfile.DoesNotExist:
            return Response({"error": "Provider profile not found."}, status=404)

        rooms = Room.objects.filter(provider=provider)

        room_data = []
        total_revenue = 0

        for room in rooms:
            # Only confirmed bookings matter for revenue
            confirmed_bookings = Booking.objects.filter(room=room, booking_status='confirmed')
            room_payments = Payment.objects.filter(booking__in=confirmed_bookings)
            room_total = room_payments.aggregate(total=Sum('amount'))['total'] or 0

            total_revenue += room_total

            room_data.append({
                "room_id": room.id,
                "room_number": room.room_number,
                "hostel_name": room.hostel_name,
                "total_earned": float(room_total)
            })

        return Response({
            "provider": provider.business_name,
            "total_revenue": float(total_revenue),
            "rooms": room_data
        })
