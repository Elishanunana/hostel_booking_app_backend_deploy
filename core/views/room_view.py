from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import Room, ProviderProfile
from core.serializers.room_serializer import RoomSerializer


# Reusable permission: only providers allowed
class IsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'provider'


class RoomCreateView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def perform_create(self, serializer):
        try:
            provider = ProviderProfile.objects.get(user=self.request.user)
        except ProviderProfile.DoesNotExist:
            raise PermissionDenied("No provider profile found for this user")
        serializer.save(provider=provider)


class MyRoomsView(generics.ListAPIView):
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def get_queryset(self):
        try:
            provider = ProviderProfile.objects.get(user=self.request.user)
        except ProviderProfile.DoesNotExist:
            raise PermissionDenied("No provider profile found")
        return Room.objects.filter(provider=provider)


class RoomListView(generics.ListAPIView):
    serializer_class = RoomSerializer
    permission_classes = []  # public

    def get_queryset(self):
        queryset = Room.objects.all()

        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        hostel_name = self.request.query_params.get('hostel_name')
        room_type = self.request.query_params.get('room_type')
        facilities = self.request.query_params.getlist('facilities')

        if price_min:
            queryset = queryset.filter(price_per_night__gte=price_min)
        if price_max:
            queryset = queryset.filter(price_per_night__lte=price_max)
        if hostel_name:
            queryset = queryset.filter(hostel_name__icontains=hostel_name)
        if room_type:
            queryset = queryset.filter(room_type__iexact=room_type)
        if facilities:
            for name in facilities:
                queryset = queryset.filter(facilities__name__iexact=name)

        return queryset.distinct()



class ToggleRoomAvailabilityView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsProvider]

    def post(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            raise NotFound("Room not found")

        if room.provider.user != request.user:
            raise PermissionDenied("You do not have permission to modify this room")

        room.is_available = not room.is_available
        room.save()

        return Response({
            "id": room.id,
            "room_number": room.room_number,
            "is_available": room.is_available
        }, status=status.HTTP_200_OK)
