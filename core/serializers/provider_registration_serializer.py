from rest_framework import serializers
from core.models import User, ProviderProfile

class ProviderRegistrationSerializer(serializers.ModelSerializer):
    # These fields are for input only (not on User model)
    business_name = serializers.CharField(write_only=True)
    contact_person = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)
    phone_number = serializers.CharField(write_only=True)
    address = serializers.CharField(write_only=True)
    bank_details = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'business_name', 'contact_person', 'email', 'phone_number', 'address', 'bank_details']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        # Extract profile data
        provider_data = {
            'business_name': validated_data.pop('business_name'),
            'contact_person': validated_data.pop('contact_person'),
            'email': validated_data.pop('email'),
            'phone_number': validated_data.pop('phone_number'),
            'address': validated_data.pop('address'),
            'bank_details': validated_data.pop('bank_details'),
        }

        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            role='provider',
            email=provider_data['email']
        )

        # Create the provider profile
        ProviderProfile.objects.create(user=user, **provider_data)
        return user

    def to_representation(self, instance):
        # Represent selected fields from the user and provider profile
        provider_profile = instance.provider_profile
        return {
            "username": instance.username,
            "role": instance.role,
            "business_name": provider_profile.business_name,
            "contact_person": provider_profile.contact_person,
            "email": provider_profile.email,
            "phone_number": provider_profile.phone_number,
            "address": provider_profile.address,
            "bank_details": provider_profile.bank_details
        }
