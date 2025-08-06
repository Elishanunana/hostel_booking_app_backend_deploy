from rest_framework import serializers
from core.models import Room
import json

class RoomSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    facilities = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ['provider']

    def to_internal_value(self, data):
        if 'facilities' in data and isinstance(data['facilities'], str):
            try:
                data['facilities'] = json.loads(data['facilities'])
            except json.JSONDecodeError:
                raise serializers.ValidationError({"facilities": "Invalid format. Expected a list of integers, e.g., [1, 2, 3]."})
        return super().to_internal_value(data)