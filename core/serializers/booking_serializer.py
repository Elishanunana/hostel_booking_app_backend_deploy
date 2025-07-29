from rest_framework import serializers
from core.models import Booking, Room, StudentProfile
from core.serializers.room_serializer import RoomSerializer

class BookingSerializer(serializers.ModelSerializer):
    room = RoomSerializer(read_only=True)
    student_info = serializers.SerializerMethodField()
    booking_status_display = serializers.SerializerMethodField()
    room_id = serializers.IntegerField(write_only=True)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'student', 'room', 'check_in_date', 'check_out_date', 'total_amount',
                  'booking_status', 'created_at', 'student_info', 'booking_status_display', 'room_id']
        read_only_fields = ['student', 'total_amount', 'booking_status', 'created_at']

    def get_student_info(self, obj):
        user = obj.student.user
        return {
            "username": user.username,
            "email": user.email
        }

    def get_booking_status_display(self, obj):
        return obj.get_booking_status_display()

    def validate(self, data):
        room_id = data.get('room_id')
        check_in = data.get('check_in_date')
        check_out = data.get('check_out_date')

        # Validate room exists
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            raise serializers.ValidationError("Invalid room ID.")

        data['room'] = room

        if check_out <= check_in:
            raise serializers.ValidationError("Check-out date must be after check-in date.")

        if not room.is_available:
            raise serializers.ValidationError("This room is not available for booking.")

        # Check room capacity based on fully paid bookings
        paid_bookings = Booking.objects.filter(
            room=room,
            check_in_date__lt=check_out,
            check_out_date__gt=check_in,
            payment__status='success',
            booking_status__in=['pending', 'confirmed']
        ).count()

        if paid_bookings >= room.max_occupancy:
            raise serializers.ValidationError("This room has reached its maximum occupancy for the selected dates based on fully paid bookings.")

        # Check for overlapping bookings by the same student
        student_profile = self.context['request'].user.student_profile
        has_overlap = Booking.objects.filter(
            student=student_profile,
            room=room,
            check_in_date__lt=check_out,
            check_out_date__gt=check_in,
        ).exists()

        if has_overlap:
            raise serializers.ValidationError("You already have a booking for this room within the selected dates.")

        return data

    def create(self, validated_data):
        student_profile = self.context['request'].user.student_profile
        room = validated_data.pop('room')
        validated_data.pop('room_id')

        validated_data['student'] = student_profile
        validated_data['room'] = room

        return super().create(validated_data)