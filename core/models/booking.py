from django.db import models
from django.db.models import Q
from django.utils.timezone import now
from .room import Room
from .student_profile import StudentProfile

class Booking(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='bookings')
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    booking_status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('approved', 'Approved'),
            ('rejected', 'Rejected'),
            ('confirmed', 'Confirmed'),
            ('cancelled', 'Cancelled')
        ],
        default='pending'
    )
    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(check_in_date__lt=models.F('check_out_date')),
                name='check_in_before_check_out'
            ),
            models.UniqueConstraint(
                fields=['student', 'room', 'check_in_date', 'check_out_date'],
                condition=Q(booking_status__in=['pending', 'approved', 'confirmed']),
                name='unique_student_room_dates'
            )
        ]

    @property
    def total_amount(self):
        days = (self.check_out_date - self.check_in_date).days
        return days * self.room.price_per_night

    def __str__(self):
        return f"Booking #{self.id} by {self.student} for {self.room}"