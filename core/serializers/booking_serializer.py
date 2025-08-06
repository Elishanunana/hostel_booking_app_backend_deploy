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
        read_only_fields = ['student', 'total_amount', 'created_at']

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

        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            raise serializers.ValidationError({"room_id": "Room does not exist. Please select a valid room."})

        data['room'] = room

        if check_out <= check_in:
            raise serializers.ValidationError({"check_out_date": "Check-out date must be after check-in date. Please adjust the dates."})

        if not room.is_available:
            raise serializers.ValidationError({"room_id": "This room is currently unavailable. Please choose another room."})

        paid_bookings = Booking.objects.filter(
            room=room,
            check_in_date__lt=check_out,
            check_out_date__gt=check_in,
            payment__status='success',
            booking_status__in=['approved', 'confirmed']
        ).count()

        if paid_bookings >= room.max_occupancy:
            raise serializers.ValidationError({"room_id": f"Room has reached its maximum occupancy of {room.max_occupancy} for the selected dates."})

        student_profile = self.context['request'].user.student_profile
        has_overlap = Booking.objects.filter(
            student=student_profile,
            room=room,
            check_in_date__lt=check_out,
            check_out_date__gt=check_in,
            booking_status__in=['pending', 'approved', 'confirmed']
        ).exists()

        if has_overlap:
            raise serializers.ValidationError({"non_field_errors": "You already have a booking for this room during the selected dates. Please choose different dates or cancel your existing booking."})

        return data

    def create(self, validated_data):
        student_profile = self.context['request'].user.student_profile
        room = validated_data.pop('room')
        validated_data.pop('room_id')

        validated_data['student'] = student_profile
        validated_data['room'] = room

        return super().create(validated_data)