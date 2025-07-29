from rest_framework import serializers
from core.models import User, StudentProfile

class StudentRegistrationSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(write_only=True)
    date_of_birth = serializers.DateField(write_only=True)
    program = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone_number', 'date_of_birth', 'program']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number')
        date_of_birth = validated_data.pop('date_of_birth')
        program = validated_data.pop('program')

        user = User.objects.create_user(**validated_data)
        StudentProfile.objects.create(
            user=user,
            phone_number=phone_number,
            date_of_birth=date_of_birth,
            program=program
        )
        return user
