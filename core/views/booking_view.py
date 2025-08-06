import logging
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from core.models import Booking, StudentProfile, Payment
from core.serializers.booking_serializer import BookingSerializer
from django.db import transaction

logger = logging.getLogger(__name__)

# Reusable permission for students
class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

# Reusable permission for providers
class IsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'provider'

class BookingCreateView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def perform_create(self, serializer):
        try:
            student_profile = StudentProfile.objects.get(user=self.request.user)
        except StudentProfile.DoesNotExist:
            logger.error(f"No StudentProfile found for user {self.request.user.username}")
            raise PermissionDenied("No student profile found")
        logger.info(f"Creating booking for user {self.request.user.username} with profile {student_profile.id}")
        serializer.save(student=student_profile)

class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'student':
            raise PermissionDenied("Only students can view their bookings")

        try:
            student_profile = StudentProfile.objects.get(user=self.request.user)
        except StudentProfile.DoesNotExist:
            raise PermissionDenied("No student profile found")

        return Booking.objects.filter(student=student_profile)

class BookingRequestsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_queryset(self):
        return Booking.objects.filter(
            room__provider__user=self.request.user,
            booking_status='pending'
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"detail": "You have no pending booking requests at the moment."}, status=status.HTTP_200_OK)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class UpdateBookingStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found. Please provide a valid booking ID."}, status=status.HTTP_404_NOT_FOUND)

        if booking.room.provider.user != request.user:
            return Response({"error": "You are not authorized to update this booking."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if new_status not in ['approved', 'rejected', 'confirmed']:
            return Response({"error": "Invalid status. Must be 'approved', 'rejected', or 'confirmed'."}, status=status.HTTP_400_BAD_REQUEST)

        if booking.booking_status != 'pending' and new_status in ['approved', 'rejected']:
            return Response({"error": f"Cannot change to {new_status} from {booking.booking_status}. Booking must be pending."}, status=status.HTTP_400_BAD_REQUEST)

        booking.booking_status = new_status
        booking.save()

        if new_status == 'rejected':
            if hasattr(booking, 'payment'):
                payment = booking.payment
                payment_id = payment.id
                payment.delete()
                logger.info(f"Payment {payment_id} deleted for rejected booking {booking_id}")
            booking.room.is_available = True
            booking.room.save()
            logger.info(f"Room {booking.room.id} set to available after rejecting booking {booking_id}")

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CancelBookingView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request, booking_id):
        logger.info(f"Attempting to cancel booking {booking_id} by user {request.user.username}")
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            logger.error(f"Booking {booking_id} not found")
            raise NotFound("Booking not found.")

        try:
            student_profile = StudentProfile.objects.get(user=request.user)
        except StudentProfile.DoesNotExist:
            logger.error(f"No StudentProfile found for user {request.user.username}")
            raise PermissionDenied("No student profile found")

        if booking.student != student_profile:
            logger.error(f"User {request.user.username} is not authorized to cancel booking {booking_id}")
            raise PermissionDenied("You are not allowed to cancel this booking.")

        with transaction.atomic():
            if hasattr(booking, 'payment'):
                payment = booking.payment
                payment_id = payment.id
                try:
                    payment.delete()
                    logger.info(f"Payment {payment_id} for booking {booking_id} deleted")
                except Exception as e:
                    logger.error(f"Failed to delete payment {payment_id} for booking {booking_id}: {str(e)}")
                    raise

            if booking.booking_status not in ['pending', 'approved', 'confirmed']:
                logger.warning(f"Booking {booking_id} is already cancelled or rejected, ensuring payment is deleted")
            else:
                booking.booking_status = 'cancelled'
                booking.save()
                logger.info(f"Booking {booking_id} cancelled by user {request.user.username}")

            paid_bookings = Booking.objects.filter(
                room=booking.room,
                check_in_date__lt=booking.check_out_date,
                check_out_date__gt=booking.check_in_date,
                payment__status='success',
                booking_status__in=['approved', 'confirmed']
            ).count()
            logger.info(f"Post-cancellation capacity for room {booking.room.id}: {paid_bookings}/{booking.room.max_occupancy}")
            if paid_bookings < booking.room.max_occupancy:
                booking.room.is_available = True
                booking.room.save()
                logger.info(f"Room {booking.room.id} set to available after cancellation of booking {booking_id}")

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)