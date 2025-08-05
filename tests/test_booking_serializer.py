from django.test import TestCase
from rest_framework.test import APIRequestFactory
from core.models import User, StudentProfile, ProviderProfile, Room, Booking, Payment
from core.serializers.booking_serializer import BookingSerializer
from django.utils import timezone
from datetime import timedelta

class BookingSerializerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username='student', email='student@example.com', password='password', role='student'
        )
        self.student_profile = StudentProfile.objects.create(
            user=self.user, phone_number='1234567890', date_of_birth='2000-01-01', program='Test Program'
        )
        self.user2 = User.objects.create_user(
            username='student2', email='student2@example.com', password='password', role='student'
        )
        self.student_profile2 = StudentProfile.objects.create(
            user=self.user2, phone_number='0987654321', date_of_birth='2000-01-01', program='Test Program'
        )
        self.provider_user = User.objects.create_user(
            username='provider', email='provider@example.com', password='password', role='provider'
        )
        self.provider_profile = ProviderProfile.objects.create(
            user=self.provider_user, business_name='Test Hostel', contact_person='John Doe',
            email='provider@example.com', phone_number='0987654321', address='123 Test St', bank_details='Bank'
        )
        self.room = Room.objects.create(
            room_number='101', hostel_name='Test Hostel', price_per_night=100.00,
            max_occupancy=2, provider=self.provider_profile, is_available=True
        )

    def create_booking(self, check_in, check_out, student=None, payment_status='success'):
        student = student or self.student_profile
        booking = Booking.objects.create(
            student=student, room=self.room,
            check_in_date=check_in, check_out_date=check_out,
            booking_status='confirmed'
        )
        if payment_status:
            Payment.objects.create(
                booking=booking, amount=booking.total_amount, payment_method='card',
                transaction_id=f'test_{booking.id}', status=payment_status
            )
        return booking

    def test_same_day_booking(self):
        """Test booking with check-in and check-out on the same day."""
        check_in = timezone.now().date() + timedelta(days=1)
        data = {
            'room_id': self.room.id,
            'check_in_date': check_in,
            'check_out_date': check_in
        }
        request = self.factory.post('/bookings/', data)
        request.user = self.user
        serializer = BookingSerializer(data=data, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('check_out_date', serializer.errors)
        self.assertEqual(
            serializer.errors['check_out_date'][0],
            'Check-out date must be after check-in date.'
        )

    def test_capacity_limit(self):
        """Test booking when room is at max capacity."""
        check_in = timezone.now().date() + timedelta(days=1)
        check_out = check_in + timedelta(days=2)
        # Create bookings to hit max_occupancy (2) with different students
        self.create_booking(check_in, check_out, student=self.student_profile)
        self.create_booking(check_in, check_out, student=self.student_profile2)
        # Try to create one more booking
        data = {
            'room_id': self.room.id,
            'check_in_date': check_in,
            'check_out_date': check_out
        }
        request = self.factory.post('/bookings/', data)
        request.user = self.user
        serializer = BookingSerializer(data=data, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
        self.assertEqual(
            serializer.errors['non_field_errors'][0],
            'This room has reached its maximum occupancy for the selected dates based on fully paid bookings.'
        )

    def test_overlapping_boundary(self):
        """Test booking with boundary overlap (adjacent dates)."""
        check_in = timezone.now().date() + timedelta(days=1)
        check_out = check_in + timedelta(days=2)
        self.create_booking(check_in, check_out)
        # Try booking ending on check-in date
        data = {
            'room_id': self.room.id,
            'check_in_date': check_in - timedelta(days=1),
            'check_out_date': check_in
        }
        request = self.factory.post('/bookings/', data)
        request.user = self.user
        serializer = BookingSerializer(data=data, context={'request': request})
        self.assertTrue(serializer.is_valid(), serializer.errors)  # Should pass, no overlap

    def test_student_overlap(self):
        """Test same student booking overlapping dates."""
        check_in = timezone.now().date() + timedelta(days=1)
        check_out = check_in + timedelta(days=2)
        self.create_booking(check_in, check_out)
        # Same student tries to book overlapping dates
        data = {
            'room_id': self.room.id,
            'check_in_date': check_in,
            'check_out_date': check_out + timedelta(days=1)
        }
        request = self.factory.post('/bookings/', data)
        request.user = self.user
        serializer = BookingSerializer(data=data, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)
        self.assertEqual(
            serializer.errors['non_field_errors'][0],
            'You already have a booking for this room within the selected dates.'
        )