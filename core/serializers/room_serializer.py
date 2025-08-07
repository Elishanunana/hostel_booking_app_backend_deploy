from rest_framework import serializers
from core.models import Room

class RoomSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_upload = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Room
        fields = '__all__'
        read_only_fields = ['provider']

    def get_image(self, obj):
        """Return the Cloudinary URL for the image"""
        if obj.image:
            return obj.image.url
        return None

    def create(self, validated_data):
        image_file = validated_data.pop('image_upload', None)
        facilities = validated_data.pop('facilities', [])  # Extract facilities
        
        # Ensure new rooms are always available
        validated_data['is_available'] = True
        
        room = Room.objects.create(**validated_data)
        
        if image_file:
            room.image = image_file
            room.save()
        
        if facilities:
            room.facilities.set(facilities)  # Set facilities after creation
        
        return room

    def update(self, instance, validated_data):
        image_file = validated_data.pop('image_upload', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if image_file:
            instance.image = image_file
        
        instance.save()
        return instance