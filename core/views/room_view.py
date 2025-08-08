from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import Room, ProviderProfile
from core.serializers.room_serializer import RoomSerializer
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, NumberFilter, CharFilter, BooleanFilter
from rest_framework.filters import SearchFilter
from rest_framework.parsers import MultiPartParser, FormParser

class IsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'provider'

class RoomFilter(FilterSet):
    price_min = NumberFilter(field_name='price_per_night', lookup_expr='gte')
    price_max = NumberFilter(field_name='price_per_night', lookup_expr='lte')
    location = CharFilter(field_name='location', lookup_expr='icontains')
    hostel_name = CharFilter(field_name='hostel_name', lookup_expr='icontains')
    is_available = BooleanFilter(field_name='is_available')

    class Meta:
        model = Room
        fields = ['price_min', 'price_max', 'location', 'hostel_name', 'is_available']

class RoomCreateView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated, IsProvider]
    parser_classes = [MultiPartParser, FormParser]  

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
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = []  # public
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_class = RoomFilter
    search_fields = ['hostel_name', 'location', 'description']

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
    

class RoomDetailView(generics.RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    