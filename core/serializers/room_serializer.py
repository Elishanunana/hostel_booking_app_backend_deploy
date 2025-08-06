from rest_framework import serializers
from core.models import Room

class RoomSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ['provider']