# core/password_reset.py

import secrets
from datetime import timedelta
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = secrets.token_urlsafe(50)
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=1)  # 1 hour expiry
        super().save(*args, **kwargs)
    
    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()
    
    def __str__(self):
        return f"Reset token for {self.user.username}"