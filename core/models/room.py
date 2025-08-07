# core/models/room.py
from django.db import models
from .provider_profile import ProviderProfile
from .facility import Facility
from cloudinary.models import CloudinaryField

class Room(models.Model):
    room_number = models.CharField(max_length=50)
    hostel_name = models.CharField(max_length=100)
    price_per_night = models.DecimalField(max_digits=8, decimal_places=2)
    max_occupancy = models.IntegerField()
    description = models.TextField(blank=True)
    facilities = models.ManyToManyField(Facility, related_name='rooms', blank=True)
    image = CloudinaryField('image', blank=True, null=True)  # Updated to use CloudinaryField
    is_available = models.BooleanField(default=True)
    location = models.CharField(max_length=255, blank=True)
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name='rooms')

    def __str__(self):
        return f"{self.hostel_name} - {self.room_number}"
    