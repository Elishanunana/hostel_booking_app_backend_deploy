from django.db import models
from core.models.user import User

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    phone_number = models.CharField(max_length=15)
    date_of_birth = models.DateField()
    program = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username
