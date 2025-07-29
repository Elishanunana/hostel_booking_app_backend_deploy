from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count
from core.models import Room, Booking, Payment, ProviderProfile


class ProviderDashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            provider_profile = ProviderProfile.objects.get(user=request.user)
        except ProviderProfile.DoesNotExist:
            return Response({"error": "Only providers can access this dashboard."}, status=403)

        # Total rooms
        total_rooms = Room.objects.filter(provider=provider_profile).count()

        # All bookings for provider’s rooms
        bookings = Booking.objects.filter(room__provider=provider_profile)

        # Booking counts by status
        booking_counts = bookings.values('booking_status').annotate(count=Count('id'))
        booking_stats = {
            "pending": 0,
            "confirmed": 0,
            "cancelled": 0,
        }
        for entry in booking_counts:
            status = entry['booking_status']
            count = entry['count']
            booking_stats[status] = count

        # Total confirmed revenue
        confirmed_bookings = bookings.filter(booking_status='confirmed')
        total_revenue = Payment.objects.filter(booking__in=confirmed_bookings).aggregate(
            total=Sum('amount')
        )['total'] or 0

        return Response({
            "total_rooms": total_rooms,
            "total_revenue": float(total_revenue),
            "bookings": booking_stats
        })
