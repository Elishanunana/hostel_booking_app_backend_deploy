from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from core.models.password_reset import PasswordResetToken
import logging

logger = logging.getLogger('core')

User = get_user_model()

@api_view(['POST'])
def request_password_reset(request):
    """
    Request password reset - sends email with reset link
    """
    email = request.data.get('email')
    
    if not email:
        return Response({
            'error': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({
            'message': 'If an account with this email exists, a reset link has been sent.'
        }, status=status.HTTP_200_OK)
    
    # Invalidate existing tokens
    PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)
    
    # Create new reset token
    reset_token = PasswordResetToken.objects.create(user=user)
    
    # Construct reset URL
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token.token}"
    
    # Send email
    try:
        send_mail(
            subject='Password Reset Request',
            message=f'''
            Hello {user.username},
            
            You requested a password reset for your account.
            
            Click the link below to reset your password:
            {reset_url}
            
            This link will expire in 1 hour.
            
            If you didn't request this, please ignore this email.
            
            Best regards,
            Hostel Booking Team
            ''',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        logger.debug(f"Password reset link sent to {email}: {reset_url}")
        return Response({
            'message': 'Password reset link has been sent to your email.',
            'reset_url': reset_url if settings.DEBUG else None  # Return link in debug mode
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {str(e)}")
        return Response({
            'error': f'Failed to send email: {str(e)}',
            'reset_url': reset_url if settings.DEBUG else None
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def confirm_password_reset(request):
    """
    Confirm password reset with token and new password
    """
    token = request.data.get('token')
    new_password = request.data.get('new_password')
    
    if not token or not new_password:
        return Response({
            'error': 'Token and new password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(new_password) < 8:
        return Response({
            'error': 'Password must be at least 8 characters long'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        reset_token = PasswordResetToken.objects.get(token=token)
    except PasswordResetToken.DoesNotExist:
        return Response({
            'error': 'Invalid reset token'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not reset_token.is_valid():
        return Response({
            'error': 'Reset token has expired or been used'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Update user password
    user = reset_token.user
    user.password = make_password(new_password)
    user.save()
    
    # Mark token as used
    reset_token.is_used = True
    reset_token.save()
    
    return Response({
        'message': 'Password has been successfully reset. You can now login with your new password.'
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def verify_reset_token(request):
    """
    Verify if a reset token is valid (useful for frontend validation)
    """
    token = request.data.get('token')
    
    if not token:
        return Response({
            'error': 'Token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        reset_token = PasswordResetToken.objects.get(token=token)
        if reset_token.is_valid():
            return Response({
                'valid': True,
                'user_email': reset_token.user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'valid': False,
                'error': 'Token has expired or been used'
            }, status=status.HTTP_400_BAD_REQUEST)
    except PasswordResetToken.DoesNotExist:
        return Response({
            'valid': False,
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)