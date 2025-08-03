from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('provider', 'Provider'),
        ('administrator', 'Administrator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True, blank=False, max_length=255)

    first_name = None
    last_name = None

    def __str__(self):
        return f"{self.username} ({self.role})"