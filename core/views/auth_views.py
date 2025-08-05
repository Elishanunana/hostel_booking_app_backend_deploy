from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from core.models import User, StudentProfile
from core.serializers.student_registration_serializer import StudentRegistrationSerializer
from core.serializers.provider_registration_serializer import ProviderRegistrationSerializer

from django.contrib.auth import authenticate


class RegisterStudentView(APIView):
    def post(self, request):
        # Add role to the data explicitly
        data = request.data.copy()
        data['role'] = 'student'  # Force role to 'student'
        serializer = StudentRegistrationSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Student registration successful! Welcome to the platform.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                },
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response({
            "error": "Registration failed. Please check your details.",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        # Accept both email and username for login
        email = request.data.get("email")
        username = request.data.get("username") 
        password = request.data.get("password")
        
        if not password:
            return Response({
                "error": "Password is required."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user = None
        
        # Try authentication by email first, then username
        if email:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        elif username:
            user = authenticate(username=username, password=password)
        else:
            return Response({
                "error": "Email or username is required."
            }, status=status.HTTP_400_BAD_REQUEST)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful! Welcome back.",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                },
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        
        return Response({
            "error": "Invalid credentials. Please check your email/username and password."
        }, status=status.HTTP_401_UNAUTHORIZED)
    

class RegisterProviderView(APIView):
    def post(self, request):
        serializer = ProviderRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Provider registration successful! You can now create room listings.",
                "user": ProviderRegistrationSerializer(user).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response({
            "error": "Provider registration failed. Please check your details.",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)