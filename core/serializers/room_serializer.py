from rest_framework import serializers
from core.models import Room
import json

class RoomSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ['provider']

    def validate_facilities(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)  # Parse string like "[1, 2, 3]" to list
                if not isinstance(value, list) or not all(isinstance(i, int) for i in value):
                    raise serializers.ValidationError("Facilities must be a list of integers.")
            except json.JSONDecodeError:
                raise serializers.ValidationError("Invalid facilities format. Expected a list of integers, e.g., [1, 2, 3].")
        return value